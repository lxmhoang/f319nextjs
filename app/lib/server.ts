
'server-only'
'use server'
import { Expert, expertAdminConverter } from "../model/expert";
import { predAdminConverter } from "../model/prediction";
import { addANewTransaction, serverAddNewModal, serverGetModal, serverQueryCollection, serverSetDoc, serverUpdateDoc } from "./firebaseadmin/adminfirestore";

import { getSoloGod, getUserInfoFromSession, getthuquyUID, setClaim } from "@/app/lib/firebaseadmin/adminauth";
import { getRealTimeStockData } from "./getStockData";
import { FieldValue, WhereFilterOp } from "firebase-admin/firestore";
import { User, userAdminConverter } from "../model/user";
import { Subscription, subscriptionAdminConverter } from "../model/subscription";
import { cookies } from "next/headers";
import { addComma, perfConver, sortByField } from "./utils";
import { UserNoti, notiAdminConverter } from "../model/noti";
import { TranType, Transaction } from "../model/transaction";
import { unstable_cache } from "next/cache";
import { getPivotDates } from "./statistic";
import { BoardProps } from "../ui/rank";

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
    const userInfo = await getUserInfoFromSession()
    if (!userInfo) {
        return []
    }
    const uid = userInfo.uid

    const toDay = new Date()

    console.log('aaaa')
    const result = await serverQueryCollection('subscription', [{ key: 'uid', operator: '==', value: uid }, { key: 'endDate', operator: '>=', value: toDay }], subscriptionAdminConverter, 5)

    console.log('aaaa')

    let eids = result.map((sub) => {
        return sub.eid
    })

    if (userInfo.isRank) {
        const rankExpert = await serverQueryCollection('expert', [{ key: 'expertType', operator: '==', value: 'rank' }], expertAdminConverter)
        const rankIds = rankExpert.map((item) => {
            return item.id
        })

        eids.push(...rankIds)
    }

    return eids
}

export async function getAdvisor() {
    const info = await getUserInfoFromSession()
    console.log('getUserInfoFromSession ' + JSON.stringify(info))
    if (info == undefined) {
        return {
            expert: undefined,
            expired: false
        }
    }
    const expert = await getExpert(info.uid)
    console.log('getAdvisor' + JSON.stringify(expert))
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

export async function getAllMypreds(filters: { key: string, operator: WhereFilterOp, value: any }[] = []) {

    const info = await getUserInfoFromSession()
    if (!(info != undefined && info.isExpert)) {
        // throw new Error('bạn không phải chuyên gia' + JSON.stringify(info))
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

export async function verifyAccessID(accessId: string) {
    const result = await serverQueryCollection('user', [{ key: 'accessId', operator: '==', value: accessId }], userAdminConverter)
    return result.length == 0
}

export async function addUser(payload: string) {
    const user: User = JSON.parse(payload)
    await serverSetDoc('user/' + user.uid, userAdminConverter.toFirestore(user) )
    const noti: UserNoti = {
        title: "Welcome",
        dateTime: toDay.getTime(),
        content: "Chào mừng quý nhà đầu tư "
    }
    await sendNotificationToUser(user.uid, noti)

    const notiBoard : UserNoti = {
        title: "Welcome",
        dateTime: toDay.getTime(),
        content: "Chào mừng " + user.displayName + " đã tham gia"
    }
    await sendNotificationToBoard(notiBoard)
}

export async function closeWIPPreds(ids: string[], rank: boolean = false) {

    const toDay = new Date()

    const userInfo = await getUserInfoFromSession()
    if (!userInfo) {
        throw new Error('user not signed in')
    }
    if (userInfo.isExpert == false) {
        throw new Error('user is not an expert')
    }

    const expertInfo = await serverGetModal('expert/' + userInfo.uid, expertAdminConverter)


    if (!expertInfo) {
        throw new Error('user is not an expert')
    }


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

            const payload = {
                priceRelease: currentLowPrice,
                dateRelease: toDay,
                status: "OWNER_CLOSED"
            }

            await serverUpdateDoc('expert/' + pred.ownerId + '/preds/' + pred.id, payload)
            if (expertInfo.expertType == 'rank') {
                await serverUpdateDoc('rankPred/' + pred.id, payload)
                // await serverQueryCollection(path:'user', {key:'rank'})
            }

            // notify  user 

            const noti: UserNoti = {
                dateTime: toDay.getTime(),
                title: pred.assetName,
                content: "Chuyên gia " + expertInfo.name + " đã khuyên kết thúc khuyến nghị cổ phiếu " + pred.assetName + " trước thời hạn, với giá hiện tại " + currentLowPrice,
                urlPath: '/expert/details/' + pred.ownerId + "#" + pred.id
            }

            let notifiedUsersIds: string[] = []

            if (expertInfo.expertType == 'rank') {
                notifiedUsersIds = (await serverQueryCollection<User>('user', [{ key: 'rankExpire', operator: '>=', value: toDay }], userAdminConverter)).map((item) => item.uid)
            } else {
                notifiedUsersIds = expertInfo.follower.filter((item) => {item.endDate < toDay}).map((item) => item.uid)
            }

            for (const userID of notifiedUsersIds) {
                await sendNotificationToUser(userID, noti)
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


export async function persistUserInfo(payload: string | undefined) {
    if (!payload) {
        cookies().delete('uInfo')
    } else {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const userInfo: User = JSON.parse(payload)
        const data = { isExpert: userInfo.isExpert ?? false }
        // const descr = await encrypt(JSON.stringify(data))
        cookies().set('uInfo', JSON.stringify(data), { maxAge: expiresIn, httpOnly: true, secure: false })

    }

}

const key = "keyaaa"
export async function encrypt(text: string) {

    const keyUtf8 = new TextEncoder().encode(key)
    const keyHash = await crypto.subtle.digest('SHA-256', keyUtf8)


    const iv = crypto.getRandomValues(new Uint8Array(12))
    const alg = { name: 'AES-GCM', iv: iv }

    const encrpytKey = await crypto.subtle.importKey('raw', keyHash, alg, false, [
        'encrypt',
    ])

    const textUtf8 = new TextEncoder().encode(text)
    const encrypted = await crypto.subtle.encrypt(alg, encrpytKey, textUtf8)
    // const encryptedText = new TextDecoder('utf-8').decode(encrypted)
    const encryptedText = ab2str(encrypted)
    const b64 = btoa(encryptedText)
    // console.log('hoang beo encrypt ' + encryptedText + ' base64 : ' + b64)
    const ivHex = Array.from(iv).map(b => ('00' + b.toString(16)).slice(-2)).join('')
    console.log('iv Hex ' + ivHex)
    const payload = ivHex + b64
    console.log('did encrypt userInfo ' + payload)
    return payload

}

function ab2str(buf: ArrayBuffer) {

    const uintArr = new Uint8Array(buf);
    return String.fromCharCode.apply(null, Array.from(uintArr));
}

export async function decrypt(enText: string) {
    // console.log('enText ' + enText)

    const iv = enText.slice(0, 24)!.match(/.{2}/g)!.map(byte => parseInt(byte, 16))

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

export async function sendNotificationToBoard(noti: UserNoti) {
    await serverUpdateDoc('stats/latest', {notifies: FieldValue.arrayUnion(noti)})    
}

export async function sendNotificationToUser(userID: string, noti: UserNoti) {
    await serverAddNewModal('user/' + userID + '/notiHistory', noti, notiAdminConverter)
    await serverUpdateDoc('user/' + userID, {notifies: FieldValue.arrayUnion(noti)})    
}

export async function getRankingInfo() {
    const numOfWinner = Number(process.env.RANK_NUM_WINNER) ?? undefined
    if (!numOfWinner) {
        throw new Error('Khong tim duoc numbOfWinner')
    }
    const experts = await serverQueryCollection('expert', 
    [{ key: "expertType", operator: "==", value: "rank" },
     { key: "status", operator: "==", value: "activated" }    

    ], expertAdminConverter
    )
    // let experts = rankExpert.filter((item) => { return item.status == 'activated' })

    const monthly = sortByField(experts, "monthPerform").map((item) => {
        return {
            name: item.name,
            id: item.id,
            perf: perfConver(item.monthPerform ?? 0)
        }
    }).slice(0,numOfWinner)

    const yearly = sortByField(experts, "yearPerform").map((item) => {
        return {
            name: item.name,
            id: item.id,
            perf: perfConver(item.yearPerform ?? 0)
        }
    }).slice(0,numOfWinner)

    const quarter = sortByField(experts, "quarterPerform").map((item) => {
        return {
            name: item.name,
            id: item.id,
            perf: perfConver(item.quarterPerform ?? 0)
        }
    }).slice(0,numOfWinner)

    const weekly = sortByField(experts, "weekPerform").map((item) => {
        return {
            name: item.name,
            id: item.id,
            perf: perfConver(item.weekPerform ?? 0)
        }
    }).slice(0,numOfWinner)

    return { weekly, monthly, quarter, yearly }
}

//   export async function getMyTransHistory() {
// wip.....
//     const myInfo = await getUserInfoFromSession()
//   }



export async function joinRankUser(perm: boolean) {
    
    const userInfo = await getUserInfoFromSession() 

    if (userInfo == null) {
        return Promise.resolve({
            success: false,
            error: "not authorized"
        })
    }

    const user = await serverGetModal<User>('user/' + userInfo.uid, userAdminConverter)
    if (user == undefined) {
        return Promise.resolve({
            success: false,
            error: "khong ton tai user"
        })
    }

    const fee = perm ? Number(process.env.NEXT_PUBLIC_RANK_SPONSOR_PERM) : Number(process.env.NEXT_PUBLIC_RANK_SPONSOR_MONTH)
    if (user.amount < fee) {
        return Promise.resolve({
            success: false,
            error: "khong du tien , chi co " + user.amount + " , can : " + fee
        })
    }

    const soloGod = await getSoloGod()
    if (!soloGod) {
        return Promise.resolve({
            success: false,
            error: "khong tim duoc thu quy"
        })
    }

    const tran: Transaction = {
        tranType: TranType.followRank,
        toUid: soloGod,
        fromUid: user.uid,
        amount: fee,
        status: "Done",
        notebankacc: "",
        date: new Date()
    }
    console.log(' trans ' + JSON.stringify(tran))
    const result = await addANewTransaction(tran)
    if (result.success == false) {
        return Promise.resolve({
            success: false,
            error: result.message
        })
    }

    const subRank : Subscription = {
        uid: userInfo.uid,
        eid: soloGod,
        startDate: toDay,
        endDate: endDateSubWithPerm(perm),
        perm: perm,
        value: fee,
        type: "rank"
    }
    console.log(' subRank ' + JSON.stringify(subRank))

    const newSubRef = await serverAddNewModal<Subscription>('subscription', subRank, subscriptionAdminConverter)

    const cusClaim = {
        expertType: userInfo.expertType,
        expertPeriod: userInfo.expertPeriod,
        expertExpire: userInfo.expertExpire,
        rankExpire:  endDateSubWithPerm(perm).getTime()
    }

    await setClaim(userInfo.uid, cusClaim) 

    await serverUpdateDoc('user/' + userInfo.uid, {rankExpire: endDateSubWithPerm(perm).getTime()})


    const subInfo = subRank
    subInfo.id = newSubRef.id

    await serverUpdateDoc('user/' + userInfo.uid, {following : FieldValue.arrayUnion(subInfo)})
    await serverSetDoc('user/' + userInfo.uid + '/subHistory/' + newSubRef.id, subInfo)

    // notify user

    const notiForUser : UserNoti = {
        dateTime : toDay.getTime(),
        title: 'Đã tham gia tài trợ rank',
        content: 'Giờ đây quý nhà đầu tư đã có thể theo dõi toàn bộ chuyên gia đua rank',
        urlPath: '/expert'
    }

    await sendNotificationToUser(userInfo.uid, notiForUser)

    return {
        success: true,
        error: ""
    }
}


export async function subcribleToAnExpert(eid: string, perm: boolean) {

    const userInfo = await getUserInfoFromSession() 


    if (userInfo == null) {
        return Promise.resolve({
            success: false,
            error: "not authorized"
        })
    }

    const user = await serverGetModal<User>('user/' + userInfo.uid, userAdminConverter)
    if (user == undefined) {
        return Promise.resolve({
            success: false,
            error: "khong ton tai user"
        })
    }

    const expertToSub = await serverGetModal<Expert>('expert/' + eid, expertAdminConverter)

    if (expertToSub == undefined) {
        return Promise.resolve({
            success: false,
            error: "khong tim thay expert"
        })
    }

    if (expertToSub.id == user.uid) {
        return Promise.resolve({
            success: false,
            error: "user va expert la chung 1 nguoi"
        })

    }

    if (perm == true && (expertToSub.expertType != 'perm') ) {
        return Promise.resolve({
            success: false,
            error: "Chỉ có thể follow vĩnh viễn một chuyên gia trọn đời"
        })
    }

    const fee = perm ? expertToSub.permPrice : expertToSub.monthlyPrice

    if (!fee) {
        return Promise.resolve({
            success: false,
            error: "Không xác định được giá "
        })
    }

    if (user.amount < fee) {
        return Promise.resolve({
            success: false,
            error: "khong du tien , chi co " + user.amount + " , can : " + fee
        })
    }


    const existingSub = await serverQueryCollection('subscription',[{key: 'eid',operator: '==',value: eid},{key: 'uid',operator: '==',value: user.uid}, {key: 'endDate',operator: '>=',value: toDay}], subscriptionAdminConverter) 
    if (existingSub.length > 0) {
        return Promise.resolve({
            success: false,
            error: "Subscription da ton tai"
        })

    }

    const tran: Transaction = {
        tranType: TranType.followSolo,
        toUid: expertToSub.id,
        fromUid: user.uid,
        amount: Number(fee),
        status: "Done",
        notebankacc: "",
        date: new Date()
    }

    const result = await addANewTransaction(tran)
    if (result.success == false) {
        return Promise.resolve({
            success: false,
            error: result.message
        })
    }

    // const subCollection = db.collection('subscription/').withConverter(subscriptionAdminConverter)
    if (user) {
        const newSub: Subscription = {
            uid: user.uid,
            eid: eid,
            startDate: new Date(),
            perm: perm,
            endDate: endDateSubWithPerm(perm),
            value: fee,
            type: "solo"
        }
        console.log('adding new sub' + JSON.stringify(newSub))
        const newSubRef = await serverAddNewModal<Subscription>('subscription/', newSub, subscriptionAdminConverter)// subCollection.add(newSub)

        const subInfo = newSub
        subInfo.id = newSubRef.id

        await serverUpdateDoc('user/' + userInfo.uid, {following : FieldValue.arrayUnion(subInfo)})
        await serverSetDoc('user/' + userInfo.uid + '/subHistory/' + newSubRef.id, subInfo)

        await serverUpdateDoc('expert/' + expertToSub.id, {follower : FieldValue.arrayUnion(subInfo)})
        await serverSetDoc('expert/' + expertToSub.id + '/subHistory/' + newSubRef.id, subInfo)
    
        // notify user
    
        const notiForUser : UserNoti = {
            dateTime : toDay.getTime(),
            title: 'Đã tham gia tài trợ rank',
            content: 'Giờ đây quý nhà đầu tư đã có thể theo dõi toàn bộ chuyên gia đua rank',
            urlPath: '/expert'
        }
        await sendNotificationToUser(userInfo.uid, notiForUser)


        // notify expert
    
        const notiForExpert : UserNoti = {
            dateTime : toDay.getTime(),
            title: 'Đã tham gia tài trợ rank',
            content: 'Xin chúc mừng, 1 nhà đầu tư vừa mới theo dõi bạn ' + perm ? "trọn đời" : "1 tháng",
            urlPath: '/expert'
        }
    
        await sendNotificationToUser(expertToSub.id, notiForExpert)

        return {
            success: true,
            error: ""
        }
    } else {
        return {
            error: "unauthorized",
            success: false
        }
    }
}



const toDay = new Date()

const endDateSubWithPerm = (perm: boolean) => {
    const monthlater = toDay
    monthlater.setMonth(monthlater.getMonth() + 1)
    return perm ? new Date('2050-01-01') : monthlater
}

export async function getStatsRankData() {

}

export async function getRankData() {
    const { weekly, monthly, quarter, yearly } = await getRankingInfo()

  
    const { pivotWeek, pivotMonth, pivotQuarter, pivotYear, weekEnd, monthEnd, quarterEnd, yearEnd } = getPivotDates(new Date())
    const weekDate = pivotWeek.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
    const monthDate = pivotMonth.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
    const quarterDate = pivotQuarter.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
    const yearDate = pivotYear.toLocaleDateString('vi')
    const weekTo = weekEnd.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
    const monthTo = monthEnd.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
    const quarterTo = quarterEnd.toLocaleDateString('vi', { day: 'numeric', month: 'numeric' })
    const yearTo = yearEnd.toLocaleDateString('vi')
  
    const numOfWinner = Number(process.env.RANK_NUM_WINNER)
    const weeklyReward = Number(process.env.RANK_WEEK_REWARD) / numOfWinner
    const monthlyReward = Number(process.env.RANK_MONTH_REWARD) / numOfWinner
    const quarterlyReward = Number(process.env.RANK_QUARTER_REWARD) / numOfWinner
    const yearlyReward = Number(process.env.RANK_YEAR_REWARD)
    const rankData: BoardProps[] = [
      { title: 'Top Tuần', since: weekDate, to: weekTo, total: addComma(weeklyReward), rewards: [], data: weekly },
      { title: 'Top Tháng', since: monthDate, to: monthTo, total: addComma(monthlyReward), rewards: [], data: monthly },
      { title: 'Top Quý', since: quarterDate, to: quarterTo, total: addComma(quarterlyReward), rewards: [], data: quarter },
      { title: 'Top Năm', since: yearDate, to: yearTo, total: addComma(yearlyReward), rewards: [], data: yearly }
    ]
    return rankData
  
  }