
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { APIResponse } from "@/app/lib/definitions";
import { createSessionCookie } from "@/app/lib/firebaseadmin/adminauth";

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as { idToken: string, csrfToken: string };
  const idToken = reqBody.idToken;
  // const csrfToken = reqBody.csrfToken;
  // if (csrfToken !== request.cookies.csrfToken) {
  //   res.status(401).send('UNAUTHORIZED REQUEST!');
  //   return;
  // }

  // console.log('========== idtoken posted' + JSON.stringify(idToken))
  // const expiresIn = 60 * 60 * 24 * 2 * 7 * 1000; // 14 days
  const expiresIn = 1000 * 60  * 5  //5 min



  const sessionCookie = await createSessionCookie(idToken, { expiresIn });
  console.log('========= cookie' + JSON.stringify(sessionCookie))
  

  
  cookies().set("__session", sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });

  return NextResponse.json<APIResponse<string>>({ success: true, data: "Signed in successfully." });
}