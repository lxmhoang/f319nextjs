'use client'

import { useAppContext } from "@/app/lib/context"
import { addComma, convert } from "@/app/lib/utils"
import { List, TextInput } from "flowbite-react"
import Image from "next/image";
import { Clipboard } from "flowbite-react"
import { Button, Divider, Input } from "@nextui-org/react";
import { updateProfilePhone } from "@/app/lib/server";
import { useState } from "react";


export default function MyProfileOverView({ domain }: { domain: string }) {

    const { user, firebaseUser } = useAppContext()
    const [ inputPhoneNumber, setInputPhoneNumber] = useState<string>(user?.phoneNumber ?? "")

    if (user == undefined) {
        return (
            <> Loading profile ... </>
        )
    }

    const ref = user.accessId
    const url = domain + '?ref=' + ref
    const amount = user.amount
    return (
        <div id="test">
            {/* {user.uid} */}
            <div>

                <div className="mb-2">{user.displayName}</div>
                <div className="mb-2">{user.email}</div>
                <div className="mb-1">Số điện thoại</div>
                <div className="mb-2 flex">
                    <form className="flex" action={updateProfilePhone}>
                    <TextInput 
                    
                    
                    className="max-w-xs mr-3 dark:text-rose-400" type="number" name="phoneNumber"  onChange={(e) => {
                        setInputPhoneNumber(e.target.value)

                    }} defaultValue={user.phoneNumber ?? ""} />
                    {inputPhoneNumber != user.phoneNumber && <Button color="success" type="submit">Cập nhật</Button>}
                    </form>

                </div>

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
                </div>
                 <p className="text-base">Bất kỳ ai vào bằng đường link này, website sẽ tự động lưu dấu vĩnh viễn bạn là người giới thiệu đầu tiên, và bạn sẽ vĩnh viễn nhận được thu nhập mỗi khi 1 trong số những người mà bạn giới thiệu có các hoạt động dưới đây </p>
                <p className="text-xs mt-1"> * việc trả phí giới thiệu lấy từ lợi nhuận của website nên không ảnh hưởng tới thu nhập của người được giới thiệu  </p>

                <div className="flex gap-8 mt-8 text-sm">
                    <div className="">
                        <p className="mb-4"> Hoạt động   </p>
                        <List.Item>Trở thành chuyên gia solo hoặc rank  </List.Item>
                        <Divider className="mb-1 mt-1" />
                        <List.Item>Nâng cấp hoặc gia hạn tài khoản chuyên gia </List.Item>
                        <Divider className="mb-1 mt-1" />
                        <List.Item>Là chuyên gia solo và được theo dõi </List.Item>
                        <Divider className="mb-1 mt-1" />
                        <List.Item>Là nhà đầu tư và tài trợ rank  </List.Item>
                    </div>
                    <div>
                        <p className="mb-4">Được chia</p>
                        <p>20% gói đăng ký chuyên gia  </p>
                        <Divider className="mb-1 mt-1" />
                        <p>20% gói nâng cấp/gia hạn</p>
                        <Divider className="mb-1 mt-1" />
                        <p>10% gói theo dõi chuyên gia solo  </p>
                        <Divider className="mb-1 mt-1" />
                        <p>20% gói theo dõi chuyên gia rank</p>
                    </div>
                </div>
            </div>

        </div>
    )

}