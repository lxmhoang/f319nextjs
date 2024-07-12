'use client'

import { useAppContext } from "@/app/lib/context"
import { addComma, convert } from "@/app/lib/utils"
import { Button, List } from "flowbite-react"
import Image from "next/image";
import { Clipboard } from "flowbite-react"
import { Divider } from "@nextui-org/react";


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
                <div>{user.email}</div>
                
                {firebaseUser && firebaseUser.photoURL && <div><Image className="rounded-full w-[160px] h-[160px] mt-4 mb-4" width={100} height={100} src={firebaseUser.photoURL} priority={true} alt={""}
                    /></div>}
                <div className="mb-4">Số dư: {addComma(amount)}</div>
                {(user.joinRank && user.rankExpire) && (<p className="mb-4"> Theo dõi rank đến {new Date(user.rankExpire).toLocaleDateString('vi')} </p>)}
                {user.isExpert && user.expertType == 'solo' && (<p className="mb-4">Chuyên gia solo</p>)}
                {user.isExpert && user.expertType == 'rank' && (<p className="mb-4">Chuyên gia rank</p>)}
                Chia sẻ đường link này để giới thiệu người mới tới website

        <div className="mt-2 mb-4">
            <input id="npm-install" type="text"
                className="mb-4 col-span-6 block w-[400px] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-xl text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={url}
                disabled
                readOnly
                />
             <Clipboard valueToCopy={url} label="Copy URL giới thiệu" />
        </div> <p className="text-base">Bất kỳ ai vào bằng đường link này, website sẽ tự động lưu dấu vĩnh viễn bạn là người giới thiệu đầu tiên, và bạn sẽ vĩnh viễn nhận được thu nhập mỗi khi 1 trong số những người mà bạn giới thiệu có các hoạt động dưới đây </p>
                 <p className="text-xs mt-1"> * việc trả phí giới thiệu lấy từ lợi nhuận của website nên không ảnh hưởng tới thu nhập của người được giới thiệu  </p>
         
                <div className="flex gap-8 mt-8 text-sm">
                    <div className="">
                        {/* <List> */}
                            <p className="mb-4"> Hoạt động   </p>
                            <List.Item>Trở thành chuyên gia solo hoặc rank  </List.Item>
                            <Divider className="mb-1 mt-1" />
                            <List.Item>Nâng cấp hoặc gia hạn tài khoản chuyên gia </List.Item>
                            <Divider className="mb-1 mt-1" />
                            <List.Item>Là chuyên gia solo và được theo dõi </List.Item>
                            <Divider className="mb-1 mt-1" />
                            <List.Item>Là nhà đầu tư và tài trợ rank  </List.Item>
                        {/* </List> */}
                    </div>
                    <div>
                        <p className="mb-4">Được chia</p>
                        {/* <List> */}
                            <p>20% gói đăng ký chuyên gia  </p>
                            <Divider className="mb-1 mt-1" />
                            <p>20% gói nâng cấp/gia hạn</p>
                            <Divider className="mb-1 mt-1" />
                            <p>10% gói theo dõi chuyên gia solo  </p>
                            <Divider className="mb-1 mt-1" />
                            <p>20% gói theo dõi chuyên gia rank</p>
                        {/* </List> */}
                    </div>
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