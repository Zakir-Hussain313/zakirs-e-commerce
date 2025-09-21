import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductVarientModel from "@/models/ProductVarient.model";
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
            _id: true, 
            product: true,
            color: true,
            size: true,
            sku: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
            media : true,
        })
        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 401, 'Invalid or missing Fields', validate.error)
        }

        const validatedData = validate.data;

        const getProductVarient = await ProductVarientModel.findOne({ deletedAt: null, _id : validatedData._id });
        if (!getProductVarient) {
            return response(false, 404, 'Data not found');
        }

        getProductVarient.product = validatedData.product;
        getProductVarient.size = validatedData.size;
        getProductVarient.color = validatedData.color;
        getProductVarient.sku = validatedData.sku;
        getProductVarient.mrp = validatedData.mrp;
        getProductVarient.sellingPrice = validatedData.sellingPrice;
        getProductVarient.discountPercentage = validatedData.discountPercentage;
        getProductVarient.media = validatedData.media;
        await getProductVarient.save()

        return response(true, 200, 'Product Varient updated successfully')
    }
    catch (error) {
        return catchError(error)
    }
}