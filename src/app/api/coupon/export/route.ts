import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CouponModel from "@/models/Coupon.Model";

export async function GET() {
    try {
        const auth = await isAuthenticated("admin");

        if (!auth.isAuth) {
            return response(false, 401, "Unauthorized Access")
        }

        await connectDB();

        const filter = {
            deletedAt: null
        }

        const getCoupon = await CouponModel.find(filter).sort({ createdAt : -1 }).lean();
        if(!getCoupon){
            return response(false , 404 , "Collection Empty")
        }

        return response(true , 200 , "Collection Found" , getCoupon)

    } catch (error) {
        return catchError(error)
    }
}