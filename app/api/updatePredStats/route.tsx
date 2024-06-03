
import { serverCount, serverQueryCollection, serverQueryCollectionGroup, serverUpdateDoc } from "@/app/lib/firebaseadmin/adminfirestore"
import { getTodayMatchedVolume } from "@/app/lib/getStockData"
import { Prediction, predAdminConverter } from "@/app/model/prediction"

export async function GET(request: Request) {
    var message: string[] = ["start \n"]
    try {

        const allInprogressPreds = await serverQueryCollectionGroup<Prediction>('preds', [{ key: 'status', operator: '==', value: 'Inprogress' }], predAdminConverter)
        for (const doc of allInprogressPreds) {
          const pred = doc.data()
          const ref = doc.ref
            message.push ('pred path : ' + ref.path + '\n')
            const matchedPriceToday = await getTodayMatchedVolume(pred.assetName)
            message.push(' asset ' + pred.assetName +  ' priceIn: ' + pred.priceIn + ' priceOut = ' + pred.priceOut + ' cutloss ' + pred.cutLoss + ' deadline ' + pred.deadLine.toLocaleString('vi') + ' portion ' + pred.portion +  '% . \n MatchedPriceToday :  ' + matchedPriceToday.toString() )
            const max = Math.max.apply(Math, matchedPriceToday)
            const min = Math.min.apply(Math, matchedPriceToday)
            message.push('  max : ' + max + '  min:  ' + min +  '  date :  ' + (new Date()).toLocaleString('vi')  + '\n')
    
            // const toDayValue = true ? min/1000 : max/1000
            // const curPerform = true ? toDayValue / pred.priceIn : pred.priceIn / toDayValue
            // const curProfit = (curPerform - 1) * pred.portion / 100 + 1
            // message.push('incremental ratio of this pred ===== ' + ((curPerform-1) * 100).toFixed(2) +'%  profit ' +  + ((curProfit-1) * 100).toFixed(2) + '% \n\n\n\n')
            if (matchedPriceToday.includes(pred.priceOut) || (min <= pred.priceOut)) {
              message.push('hit price Out, close '+ ref.path + 'with price Release ' + pred.priceOut + '\n')

              // const path = 'expert/' + pred.ownerId + '/preds/' + pred.id ?? ""
              await serverUpdateDoc(ref.path, {
                priceRelease: pred.priceOut,
                dateRelease: new Date(),
                status: "WIN"
              })
            } else if ((matchedPriceToday.includes(pred.cutLoss)) || (max >= pred.cutLoss )) {
              message.push('hit cutLoss, close '+ ref.path + ' with price Release ' + pred.cutLoss + '\n')
              await serverUpdateDoc(ref.path, {
                priceRelease: pred.cutLoss,
                dateRelease: new Date(),
                status: "LOSE"
              })
            } else if  (greaterThan(new Date(), pred.deadLine)){
              const priceRelease = true ? min/1000 : max/1000
              message.push(' hit deadLine , close '+ ref.path + 'with price Release ' + priceRelease + '\n')
              await serverUpdateDoc(ref.path, {
                priceRelease: priceRelease,
                dateRelease: new Date(),
                status: "EXPIRED"
              })
    
            } else {
              message.push(' still In progress \n')
              // continue Inprogress
            }
          }

          const countAllPred = await serverCount('preds')
          await serverUpdateDoc('stats/latest',{openPreds: allInprogressPreds.length, allPreds: countAllPred})

    } catch (error) {
        return new Response(`Webhook error: ` + JSON.stringify(error), {
            status: 400,
        })
    }

    return new Response(message.toString(), {
        status: 200
    })


}



const greaterThan = (first: Date, second: Date) => {
  first.setUTCHours(0,0,0,0) > second.setUTCHours(0,0,0,0)
  return first > second
}
//     // first.getFullYear() === second.getFullYear() &&
//     // first.getMonth() === second.getMonth() &&
//     // first.getDate() === second.getDate();