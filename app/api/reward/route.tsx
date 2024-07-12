
// vao ngay cuoi cua chu ky thuong thi thuong tien cho cac be
// cron 0 23 31,30,29 * 5
// At 11:00 PM, on day 31, 30, and 29 of the month, and on Friday

import { getthuquyUID } from "@/app/lib/firebaseadmin/adminauth"
import { getRankingInfo, sendNotificationToUser, serverAddANewTransaction } from "@/app/lib/server"
import { getPivotDates } from "@/app/lib/statistic"
import { contentOf } from "@/app/lib/utils"
import { UserNoti } from "@/app/model/noti"
import { Subscription } from "@/app/model/subscription"
import { TranType, Transaction, tranAdminConverter } from "@/app/model/transaction"
import { connect } from "http2"

export async function GET(request: Request) {
  const message: string[] = []
  let rankInfo = undefined
  let thuquyid = undefined

  const numOfWinner =  Number(process.env.NEXT_PUBLIC_NUM_WINNER)

  if (!numOfWinner) {
    return new Response('Khong tim duoc numOfWinner', {
      status: 400,
    })
  }

  try {
    const toDay = new Date()
    const toDayStr = toDay.toLocaleDateString()
    const pivots = await getPivotDates(new Date())
    const weekEndStr = pivots.weekEnd.toLocaleDateString()
    const monthEndStr = pivots.weekEnd.toLocaleDateString()
    const quarterEndStr = pivots.weekEnd.toLocaleDateString()
    const yearEndStr = pivots.weekEnd.toLocaleDateString()

    message.push(toDayStr)
    message.push(weekEndStr)
    message.push(monthEndStr)
    message.push(quarterEndStr)
    message.push(yearEndStr)

    if (toDayStr in [weekEndStr, monthEndStr, quarterEndStr, yearEndStr]) {
      message.push('ok to day is ngay chia tien ')

      if (!rankInfo) {
        rankInfo = await getRankingInfo()
        if (!thuquyid) {
          thuquyid = await getthuquyUID()
        }
        if (!thuquyid) {
          return new Response('Khong tim duoc thu quy uid', {
            status: 400,
          })
        }
        if (!rankInfo) {
          return new Response('Khong data rank', {
            status: 400,
          })
        }


        message.push(' Rank Info ' + JSON.stringify(rankInfo))


        // *************************************
        if (toDayStr == weekEndStr) {
          const winners = rankInfo.weekly
          const reward = Number(process.env.NEXT_PUBLIC_WEEK_REWARD)
          message.push('hom nay la cuoi tuan, chuan bi thuong tuan cho ' + winners.length + ' chuyen gia với số tiền mỗi người là ' + reward.toString())
          for (const winner of winners) {
            const tran: Transaction = {
              tranType: TranType.rankReward,
              toUid: winner.id,
              fromUid: thuquyid,
              amount: reward,
              date: toDay.getTime(),
              note: 'thuong tuan ' + weekEndStr,
              status: "Done"
            }
            // await addANewTransaction(tran)
            await serverAddANewTransaction(tran)
            // notify user
            const noti : UserNoti = {
              title: "Xin chúc mừng chuyên gia rank, bạn đã được thưởng " + reward.toString() + ' vì đạt top tuần',
              dateTime: toDay.getTime(),
              content: ""
            }

            await sendNotificationToUser(winner.id, noti)
           
          }
          message.push(" xong thuong tuan ")
        }
        // *************************************
        if (toDayStr == monthEndStr) {
          const winners = rankInfo.monthly
          const reward = Number(process.env.NEXT_PUBLIC_MONTH_REWARD)
          message.push('hom nay la cuoi thang, chuan bi thuong tuan cho ' + winners.length + ' chuyen gia với số tiền mỗi người là ' + reward.toString())
          for (const winner of winners) {
            const tran: Transaction = {
              tranType: TranType.rankReward,
              toUid: winner.id,
              fromUid: thuquyid,
              amount: reward / numOfWinner,
              date: toDay.getTime(),
              note: 'thuong thang ' + monthEndStr,
              status: "Done"
            }
            await serverAddANewTransaction(tran)
            // notify user
            const noti : UserNoti = {
              title: "Xin chúc mừng chuyên gia rank, bạn đã được thưởng " + reward.toString() + ' vì đạt top tháng',
              dateTime: toDay.getTime(),
              content: ""
            }

            await sendNotificationToUser(winner.id, noti)
          }
          message.push(" xong thuong thang ")
        }
        // *************************************
        if (toDayStr == quarterEndStr) {
          const winners = rankInfo.quarter.slice(0, numOfWinner)
          const reward = Number(process.env.NEXT_PUBLIC_QUARTER_REWARD)
          message.push('hom nay la cuoi quy, chuan bi thuong tuan cho ' + winners.length + ' chuyen gia với số tiền mỗi người là ' + reward.toString())
          for (const winner of winners) {
            const tran: Transaction = {
              tranType: TranType.rankReward,
              toUid: winner.id,
              fromUid: thuquyid,
              amount: reward / numOfWinner,
              date: toDay.getTime(),
              note: 'thuong quy '+ quarterEndStr,
              status: "Done"
            }
            await serverAddANewTransaction(tran)
            // notify user
            const noti : UserNoti = {
              title: "Xin chúc mừng chuyên gia rank, bạn đã được thưởng " + reward.toString() + ' vì đạt top quý',
              dateTime: toDay.getTime(),
              content: ""
            }

            await sendNotificationToUser(winner.id, noti)
          }
          message.push(" xong thuong quy ")
        }
        // *************************************
        if (toDayStr == yearEndStr) {
          const winners = rankInfo.yearly.slice(0, numOfWinner)
          const reward = Number(process.env.NEXT_PUBLIC_YEAR_REWARD)
          message.push('hom nay la cuoi nam, chuan bi thuong nam cho ' + winners.length + ' chuyen gia với số tiền mỗi người là ' + reward.toString())
          for (const winner of winners) {
            const tran: Transaction = {
              tranType: TranType.rankReward,
              toUid: winner.id,
              fromUid: thuquyid,
              amount: reward / numOfWinner,
              date: toDay.getTime(),
              note: 'thuong nam ' + yearEndStr,                                         
              status: "Done"
            }
            await serverAddANewTransaction(tran)
            // notify user
            const noti : UserNoti = {
              title: "Xin chúc mừng chuyên gia rank, bạn đã được thưởng " + reward.toString() + ' vì đạt top năm',
              dateTime: toDay.getTime(),
              content: ""
            }

            await sendNotificationToUser(winner.id, noti)
          }
          message.push(" xong thuong nam ")
        }

      }
    } else {
      message.push('Không phải ngày chia thưởng')

      
     
      return new Response( contentOf(message), {
        status: 400,
      })
      
    }

  } catch (error) {

    message.push('Error khi chia thưởng : '+ JSON.stringify(error))
    return new Response(contentOf(message), {
      status: 400,
    })
  }

 
  return new Response(contentOf(message), {
    status: 200
  })
}
