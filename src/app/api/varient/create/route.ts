import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductVarientModel from "@/models/ProductVarient.model";
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

        const varientData = validate.data;

        const newProductVarient = new ProductVarientModel({
            product :varientData.product,
            sku :varientData.sku,
            color :varientData.color,
            size :varientData.size,
            mrp: varientData.mrp,
            sellingPrice: varientData.sellingPrice,
            discountPercentage: varientData.discountPercentage,
            media: varientData.media
        })

        await newProductVarient.save()

        return response(true, 200, 'Product Varient added successfully')
    }
    catch (error) {
        return catchError(error)
    }
}