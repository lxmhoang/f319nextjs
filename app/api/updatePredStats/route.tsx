
import { serverCount, serverGetModal, serverQueryCollection, serverQueryCollectionGroup, serverUpdateDoc } from "@/app/lib/firebaseadmin/adminfirestore"
import { getTodayMatchedVolume } from "@/app/lib/getStockData"
import { sendNotificationToUser } from "@/app/lib/server"
import { contentOf, datesGreaterThan } from "@/app/lib/utils"
import { expertAdminConverter } from "@/app/model/expert"
import { UserNoti } from "@/app/model/noti"
import { Prediction, predAdminConverter } from "@/app/model/prediction"
import { User, userAdminConverter } from "@/app/model/user"


// ********* update status of every wip preds, base on  realtime stock price  , run in tranding time  *********
// ********* update total pred stats , consider to remove later *********

export async function GET(request: Request) {
  var message: string[] = ["start \n"]
  try {
    const allInprogressPreds = await serverQueryCollectionGroup<Prediction>('preds', [{ key: 'status', operator: '==', value: 'Inprogress' }], predAdminConverter)
    // const data = allInprogressPreds.map((item) => item.data())
    //   return new Response(JSON.stringify(data), {
    //     status: 200
    // })
    // const allInprogressPreds = allPreds.filter((doc) => { return doc.data().status == 'Inprogress'})
    for (const doc of allInprogressPreds) {
      const pred = doc.data()
      const ref = doc.ref
      message.push('pred path : ' + ref.path + '\n')
      const matchedPriceToday = await getTodayMatchedVolume(pred.assetName)
      message.push(' asset ' + pred.assetName + ' priceIn: ' + pred.priceIn + ' priceOut = ' + pred.priceOut + ' cutloss ' + pred.cutLoss + ' deadline ' + pred.deadLine.toLocaleDateString('vi') + ' portion ' + pred.portion + '% . \n MatchedPriceToday :  ' + matchedPriceToday.toString())
      const max = Math.max.apply(Math, matchedPriceToday)
      const min = Math.min.apply(Math, matchedPriceToday)
      message.push('  max : ' + max + '  min:  ' + min + '  date :  ' + (new Date()).toLocaleDateString('vi') + '\n')

      // const toDayValue = true ? min/1000 : max/1000
      // const curPerform = true ? toDayValue / pred.priceIn : pred.priceIn / toDayValue
      // const curProfit = (curPerform - 1) * pred.portion / 100 + 1
      // message.push('incremental ratio of this pred ===== ' + ((curPerform-1) * 100).toFixed(2) +'%  profit ' +  + ((curProfit-1) * 100).toFixed(2) + '% \n\n\n\n')

      // if (matchedPriceToday.includes(pred.priceOut) || (min >= pred.priceOut)) {
      if (min >= pred.priceOut) {
        message.push('hit price Out, close ' + ref.path + 'with price Release ' + pred.priceOut + '\n')

        const toDay = new Date()
        // const path = 'expert/' + pred.ownerId + '/preds/' + pred.id ?? ""

        await serverUpdateDoc(ref.path, {
          priceRelease: pred.priceOut,
          dateRelease: toDay,
          status: "WIN"
        })

        // notify user
        const expertInfo = await serverGetModal('expert/' + pred.ownerId, expertAdminConverter)
        if (!expertInfo) {
          return new Response(` Khong tim duoc expert voi id` + pred.ownerId, {
            status: 400,
          })
        }
        const noti : UserNoti = {
          title: pred.assetName + " chạm điểm chốt lời , xin chúc mừng bạn " ,
          dateTime: toDay.getTime(),
          content:  "Khuyến nghị cổ phiếu " + pred.assetName + " của chuyên gia " + expertInfo.name +" từ ngày " + pred.dateIn.toLocaleDateString('vi') + " đã chạm điểm chốt lời , xin chúc mừng bạn ",
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
        // notify owner
        await sendNotificationToUser(pred.ownerId, noti)

      } else
      //  if ((matchedPriceToday.includes(pred.cutLoss)) || (max <= pred.cutLoss)) {
      if (min <= pred.cutLoss) {
        message.push('hit cutLoss, close ' + ref.path + ' with price Release ' + pred.cutLoss + '\n')
        const toDay = new Date()
        await serverUpdateDoc(ref.path, {
          priceRelease: pred.cutLoss,
          dateRelease: toDay,
          status: "LOSE"
        })

        // notify user
        const expertInfo = await serverGetModal('expert/' + pred.ownerId, expertAdminConverter)
        if (!expertInfo) {
          return new Response(` Khong tim duoc expert voi id` + pred.ownerId, {
            status: 400,
          })
        }
        const noti : UserNoti = {
          title: pred.assetName + " chạm điểm cắt lỗ" ,
          dateTime: toDay.getTime(),
          content:  "Khuyến nghị cổ phiếu " + pred.assetName + " của chuyên gia " + expertInfo.name +" từ ngày " + pred.dateIn.toLocaleDateString('vi') + " đã chạm điểm cắt lỗ , xin chúc mừng bạn ",
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
        // notify owner
        await sendNotificationToUser(pred.ownerId, noti)
      } else if (datesGreaterThan(new Date(), pred.deadLine)) {

        const toDay = new Date()
        const priceRelease = true ? min / 1000 : max / 1000
        message.push(' hit deadLine , close ' + ref.path + 'with price Release ' + priceRelease + '\n')
        await serverUpdateDoc(ref.path, {
          priceRelease: priceRelease,
          dateRelease: toDay,
          status: "EXPIRED"
        })
        // notify user
        const expertInfo = await serverGetModal('expert/' + pred.ownerId, expertAdminConverter)
        if (!expertInfo) {
          return new Response(` Khong tim duoc expert voi id` + pred.ownerId, {
            status: 400,
          })
        }
        const noti : UserNoti = {
          title: pred.assetName + " tới deadline" ,
          dateTime: toDay.getTime(),
          content:  "Khuyến nghị cổ phiếu " + pred.assetName + " của chuyên gia " + expertInfo.name +" từ ngày " + pred.dateIn.toLocaleDateString('vi') + " đã tới deadline , bạn có thể kết thúc theo khuyến nghị  ",
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

        // notify owner
        await sendNotificationToUser(pred.ownerId, noti)

      } else {
        message.push(' still In progress \n')
        // continue Inprogress
      }
    }

    const countAllPred = await serverCount('preds')
    await serverUpdateDoc('stats/latest', { openPreds: allInprogressPreds.length, allPreds: countAllPred })

  } catch (error) {
    return new Response(`Error update stats of preds with error: ` + JSON.stringify(error), {
      status: 400,
    })
  }

  return new Response(contentOf(message), {
    status: 200
  })
}
//     // first.getFullYear() === second.getFullYear() &&
//     // first.getMonth() === second.getMonth() &&
//     // first.getDate() === second.getDate();