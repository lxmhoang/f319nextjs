'use client'

import { useAppContext } from "@/app/lib/context"
import { addComma, convert } from "@/app/lib/utils"
import { Button, List } from "flowbite-react"
import Image from "next/image";

export default function MyProfileOverView({ host }: { host: string }) {
    const { user, firebaseUser } = useAppContext()

    if (user == undefined) {
        return (
            <> Loading profile ... </>
        )
    }

    const ref = user.accessId
    const url = 'https://' + host + '?ref=' + ref
    const amount = user.amount
    return (
        <div>
            {/* {user.uid} */}
            <div>
                <div>{user.displayName}</div>
                {firebaseUser && firebaseUser.photoURL && <div><Image width={100} height={100} src={firebaseUser.photoURL} priority={true} alt={""}
                    style={{ width: '100%', height: 'auto' }} /></div>}
                <div className="mb-4">Tài khoản: {addComma(amount)}</div>
                {user.isExpert && user.expertType == 'solo' && (<p className="mb-4">Chuyên gia solo</p>)}
                {user.isExpert && user.expertType == 'rank' && (<p className="mb-4">Chuyên gia rank</p>)}
                Chia sẻ đường link này để nhận được 20% doanh thu mỗi khi người mà bạn giới thiệu :
                <List>
                    <List.Item>Đăng ký làm chuyên gia  </List.Item>
                    <List.Item>Nâng cấp hoặc gia hạn tài khoản chuyên gia </List.Item>
                    <List.Item>Theo dõi bất kỳ chuyên gia nào </List.Item>
                </List>
                <div className="">
                    <p className="text-2xl mb-4 mt-2">{url}</p>
                    <Button onClick={() => {
                        navigator.clipboard.writeText(url)
                    }}>Copy URL</Button>
                </div>

            </div>

        </div>
    )

}