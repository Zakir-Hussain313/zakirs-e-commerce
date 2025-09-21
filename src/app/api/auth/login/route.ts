import { connectDB } from "@/lib/dataBaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { NextRequest } from "next/server";
import z from "zod";
import UserModel, { User } from "@/models/User.model";
import * as jose from "jose";
import { sendMail } from "@/lib/sendEmail";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import OTPModel, { IOTP } from "@/models/Otp.model";
import { otpEmail } from "@/email/otpEmail";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const payload = await request.json();

    // ✅ Validation schema
    const validationSchema = zSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string().min(6, "Password must be at least 6 characters"),
      });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing Credentials!",
        validatedData.error.format()
      );
    }

    const { email, password } = validatedData.data;

    // ✅ Find user
    const getUser = (await UserModel.findOne({ email }).select('+password')) as User | null;
    if (!getUser) {
      return response(false, 400, "Invalid Credentials!");
    }

    // ✅ Resend verification email if not verified
    if (!getUser.isEmailVerified) {
      if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY is not defined in environment variables");
      }

      const secret = new TextEncoder().encode(process.env.SECRET_KEY);

      const token = await new jose.SignJWT({ userId: getUser._id })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);

      await sendMail(
        "Email Verification Request from ZakirOo",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        )
      );

      return response(
        false,
        400,
        "Please verify your email first from the verification email sent to your registered email address to Login"
      );
    }

    // ✅ Verify password
    const isPasswordVerified = await getUser.comparePassword(password);
    if (!isPasswordVerified) {
      return response(false, 400, "Invalid Credentials!");
    }

    // ✅ Generate and save OTP
    await OTPModel.deleteMany({ email });
    const otp = generateOTP();

    const newOtpData: IOTP = new OTPModel({
      email,
      otp,
    });

    await newOtpData.save();

    // ✅ Send OTP email
    const otpEmailStatus = await sendMail(
      "Your Email Verification Code",
      email,
      otpEmail(otp)
    );

    if (!otpEmailStatus.success) {
      return response(false, 400, "Failed to send OTP!");
    }

    return response(true, 200, "OTP sent successfully. Please verify your device.");
    
  } catch (error: any) {
    return catchError(error, "Login/OTP request failed");
  }
}
