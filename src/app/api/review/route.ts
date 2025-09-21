import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.Model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized Access");
        }

        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const start = parseInt(searchParams.get("start") || "0", 10);
        const size = parseInt(searchParams.get("size") || "10", 10);
        const filter = JSON.parse(searchParams.get("filter") || "[]");
        const globalFilter = searchParams.get("globalFilter") || "";
        const sorting = JSON.parse(searchParams.get("sorting") || "[]");
        const deleteType = searchParams.get("deleteType");

        let matchQuery: Record<string, any> = {};

        if (deleteType === "SD") {
            matchQuery = { deletedAt: null };
        } else if (deleteType === "PD") {
            matchQuery = { deletedAt: { $ne: null } };
        }

        if (globalFilter) {
            matchQuery["$or"] = [
                { 'userData.name': { $regex: globalFilter, $options: "i" } },
                { 'productData.name': { $regex: globalFilter, $options: "i" } },
                { review: { $regex: globalFilter, $options: "i" } },
                { rating: { $regex: globalFilter, $options: "i" } },
                { title: { $regex: globalFilter, $options: "i" } },
            ];
        }

        // column filtering
        filter.forEach((f: { id: string; value: string }) => {
            if (f.id === 'product') {
                matchQuery['productData.name'] = { $regex: f.value, $options: "i" };

            }
            else if (f.id === 'user') {
                matchQuery['userData.name'] = { $regex: f.value, $options: "i" };

            }
            else {
                matchQuery[f.id] = { $regex: f.value, $options: "i" };
            }
        });

        // sorting
        const sortQuery: Record<string, 1 | -1> = {};
        sorting.forEach((s: { id: string; desc: boolean }) => {
            sortQuery[s.id] = s.desc ? -1 : 1;
        });

        // aggregate pipeline
        const aggregatePipeline = [
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            {
                $unwind: {
                    path: '$productData',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'usertData'
                }
            },
            {
                $unwind: {
                    path: '$userData',
                    preserveNullAndEmptyArrays: true,
                }
            },
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    rating: 1,
                    user: '$userData.name',
                    product: '$productData.name',
                    review: 1,
                    avatar: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,
                },
            },
        ];

        // execute query
        const getReviews = await ReviewModel.aggregate(aggregatePipeline);
        const totalRowCount = await ReviewModel.countDocuments(matchQuery);

        return NextResponse.json({
            success: true,
            data: getReviews,
            meta: { totalRowCount },
        });
    } catch (error: unknown) {
        return catchError(error);
    }
}
