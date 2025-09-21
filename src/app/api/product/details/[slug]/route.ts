
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";
import ProductVarientModel from "@/models/ProductVarient.model";
import ReviewModel from "@/models/Review.Model";
export async function GET(request, { params }) {
    try {
        await connectDB();

        const getParams = await params;
        const slug = getParams.slug;

        const searchParams = request.nextUrl.searchParams;
        const size = searchParams.get('size');
        const color = searchParams.get('color');

        const filter = { deletedAt: null };

        if (!slug) {
            return response(false, 404, 'Product not found');
        }

        filter.slug = slug;

        const getProduct = await ProductModel.findOne(filter).populate('media', 'secure_url').lean();

        if (!getProduct) {
            return response(false, 404, 'Product not found');
        }

        const varientFilter = {
            product: getProduct._id
        }
        if (size) {
            varientFilter.size = size
        }
        if (color) {
            varientFilter.color = color
        }

        const varient = await ProductVarientModel.findOne(varientFilter).populate('media', 'secure_url').lean();

        if (!varient) {
            return response(false, 404, 'Product Varient not found');
        }

        const getColor = await ProductVarientModel.distinct('color', { product: getProduct._id });

        const getSize = await ProductVarientModel.aggregate([
            {
                $match: { product: getProduct._id }
            },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: "$size",
                    first: { $first: '$_id' }
                }
            },
            { $sort: { first: 1 } },
            { $project: { _id: 0, size: "$_id" } }
        ])

        const review = await ReviewModel.countDocuments({ product: getProduct._id });

        const productData = {
            product: getProduct,
            varient: varient,
            color: getColor,
            size: getSize.length ? getSize.map(item => item.size) : [],
            reviewCount: review
        }

        return response(true, 200, 'Product found', productData)

    } catch (error) {
        return catchError(error);
    }
}
