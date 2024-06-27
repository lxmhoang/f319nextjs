
'server-only'
'use server'
import { Expert, expertAdminConverter } from "../model/expert";
import { predAdminConverter } from "../model/prediction";
import { serverGetModal, serverQueryCollection, serverUpdateDoc } from "./firebaseadmin/adminfirestore";

import { getCurrentUserId, getUserInfoFromSession } from "@/app/lib/firebaseadmin/adminauth";
import { getRealTimeStockData } from "./getStockData";
import { WhereFilterOp } from "firebase-admin/firestore";
import { signInWithGoogle } from "./firebase/auth";
import { userAdminConverter } from "../model/user";
import { subscriptionAdminConverter } from "../model/subscription";

export async function getExpert(eid: string) {
    // console.log('get expert with id ' + eid)
    return await serverGetModal<Expert>('expert/' + eid, expertAdminConverter)
}

export async function getUserDBInfo() {

    const info = await getUserInfoFromSession()
    console.log(JSON.stringify(info))
    if (info) {
        const result = await serverGetModal('user/' + info.uid, userAdminConverter)
        return result
    } else {
        return undefined
    }
}

export async function getMyFollowingExpertIDs() {
    const uid = await getCurrentUserId()
    if (!uid) {
        return []
    }

    const toDay = new Date()

    const result = await serverQueryCollection('subscription', [{key:'uid', operator:'==', value: uid},{key:'endDate', operator:'>=', value: toDay}], subscriptionAdminConverter)

    const eids = result.map((sub) => {
        return sub.eid
    })

    return eids
}

export async function getAdvisor() {
    const info = await getUserInfoFromSession()
    // console.log('getAdvisor ' + JSON.stringify(info))
    if (info == undefined) {
        return {
            expert: undefined,
            expired: false
        }
    }
    const expert = await getExpert(info.uid)
    // console.log('getAdvisor' + JSON.stringify(expert))
    // return expert
    if (!expert) {
        return {
            expert: undefined,
            expired: false
        }
    }

    const expiration = new Date(expert.expertExpire) < new Date()

    return {
        expert: expert,
        expired: expiration
    }

}

export async function getAllMypreds(filters:{key:string, operator: WhereFilterOp, value:any}[] = []) {

    const info = await getUserInfoFromSession()
    if (!(info != undefined && info.isExpert)) {
        throw new Error('bạn không phải chuyên gia' + JSON.stringify(info))
        return []
    }
    const result = await serverQueryCollection('expert/' + info.uid + '/preds', filters, predAdminConverter)
    const wrongPred = result.find((it) => it.ownerId != info.uid)
    if (wrongPred) {
        throw new Error('Thông tin data bị lệch ')
    }

    return result

}

export async function getMyWIPPreds() {


    return getAllMypreds([{ key: 'status', operator: '==', value: 'Inprogress' }])
}

export async function closeWIPPreds(ids: string[], rank: boolean = false) {

    const userInfo = await getUserInfoFromSession()
    if (!userInfo) {
        throw new Error('user not signed in')
    }
    const expertType = userInfo.expertType


    const preds = await getMyWIPPreds()
    // console.log('wip preds ' + JSON.stringify(preds))
    const predsToBeClosed = preds.filter((item) => {
        // console.log('check if id  ' + item.id + ' in array ' + [ids])
        // item.id && ids.includes(item.id) 
        return (item.id && ids.includes(item.id))
    })

    console.log('ids : ' + ids + ' predsToBeClosed ' + JSON.stringify(predsToBeClosed))
    if (predsToBeClosed.length != ids.length) {
        throw new Error('ID không khớp với danh sách khuyến nghị đang tiếp diễn')
    }

    const listCodes = Array.from(new Set(predsToBeClosed.map((it) => it.assetName)))
    const prices = await getRealTimeStockData(listCodes)

    // const codes = new Set(Object.keys(prices))
    console.log(' listCodes ' + listCodes)
    console.log(' prices ' + Object.keys(prices))

    if (!listCodes.every(val => Object.keys(prices).includes(val))) {
        throw new Error('khong lấy được giá hiện tại của cổ phiếu ')
    }
    

    for (const pred of predsToBeClosed) {
        if (pred.id) {
            const currentLowPrice = prices[pred.assetName].low
            console.log('begin to closindg pred with assest : ' + pred.assetName + ' price ' + currentLowPrice)
            let data = {priceRelease : currentLowPrice, dateRelease: new Date(), status:"Closed"}
            await serverUpdateDoc('expert/' + pred.ownerId +'/preds/' + pred.id, data)
            if (expertType == 'rank') {
                await serverUpdateDoc('rankPred/' + pred.id, {priceRelease : currentLowPrice, dateRelease: new Date(), status:"Closed"})

            }
        }
    }

    // const delay = () => {

    //     return new Promise<void>(resolve => {
    //         setTimeout(() => {
    //             resolve()
    //         }, 2000)
    //     })
    // }

    // await delay()



    // const info = await getUserInfoFromSession()
    // if (!(info.uid && info.isExpert)) {
    //     throw new Error('bạn không phải chuyên gia')
    // }

}
