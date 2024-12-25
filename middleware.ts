import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  //get frontend authentication token from request
  const { isSignedIn } = await clerkClient.authenticateRequest(req);

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
          message: "You are not authorized as admin",
        },
        {
          status: 401,
        }
      );
    }
  }

  // else you can continue
  const response = NextResponse.next();

  // Add CORS headers Second option not needed can be deleted
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
});

// Configure the middleware to run only on API routes
export const config = {
  matcher: "/api/:path*",
};
