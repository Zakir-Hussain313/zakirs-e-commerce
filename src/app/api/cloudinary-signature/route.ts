import { connectDB } from "@/lib/dataBaseConnection";
import { catchError } from "@/lib/helperFunction";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const payload = await request.json();
    const { paramsToSign } = payload;

    // ✅ Create signature
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_SECRET_KEY as string
    );

    return NextResponse.json({
      signature,
    });
  } catch (error: any) {
    return catchError(error); // ✅ must return
  }
}
