'use client'

import { useAppContext } from "@/app/lib/context"
import { Divider } from "@nextui-org/react"
import {Link} from "@nextui-org/react";
import { Label } from "flowbite-react";

export default function MyActivityView() {
    const { user } = useAppContext()
    const notifies = user?.notifies

    if (!user) {
        return (
            <>
                Loading
            </>
        )

    }

    if (!notifies || notifies.length == 0) {
        return (
            <>
                Không có hoạt động nào
            </>
        )
    }

    return (
        <>
            <p className="mb-4">Thông báo tới bạn</p>
                        <Divider className="mt-2 mb-2" />
            {/* {JSON.stringify(notifies)} */}
            <>
                {notifies.map((item) => {   
                    return (
                        <div className="gap-4 block" key={item.dateTime}>
                            <Link href={item.urlPath ?? ""}>
                                {item.content}
                            </Link>

                            <p className="text-xs mt-2">{(new Date(item.dateTime)).toLocaleString('vi')}</p> 

                        <Divider className="mt-2 mb-2" />
                        </div>
                        
                    )






                })}
            </>
        </>
    )

}