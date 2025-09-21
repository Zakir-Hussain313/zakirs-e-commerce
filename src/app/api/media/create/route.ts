import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/dataBaseConnection";
import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const payload = await request.json()
    try {
        const auth = await isAuthenticated("admin");

        if (!auth.isAuth) {
            return response( false , 401 , "Unauthorized Access")
        } 
        
        await connectDB();
        const newMedia = await MediaModel.insertMany(payload);
        return response(
            true,
            200,
            'Media uploaded Successfully',
            newMedia
        )
    }
    catch (error: any) {

        if (payload && payload.length > 0) {
            const publicIds = payload.map((data => data.public_id));

            try {
                await cloudinary.api.delete_resources(publicIds)
            } catch (deleteError) {
                error.cloudinary = deleteError
            }
        }

        return catchError(error)
    }
}