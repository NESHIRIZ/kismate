import { NextResponse } from "next/server";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getUserById } from "@/lib/db";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${KISMATE_SESSION_COOKIE}=`));

  if (!cookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const token = cookie.split("=")[1];
  const payload = verifyJwt(token);

  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = getUserById(payload.sub);

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Logged out." });

  response.cookies.set({
    name: KISMATE_SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}
