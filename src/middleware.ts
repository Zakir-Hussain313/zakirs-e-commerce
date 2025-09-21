import { NextRequest, NextResponse } from "next/server";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./WebsiteRoute";
import { jwtVerify } from "jose";
import { ADMIN_DASHBOARD } from "./AdminPanelRoutes";

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const accessToken = request.cookies.get("access-token");

    // ✅ If NO token
    if (!accessToken) {
      // allow auth pages without redirect loop
      if (pathname.startsWith("/auth")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    // ✅ Verify token
    let payload: any;
    try {
      const { payload: verified } = await jwtVerify(
        accessToken.value,
        new TextEncoder().encode(process.env.SECRET_KEY)
      );
      payload = verified;
    } catch {
      // invalid/expired token → clear cookie + go to login
      const response = NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
      response.cookies.delete("access-token");
      return response;
    }

    const role = payload.role;

    // ✅ If already logged in and visiting /auth/* → redirect to dashboard
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(role === "admin" ? ADMIN_DASHBOARD : USER_DASHBOARD, request.nextUrl)
      );
    }

    // ✅ Role protection
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    const response = NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    return response;
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/my-account/:path*",
    "/auth/:path*",
  ],
};
