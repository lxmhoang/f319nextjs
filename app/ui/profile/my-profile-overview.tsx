'use client'

import { useAppContext } from "@/app/lib/context"

export default function MyProfileOverView({ host }: { host: string }) {
    const { user } = useAppContext()

    if (user == undefined) {
        return (
            <> Please Sign in</>
        )
    }

    const ref = user.accessId
    const amount = user.amount

    return (
        <div>
            {user.uid}
            <div>
                <div>{amount}</div>
                Share url này để kiếm tiền affiliate :

                <p>{host}/{ref}</p>

            </div>

        </div>
    )

}