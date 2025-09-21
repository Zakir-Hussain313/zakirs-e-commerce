import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isValidObjectId } from "mongoose";
import MediaModel from "@/models/Media.model";
import ProductVarientModel from "@/models/ProductVarient.model";

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

    const getProductVarient = await ProductVarientModel.findOne(filter).populate('media' , '_id secure_url').lean();

    if (!getProductVarient) {
      return response(false, 404, "Product Varient not found");
    }

    return response(true, 200, "Product Varient Found", getProductVarient);
  } catch (error) {
    return catchError(error);
  }
}
