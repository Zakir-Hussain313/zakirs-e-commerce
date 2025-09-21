import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/category.model";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized Access");
        }

        await connectDB();
        const payload = await request.json()

        const schema = zSchema.pick({
            _id : true,
            name : true,
            slug : true
        });
        const validate = schema.safeParse(payload);
        if(!validate.success){
            return response(false, 401, 'Invalid or missing Fields',validate.error)
        }

        const { _id , name , slug } = validate.data;

        const getCategory = await CategoryModel.findOne({ deletedAt : null , _id });
        if(!getCategory){
            return response(false, 404, 'Data not found');
        }

        getCategory.name = name;
        getCategory.slug = slug;
        await getCategory.save()
       
        return response( true , 200 , 'Category updated successfully')
    }
    catch ( error ){
        return catchError( error )
    }
}