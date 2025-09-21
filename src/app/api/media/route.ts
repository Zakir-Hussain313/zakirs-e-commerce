import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel, { IMedia } from "@/models/Media.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized Access");
    }

    await connectDB();
 
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const deleteType = searchParams.get("deleteType");

    let filter: Record<string, unknown> = {};
    if (deleteType === "SD") {
      // Soft Delete -> not deleted
      filter = { deletedAt: null };
    } else if (deleteType === "PD") {
      // Permanently Deleted -> deletedAt not null
      filter = { deletedAt: { $ne: null } };
    }

    // ✅ Use find instead of findOne for pagination
    const mediaData: IMedia[] = await MediaModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .lean();

    const totalMedia = await MediaModel.countDocuments(filter);

    return NextResponse.json({
      mediaData,
      hasMore: (page + 1) * limit < totalMedia,
    });
  } catch (error: any) {
    return catchError(error);
  }
}
