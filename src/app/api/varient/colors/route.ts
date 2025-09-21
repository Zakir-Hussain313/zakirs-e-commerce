import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVarientModel from "@/models/ProductVarient.model";

export async function GET() {
    try {
      
          await connectDB();

          const getColors = await ProductVarientModel.distinct('color')

          if(!getColors){
            return response( false , 404 , "Color not found")
          }

          return response(true , 200 , "Color Found", getColors )

    } catch (error) {
        return catchError(error)
    }
}