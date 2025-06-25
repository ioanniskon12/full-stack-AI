// // pages/api/book-trip.js
// import dbConnect from "@/lib/mongodb";
// import Booking from "@/models/Booking";
// import Stripe from "stripe";
// import { getSession } from "next-auth/react";

// // Initialize Stripe with your secret key
// const stripe = process.env.STRIPE_SECRET_KEY
//   ? new Stripe(process.env.STRIPE_SECRET_KEY)
//   : null;

// export default async function handler(req, res) {
//   console.log("🔵 Book trip API called");
//   console.log("🔵 Method:", req.method);
//   console.log("🔵 Headers:", req.headers);

//   // Only allow POST requests
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     // Get user session for authentication
//     console.log("🔵 Getting session...");
//     const session = await getSession({ req });
//     console.log("🔵 Session result:", JSON.stringify(session, null, 2));

//     if (!session) {
//       console.log("❌ No session found - user not authenticated");
//       return res.status(401).json({ error: "Please log in to book a trip" });
//     }

//     console.log("✅ User authenticated:", session.user.email);

//     // Connect to MongoDB
//     console.log("🔵 Connecting to MongoDB...");
//     await dbConnect();
//     console.log("✅ Connected to MongoDB");

//     // Extract data from request body
//     const { trip, email } = req.body;

//     // Validate required data
//     if (!trip || !email) {
//       console.log("❌ Missing required data");
//       return res.status(400).json({ error: "Missing trip data or email" });
//     }

//     console.log("🔵 Creating booking for:", email);
//     console.log("🔵 Destination:", trip.Destination);
//     console.log("🔵 Dates:", trip.StartDate, "to", trip.EndDate);

//     // Calculate pricing
//     const basePrice =
//       trip.basePrice || parseInt(trip.Price?.replace(/[^0-9]/g, "") || "0", 10);
//     const activitiesTotal =
//       trip.selectedActivities?.reduce((sum, activity) => {
//         return sum + (activity.price || 0);
//       }, 0) || 0;
//     const totalPrice = basePrice + activitiesTotal;

//     console.log("💰 Price breakdown:");
//     console.log("  - Base price:", basePrice);
//     console.log("  - Activities total:", activitiesTotal);
//     console.log("  - Total price:", totalPrice);

//     // Create booking document
//     const bookingData = {
//       userId: session.user.id || session.user.email || email,
//       email: email,
//       destination: trip.Destination,
//       month: trip.Month,
//       reason: trip.Reason,
//       duration: trip.Duration,
//       startDate: trip.StartDate ? new Date(trip.StartDate) : null,
//       endDate: trip.EndDate ? new Date(trip.EndDate) : null,
//       flight: {
//         outbound: trip.Flight?.Outbound || "",
//         return: trip.Flight?.Return || "",
//       },
//       hotel: trip.Hotel,
//       activities: trip.selectedActivities || [],
//       price: `$${totalPrice}`,
//       basePrice: basePrice,
//       totalPrice: totalPrice,
//       passengers: trip.passengers || { adults: 1, children: 0, infants: 0 },
//       weather: trip.Weather || null,
//       status: "pending",
//       paymentStatus: "pending",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     console.log(
//       "🔵 Creating booking with data:",
//       JSON.stringify(bookingData, null, 2)
//     );

//     // Save booking to database
//     const booking = new Booking(bookingData);
//     await booking.save();
//     console.log("✅ Booking saved to database:", booking._id);

//     // Check if Stripe is configured and enabled
//     const stripeEnabled =
//       stripe && process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true";
//     console.log("🔵 Stripe enabled:", stripeEnabled);

//     if (stripeEnabled) {
//       console.log("💳 Creating Stripe checkout session...");

//       try {
//         // Generate destination image URL
//         const destinationName = trip.Destination.split(",")[0]
//           .toLowerCase()
//           .replace(/\s+/g, "");
//         const destinationImage =
//           trip.DestinationImage ||
//           `https://source.unsplash.com/800x400/?${destinationName},travel,destination`;

//         // Prepare line items for Stripe
//         const lineItems = [];

//         // Add base trip package
//         lineItems.push({
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: `Trip to ${trip.Destination}`,
//               description: `${trip.Duration} in ${trip.Month} - ${trip.Hotel}`,
//               images: [destinationImage],
//             },
//             unit_amount: basePrice * 100, // Convert to cents
//           },
//           quantity: 1,
//         });

//         // Add each selected activity
//         if (trip.selectedActivities && trip.selectedActivities.length > 0) {
//           trip.selectedActivities.forEach((activity) => {
//             lineItems.push({
//               price_data: {
//                 currency: "usd",
//                 product_data: {
//                   name: activity.name,
//                   description: `Activity in ${trip.Destination}${activity.childFriendly ? " (Child-friendly)" : ""}`,
//                 },
//                 unit_amount: (activity.price || 0) * 100, // Convert to cents
//               },
//               quantity: 1,
//             });
//           });
//         }

//         console.log(
//           "🔵 Stripe line items:",
//           JSON.stringify(lineItems, null, 2)
//         );

//         // Create Stripe checkout session
//         const stripeSession = await stripe.checkout.sessions.create({
//           payment_method_types: ["card"],
//           line_items: lineItems,
//           mode: "payment",
//           success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
//           cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/trip-builder`,
//           customer_email: email,
//           metadata: {
//             bookingId: booking._id.toString(),
//             destination: trip.Destination,
//             userId: session.user.id || email,
//             startDate: trip.StartDate,
//             endDate: trip.EndDate,
//           },
//           // Additional Stripe options
//           billing_address_collection: "auto",
//           allow_promotion_codes: true,
//           expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
//         });

//         console.log("✅ Stripe session created:", stripeSession.id);

//         // Update booking with Stripe session ID
//         booking.stripeSessionId = stripeSession.id;
//         await booking.save();

//         // Return Stripe checkout URL
//         return res.status(200).json({
//           success: true,
//           url: stripeSession.url,
//           bookingId: booking._id.toString(),
//           sessionId: stripeSession.id,
//         });
//       } catch (stripeError) {
//         console.error(
//           "⚠️ Stripe error (falling back to test mode):",
//           stripeError.message
//         );
//         // Continue to test mode booking if Stripe fails
//       }
//     } else {
//       console.log("ℹ️ Stripe not configured - using test mode");
//     }

//     // Test mode booking (no payment required)
//     booking.status = "confirmed";
//     booking.paymentStatus = "test_mode";
//     await booking.save();

//     console.log("✅ Booking created in test mode");

//     // Return success response for test mode
//     return res.status(200).json({
//       success: true,
//       bookingId: booking._id.toString(),
//       message: "Booking created successfully (test mode - no payment required)",
//       testMode: true,
//     });
//   } catch (error) {
//     console.error("❌ Book trip error:", error);
//     console.error("Stack trace:", error.stack);

//     // Return appropriate error message
//     return res.status(500).json({
//       error: "Failed to create booking",
//       message: error.message,
//       details:
//         process.env.NODE_ENV === "development"
//           ? {
//               message: error.message,
//               stack: error.stack,
//             }
//           : undefined,
//     });
//   }
// }

// // Export config to handle larger payloads if needed
// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "10mb",
//     },
//   },
// };
// pages/api/book-trip.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 1) Auth
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Please log in to book a trip" });
  }

  // 2) Connect DB
  await dbConnect();

  const { trip, email } = req.body;
  if (!trip || !email) {
    return res.status(400).json({ error: "Missing trip data or email" });
  }

  // 3) Build & save booking
  const basePrice =
    trip.basePrice ?? parseInt(trip.Price.replace(/\D/g, ""), 10) ?? 0;
  const activitiesTotal = (trip.selectedActivities || []).reduce(
    (sum, a) => sum + (a.price || 0),
    0
  );

  const booking = await Booking.create({
    userId: session.user.id,
    email,
    destination: trip.Destination,
    month: trip.Month,
    duration: trip.Duration,
    startDate: trip.StartDate ? new Date(trip.StartDate) : null,
    endDate: trip.EndDate ? new Date(trip.EndDate) : null,
    flight: trip.Flight,
    hotel: trip.Hotel,
    activities: trip.selectedActivities,
    price: `$${basePrice + activitiesTotal}`,
    basePrice,
    totalPrice: basePrice + activitiesTotal,
    status: "pending",
    paymentStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 4) Create Stripe session
  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: `Trip to ${trip.Destination}`,
          description: `${trip.Duration} in ${trip.Month} — ${trip.Hotel}`,
          images: trip.DestinationImage ? [trip.DestinationImage] : [],
        },
        unit_amount: basePrice * 100,
      },
      quantity: 1,
    },
    ...(trip.selectedActivities || []).map((act) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: act.name,
          description: `Activity in ${trip.Destination}`,
        },
        unit_amount: Math.round(act.price * 100),
      },
      quantity: 1,
    })),
  ];

  const sessionOpts = {
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/trip-builder`,
    metadata: { bookingId: booking._id.toString() },
  };

  try {
    const stripeSession = await stripe.checkout.sessions.create(sessionOpts);
    // save session ID back to booking
    booking.stripeSessionId = stripeSession.id;
    await booking.save();

    return res.status(200).json({
      url: stripeSession.url,
      bookingId: booking._id.toString(),
      sessionId: stripeSession.id,
    });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    // fallback: mark as test-mode confirmed
    booking.paymentStatus = "test_mode";
    booking.status = "confirmed";
    await booking.save();

    return res.status(200).json({
      success: true,
      bookingId: booking._id.toString(),
      testMode: true,
      message: "Booking created in test mode (no payment)",
    });
  }
}
