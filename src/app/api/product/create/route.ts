import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/Product.model";
import { encode } from "entities";
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
            name: true,
            slug: true,
            category: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
            description: true,
            media : true
        })
        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 401, 'Invalid or missing Fields', validate.error)
        }

        const productData = validate.data;

        const newProduct = new ProductModel({
            name: productData.name,
            slug: productData.slug,
            category: productData.category,
            mrp: productData.mrp,
            sellingPrice: productData.sellingPrice,
            discountPercentage: productData.discountPercentage,
            description: encode(productData.description),
            media : productData.media
        })

        await newProduct.save()

        return response(true, 200, 'Product added successfully')
    }
    catch (error) {
        return catchError(error)
    }
}