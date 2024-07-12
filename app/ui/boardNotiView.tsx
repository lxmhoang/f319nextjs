'use client'

import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { rtDB } from "../lib/firebase/firebase"
import { userRTDBConverter } from "../model/user"
import { arrayFromData, contentOf } from "../lib/utils"
import { UserNoti } from "../model/noti"
import { Link } from "@nextui-org/react"

export default function BoardNotificationView() {


    const [content, setContent] = useState<JSX.Element[]>()
    const [css, setCSS] = useState<string>()




    useEffect(() => {
        var unsubscrible = onValue(ref(rtDB, 'boardNoti'), (snapshot) => {
            console.log('onValue Realtime Database onSnapshot get board noti ')
            const notifies: UserNoti[] = arrayFromData(snapshot.val())


            const boardContent = notifies ? notifies.map((noti: UserNoti) => {

                return (<Link key={noti.dateTime} showAnchorIcon={noti.urlPath != undefined} color="foreground" className="ml-20" href={noti.urlPath ?? ""}>{noti.content}</Link>)
            }) : undefined

            if (boardContent) {
                setContent(boardContent)
            }


            const charSpace = 8
            const dismissX = 400
            const speedPXPerSec = 60
            const rawtext = (notifies && notifies.length > 0) ? contentOf(notifies.map((noti: UserNoti) => { return noti.content }),) : ""
            const space = notifies ? notifies.length * 20 : 0
            const lengthOfTextInPx = rawtext.length * charSpace + space + dismissX
            const time = Math.round(lengthOfTextInPx / speedPXPerSec)

            const css = `
                    #wrapper {
                        overflow: hidden;
                    }

                    div#sliding {
                        animation: marquee ` + time + `s linear infinite;
                        white-space: nowrap;
                    }

                    @keyframes marquee {
                        from {transform: translateX(-100%); }
                        to {transform: translateX(`+ dismissX + `px); }
                    }
                              `
            setCSS(css)
        }
        
    
    )
    return unsubscrible


    }
    
    , [])

    return (
        <>

            <style>
                {css}
            </style>
            {content && (<div className="flex">

                <div className="flex mx-auto mt-2 w-3/4 h-[50px] rounded-lg border-solid border-1 border-sky-500" id="wrapper" >
                    <div id="sliding" className="my-auto ">{content}</div>
                </div>
            </div>)}
        </>
    )
}