
'server-only'
'use server'
import { Expert, ExpertStatus, expertAdminConverter, expertFromRaw } from "../model/expert";
import { Prediction, predAdminConverter, predictionFromRaw } from "../model/prediction";
import { firestoreAddNewModal, firestoreBatchUpdate, firestoreCountModal, firestoreGetModal, firestoreGetRaw, firestoreQueryCollection, firestoreQueryCollectionGroup, firestoreSetDoc, firestoreUpdateDoc } from "./firebaseadmin/adminfirestore";

import { getUserInfoFromSession, getthuquyUID, setClaim } from "@/app/lib/firebaseadmin/adminauth";
import { bonusAppliedToPred, getRealTimeStockData } from "./getStockData";
import { FieldValue, WhereFilterOp } from "firebase-admin/firestore";
import { User, userAdminConverter } from "../model/user";
import { Subscription, subscriptionAdminConverter } from "../model/subscription";
import { cookies } from "next/headers";
import { addComma, arrayFromData, dataFromArray, didFollow, perfConver, sortByField } from "./utils";
import { UserNoti, notiAdminConverter } from "../model/noti";
import { TranType, Transaction, tranAdminConverter, tranTypeText } from "../model/transaction";
import { getNextMonthMileStone, getNextQuarterMileStone, getNextWeekMileStone, getNextYearMileStone, getPivotDates } from "./statistic";
import { BoardProps } from "../ui/rank";
import { databaseAddDoc, databaseGetDoc, databaseSetDoc, databaseUpdateDoc } from "./firebaseadmin/adminRealTimeDatabase";
import { FeedBack, feedBackAdminConverter } from "../model/feedback";
import { increment } from "firebase/database";

//  RT : user (for admin), board noti, user noti , subscription (follower, folowwing), transaction , stats
// FS : user , expert, prediction, feedback, 


export async function sendNotificationToBoard(noti: UserNoti) {
    // const newRef = await firestoreAddNewModal('notifies', noti, notiAdminConverter)
    // noti.id = newRef.id
    // await firestoreSetDoc('stats/latest', { notifies: FieldValue.arrayUnion(noti) }, true)

    //rtdb
    await databaseAddDoc('boardNoti', noti)
}

export async function sendNotificationToUser(userID: string, noti: UserNoti) {
    // firestore
    // const newRef = await firestoreAddNewModal('user/' + userID + '/notiHistory', noti, notiAdminConverter)
    // noti.id = newRef.id
    // await firestoreUpdateDoc('user/' + userID, { notifies: FieldValue.arrayUnion(noti) })

    //rtdb
    const refPath = await databaseAddDoc('user/' + userID + '/notifies', noti)
    console.log(' ref Path ' + refPath.toString())
}

export async function updateProfilePhone(formData: FormData) {
    const phoneNumber = formData.get('phoneNumber') as string
    const userInfo = await getUserInfoFromSession()
    if (userInfo && phoneNumber) {
        await serverUpdateUserInfo(userInfo.uid, {phoneNumber: phoneNumber})
    }
}

export async function getExpert(eid: string) {
    return firestoreGetModal<Expert>('expert/' + eid, expertAdminConverter)
}

export async function getAllActivatedExpert() {
    const expertsData = await databaseGetDoc('expert')
    const result : Expert[] = arrayFromData<Expert>(expertsData, expertFromRaw)
    return result

}

export async function clientGetExperts(filters: {key:string, operator: WhereFilterOp, value:any }[]) {
    const exps = await firestoreQueryCollection('expert',filters,expertAdminConverter)

    return JSON.stringify(exps)
}

export async function getExperts(filters: {key:string, operator: WhereFilterOp, value:any }[]) {
    return firestoreQueryCollection('expert',filters,
        // [
        //     { key: "status", operator: "==", value: "activated" }
        // ],
        expertAdminConverter,
    )
}



export async function getUserDBInfo() {

    const info = await getUserInfoFromSession()
    console.log(JSON.stringify(info))
    if (info) {
        const result = await firestoreGetModal('user/' + info.uid, userAdminConverter)
        // const dbResult = await databaseGetDoc('user')
        return result
    } else {
        return undefined
    }
}

export async function getMyAdvisorProfile() {
    const info = await getUserInfoFromSession()

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

export async function clientGetAllMyPreds() {
    const preds = await getAllMypreds()
    return JSON.stringify(preds)

}

export async function getAllMypreds(
    // filters: { key: string, operator: WhereFilterOp, value: any }[] = []

) {

    const info = await getUserInfoFromSession()

    if (!(info != undefined && info.isExpert)) {
        // throw new Error('bạn không phải chuyên gia' + JSON.stringify(info))
        return []
    }
    // const result = await firestoreQueryCollection('expert/' + info.uid + '/preds', filters, predAdminConverter)
    const result = arrayFromData<Prediction>(await databaseGetDoc('user/' + info.uid + '/preds'), predictionFromRaw)
    const wrongPred = result.find((it) => { return it.ownerId != info.uid})
    if (wrongPred) {
        console.log('____' + JSON.stringify(wrongPred))
        throw new Error('Thông tin data bị lệch ')
    }
    return result
}

export async function getMyWIPPreds() {

    const allpreds = await getAllMypreds()

    return allpreds.filter((item) => {
        return item.status == 'Inprogress'
    })

    // return getAllMypreds([{ key: 'status', operator: '==', value: 'Inprogress' }])
}

export async function verifyAccessID(accessId: string) {
    const result = await firestoreQueryCollection('user', [{ key: 'accessId', operator: '==', value: accessId }], userAdminConverter)
    return result.length == 0
}

export async function serverAddUser(payload: string) {
    const user: User = JSON.parse(payload)
    try {
        await databaseSetDoc('user/' + user.uid, user)
        await firestoreSetDoc('user/' + user.uid, userAdminConverter.toFirestore(user))
    } catch (error) {
        console.log('error Adding User ' + JSON.stringify(error))
    }
    const noti: UserNoti = {
        title: "Welcome",
        dateTime: Date.now(),
        content: "Chào mừng quý nhà đầu tư ",
        urlPath : '/intro'
    }
    await sendNotificationToUser(user.uid, noti)

    const notiBoard: UserNoti = {
        title: "Welcome",
        dateTime: Date.now(),
        content: "Chào mừng " + user.displayName + " đã tham gia"
    }
    await sendNotificationToBoard(notiBoard)
}

export async function closeWIPPreds(ids: string[], rank: boolean = false) {

    const userInfo = await getUserInfoFromSession()
    if (!userInfo) {
        throw new Error('user not signed in')
    }
    if (userInfo.isExpert == false) {
        throw new Error('user is not an expert')
    }

    const expertInfo = await firestoreGetModal('expert/' + userInfo.uid, expertAdminConverter)


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
                dateRelease: Date.now(),
                status: "OWNER_CLOSED"
            }

            await firestoreUpdateDoc('expert/' + pred.ownerId + '/preds/' + pred.id, payload)
            await databaseUpdateDoc('user/' + pred.ownerId + '/preds/' + pred.id, payload)

            // if (expertInfo.expertType == 'rank') {
            //     await firestoreUpdateDoc('rankPred/' + pred.id, payload)
            // }

            // notify  user 

            const noti: UserNoti = {
                dateTime: Date.now(),
                title: pred.assetName,
                content: "Chuyên gia " + expertInfo.name + " đã khuyên kết thúc khuyến nghị cổ phiếu " + pred.assetName + " trước thời hạn, với giá hiện tại " + currentLowPrice,
                urlPath: '/expert/details/' + pred.ownerId + "#" + pred.id
            }

            await notifyObserverOfExpert(noti, expertInfo)

        }
    }


}


export async function persistUserInfo(payload: string | undefined) {
    if (!payload) {
        cookies().delete("__session");
        cookies().delete('uInfo')
    } else {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const userInfo: User = JSON.parse(payload)
        const data = { isExpert: userInfo.isExpert ?? false }
        // const descr = await encrypt(JSON.stringify(data))
        cookies().set('uInfo', JSON.stringify(data), { maxAge: expiresIn, httpOnly: true, secure: true })

    }

}

// const key = "keyaaa"
// export async function encrypt(text: string) {

//     const keyUtf8 = new TextEncoder().encode(key)
//     const keyHash = await crypto.subtle.digest('SHA-256', keyUtf8)


//     const iv = crypto.getRandomValues(new Uint8Array(12))
//     const alg = { name: 'AES-GCM', iv: iv }

//     const encrpytKey = await crypto.subtle.importKey('raw', keyHash, alg, false, [
//         'encrypt',
//     ])

//     const textUtf8 = new TextEncoder().encode(text)
//     const encrypted = await crypto.subtle.encrypt(alg, encrpytKey, textUtf8)
//     // const encryptedText = new TextDecoder('utf-8').decode(encrypted)
//     const encryptedText = ab2str(encrypted)
//     const b64 = btoa(encryptedText)
//     // console.log('hoang beo encrypt ' + encryptedText + ' base64 : ' + b64)
//     const ivHex = Array.from(iv).map(b => ('00' + b.toString(16)).slice(-2)).join('')
//     console.log('iv Hex ' + ivHex)
//     const payload = ivHex + b64
//     console.log('did encrypt userInfo ' + payload)
//     return payload

// }

// function ab2str(buf: ArrayBuffer) {

//     const uintArr = new Uint8Array(buf);
//     return String.fromCharCode.apply(null, Array.from(uintArr));
// }

// export async function decrypt(enText: string) {
//     // console.log('enText ' + enText)

//     const iv = enText.slice(0, 24)!.match(/.{2}/g)!.map(byte => parseInt(byte, 16))

//     // console.log('vi extracted from payload ' + iv)
//     const alg = { name: 'AES-GCM', iv: new Uint8Array(iv) }
//     const keyUtf8 = new TextEncoder().encode(key)
//     const keyHash = await crypto.subtle.digest('SHA-256', keyUtf8)
//     const decryptKey = await crypto.subtle.importKey('raw', keyHash, alg, false, ['decrypt'])

//     const bodycontent = atob(enText.slice(24))
//     // console.log('body content extracted from payload ' + bodycontent)
//     const bodyasArrayNumber = new Uint8Array(bodycontent.match(/[\s\S]/g)!.map(ch => ch.charCodeAt(0)))
//     // begin to decrupt


//     // const enTextUtf8 = new TextEncoder().encode(enText)
//     const textBuffer = await crypto.subtle.decrypt(alg, decryptKey, bodyasArrayNumber)
//     const decryptedText = new TextDecoder().decode(textBuffer)
//     console.log('did decrypt userInfo ' + decryptedText)
//     return decryptedText

// }

export async function getUIDfromRefID(refID: string) {
    const result = await firestoreQueryCollection('user', [{ key: 'accessId', operator: '==', value: refID }], userAdminConverter)
    if (result.length == 1) {
        return result[0].uid
    }
    return undefined
}

export async function serverAddFeedback(feedback: FeedBack) {
    return firestoreAddNewModal('feedBack', feedback, feedBackAdminConverter)
}


export async function getRankingInfo() {
    const numOfWinner = Number(process.env.RANK_NUM_WINNER) ?? undefined
    if (!numOfWinner) {
        throw new Error('Khong tim duoc numbOfWinner')
    }
    const experts = await firestoreQueryCollection('expert',
        [{ key: "expertType", operator: "==", value: "rank" },
        { key: "status", operator: "==", value: "activated" }

        ], expertAdminConverter
    )
    // let experts = rankExpert.filter((item) => { return item.status == 'activated' })

    const monthly = sortByField(experts, "monthPerform").map((item) => {
        return {
            name: item.name,
            avatar: item.imageURL,
            id: item.id,
            perf: perfConver(item.monthPerform ?? 0)
        }
    }).slice(0, numOfWinner)

    const yearly = sortByField(experts, "yearPerform").map((item) => {
        return {
            name: item.name,
            avatar: item.imageURL,
            id: item.id,
            perf: perfConver(item.yearPerform ?? 0)
        }
    }).slice(0, numOfWinner)

    const quarter = sortByField(experts, "quarterPerform").map((item) => {
        return {
            name: item.name,
            avatar: item.imageURL,
            id: item.id,
            perf: perfConver(item.quarterPerform ?? 0)
        }
    }).slice(0, numOfWinner)

    const weekly = sortByField(experts, "weekPerform").map((item) => {
        return {
            name: item.name,
            avatar: item.imageURL,
            id: item.id,
            perf: perfConver(item.weekPerform ?? 0)
        }
    }).slice(0, numOfWinner)

    return { weekly, monthly, quarter, yearly }
}


export async function joinRankUser(perm: boolean) {

    const userInfo = await getUserInfoFromSession()

    if (userInfo == null) {
        return Promise.resolve({
            success: false,
            error: "not authorized"
        })
    }

    const user = await firestoreGetModal<User>('user/' + userInfo.uid, userAdminConverter)
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

    const thuquyUid = await getthuquyUID()
    if (!thuquyUid) {
        return Promise.resolve({
            success: false,
            error: "khong tim duoc thu quy"
        })
    }

    const tran: Transaction = {
        tranType: perm ? TranType.followRankPerm : TranType.followRankMonth,
        toUid: thuquyUid,
        fromUid: user.uid,
        amount: fee,
        status: "Done",
        notebankacc: "",
        date: Date.now()
    }
    console.log(' trans ' + JSON.stringify(tran))
    try {
        const result = await serverAddANewTransaction(tran)
    } catch (error) {
        return Promise.resolve({
            success: false,
            error: error
        })
    }

    const subRank: Subscription = {
        uid: userInfo.uid,
        eid: thuquyUid,
        startDate: Date.now(),
        endDate: endDateSubWithPerm(perm),
        perm: perm,
        value: fee,
        type: "rank"
    }

    console.log(' subRank ' + JSON.stringify(subRank))

    const newSubRef = await firestoreAddNewModal<Subscription>('subscription', subRank, subscriptionAdminConverter)
    await databaseSetDoc('subscription/' + newSubRef.id , subRank)

    await setClaim(userInfo.uid, {rankExpire: endDateSubWithPerm(perm)})

    await firestoreUpdateDoc('user/' + userInfo.uid, { rankExpire: endDateSubWithPerm(perm) })
    await databaseUpdateDoc('user/' + userInfo.uid, { rankExpire: endDateSubWithPerm(perm) })


    const subInfo = subRank
    subInfo.id = newSubRef.id

    await firestoreUpdateDoc('user/' + userInfo.uid, { following: FieldValue.arrayUnion(subInfo) })
    await firestoreSetDoc('user/' + userInfo.uid + '/subHistory/' + newSubRef.id, subInfo)

    await databaseSetDoc('user/' + userInfo.uid + '/following/' + newSubRef.id, subInfo)

    // notify user

    const notiForUser: UserNoti = {
        dateTime: Date.now(),
        title: 'Đã tham gia tài trợ rank',
        content: 'Giờ đây quý nhà đầu tư đã có thể theo dõi toàn bộ chuyên gia đua rank',
        urlPath: '/expert'
    }

    await sendNotificationToUser(userInfo.uid, notiForUser)

    // notify board
    const notiBoard: UserNoti = {
        dateTime: Date.now(),
        title: "",
        content: "Nhà đầu tư " + user.displayName + ' đã tham gia tài trợ rank, tổng tiền tài trợ sẽ được dùng trả thưởng cho top chuyên gia rank',
        urlPath: '/expert'
    }

    await sendNotificationToBoard(notiBoard)


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

    const user = await firestoreGetModal<User>('user/' + userInfo.uid, userAdminConverter)
    if (user == undefined) {
        return Promise.resolve({
            success: false,
            error: "khong ton tai user"
        })
    }

    const expertToSub = await firestoreGetModal<Expert>('expert/' + eid, expertAdminConverter)

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

    if (perm == true && (expertToSub.expertType != 'perm')) {
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

    const myFollowingData = await databaseGetDoc('user/' + user.uid + '/following')
    const myFollowing = arrayFromData<Subscription>(myFollowingData)
    const existingSub = myFollowing.filter((item) => { return item.endDate >= Date.now()})


    // const existingSub = await firestoreQueryCollection('subscription', [{ key: 'eid', operator: '==', value: eid }, { key: 'uid', operator: '==', value: user.uid }, { key: 'endDate', operator: '>=', value: Date.now() }], subscriptionAdminConverter)
    if (existingSub.length > 0) {
        return Promise.resolve({
            success: false,
            error: "Subscription da ton tai"
        })

    }


    const thuquyid = await getthuquyUID()

    if (!thuquyid) {
        return Promise.resolve({
            success: false,
            error: "Thu quy not found"
        })

    }


    const tranUserPay: Transaction = {
        tranType: perm ? TranType.followSoloPerm : TranType.followRankMonth,
        toUid: thuquyid,
        fromUid: user.uid,
        amount: Number(fee),
        status: "Done",
        notebankacc: "",
        date: Date.now()
    }

    try { await serverAddANewTransaction(tranUserPay) }
    catch (error) {
        return Promise.resolve({
            success: false,
            error: 'error khi tra tien tu user den thu quy' + JSON.stringify(error)
        })
    }


    const tranPayToExpert: Transaction = {
        tranType: TranType.newFollower,
        toUid: expertToSub.id,
        fromUid: thuquyid,
        amount: Number(fee * 0.8),
        status: "Done",
        notebankacc: user.displayName + " theo dõi quý chuyên gia",
        date: Date.now()
    }

    try { await serverAddANewTransaction(tranPayToExpert) }
    catch (error) {
        return Promise.resolve({
            success: false,
            error: 'error khi tra tien tu thu quy den chuyen gia' + JSON.stringify(error)
        })
    }

    if (user) {
        const newSub: Subscription = {
            uid: user.uid,
            eid: eid,
            startDate: Date.now(),
            perm: perm,
            endDate: endDateSubWithPerm(perm),
            value: fee,
            type: "solo"
        }
        console.log('adding new sub' + JSON.stringify(newSub))
        const newSubRef = await firestoreAddNewModal<Subscription>('subscription/', newSub, subscriptionAdminConverter)// subCollection.add(newSub)

        const subInfo = newSub
        subInfo.id = newSubRef.id

        await databaseUpdateDoc('user/' + userInfo.uid + '/following/' + subInfo.id, newSub)

        await databaseUpdateDoc('user/' + expertToSub.id + '/follower/' + subInfo.id, newSub)
        await databaseUpdateDoc('expert/' + expertToSub.id + '/follower/' + subInfo.id, newSub)


        await firestoreUpdateDoc('user/' + userInfo.uid, { following: FieldValue.arrayUnion(subInfo) })
        await firestoreSetDoc('user/' + userInfo.uid + '/subHistory/' + newSubRef.id, subInfo)

        await firestoreUpdateDoc('expert/' + expertToSub.id, { follower: FieldValue.arrayUnion(subInfo) })
        await firestoreSetDoc('expert/' + expertToSub.id + '/subHistory/' + newSubRef.id, subInfo)

        // notify user

        const notiForUser: UserNoti = {
            dateTime: Date.now(),
            title: 'Đã theo dõi chuyên gia' + expertToSub.name,
            content: 'Giờ đây quý nhà đầu tư đã có thể theo dõi chuyên gia' + expertToSub.name,
            urlPath: '/expert/details/' + eid
        }
        await sendNotificationToUser(userInfo.uid, notiForUser)


        // notify expert

        const notiForExpert: UserNoti = {
            dateTime: Date.now(),
            title: 'Thêm 1 người theo dõi',
            content: 'Xin chúc mừng, 1 nhà đầu tư vừa mới theo dõi bạn ' + (perm ? "trọn đời" : "1 tháng"),
            urlPath: '/profile'
        }

        await sendNotificationToUser(expertToSub.id, notiForExpert)

        // notify board
        const notiBoard: UserNoti = {
            dateTime: Date.now(),
            title: "",
            content: "Chuyên gia " + expertToSub.name + " đã có thêm 1 người theo dõi  ",
            urlPath: '/expert/details/' + eid
        }

        await sendNotificationToBoard(notiBoard)

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

    var nextMS = getNextWeekMileStone().toString()
    var rewardTotal = await databaseGetDoc('reward/week/' + nextMS + '/amount' ) ?? 0//rewardInfo.week["nextWeekMS"].amount
    const weeklyReward = Math.round(rewardTotal / numOfWinner)
    // const weeklyReward = Number(process.env.RANK_WEEK_REWARD) / numOfWinner

    nextMS = getNextMonthMileStone().toString()
    rewardTotal = await databaseGetDoc('reward/month/' + nextMS + '/amount' ) ?? 0//rewardInfo.week["nextWeekMS"].amount
    const monthlyReward = Math.round(rewardTotal / numOfWinner)
    // const weeklyReward = Number(process.env.RANK_WEEK_REWARD) / numOfWinner

    nextMS = getNextQuarterMileStone().toString()
    rewardTotal = await databaseGetDoc('reward/quarter/' + nextMS + '/amount' ) ?? 0//rewardInfo.week["nextWeekMS"].amount
    const quarterlyReward = Math.round(rewardTotal / numOfWinner)
    // const weeklyReward = Number(process.env.RANK_WEEK_REWARD) / numOfWinner

    nextMS = getNextYearMileStone().toString()
    rewardTotal = await databaseGetDoc('reward/year/' + nextMS + '/amount' ) ?? 0//rewardInfo.week["nextWeekMS"].amount
    const yearlyReward = Math.round(rewardTotal / numOfWinner)

    const rankData: BoardProps[] = [
        { title: 'Top Tuần', since: weekDate, to: weekTo, perPax: Math.round(weeklyReward), rewards: [], data: weekly },
        { title: 'Top Tháng', since: monthDate, to: monthTo, perPax: Math.round(monthlyReward), rewards: [], data: monthly },
        { title: 'Top Quý', since: quarterDate, to: quarterTo, perPax: Math.round(quarterlyReward), rewards: [], data: quarter },
        { title: 'Top Năm', since: yearDate, to: yearTo, perPax: Math.round(yearlyReward), rewards: [], data: yearly }
    ]
    
    return rankData
}

// export async function getMyTransHistory() {

//     const userInfo = await getUserInfoFromSession()

//     // const user = await getCurrentUser()
//     if (userInfo && userInfo.uid) {
//         console.log('path ' + 'user/' + userInfo.uid + '/trans')
//         const result = await firestoreQueryCollection('user/' + userInfo.uid + '/trans', [], tranAdminConverter)
//         console.log('result 3333' + JSON.stringify(result))
//         // let q = collection(db, 'user/' + uid + '/trans').withConverter(transConverter)
//         // const querySnapshot = await getDocs(q)
//         // const array =  querySnapshot.docs.map((doc) => doc.data())
//         result.sort((a, b) => { return a.date - b.date })
//         return result
//     } else {
//         console.log('not usr')
//         return []
//     }

// }

export async function getFollowExpertByIDList(idList: string[]) {
    var result: Expert[] = []

    for (const eid of idList) {
        const info = await firestoreGetModal<Expert>('expert/' + eid, expertAdminConverter)
        if (info) {
            result.push(info)
        }
    }

    return result
}

export async function serverCount(name: string) {
    return firestoreCountModal(name)
}

export async function serverSetStats(data: {}) {

    const now = Date.now()

    await firestoreSetDoc('stats/' + now, data)
    await firestoreSetDoc('stats/latest', data, true)

    await databaseSetDoc('stats/' + now, data)
    await databaseSetDoc('stats/latest', data)
}

export async function serverUpdateStats(data: {}) {

    // await firestoreSetDoc('stats/' + Date.now(), data)
    await firestoreUpdateDoc('stats/latest', data)

    // await databaseSetDoc('stats/' + Date.now(), data)
    await databaseUpdateDoc('stats/latest', data)
}

export async function serverGetAllInprogressPred() {
    const res = await firestoreQueryCollectionGroup<Prediction>('preds', [{ key: 'status', operator: '==', value: 'Inprogress' }], predAdminConverter)
    return res.filter((item) => {
        return item.data().status == 'Inprogress'
    })

}


export async function serverGetStat() {
    // const result = await firestoreGetRaw('stats/latest')
    const result = await databaseGetDoc('stats/latest')
    // const docRef = adminDB.doc('stats/latest')
    // const docSnap = await docRef.get()
    return result ?? {}
}

export async function serverAddANewPred(pred: Prediction, expertInfo: Expert) {



    const result = await firestoreAddNewModal<Prediction>('expert/' + expertInfo.id + '/preds', pred, predAdminConverter)

    await databaseSetDoc('user/' + expertInfo.id + '/preds/' + result.id, pred)


    if (result) {

        console.log("prediction has been added : " + JSON.stringify(result))
        // if (userInfo.expertType == 'rank') {
        //     const resultForRank = await firestoreSetDoc('rankPred/' + result.id, predAdminConverter.toFirestore(pred))
        //     console.log("prediction from Rank Expert has been added : " + JSON.stringify(resultForRank))
        //   }
        // notify follower
        const noti: UserNoti = {
            dateTime: Date.now(),
            title: pred.assetName,
            content: "Chuyên gia " + expertInfo.name + " đã tạo khuyến nghị cổ phiếu " + pred.assetName,
            urlPath: '/expert/details/' + expertInfo.id + "#" + result.id
        }

        await notifyObserverOfExpert(noti, expertInfo)


        // notify board
        const notiBoard: UserNoti = {
            dateTime: Date.now(),
            title: "",
            content: "Chuyên gia " + expertInfo.name + " mới tạo thêm 1 khuyến nghị ",
            urlPath: '/expert/details/' + expertInfo.id + "#" + result.id
        }

        await sendNotificationToBoard(notiBoard)

    }

    return result

}

export async function serverAddANewTransaction(tran: Transaction) {
    console.log("transactin being added ======" + JSON.stringify(tran))

    // trung tam o day
    const newRef = await firestoreAddNewModal('transaction', tran, tranAdminConverter)
    // addition actions 

    const benefitUid = tran.toUid
    const paidUid = tran.fromUid;

    await databaseUpdateDoc('user/' + benefitUid, { amount: increment(tran.amount) })
    await databaseSetDoc('user/' + benefitUid + '/trans/' + newRef.id, tran)

    await databaseUpdateDoc('user/' + paidUid, { amount: increment(-tran.amount) })
    await databaseSetDoc('user/' + paidUid + '/trans/' + newRef.id, tran)


    await firestoreUpdateDoc('user/' + benefitUid, { amount: FieldValue.increment(tran.amount) })
    await firestoreSetDoc('user/' + benefitUid + '/trans/' + newRef.id, tran)

    await firestoreUpdateDoc('user/' + paidUid, { amount: FieldValue.increment(-tran.amount) })
    await firestoreSetDoc('user/' + paidUid + '/trans/' + newRef.id, tran)
    console.log('============check if trantype ' + tran.tranType + ' is in array ' + [
        TranType.followRankMonth,
        TranType.followSoloMonth,
        TranType.registerSoloYearly,
        TranType.upgradeToSoloPerm,
        TranType.registerSoloPerm,
        TranType.registerRankYearly,
        TranType.upgradeToRankPerm,
        TranType.registerRankPerm,
        TranType.followRankPerm,
        TranType.followSoloPerm
    ])

    if ([
        TranType.followRankMonth,
        TranType.followSoloMonth,
        TranType.registerSoloYearly,
        TranType.upgradeToSoloPerm,
        TranType.registerSoloPerm,
        TranType.registerRankYearly,
        TranType.upgradeToRankPerm,
        TranType.registerRankPerm,
        TranType.followRankPerm,
        TranType.followSoloPerm
    ].includes(tran.tranType)) {

        // kiem tra ref ID
        const paidUser = await firestoreGetModal<User>('user/' + paidUid, userAdminConverter)
        const refID = paidUser?.refID
        console.log('redID ' + refID)

        if (refID) {
            // chia tien cho ref
            const ratio = (tran.tranType == TranType.followSoloPerm || tran.tranType == TranType.followSoloMonth) ? 0.1 : 0.2
            const displayName = paidUser.displayName

            const amountForReference = tran.amount * ratio

            const description = 'Do ' + displayName + '  ' + tranTypeText(tran.tranType)?.toLocaleLowerCase('vi')

            const thuquyuid = await getthuquyUID()

            if (thuquyuid) {
                const refTran: Transaction = {
                    tranType: TranType.referReward,
                    toUid: refID,
                    fromUid: thuquyuid,
                    amount: amountForReference,
                    date: Date.now(),
                    status: "Done",
                    note: description,
                    triggerTranId: newRef.id,
                    triggerTranType: tran.tranType
                }

                await serverAddANewTransaction(refTran)
            }
        }

        console.log(' ===== check add fund')
        if (tran.tranType == TranType.followRankMonth || tran.tranType == TranType.followRankPerm) {

        console.log(' ===== check add fund222')
            const startTime = tran.date
            const endDate = new Date(startTime)
            
            if (tran.tranType === TranType.followRankMonth) {
                endDate.setMonth(endDate.getMonth() + 1)
            } else if (tran.tranType === TranType.followRankPerm) {
                endDate.setFullYear(endDate.getFullYear() + 2)
            }
            const endTime = endDate.getTime()

            console.log(' ===== check add 3333')

            const amountForReward = tran.amount * 0.8


            console.log('  ==== bat dau them tien vao quy ====== startTime: ' + new Date(tran.date).toLocaleDateString('vi') + '  end date  ' + endDate.toLocaleDateString('vi') + '  amount  ' +  amountForReward )

            // ====== week funds ===================
            const amountForWeekReward = amountForReward / 4
            const sharedWeeks : number[] = []
            var weekMileStone = getNextWeekMileStone()
            while (weekMileStone <= endTime) {
                sharedWeeks.push(weekMileStone)
                weekMileStone += 1000*3600*24*7 // add 7 days
            }

            console.log('weeks mile stones : ' + sharedWeeks)

            const amountPerWeek = amountForWeekReward / sharedWeeks.length

            // ====== month funds ===================
            const amountForMonthReward = amountForReward / 4
            const sharedMonths : number[] = []
            var monthMileStone = getNextMonthMileStone()
            while (monthMileStone <= endTime) {
                sharedMonths.push(monthMileStone)
                const date = new Date(monthMileStone)
                date.setMonth(date.getMonth() + 1)
                monthMileStone = date.getTime()
            }

            console.log('moonth mile stones : ' + sharedMonths)
            const amountPerMonth = amountForMonthReward / sharedMonths.length

            // ====== quarter funds ===================
            const amountForQuarterReward = amountForReward / 4
            const sharedQuarters : number[] = []
            var quarterMileStone = getNextQuarterMileStone()
            while (quarterMileStone <= endTime) {
                sharedQuarters.push(quarterMileStone)
                const date = new Date(quarterMileStone)
                date.setMonth(date.getMonth() + 3)
                quarterMileStone = date.getTime()
            }
            console.log('quarter mile stones : ' + sharedQuarters)

            const amountPerQuarter = amountForQuarterReward / sharedQuarters.length

            // ====== year funds ===================
            const amountForYearReward = amountForReward / 4
            const sharedYear: number[] = []
            var yearMileStone = getNextYearMileStone()
            while (yearMileStone <= endTime) {
                sharedYear.push(yearMileStone)
                const date = new Date(yearMileStone)
                date.setFullYear(date.getFullYear() + 1)
                yearMileStone = date.getTime()
            }

            console.log('year mile stones : ' + sharedYear)


            const amountPerYear = amountForYearReward / sharedYear.length

            for (const weekTime of sharedWeeks) {
                await databaseUpdateDoc('reward/week/' + weekTime.toString() , {amount : increment(amountPerWeek) })
            }
            for (const monthTime of sharedMonths) {
                await databaseUpdateDoc('reward/month/' + monthTime.toString() , {amount : increment(amountPerMonth) })
            }
            for (const quartertime of sharedQuarters) {
                await databaseUpdateDoc('reward/quarter/' + quartertime.toString() , {amount : increment(amountPerQuarter) })
            }
            for (const yearTime of sharedYear) {
                await databaseUpdateDoc('reward/year/' + yearTime.toString() , {amount : increment(amountPerYear) })
            }


        }
    } else if (tran.tranType == TranType.referReward) {


        const benefitUser = await firestoreGetModal<User>('user/' + benefitUid, userAdminConverter)

        if (benefitUser) {

            const boardNoti: UserNoti = {
                title: "Duoc chia tien",
                dateTime: Date.now(),
                content: benefitUser.displayName + ' được chia ' + addComma(tran.amount) + ' ' + tran.note,
                urlPath: '/profile/transactions'
            }
            await sendNotificationToBoard(boardNoti)

            const refNoti: UserNoti = {
                title: "Duoc chia tien",
                dateTime: Date.now(),
                content: 'Bạn được chia ' + addComma(tran.amount) + ' ' + tran.note,
                urlPath: '/profile/transactions'

            }
            await sendNotificationToUser(benefitUid, refNoti)

        }
    }

    return newRef.id
}

export async function banExpert(docId: string) {
    await serverUpdateExpertInfo(docId, { status: ExpertStatus.banned })
}


export async function activateExpert(docId: string) {
    await serverUpdateExpertInfo(docId, { status: ExpertStatus.banned })
}


export async function viewExpertPreds(user: User | undefined, expert: Expert | undefined) {
    if (!expert) {
        return Promise.resolve(JSON.stringify({
            needFollow: true,
            data: {
                numOfInProgress: 0,
                onTrackPreds: [],
                donePreds: []
            }
        })
        )
    }
    const getDonePredOnly = !(user && didFollow(user, expert) || (user && user.uid == expert.id))
    console.log('getDonePredOnly ' + getDonePredOnly + '  user ' + user)
    // let response = await firestoreQueryCollection<Prediction>('expert/' + expert.id + '/preds', [], predAdminConverter)
    let response = await databaseGetDoc('user/' + expert.id + '/preds')
    let allPreds: Prediction[] = arrayFromData<Prediction>(response, predictionFromRaw)// JSON.parse(response)
    const inProgressPreds = allPreds.filter((item) => { return item.status == 'Inprogress' })
    const donePreds = allPreds.filter((item) => { return item.status != 'Inprogress' }).sort((a, b) => { return (b.dateIn - a.dateIn) })

    console.log('shit ======================= ' + JSON.stringify(inProgressPreds))
    

    const result = {
        needFollow: getDonePredOnly,
        data: {
            numOfInProgress: inProgressPreds.length,
            onTrackPreds: getDonePredOnly ? [] : inProgressPreds,
            donePreds: donePreds
        }
    }
    // console.log('result ' + JSON.stringify(result))
    return JSON.stringify(result)

}

export async function getPredsSince(date: Date, inProgress: boolean, eid: string) {
    const preds = await firestoreQueryCollection<Prediction>('expert/' + eid + '/preds',
        [
            // { key: 'dateIn', operator: '>=', value: date.getTime() },
            { key: 'status', operator: inProgress ? '==' : '!=', value: 'Inprogress' }

        ], predAdminConverter)

    const result = preds.filter((item) => { return item.dateIn >= date.getTime()})
    return result
}

export async function serverUpdatePredBonus(pred:Prediction, bonus: BonusData[]) {

    const pathFS = 'expert/' + pred.ownerId + '/preds/' + pred.id
    const pathRT = 'user/' + pred.ownerId + '/preds/' + pred.id + '/bonus'
    const payloadRT = dataFromArray(bonus)
    await databaseSetDoc(pathRT, payloadRT)
    // for (const item of bonus) {
        await firestoreUpdateDoc(pathFS , {bonus: bonus})
    // }
    
}

export async function serverMarkPredCutLoss(pred: Prediction) {
    const pathFS = 'expert/' + pred.ownerId + '/preds/' + pred.id
    const pathRT = 'user/' + pred.ownerId + '/preds/' + pred.id
    const payload = {
        priceRelease: pred.cutLoss,
        dateRelease: Date.now(),
        status: "LOSE"
    }
    await firestoreUpdateDoc(pathFS, payload)

    await databaseUpdateDoc(pathRT, payload)

    // notify user
    const expertInfo = await firestoreGetModal('expert/' + pred.ownerId, expertAdminConverter)
    if (!expertInfo) {
        return new Response(` Khong tim duoc expert voi id` + pred.ownerId, {
            status: 400,
        })
    }
    const noti: UserNoti = {
        title: pred.assetName + " chạm điểm cắt lỗ",
        dateTime: Date.now(),
        content: "Khuyến nghị cổ phiếu " + pred.assetName + " của chuyên gia " + expertInfo.name + " từ ngày " + new Date(pred.dateIn).toLocaleDateString('vi') + " đã chạm điểm cắt lỗ , xin chúc mừng bạn ",
        urlPath: '/expert/details/' + pred.ownerId + "#" + pred.id
    }

    // notify audience
    await notifyObserverOfExpert(noti, expertInfo)
    // notify owner
    await sendNotificationToUser(pred.ownerId, noti)
}


export async function serverMarkPredExpired(pred: Prediction, priceRelease: number) {
    const pathFS = 'expert/' + pred.ownerId + '/preds/' + pred.id
    const pathRT = 'user/' + pred.ownerId + '/preds/' + pred.id
    const payload = {
        priceRelease: priceRelease,
        dateRelease: Date.now(),
        status: "EXPIRED"
    }

    await firestoreUpdateDoc(pathFS, payload)
    await databaseUpdateDoc(pathRT, payload)


    // notify user
    const expertInfo = await firestoreGetModal('expert/' + pred.ownerId, expertAdminConverter)
    if (!expertInfo) {
        return new Response(` Khong tim duoc expert voi id` + pred.ownerId, {
            status: 400,
        })
    }
    const noti: UserNoti = {
        title: pred.assetName + " tới deadline",
        dateTime: Date.now(),
        content: "Khuyến nghị cổ phiếu " + pred.assetName + " của chuyên gia " + expertInfo.name + " từ ngày " + new Date(pred.dateIn).toLocaleDateString('vi') + " đã tới deadline , bạn có thể kết thúc theo khuyến nghị  ",
        urlPath: '/expert/details/' + pred.ownerId + "#" + pred.id
    }

    await notifyObserverOfExpert(noti, expertInfo)

    // notify owner
    await sendNotificationToUser(pred.ownerId, noti)
}


export async function serverMarkPredWin(pred: Prediction) {
    const pathFS = 'expert/' + pred.ownerId + '/preds/' + pred.id
    const pathRT = 'user/' + pred.ownerId + '/preds/' + pred.id

    const payload = {
        priceRelease: pred.priceOut,
        dateRelease: Date.now(),
        status: "WIN"
    }

    await firestoreUpdateDoc(pathFS, payload)
    await databaseUpdateDoc(pathRT, payload)

    // notify user
    const expertInfo = await firestoreGetModal('expert/' + pred.ownerId, expertAdminConverter)
    if (!expertInfo) {
        return new Response(` Khong tim duoc expert voi id` + pred.ownerId, {
            status: 400,
        })
    }
    const noti: UserNoti = {
        title: pred.assetName + " chạm điểm chốt lời , xin chúc mừng bạn ",
        dateTime: Date.now(),
        content: "Khuyến nghị cổ phiếu " + pred.assetName + " của chuyên gia " + expertInfo.name + " từ ngày " + new Date(pred.dateIn).toLocaleDateString('vi') + " đã chạm điểm chốt lời , xin chúc mừng bạn ",
        urlPath: '/expert/details/' + pred.ownerId + "#" + pred.id
    }

    await notifyObserverOfExpert(noti, expertInfo)
    // notify owner
    await sendNotificationToUser(pred.ownerId, noti)
}

async function notifyObserverOfExpert(noti: UserNoti, expertInfo: Expert) {

    let notifiedUsersIds: string[] = []
    console.log(' followers to be notified ' + JSON.stringify(expertInfo.follower))

    if (expertInfo.expertType == 'rank') {
        notifiedUsersIds = (await firestoreQueryCollection<User>('user', [{ key: 'rankExpire', operator: '>=', value: Date.now() }], userAdminConverter)).map((item) => item.uid)
    } else {
        notifiedUsersIds = expertInfo.follower.filter((item) => { return item.endDate > Date.now() }).map((item) => item.uid)
    }

    console.log('notified user ids ' + notifiedUsersIds)



    for (const userID of notifiedUsersIds) {
        await sendNotificationToUser(userID, noti)
    }
}

export async function serverMarkExpertExpired(eid: string) {
    await serverUpdateExpertInfo(eid,{ status: ExpertStatus.expired } )
}

export async function serverInsertNewExpert(expert: Expert, uid: string) {
    await firestoreSetDoc('expert/' + uid, expertAdminConverter.toFirestore(expert)) // create expert record
    await databaseSetDoc('expert/' + uid, expert)
}
export async function serverUpdateExpertInfo(eid: string, data: {}) {
    await firestoreUpdateDoc('expert/' + eid, data)
    await databaseUpdateDoc('expert/' + eid, data)
}

export async function serverUpdateUserInfo(eid: string, data: {}) {
    await databaseUpdateDoc('user/' + eid, data)
    await firestoreUpdateDoc('user/' + eid, data)
}


const endDateSubWithPerm = (perm: boolean) => {
    const monthlater = new Date()
    monthlater.setMonth(monthlater.getMonth() + 1)
    return perm ? (new Date('2050-01-01')).getTime() : monthlater.getTime()
}
