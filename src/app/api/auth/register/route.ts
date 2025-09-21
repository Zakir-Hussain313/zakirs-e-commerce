import { connectDB } from "@/lib/dataBaseConnection";
import { NextRequest } from "next/server";
import { zSchema } from "@/lib/zodSchema";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import * as jose from "jose";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { sendMail } from "@/lib/sendEmail";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    await connectDB();

    // ✅ Define validation schema
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    // ✅ Parse request payload
    const payLoad: unknown = await request.json();
    const validatedData = validationSchema.safeParse(payLoad);

    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing credentials",
        validatedData.error.flatten() // cleaner Zod error output
      );
    }

    const { name, email, password } = validatedData.data;

    // ✅ Check if user already exists
    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(false, 409, "User already exists");
    }

    // ✅ Create new user
    const newRegistration = new UserModel({
      name,
      email,
      password,
    });

    await newRegistration.save();

    // ✅ Generate JWT
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined in environment variables");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new jose.SignJWT({ userId: newRegistration._id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    // ✅ Send verification email
    await sendMail(
      "Email Verification Request from ZakirOo",
      email,
      emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
      )
    );

    return response(
      true,
      200,
      "Registered successfully. Please verify your email address."
    );
  } catch (error: any) {
    return catchError(error);
  }
}
