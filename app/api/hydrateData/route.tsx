
// scan de xoa data notification va follower, following thua, da backup o collection
// chay 1 tuan 1 lan


import { serverQueryCollection, serverUpdateDoc } from "@/app/lib/firebaseadmin/adminfirestore"
import { getExpert } from "@/app/lib/server"
import { contentOf, datesGreaterThan } from "@/app/lib/utils"
import { ExpertStatus, expertAdminConverter, expertRawConverter } from "@/app/model/expert"
import { userRawConverter } from "@/app/model/user"
import { FieldValue } from "firebase-admin/firestore"

export async function GET(request: Request) {

    const message: string[] = []
    const toDay = new Date()

    try {

        message.push('xu ly cac expert nest object da expired, backup ko dong toi')
        const allExpert = await serverQueryCollection('expert',
            [
                // { key: 'status', operator: '==', value: 'activated' },
                // { key: 'expertExpire', operator: '<', value: toDay.getTime() }

            ],
            expertRawConverter)



        message.push('xu ly cac follower nest object da expired, backup ko dong toi')
        for (const expert of allExpert) {
            message.push('check if any follower expired with expert id : ' + expert.id)
            for (const follwer of expert.follower) {
                // message.push('check if any follower expired with expert id : ' + follwer.endDate.toDate())

                if (datesGreaterThan(toDay, follwer.endDate.toDate())) {
                    message.push('this follower have end date < today, will be deleted ' + JSON.stringify(follwer))
                    await serverUpdateDoc('expert/' + expert.id, {follower: FieldValue.arrayRemove(follwer)})  
                }
            }
        }

        const allUser = await serverQueryCollection('user', [],userRawConverter)

        message.push('duyet danh sach user, xu ly cac following nest object da qua lau, backup ko dong toi')
        for (const user of allUser) {
            message.push('check if any following da qua cu with user id : ' + user.displayName)
            for (const sub of user.following) {
                // message.push('check if any follower expired with expert id : ' + follwer.endDate.toDate())

                if (datesGreaterThan(toDay, sub.endDate.toDate())) {
                    message.push('this following have end date < today, will be deleted ' + JSON.stringify(sub))
                    await serverUpdateDoc('user/' + user.id, {following: FieldValue.arrayRemove(sub)})  
                }
            }


            // message.push('remove bot notification qua cu cua user : ' + user.displayName)
            // for (const noti of user.notifies) {
            //     // message.push('check if any follower expired with expert id : ' + follwer.endDate.toDate())
            //     // remove sau 2 ngay
            //     const date = new Date(noti.dateTime + 1000 * 3600 * 24 * 2)

            //     if (datesGreaterThan(toDay, date)) {
            //         message.push('this following have end date < today, will be deleted ' + JSON.stringify(sub))
            //         await serverUpdateDoc('user/' + user.id, {following: FieldValue.arrayRemove(sub)})  
            //     }
            // }
        }




    } catch (error) {

        message.push('Error : ' + JSON.stringify(error))
        return new Response(contentOf(message), {
            status: 400,
        })
    }

    return new Response(contentOf(message), {
        status: 200
    })
}
