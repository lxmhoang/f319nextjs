import { NextRequest, NextResponse } from 'next/server'
import { getUserInfoFromSession } from './app/lib/firebaseadmin/adminauth'

import { User } from './app/model/user'

export const config = {
    matcher: ['/advisor/:path*', '/profile/:path*'],
}

export  async function middleware(request: NextRequest) {
    // const token = crypto.randomUUID()
    if (request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/advisor')) {
        
       

        if (!request.cookies.has('__session')) {

            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)

        } else {
            if (request.nextUrl.pathname.startsWith('/advisor')) {

                if (request.cookies.has('uInfo')) {
                    const value = request.cookies.get('uInfo')?.value
                    if (value) {
                        const descrypt = await decrypt(value)
                        const uInfo : {isExpert: boolean} = JSON.parse(descrypt)
                        console.log(' ------- uInfo ------' + uInfo)
                        if (!uInfo.isExpert) {
                            console.log('---------11111')
                            const url = request.nextUrl.clone()
                            url.pathname = '/'
                            return NextResponse.redirect(url)
                        }
        
                    }
                }
                 else {
                    console.log('---------2222')
                    const url = request.nextUrl.clone()
                    url.pathname = '/'
                    return NextResponse.redirect(url)
                }
    
            } else {
                return NextResponse.next()
            }
          
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

 async function decrypt(enText: string) {
const key = "keyaaa"

    // console.log('enText ' + enText)
   
    const iv = enText.slice(0,24)!.match(/.{2}/g)!.map(byte => parseInt(byte, 16))
  
    // console.log('vi extracted from payload ' + iv)
    const alg = { name: 'AES-GCM', iv: new Uint8Array(iv) }
    const keyUtf8 = new TextEncoder().encode(key)
    const keyHash = await crypto.subtle.digest('SHA-256', keyUtf8)
    const decryptKey = await crypto.subtle.importKey('raw', keyHash, alg, false, ['decrypt'])
  
    const bodycontent = atob(enText.slice(24))
    // console.log('body content extracted from payload ' + bodycontent)
    const bodyasArrayNumber = new Uint8Array(bodycontent.match(/[\s\S]/g)!.map(ch => ch.charCodeAt(0)))
    // begin to decrupt
  
  
    // const enTextUtf8 = new TextEncoder().encode(enText)
    const textBuffer = await crypto.subtle.decrypt(alg, decryptKey, bodyasArrayNumber)
    const decryptedText = new TextDecoder().decode(textBuffer)
    console.log('did decrypt userInfo ' + decryptedText)
    return decryptedText
  
  }