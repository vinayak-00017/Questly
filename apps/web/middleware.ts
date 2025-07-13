import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  // Basic bot detection
  const botPatterns = [/bot/i, /crawler/i, /spider/i, /curl/i, /wget/i];
  const isBot = botPatterns.some((pattern) => pattern.test(userAgent));

  if (isBot) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
