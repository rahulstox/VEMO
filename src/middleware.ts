import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/auth(.*)",
  "/invite(.*)",
  "/preview(.*)",
  "/api/payment/webhook",
]);

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/payment(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const apiKey = req.headers.get("Authorization")?.split(" ")[1];
    if (apiKey === process.env.DESKTOP_APP_API_KEY) {
      return NextResponse.next();
    }
  }

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
