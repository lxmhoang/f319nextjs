
'server-only'
'use server'
import { Expert, expertAdminConverter } from "../model/expert";
import { predAdminConverter } from "../model/prediction";
import { serverAddNewModal, serverGetModal, serverQueryCollection, serverSetDoc, serverUpdateDoc } from "./firebaseadmin/adminfirestore";

import { getCurrentUserId, getUserInfoFromSession } from "@/app/lib/firebaseadmin/adminauth";
import { getRealTimeStockData } from "./getStockData";
import { WhereFilterOp } from "firebase-admin/firestore";
import { signInWithGoogle } from "./firebase/auth";
import { User, userAdminConverter } from "../model/user";
import { subscriptionAdminConverter } from "../model/subscription";
import { cookies } from "next/headers";

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

export async function verifyAccessID(accessId: string) {
    const result = await serverQueryCollection('user', [{key:'accessId', operator:'==', value: accessId}], userAdminConverter)
    return result.length == 0
}

export async function addUser(payload: string) {
    const user: User = JSON.parse(payload)
    const result = await serverSetDoc('user/' + user.uid, userAdminConverter.toFirestore(user) )
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

export async function persistUserInfo(payload: string | undefined) {
    if (!payload) {
        cookies().delete('uInfo')
    } else {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const userInfo: User = JSON.parse(payload)
        const data = {isExpert: userInfo.isExpert ?? false}
        const descr = await encrypt(JSON.stringify(data))
        cookies().set('uInfo',descr, { maxAge: expiresIn, httpOnly: true, secure: true })

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
    const stringencrypted = encrypted.toString()
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
    return String.fromCharCode.apply(null,Array.from(uintArr));
  }

export async function decrypt(enText: string) {
    // console.log('enText ' + enText)
   
    const iv = enText.slice(0,24)!.match(/.{2}/g)!.map(byte => parseInt(byte, 16))
  
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