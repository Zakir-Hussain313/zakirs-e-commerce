import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.Model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized Access");
        }

        await connectDB();
        const payload = await request.json()

        const schema = zSchema.pick({
            code: true,
            discountPercentage: true,
            minShoppingAmount: true,
            validity: true,
        })
        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 401, 'Invalid or missing Fields', validate.error)
        }

        const couponData = validate.data;

        const newCoupon = new CouponModel({
            code: couponData.code,
            minShoppingAmount: couponData.minShoppingAmount,
            discountPercentage: couponData.discountPercentage,
            validity: couponData.validity,
        })

        await newCoupon.save()

        return response(true, 200, 'Coupon added successfully')
    }
    catch (error) {
        return catchError(error)
    }
}