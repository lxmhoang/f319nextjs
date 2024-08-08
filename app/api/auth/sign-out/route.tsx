
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { APIResponse } from "@/app/lib/definitions";
import { revokeAllSessions } from "@/app/lib/firebaseadmin/adminauth";

export async function GET() {
  const sessionCookie = cookies().get("__session")?.value;

  // console.log('did signout cookie session will be delete ' + JSON.stringify(sessionCookie))

  if (!sessionCookie)
    return NextResponse.json<APIResponse<string>>({ success: false, error: "Session not found." }, { status: 400 });
  // console.log('deleting cookie session')

  await revokeAllSessions(sessionCookie);
  cookies().delete("__session");
  cookies().delete("uInfo");

  return NextResponse.json<APIResponse<string>>({ success: true, data: "Signed out successfully." });
}