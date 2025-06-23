import { NextRequest, NextResponse } from "next/server";

export default withClerkMiddleware(() => {});
export const config = {
  matcher: ["/((?!_next/image|_next/static|favicon.ico).*)"],
};
function withClerkMiddleware(handler: (req: NextRequest) => void) {
  return async function middleware(req: NextRequest) {
    // Here you could add authentication/authorization logic with Clerk
    // For now, just call the handler
    await handler(req);
    return NextResponse.next();
  };
}
