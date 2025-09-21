import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
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
                { name: { $regex: globalFilter, $options: "i" } },
                { email: { $regex: globalFilter, $options: "i" } },
                { phone: { $regex: globalFilter, $options: "i" } },
                { address: { $regex: globalFilter, $options: "i" } },
                { isEmailVerified: { $regex: globalFilter, $options: "i" } },
            ];
        }

        // column filtering
        filter.forEach((f: { id: string; value: string }) => {
            matchQuery[f.id] = { $regex: f.value, $options: "i" };
        });

        // sorting
        const sortQuery: Record<string, 1 | -1> = {};
        sorting.forEach((s: { id: string; desc: boolean }) => {
            sortQuery[s.id] = s.desc ? -1 : 1;
        });

        // aggregate pipeline
        const aggregatePipeline = [
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    address: 1,
                    isEmailVerified : 1,
                    avatar : 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,
                },
            },
        ];

        // execute query
        const getCustomers = await UserModel.aggregate(aggregatePipeline);
        const totalRowCount = await UserModel.countDocuments(matchQuery);

        return NextResponse.json({
            success: true,
            data: getCustomers,
            meta: { totalRowCount },
        });
    } catch (error: unknown) {
        return catchError(error);
    }
}
