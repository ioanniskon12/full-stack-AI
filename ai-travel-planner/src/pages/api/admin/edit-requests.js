// pages/api/admin/edit-requests.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/mongodb";
import EditRequest from "@/oldFile/models/EditRequest";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  await dbConnect();

  if (req.method === "GET") {
    try {
      const requests = await EditRequest.find({})
        .populate("booking")
        .sort("-createdAt");
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching edit requests:", error);
      res.status(500).json({ error: "Failed to fetch edit requests" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
