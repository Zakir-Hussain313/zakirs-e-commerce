import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CouponModel from "@/models/Coupon.Model";
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
        { code: { $regex: globalFilter, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: '$discountPercentage' },
              regex: globalFilter,
              options: 'i'
            }
          }
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: '$minShoppingAmount' },
              regex: globalFilter,
              options: 'i'
            }
          }
        }
      ];
    }

    // column filtering
    filter.forEach((f: { id: string; value: string }) => {
      if (f.id === 'discountPercentage' || f.id === 'minShoppingAmount') {
        matchQuery[f.id] = Number(f.value);
      }
      else if (f.id === 'validity') {
        matchQuery[f.id] = new Date(f.value);
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
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          code: 1,
          minShoppingAmount: 1,
          validity: 1,
          discountPercentage: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // execute query
    const getCoupon = await CouponModel.aggregate(aggregatePipeline);
    const totalRowCount = await CouponModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getCoupon,
      meta: { totalRowCount },
    });
  } catch (error: unknown) {
    return catchError(error);
  }
}
