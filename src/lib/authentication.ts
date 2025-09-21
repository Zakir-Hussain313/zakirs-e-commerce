"use server";

import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";

export interface AuthResult {
  isAuth: boolean;
  userId?: string;
  error?: unknown;
}

export interface CustomJWTPayload extends JWTPayload {
  id: string;
  role: string;
}

export const isAuthenticated = async (role: string): Promise<AuthResult> => {
  try {
    const cookieStore = await cookies(); 
    const accessToken = cookieStore.get("access-token")?.value;

    if (!accessToken) {
      return { isAuth: false };
    }

    const secret = process.env.SECRET_KEY;
    if (!secret) {
      throw new Error("SECRET_KEY is not defined in environment variables");
    }

    const { payload } = await jwtVerify<CustomJWTPayload>(
      accessToken,
      new TextEncoder().encode(secret)
    );

    if (payload.role !== role) {
      return { isAuth: false };
    }

    return {
      isAuth: true,
      userId: payload.id,
    };
  } catch (error: unknown) {
    return {
      isAuth: false,
      error,
    };
  }
};
