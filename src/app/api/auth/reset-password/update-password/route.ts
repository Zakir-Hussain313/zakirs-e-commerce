import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { NextRequest } from "next/server";

export async function PUT(request : NextRequest ){
    try{
        await connectDB();
        const payload = await request.json();
        const validationSchema = zSchema.pick({
            email : true,
            password : true
        });

        const validatedData = validationSchema.safeParse(payload);
        if(!validatedData.success){
            return response(
                false,
                402,
                "Invalid or missing credentials",
                validatedData.error
            )
        }

        const { email , password } = validatedData.data

        const getUser = await UserModel.findOne({ deletedAt : null , email }).select('+password');
        if(!getUser){
            return response(
                false,
                404,
                'User not found'
            )
        }
        getUser.password = password;
        await getUser.save();

        return response(
            true,
            200,
            'Password updated successfully'
        )
    }
    catch(error){
        catchError(error)
    }
}