import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST( request : NextRequest ){
    try{
        await connectDB();
        const cookieStore = await cookies();
        cookieStore.delete('access_token');
        return response(
            true,
            200,
            'Logged Out Successfully'
        )
    }
    catch ( err : any ){
       return catchError(err)
    }

}