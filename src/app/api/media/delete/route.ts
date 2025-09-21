import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel, { IMedia } from "@/models/Media.model";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

interface DeletePayload {
  ids: string[];
  deleteType: "SD" | "RSD" | "PD";
}

// =========================
// SOFT DELETE / RESTORE
// =========================
export async function PUT(request: NextRequest) {
  try {
    // ✅ Authenticate
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized Access");
    }

    await connectDB();

    const payload: DeletePayload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    // ✅ Validate ids
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty ID list.");
    }

    // ✅ Find media
    const media = await MediaModel.find({ _id: { $in: ids } }).lean();
    if (!media.length) {
      return response(false, 404, "Media not found");
    }

    // ✅ Validate delete action
    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid Delete Action");
    }

    // ✅ Perform update
    if (deleteType === "SD") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
    } else {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    }
    return response(true, 200, "Media updated successfully");

  } catch (error: unknown) {
    return catchError(error);
  }
}

// =========================
// PERMANENT DELETE
// =========================
export async function DELETE(request: NextRequest) {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ Authenticate
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 403, "Unauthorized Access");
    }

    await connectDB();

    const payload: DeletePayload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    // ✅ Validate ids
    if (!Array.isArray(ids) || ids.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 400, "Invalid or empty ID list.");
    }

    // ✅ Validate delete action
    if (deleteType !== "PD") {
      await session.abortTransaction();
      session.endSession();
      return response(false, 400, "Invalid Delete Action");
    }

    // ✅ Find media
    const media: IMedia[] = await MediaModel.find({ _id: { $in: ids } })
      .session(session)
      .lean();

    if (!media.length) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 404, "Media not found");
    }

    // ✅ Delete media from DB
    await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);

    // ✅ Delete from Cloudinary
    const publicIds = media.map(m => m.public_id);
    try {
      await cloudinary.api.delete_resources(publicIds);
      console.log("Deleting these from Cloudinary:", publicIds);
    } catch (cloudErr) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 500, "Cloudinary deletion failed");
    }

    await session.commitTransaction();
    session.endSession();
    return response(true, 200, "Media deleted permanently");

  } catch (error: unknown) {
    await session.abortTransaction();
    session.endSession();
    return catchError(error);
  }
}
