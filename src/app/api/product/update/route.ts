import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/Product.model";
import { encode } from "entities";
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
            name: true,
            slug: true,
            category: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
            description: true,
            media: true
        })
        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 401, 'Invalid or missing Fields', validate.error)
        }

        const validatedData = validate.data;

        const getProduct = await ProductModel.findOne({ deletedAt: null, _id : validatedData._id });
        if (!getProduct) {
            return response(false, 404, 'Data not found');
        }

        getProduct.name = validatedData.name
        getProduct.slug = validatedData.slug;
        getProduct.category = validatedData.category;
        getProduct.mrp = validatedData.mrp;
        getProduct.sellingPrice = validatedData.sellingPrice;
        getProduct.discountPercentage = validatedData.discountPercentage;
        getProduct.description = encode(validatedData.description);
        getProduct.media = validatedData.media;
        await getProduct.save()

        return response(true, 200, 'Product updated successfully')
    }
    catch (error) {
        return catchError(error)
    }
}