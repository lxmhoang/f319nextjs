
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { APIResponse } from "@/app/lib/definitions";
import { createSessionCookie, getUserInfoFromSession } from "@/app/lib/firebaseadmin/adminauth";
import { getAuth } from "firebase-admin/auth";

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as { idToken: string, csrfToken: string };
  const idToken = reqBody.idToken;
  // const csrfToken = reqBody.csrfToken;
  // if (csrfToken !== request.cookies.csrfToken) {
  //   res.status(401).send('UNAUTHORIZED REQUEST!');
  //   return;
  // }

  // console.log('========== idtoken posted' + JSON.stringify(idToken))
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  const oldcookie = cookies().get("__session")?.value
  const old = await getUserInfoFromSession(oldcookie)

  console.log('========= old user info' + JSON.stringify(old))
  

  const sessionCookie = await createSessionCookie(idToken, { expiresIn });


  const new22 = await getUserInfoFromSession(sessionCookie)
  console.log('========= new22 user info' + JSON.stringify(new22))
  
  // console.log('aaaaa newly created sessionCookie' + JSON.stringify(sessionCookie))
  
  cookies().set("__session", sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });

  return NextResponse.json<APIResponse<string>>({ success: true, data: "Signed in successfully." });
}