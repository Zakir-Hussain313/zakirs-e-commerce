import { connectDB } from "@/lib/dataBaseConnection";
import { zSchema } from "@/lib/zodSchema";
import { NextRequest, NextResponse } from "next/server";
import { response } from "@/lib/helperFunction";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

// ✅ Pick only the fields we need
const validationSchema = zSchema.pick({
    email: true,
    otp: true,
});

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        await connectDB();

        const payload = await request.json();
        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response(
                false,
                401,
                "Invalid or missing input fields",
                validatedData.error.flatten()
            );
        }

        const { email, otp } = validatedData.data;

        const getOtpData = await OTPModel.findOne({ email, otp });
        if (!getOtpData) {
            return response(false, 404, "Invalid or expired OTP");
        }

        const getUser = await UserModel.findOne({
            deletedAt: null,
            email,
        }).lean();

        if (!getUser) {
            return response(false, 404, "User not found");
        }

        // ✅ remove OTP after login
        await getOtpData.deleteOne();

        return response(true, 200, "OTP verified successfully!");
    } catch (error) {
        console.error(error);
        return response(false, 500, "Internal Server Error", error);
    }
}
