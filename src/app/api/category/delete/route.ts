import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";
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

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty Action.");
    }

    const category = await CategoryModel.find({ _id: { $in: ids } }).lean();
    if (!category.length) {
      return response(false, 404, "Category not found");
    }

    // ✅ Validate delete action
    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid Delete Action");
    }

    // ✅ Perform update
    if (deleteType === "SD") {
      await CategoryModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
    } else {
      await CategoryModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    }
    return response(true, 200, "Category updated successfully");

  } catch (error: unknown) {
    return catchError(error);
  }
}

// =========================
// PERMANENT DELETE
// =========================
export async function DELETE(request: NextRequest) {

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
      return response(false, 400, "Invalid or empty Action.");
    }

    // ✅ Validate delete action
    if (deleteType !== "PD") {
      return response(false, 400, "Invalid Delete Action");
    }

    // ✅ Find media
    const category = await CategoryModel.find({ _id: { $in: ids } })
      .lean();

    if (!category.length) {
      return response(false, 404, "Category not found");
    }

    // ✅ Delete from DB
    await CategoryModel.deleteMany({ _id: { $in: ids } });


    return response(true, 200, "Media deleted permanently");

  } catch (error: unknown) {

    return catchError(error);
  }
}
