// pages/api/bookings/edit-request.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/mongodb";
import EditRequest from "@/oldFile/models/EditRequest";
import Booking from "@/oldFile/models/Booking";
import User from "@/oldFile/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();

    const {
      bookingId,
      request,
      requestType = "other",
      proposedChanges = {},
      priority = "medium",
    } = req.body;

    if (!bookingId || !request) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.email !== session.user.email) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this booking" });
    }

    // Get user ID from email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create edit request with your schema
    const editRequest = await EditRequest.create({
      booking: bookingId,
      user: user._id,
      requestType: requestType,
      description: request,
      proposedChanges: proposedChanges,
      priority: priority,
      status: "pending",
    });

    // Populate booking details for the email
    await editRequest.populate("booking");

    // Send notification email if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: "noreply@resend.dev",
          to: process.env.ADMIN_EMAIL || "admin@aitravelplanner.com",
          subject: `[${priority.toUpperCase()}] Edit Request - ${booking.destination}`,
          html: `
            <h2>New Edit Request</h2>
            <p><strong>Priority:</strong> ${priority.toUpperCase()}</p>
            <p><strong>User:</strong> ${session.user.email}</p>
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Destination:</strong> ${booking.destination}</p>
            <p><strong>Request Type:</strong> ${requestType.replace("_", " ").toUpperCase()}</p>
            <p><strong>Description:</strong></p>
            <p>${request.replace(/\n/g, "<br>")}</p>
            ${
              Object.keys(proposedChanges).length > 0
                ? `
              <p><strong>Proposed Changes:</strong></p>
              <ul>
                ${Object.entries(proposedChanges)
                  .map(
                    ([key, value]) =>
                      `<li><strong>${key}:</strong> ${value}</li>`
                  )
                  .join("")}
              </ul>
            `
                : ""
            }
            <p><a href="${process.env.NEXT_PUBLIC_URL}/admin/edit-requests/${editRequest._id}">View Request</a></p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({
      success: true,
      message: "Edit request submitted successfully",
      requestId: editRequest._id,
      status: editRequest.status,
    });
  } catch (error) {
    console.error("Edit request error:", error);
    res.status(500).json({
      error: "Failed to submit edit request",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
