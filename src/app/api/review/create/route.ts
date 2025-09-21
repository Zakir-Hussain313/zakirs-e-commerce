import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ReviewModel from "@/models/Review.Model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const auth = await isAuthenticated("user");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized Access");
        }

        await connectDB();
        const payload = await request.json()

        const schema = zSchema.pick({
            product: true,
            userId: true,
            rating: true,
            title: true,
            review: true
        });
        const validate = schema.safeParse(payload);
        if (!validate.success) {
            return response(false, 401, 'Invalid or missing Fields', validate.error)
        }

        const { product, userId, rating, title, review, } = validate.data;

        const newReview = new ReviewModel({
            product: product,
            user: userId,
            rating: rating,
            title: title,
            review: review
        });

        await newReview.save()

        return response(true, 200, 'Review added successfully')
    }
    catch (error) {
        return catchError(error)
    }
}