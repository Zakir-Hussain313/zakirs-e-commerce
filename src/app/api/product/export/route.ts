import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";

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

        const getProduct = await ProductModel.find(filter).sort({ createdAt : -1 }).select('-media -description').lean();
        if(!getProduct){
            return response(false , 404 , "Collection Empty")
        }

        return response(true , 200 , "Collection Found" , getProduct)

    } catch (error) {
        return catchError(error)
    }
}