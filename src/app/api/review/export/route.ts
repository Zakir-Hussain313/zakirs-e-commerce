import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.Model";

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

        const getReviews = await ReviewModel.find(filter).sort({ createdAt : -1 }).lean();
        if(!getReviews){
            return response(false , 404 , "Collection Empty")
        }

        return response(true , 200 , "Collection Found" , getReviews)

    } catch (error) {
        return catchError(error)
    }
}