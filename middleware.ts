import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  // Handle preflight requests (OPTIONS)
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400", // 24 hours cache
      },
    });
  }

  //get frontend authentication token from request
  const { isSignedIn } = await clerkClient.authenticateRequest(req);

  const response = NextResponse.next();

  //protect user api
  if (req.nextUrl.pathname.startsWith("/api/user")) {
    //if signedIn is false
    if (!isSignedIn) {
      return Response.json(
        {
          message: "You are not authentificated",
        },
        {
          status: 401,
        }
      );
    }
  }

  // protect api admin routes
  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    //if role exist and role is not admin
    if ((await auth()).sessionClaims?.metadata.role !== "admin") {
      return Response.json(
        {
          message: "Forbidden!",
        },
        {
          status: 403,
        }
      );
    }
  }

  // else you can continue
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
