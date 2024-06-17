import { NextRequest, NextResponse } from 'next/server'

export const config = {
    matcher: ['/advisor/:path*', '/profile/:path*'],
}

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/advisor')) {
        // const userInfo = await getUserInfoFromSession()
        // const allCookies = request.cookies.getAll()
        // console.log('all cookies : ' + JSON.stringify(allCookies)) // => [{ name: 'nextjs', value: 'fast' }]

        if (!request.cookies.has('__session')) {

            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)

        } else {
            return NextResponse.next()
        }

        //   let cookie = request.cookies.get('__session')

        // console.log('userinfo checked in middleware ' + JSON.stringify(userInfo))
        // if (userInfo.authenticated) {
        //     return Response.json(
        //         { success: false, message: 'authentication failed' },
        //         { status: 401 }
        //     )

        // }

        // This logic is only applied to /about
    }

}