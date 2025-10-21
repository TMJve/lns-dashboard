// // In your ROOT middleware.ts file

// import { updateSession } from "@/lib/supabase/middleware";
// import { type NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
//      * Feel free to modify this pattern to include more paths.
//      */
//     '/((?!api/leads|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//     // REMOVED the trailing '/' from the string above
//   ],
// };


// In your ROOT middleware.ts file

import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // This middleware now does absolutely nothing but pass the request through.
  // It doesn't even call Supabase.
  console.log(`Request received for: ${request.nextUrl.pathname}. Middleware is doing nothing.`);
  return NextResponse.next();
}

export const config = {
  // This matcher is designed to literally match NOTHING.
  // This should prevent the middleware from running at all.
  matcher: ['/no-paths-should-ever-match-this'],
};