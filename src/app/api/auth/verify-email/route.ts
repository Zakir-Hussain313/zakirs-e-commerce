import { connectDB } from "@/lib/dataBaseConnection";
import { NextRequest } from "next/server";
import { response } from "@/lib/helperFunction";
import { jwtVerify } from "jose";
import UserModel from "@/models/User.model";

export async function POST( request : NextRequest ){
    try{
        await connectDB()
        const { token } = await request.json();

        if(!token){
            return response(
                false, 
                401,
                'Missing Token'
            )
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const decoded = await jwtVerify( token , secret );
        const userId = decoded.payload.userId;

        // get user
        const user = await UserModel.findById(userId);
        if(!user){
            return response(
                false,
                401,
                'User not found!'
            )
        }

        user.isEmailVerified = true;
        await user.save();

        return response(
                true,
                200,
                'Email Verified Successfully!'
            )
    }
    catch ( error ){
        console.log( error )
    }
}