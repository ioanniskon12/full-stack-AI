// pages/api/book-trip.js - Stripe only payment processing
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import Stripe from "stripe";

// Initialize Stripe - REQUIRED
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export default async function handler(req, res) {
  console.log("🔥 book-trip API called - Stripe only mode");

  // Set proper headers
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      code: "METHOD_NOT_ALLOWED",
    });
  }

  try {
    // 1. Get user session
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({
        error: "Please log in to book a trip",
        code: "UNAUTHORIZED",
      });
    }

    console.log("✅ User authenticated:", session.user.email);

    // 2. Extract and validate data
    const { trip, email } = req.body;

    if (!trip || !email || !trip.Destination) {
      return res.status(400).json({
        error: "Missing required booking data",
        code: "MISSING_DATA",
        details: {
          hasTrip: !!trip,
          hasEmail: !!email,
          hasDestination: !!trip?.Destination,
        },
      });
    }

    // 3. Calculate pricing
    const basePrice =
      trip.basePrice ||
      parseInt(trip.Price?.replace(/[^0-9]/g, "") || "1000", 10);

    const activitiesTotal = (trip.selectedActivities || []).reduce(
      (sum, activity) => sum + (activity.price || 0),
      0
    );

    const totalPrice = basePrice + activitiesTotal;

    console.log("💰 Price calculation:");
    console.log("  Base price:", basePrice);
    console.log("  Activities total:", activitiesTotal);
    console.log("  Total price:", totalPrice);

    // Validate minimum price for Stripe (50 cents minimum)
    if (totalPrice < 0.5) {
      return res.status(400).json({
        error: "Minimum booking amount is $0.50",
        code: "AMOUNT_TOO_LOW",
      });
    }

    // 4. Create booking data for database
    const bookingData = {
      userId: session.user.id || session.user.email,
      email: email,
      destination: trip.Destination,
      month: trip.Month || "TBD",
      reason: trip.Reason || "Travel",
      duration: trip.Duration || "1 week",
      startDate: trip.StartDate ? new Date(trip.StartDate) : null,
      endDate: trip.EndDate ? new Date(trip.EndDate) : null,
      flight: trip.Flight || {},
      hotel: trip.Hotel || {},
      activities: trip.Activities || [],
      selectedActivities: trip.selectedActivities || [],
      price: `$${totalPrice}`,
      basePrice: basePrice,
      totalPrice: totalPrice,
      passengers: trip.passengers || { adults: 2, children: 0, infants: 0 },
      paymentMethod: "stripe", // ONLY STRIPE
      status: "pending_payment",
      paymentStatus: "pending",
      destinationImage: trip.destinationImage,
      originalSearchQuery: trip.originalSearchQuery,
      weather: trip.weather || [],
      familyFeatures: {
        isFamily: trip.passengers?.children > 0 || trip.passengers?.infants > 0,
        childFriendlyActivities:
          trip.selectedActivities
            ?.filter((a) => a.childFriendly)
            ?.map((a) => a.name) || [],
      },
    };

    // 5. Save booking to database
    let savedBooking;
    try {
      const dbConnect = (await import("@/lib/mongodb")).default;
      await dbConnect();

      const Booking = (await import("@/models/Booking")).default;
      savedBooking = await Booking.create(bookingData);
      console.log("✅ Booking saved to database:", savedBooking._id);
    } catch (dbError) {
      console.error("❌ Database save failed:", dbError);
      return res.status(500).json({
        error: "Failed to create booking record",
        code: "DATABASE_ERROR",
      });
    }

    // 6. Create Stripe checkout session
    try {
      const lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Trip to ${trip.Destination}`,
              description: `${trip.Duration} in ${trip.Month}`,
              images: trip.destinationImage ? [trip.destinationImage] : [],
            },
            unit_amount: Math.round(basePrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ];

      // Add selected activities as line items
      if (trip.selectedActivities && trip.selectedActivities.length > 0) {
        trip.selectedActivities.forEach((activity) => {
          if (activity.price > 0) {
            lineItems.push({
              price_data: {
                currency: "usd",
                product_data: {
                  name: activity.name,
                  description: `Activity in ${trip.Destination}`,
                },
                unit_amount: Math.round(activity.price * 100),
              },
              quantity: 1,
            });
          }
        });
      }

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"], // Only card payments
        line_items: lineItems,
        mode: "payment",
        customer_email: email,

        // Success URL - will trigger webhook first, then redirect user
        success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${savedBooking._id}`,

        // Cancel URL - redirect back to trip builder
        cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/payment-cancelled?booking_id=${savedBooking._id}`,

        // Metadata for webhook processing
        metadata: {
          bookingId: savedBooking._id.toString(),
          userId: session.user.id || session.user.email,
          destination: trip.Destination,
          userEmail: email,
        },

        // Additional options
        billing_address_collection: "required",
        shipping_address_collection: {
          allowed_countries: [
            "US",
            "CA",
            "GB",
            "AU",
            "DE",
            "FR",
            "IT",
            "ES",
            "NL",
            "BE",
          ],
        },

        // Payment settings
        payment_intent_data: {
          description: `AI Travel Planner - Trip to ${trip.Destination}`,
          metadata: {
            bookingId: savedBooking._id.toString(),
            destination: trip.Destination,
          },
        },
      });

      // Update booking with Stripe session ID
      savedBooking.stripeSessionId = stripeSession.id;
      savedBooking.paymentUrl = stripeSession.url;
      await savedBooking.save();

      console.log("✅ Stripe checkout session created:", stripeSession.id);

      return res.status(200).json({
        success: true,
        url: stripeSession.url, // Redirect to Stripe
        bookingId: savedBooking._id.toString(),
        sessionId: stripeSession.id,
        message: "Redirecting to Stripe checkout...",
        paymentMethod: "stripe",
      });
    } catch (stripeError) {
      console.error("❌ Stripe error:", stripeError);

      // Mark booking as failed
      if (savedBooking) {
        savedBooking.paymentStatus = "failed";
        savedBooking.status = "pending_payment";
        await savedBooking.save();
      }

      return res.status(500).json({
        error: "Payment system unavailable",
        message:
          "Unable to process payment at this time. Please try again later.",
        code: "STRIPE_ERROR",
        bookingId: savedBooking?._id?.toString(),
      });
    }
  } catch (error) {
    console.error("❌ Book trip API error:", error);

    return res.status(500).json({
      error: "Failed to create booking",
      message: error.message || "An unexpected error occurred",
      code: "INTERNAL_ERROR",
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
