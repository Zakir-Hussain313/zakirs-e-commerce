import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isValidObjectId } from "mongoose";
import CouponModel from "@/models/Coupon.Model";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized Access");
    }

    await connectDB();

    const id = params.id;
    const filter: any = { deletedAt: null };

    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid Object Id");
    }

    filter._id = id;

    const getCoupon = await CouponModel.findOne(filter).lean();

    if (!getCoupon) {
      return response(false, 404, "Coupon not found");
    }

    return response(true, 200, "Coupon Found", getCoupon);
  } catch (error) {
    return catchError(error);
  }
}
