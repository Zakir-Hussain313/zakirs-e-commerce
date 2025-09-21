import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendEmail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const payload = await request.json();
        const validationSchema = zSchema.pick({
            email: true,
        });

        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData.success) {
            return response(
                false,
                401,
                "Invalid or missing credentials",
                validatedData.error
            );
        }

        // ✅ Correct destructuring
        const { email } = validatedData.data;

        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();
        if (!getUser) {
            return response(false, 404, "User not found");
        }

        // ✅ Remove old OTPs
        await OTPModel.deleteMany({ email });

        // ✅ Generate and save new OTP
        const otp = generateOTP();
        const newOtpData = new OTPModel({ email, otp });
        await newOtpData.save();

        // ✅ Send OTP email
        const otpSendStatus = await sendMail(
            "Your email verification code",
            email,
            otpEmail(otp)
        );

        if (!otpSendStatus.success) {
            return response(false, 402, "OTP resend failed!");
        }

        return response(true, 200, "Please verify your account!");
    } catch (error) {
        return catchError(error, "Failed to send OTP");
    }
}
