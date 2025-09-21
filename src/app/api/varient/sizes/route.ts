import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVarientModel from "@/models/ProductVarient.model";

export async function GET() {
    try {

        await connectDB();

        const getSizes = await ProductVarientModel.aggregate([
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: "$size",
                    first: { $first: '$_id' }
                }
            },
            { $sort: { first: 1 } },
            { $project : { _id : 0 , size : "$_id"}}
        ])

        if (!getSizes.length) {
            return response(false, 404, "Sizes not found")
        }

        const sizes = getSizes.map(item => item.size)

        return response(true, 200, "Sizes Found", sizes)

    } catch (error) {
        return catchError(error)
    }
}