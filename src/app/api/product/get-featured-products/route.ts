
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    console.log("Registered models:", mongoose.modelNames());


    const getProduct = await ProductModel.find({ deleteAt: null }).populate('media').limit(8).lean();

    if (!getProduct) {
      return response(false, 404, "Product not found");
    }

    return response(true, 200, "Product Found", getProduct);
  } catch (error) {
    return catchError(error);
  }
}
