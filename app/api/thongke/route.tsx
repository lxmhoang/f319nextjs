// import { expertAdminConverter, predAdminConverter, userAdminConverter } from "@/app/lib/firebaseadmin/adminconverter";
// import { serverQueryCollection, serverSetDoc, serverUpdateDoc } from "@/app/lib/firebaseadmin/firebaseadmin";
import { expertAdminConverter, predAdminConverter, subscriptionAdminConverter } from "@/app/lib/firebase/adminconverter";
import { serverQueryCollection, serverUpdateDoc } from "@/app/lib/firebaseadmin/adminfirestore";
import getStockData, { getTodayMatchedVolume } from "@/app/lib/getStockData";

const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export async function GET(request: Request) {
  try {
    var message: string[] = ["start \n"]
    var halfYear = new Date()
    halfYear.setMonth(halfYear.getMonth()-6)

    var oneYear = new Date()
    oneYear.setMonth(oneYear.getMonth()-12)

    var twoYear = new Date()
    twoYear.setMonth(twoYear.getMonth()-24)

    const pivotDates = [halfYear, oneYear, twoYear]
    message.push('pivotDates ' + pivotDates.map((date) => date.toLocaleDateString('vi')).toString() + '\n')
    let experts = await serverQueryCollection('expert', [
      { key: 'status', operator: '==', value: "activated" }
    
    ], expertAdminConverter)

    for (const pivotDay of pivotDates) {
      const index = pivotDates.indexOf(pivotDay)
      for (const expert of experts) {
        var perform = 1.0
        const eid = expert.id
        let allPreds = await serverQueryCollection('expert/' + eid + '/preds', [] , predAdminConverter)
        // let openPreds = await serverQueryCollection('expert/' + eid + '/preds', [
        //   { key: 'status', operator: '==', value: "Inprogress" },
        //   { key: 'dateIn', operator: '>=', value: pivotDay }
        // ], predAdminConverter)
        let openPreds = allPreds.filter((item) => {
          return item.status =="Inprogress" && item.dateIn >= pivotDay
        })
  
        message.push('expert id : ' + eid +  ' name ' + expert.name +'\n\n\n\n')
  
        for (const pred of openPreds) {
          message.push('pred id : ' + pred.id ?? "" )
          const matchedPriceToday = await getTodayMatchedVolume(pred.assetName)
          message.push(' asset ' + pred.assetName +  ' priceIn: ' + pred.priceIn + ' priceOut = ' + pred.priceOut + ' cutloss ' + pred.cutLoss + ' deadline ' + pred.deadLine.toLocaleString('vi') + ' portion ' + pred.portion +  '% . \n MatchedPriceToday :  ' + matchedPriceToday.toString() )
          const max = Math.max.apply(Math, matchedPriceToday)
          const min = Math.min.apply(Math, matchedPriceToday)
          message.push('  max : ' + max + '  min:  ' + min +  '  date :  ' + (new Date()).toLocaleString('vi')  + '\n')
  
          const toDayValue = true ? min/1000 : max/1000
          const curPerform = true ? toDayValue / pred.priceIn : pred.priceIn / toDayValue
          const curProfit = (curPerform - 1) * pred.portion / 100 + 1
          message.push('incremental ratio of this pred ===== ' + ((curPerform-1) * 100).toFixed(2) +'%  profit ' +  + ((curProfit-1) * 100).toFixed(2) + '% \n\n\n\n')
          perform = perform * curProfit
          const priceOut = pred.priceOut * 1000
          const cutLoss = pred.cutLoss * 1000
          if (matchedPriceToday.includes(priceOut) || (max >= priceOut && min <= priceOut)) {
            message.push('hit price Out \n')
            const path = 'expert/' + eid + '/preds/' + pred.id ?? ""
            await serverUpdateDoc(path, {
              priceRelease: pred.priceOut,
              dateRelease: new Date(),
              status: "Closed"
            })
            message.push('set to closed : ' + path + '\n')
            // mark cut loss
          } else if ((matchedPriceToday.includes(pred.cutLoss * 1000)) || (max >= cutLoss && min <= cutLoss)) {
            message.push('hit cutLoss \n')
            const path = 'expert/' + eid + '/preds/' + pred.id ?? ""
            await serverUpdateDoc(path, {
              priceRelease: pred.cutLoss,
              dateRelease: new Date(),
              status: "Closed"
            })
            message.push('set to closed : ' + path + '\n')
          } else if  (datesAreOnSameDay(new Date(), pred.deadLine)){
            message.push(' hit dead Line ')
            const path = 'expert/' + eid + '/preds/' + pred.id ?? ""
            await serverUpdateDoc(path, {
              priceRelease: max,
              dateRelease: new Date(),
              status: "Closed"
            })
  
          }
        }
  
        // let closePreds = await serverQueryCollection('expert/' + eid + '/preds', [{ key: 'status', operator: '!=', value: "Inprogress" },
        // { key: 'dateIn', operator: '>=', value: pivotDay }], predAdminConverter)

        let closePreds = allPreds.filter((item) => {
          return item.status != "Inprogress" && item.dateIn >= pivotDay
        })
        for (const pred of closePreds) {
          if (pred.priceRelease) {
            const ratio = pred.priceRelease / pred.priceIn
            const predPerform = true ? ratio : 1/ratio
            const profit = (predPerform -1) * pred.portion / 100 + 1
            message.push(' \n  Perform of close Pred ===== ' + predPerform.toFixed(2)   + '  profit ' +  profit.toFixed(2) + '\n')
            perform = perform * profit
          }
        }

        let timeInfo = index == 0 ? {"halfYear" : perform} : index == 1 ? {"oneYear": perform} : {"twoYear": perform}
        let result = await serverUpdateDoc('expert/' + eid,timeInfo)

  
        message.push('\n expert performance of ' + JSON.stringify(timeInfo) +' =====' + perform + '\n\n\n\n')
  
      }
    }

  } catch (error) {
    return new Response(`Webhook error: ` + JSON.stringify(error), {
      status: 400,
    })
  }

  return new Response(message.toString(), {
    status: 200
  })
}