import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { routePermissions } from "./src/lib/routePermissions";

const protectedRoutes = Object.keys(routePermissions);

async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");
  return jwtVerify(token, secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const match = protectedRoutes.find((route) => pathname.startsWith(route));
  if (!match) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await verifyToken(token);
    const permissions = (payload.permissions as string[]) ?? [];
    const required = routePermissions[match];
    if (!permissions.includes(required)) {
      const url = new URL("/login", req.url);
      url.searchParams.set("reason", "unauthorized");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/permissions/:path*",
    "/leads/:path*",
    "/tasks/:path*",
    "/reports/:path*",
    "/audit-logs/:path*",
    "/customer-portal/:path*",
    "/settings/:path*",
    "/help-center/:path*",
  ],
};
