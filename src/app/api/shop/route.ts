import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/category.model";
import ProductModel from "@/models/Product.model";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {

        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        const size = searchParams.get('size');
        const color = searchParams.get('color');
        const categorySlug = searchParams.get('category');
        const minPrice = parseInt(searchParams.get('minPrice')) || 0
        const maxPrice = parseInt(searchParams.get('maxPrice')) || 100000000000
        const limit = parseInt(searchParams.get('limit')) || 9
        const page = parseInt(searchParams.get('page')) || 0
        const search = searchParams.get('q')

        const skip = page * limit;

        const sortOptions = searchParams.get('sort') || 'default_sorting';
        let sortQuery = {};
        if (sortOptions === 'default_sorting') sortQuery = { createdAt: -1 };
        if (sortOptions === 'asc') sortQuery = { name: 1 };
        if (sortOptions === 'desc') sortQuery = { name: -1 };
        if (sortOptions === 'price_high_low') sortQuery = { sellingPrice: -1 };
        if (sortOptions === 'price_low_high') sortQuery = { sellingPrice: 1 };

        //category finding by slug

        let categoryId = []
        if (categorySlug) {
            const slugs = categorySlug.split(',')
            const categoryData = await CategoryModel.find({ deletedAt: null, slug: { $in: slugs } }).select('_id').lean();
            categoryId = categoryData.map(category => category._id)
        }


        let matchStage = {};
        if (categoryId.length > 0) matchStage.category = { $in: categoryId };

        if (search) {
            matchStage.name = { $regex: search, $options: 'i' }
        }


        //aggregation pipeline 
        const products = await ProductModel.aggregate([
            { $match: matchStage },
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: limit + 1 },
            {
                $lookup: {
                    from: "product-varients",
                    localField: ' _id',
                    foreignField: ' product',
                    as: 'varients'
                }
            },
            {
                $addFields: {
                    varients: {
                        $filter: {
                            input: '$varients',
                            as: 'varient',
                            cond: {
                                $and: [
                                    size ? { $in: ['$$varient.size', size.split(',')] } : { $literal: true },
                                    color ? { $in: ['$$varient.color', color.split(',')] } : { $literal: true },
                                    { $gte: ['$$varient.sellingPrice', minPrice] },
                                    { $lte: ['$$varient.sellingPrice', maxPrice] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    varients: { $ne: [] }
                }
            },
            {
                $lookup: {
                    from: "medias",
                    localField: 'media',
                    foreignField: '_id',
                    as: 'media'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    mrp: 1,
                    sellingPrice: 1,
                    discountPercentage: 1,
                    media: {
                        _id: 1,
                        secure_url: 1,
                        alt: 1
                    },
                    varients: {
                        color: 1,
                        size: 1,
                        mrp: 1,
                        sellingPrice: 1,
                        discountPercentage: 1,
                    }
                }
            }
        ])

        let nextPage = null;
        if (products.length > limit) {
            nextPage = page + 1;
            products.pop()
        }

        return response(true, 200, 'Product data found', { products, nextPage })

    } catch (error) {
        return catchError(error)
    }
}