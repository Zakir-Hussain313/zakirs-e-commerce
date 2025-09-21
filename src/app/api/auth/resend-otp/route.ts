import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendEmail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ✅ Only email field required
const validationSchema = zSchema.pick({ email: true });
type OTPRequest = z.infer<typeof validationSchema>;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const payload: OTPRequest = await request.json();
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or empty credential fields",
        validatedData.error.flatten()
      );
    }

    const { email } = validatedData.data;

    const getUser = await UserModel.findOne({ email });
    if (!getUser) {
      return response(false, 404, "User Not found!");
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

    return response(true, 200, "OTP sent successfully!");
  } catch (error) {
    return catchError(error);
  }
}
