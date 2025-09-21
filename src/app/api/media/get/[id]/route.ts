import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }) {
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

          const getMedia = await MediaModel.findOne(filter).lean();

          if(!getMedia){
            return response( false , 404 , "media not found")
          }

          return response(true , 200 , "Media Found", getMedia )

    } catch (error) {
        catchError(error)
    }
}