import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { JWTExpired } from "jose/errors";

const hostAuth = process.env.NEXT_PUBLIC_BACKEND_API;

export async function middleware(request) {
  const cookieStore = cookies();
  let access_token = cookieStore.get("access_token")?.value;

  if (!access_token) {
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_BASEPATH}/auth/signin`, request.url)
    );
  }

  try {
    const secretKey = process.env.NEXT_PUBLIC_KEY || "";
    const key = new TextEncoder().encode(secretKey);
    await jwtVerify(access_token, key, {
      algorithms: ["HS256"],
    });
    return NextResponse.next();
  } catch (error) {
    if (error instanceof JWTExpired) {
      try {
        const refresh_token = cookieStore.get("refresh_token")?.value;
        if (!refresh_token) {
          throw new Error("Refresh token not found");
        }

        const response = await fetch(`${hostAuth}/api/auth/refreshtoken`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refresh_token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Refresh request failed with status ${response.status}`);
        }

        const data = await response.json();
        const newAccessToken = data.access_token;
        const nextResponse = NextResponse.next();
        cookieStore.set("access_token", newAccessToken,{
          sameSite: 'Strict', // ตั้งค่า SameSite
          httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
          secure: process.env.NEXT_PUBLIC_NODE_ENV !== 'development', // ใช้กับ HTTPS เท่านั้น
          path: '/', // กำหนด path ของคุกกี้
        });

        return nextResponse;
      } catch (error) {
        console.error("Error during token refresh:", error);
        return NextResponse.redirect(
          new URL(`${process.env.NEXT_PUBLIC_BASEPATH}/auth/signin`, request.url)
        );
      }
    } else {
      console.error("JWT verification error:", error);
      return NextResponse.redirect(
        new URL(`${process.env.NEXT_PUBLIC_BASEPATH}/auth/signin`, request.url)
      );
    }
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
