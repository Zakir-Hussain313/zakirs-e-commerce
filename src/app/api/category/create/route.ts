import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/category.model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized Access");
        }

        await connectDB();
        const payload = await request.json()

        const schema = zSchema.pick({
            name : true,
            slug : true
        });
        const validate = schema.safeParse(payload);
        if(!validate.success){
            return response(false, 401, 'Invalid or missing Fields',validate.error)
        }

        const { name , slug } = validate.data;

        const newCategory = new CategoryModel({
            name , slug
        });

        await newCategory.save()

        return response( true , 200 , 'Category added successfully')
    }
    catch ( error ){
        return catchError( error )
    }
}