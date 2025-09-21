import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";

export async function GET() {
    try {
      
          await connectDB();

          const getCategory = await CategoryModel.find({ deletedAt : null }).lean();

          if(!getCategory){
            return response( false , 404 , "Category not found")
          }

          return response(true , 200 , "Category Found", getCategory )

    } catch (error) {
        return catchError(error)
    }
}