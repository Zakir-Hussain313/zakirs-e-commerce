import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";
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

    const data = await ProductModel.find({ _id: { $in: ids } }).lean();
    if (!data.length) {
      return response(false, 404, "product not found");
    }

    // ✅ Validate delete action
    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid Delete Action");
    }

    // ✅ Perform update
    if (deleteType === "SD") {
      await ProductModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
    } else {
      await ProductModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    }
    return response(true, 200, "product updated successfully");

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

    const data = await ProductModel.find({ _id: { $in: ids } })
      .lean();

    if (!data.length) {
      return response(false, 404, "product not found");
    }

    await ProductModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "product deleted permanently");

  } catch (error: unknown) {

    return catchError(error);
  }
}
