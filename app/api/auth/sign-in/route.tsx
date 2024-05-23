
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { APIResponse } from "@/app/lib/definitions";
import { createSessionCookie } from "@/app/lib/firebaseadmin/adminauth";

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as { idToken: string };
  const idToken = reqBody.idToken;

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  const sessionCookie = await createSessionCookie(idToken, { expiresIn });

    // console.log('aaaaa sessionCookie' + JSON.stringify(sessionCookie))
  cookies().set("__session", sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
  // const sessionCookietest = cookies().get("__session")?.value;
  // console.log('aaaaa  test    sessionCookie' + JSON.stringify(sessionCookie))

  return NextResponse.json<APIResponse<string>>({ success: true, data: "Signed in successfully." });
}