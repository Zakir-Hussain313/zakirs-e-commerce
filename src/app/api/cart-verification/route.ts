import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVarientModel from "@/models/ProductVarient.model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const payload = await request.json();

        const verifiedCartData = await Promise.all(
            payload.map(async (cartItem) => {
                const varient = await ProductVarientModel.findById(cartItem.varientId).populate('product').populate('media', 'secure_url').lean();
                if (varient) {
                    return {
                        productId: varient.product._id,
                        varientId: varient._id,
                        name: varient.product.name,
                        url: varient.product.slug,
                        mrp: varient.mrp,
                        sellingPrice: varient.sellingPrice,
                        color: varient.color,
                        size: varient.size,
                        media: varient?.media[0]?.secure_url,
                        qty: cartItem.qty
                    }
                }
            }))

        return response(true, 200, 'Verified Cart Data', verifiedCartData);

    } catch (error) {
        return catchError(error)
    }
}