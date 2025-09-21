import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.Model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const payload = await request.json();
        const couponFormSchema = zSchema.pick({
            code: true,
            cartTotal: true
        });

        const validate = couponFormSchema.safeParse(payload);
        if (!validate.success) {
            return response(false, 400, 'Missing or invalid data', validate.error);
        }

        const { code, cartTotal } = validate.data;

        const couponData = await CouponModel.findOne({ code }).lean();
        if (!couponData) {
            return response(false, 400, 'Wrong or expired coupon');
        }

        if (new Date() > couponData?.validity) {
            return response(false, 400, 'Coupon code expired');
        }

        if (cartTotal < couponData.minShoppingAmount) {
            return response(false, 400, 'In-sufficient shopping amount');
        }

        return response(true, 200, 'Coupon applied Successfully', { discountPercentage: couponData.discountPercentage })

    } catch (error) {
        return catchError(error.message);
    }
}