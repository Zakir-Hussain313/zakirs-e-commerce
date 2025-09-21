import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";
import { isValidObjectId } from "mongoose";

export async function GET({ params }) {
    try {
        const auth = await isAuthenticated("admin");

        if (!auth.isAuth) {
            return response(false, 401, "Unauthorized Access")
        }

          await connectDB();
          const getParams = await params;
          const id = getParams.id;

          const filter = {
            deletedAt : null
          }

          if(!isValidObjectId(id)){
            return response(false , 400 , "Invalid Object Id")
          }
          
          filter._id = id;

          const getCategory = await CategoryModel.findOne(filter).lean();

          if(!getCategory){
            return response( false , 404 , "Category not found")
          }

          return response(true , 200 , "Category Found", getCategory )

    } catch (error) {
        return catchError(error)
    }
}