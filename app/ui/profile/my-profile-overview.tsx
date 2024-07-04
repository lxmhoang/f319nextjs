'use client'

import { useAppContext } from "@/app/lib/context"
import { addComma, convert } from "@/app/lib/utils"
import { Button, List } from "flowbite-react"
import Image from "next/image";
import { Clipboard } from "flowbite-react"


export default function MyProfileOverView({ domain }: { domain: string }) {
    const { user, firebaseUser } = useAppContext()

    if (user == undefined) {
        return (
            <> Loading profile ... </>
        )
    }
    
    const ref = user.accessId
    const url = domain + '?ref=' + ref
    const amount = user.amount
    return (
        <div>
            {/* {user.uid} */}
            <div>

                <div>{user.displayName}</div>
                {firebaseUser && firebaseUser.photoURL && <div><Image className="rounded-full w-[160px] h-[160px] mt-4 mb-4" width={100} height={100} src={firebaseUser.photoURL} priority={true} alt={""}
                    /></div>}
                <div className="mb-4">Tài khoản: {addComma(amount)}</div>
                {(user.joinRank && user.rankExpire) && (<p className="mb-4"> Theo dõi rank đến {user.rankExpire.toLocaleDateString('vi')} </p>)}
                {user.isExpert && user.expertType == 'solo' && (<p className="mb-4">Chuyên gia solo</p>)}
                {user.isExpert && user.expertType == 'rank' && (<p className="mb-4">Chuyên gia rank</p>)}
                Chia sẻ đường link này để nhận được 20% doanh thu mỗi khi người mà bạn giới thiệu :
                <List>
                    <List.Item>Đăng ký làm chuyên gia  </List.Item>
                    <List.Item>Nâng cấp hoặc gia hạn tài khoản chuyên gia </List.Item>
                    <List.Item>Theo dõi bất kỳ chuyên gia nào </List.Item>
                </List>


        <div className="mt-8">
            <input id="npm-install" type="text"
                className="mb-4 col-span-6 block w-[400px] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-xl text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={url}
                disabled
                readOnly
                />
             <Clipboard valueToCopy={url} label="Copy URL giới thiệu" />
        </div>
                <div className="">
                    {/* <p className="text-2xl mb-4 mt-2">{url}</p> */}
                    {/* <input
          id="npm-install"
          type="text"
          className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-4 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          value={url}
          disabled
          readOnly
        /> */}
        {/* <Clipboard.WithIconText valueToCopy="npm install flowbite-react" /> */}
                    {/* <Button onClick={() => {
                        navigator.clipboard.writeText(url)
                    }}>Copy URL</Button> */}
                </div>

            </div>

        </div>
    )

}