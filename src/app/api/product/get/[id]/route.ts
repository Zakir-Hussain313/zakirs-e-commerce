import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";
import { isValidObjectId } from "mongoose";
import MediaModel from "@/models/Media.model";

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

    const getProduct = await ProductModel.findOne(filter).populate('media' , '_id secure_url').lean();

    if (!getProduct) {
      return response(false, 404, "Product not found");
    }

    return response(true, 200, "Product Found", getProduct);
  } catch (error) {
    return catchError(error);
  }
}
