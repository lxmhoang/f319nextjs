
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { revokeAllSessions } from "@/app/lib/firebaseadmin/firebaseadmin";
import { APIResponse } from "@/app/lib/definitions";

export async function GET() {
  const sessionCookie = cookies().get("__session")?.value;

  if (!sessionCookie)
    return NextResponse.json<APIResponse<string>>({ success: false, error: "Session not found." }, { status: 400 });
  console.log('aaaaa deleting cookie session')
  cookies().delete("__session");

  await revokeAllSessions(sessionCookie);

  return NextResponse.json<APIResponse<string>>({ success: true, data: "Signed out successfully." });
}