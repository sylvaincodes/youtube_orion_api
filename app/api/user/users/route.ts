import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function PUT(req: Request) {
  const { userId, role } = await req.json();
  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  });
  return NextResponse.json({
    success: true,
    message: "Sign out and Sign in again to see effect.",
  });
}
