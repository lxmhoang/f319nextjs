import { expertAdminConverter, predAdminConverter, userAdminConverter } from "@/app/lib/firebaseadmin/adminconverter";
import { serverQueryCollection, serverSetDoc, serverUpdateDoc } from "@/app/lib/firebaseadmin/firebaseadmin";
import getStockData, { getTodayMatchedVolume } from "@/app/lib/getStockData";

const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export async function GET(request: Request) {
  try {
    var message: string[] = ["start \n"]
    let experts = await serverQueryCollection('expert', { status: "activated" }, expertAdminConverter)

    for (const expert of experts) {
      const eid = expert.id
      let openPreds = await serverQueryCollection('expert/' + eid + '/preds', { status: "justCreated" }, predAdminConverter)

      message.push('expert id : ' + eid + '\n')

      for (const pred of openPreds) {
        message.push('pred id : ' + pred.id ?? "" + '\n')
        const matchedPriceToday = await getTodayMatchedVolume(pred.assetName)
        message.push(' asset ' + pred.assetName + ' with priceOut = ' + pred.priceOut * 1000 + ' and cut loss ' + pred.cutLoss * 1000 + ' deadline ' + pred.deadLine.toLocaleString() +  ', and we have matchedPriceToday :  ' + matchedPriceToday.toString() )
        const max = Math.max.apply(Math, matchedPriceToday)
        const min = Math.min.apply(Math, matchedPriceToday)
        message.push('  max : ' + max + '  min:  ' + min +  '  date :  ' + Date() + '\n')
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
    }

  } catch (error) {
    return new Response(`Webhook error:.message}`, {
      status: 400,
    })
  }

  return new Response(message.toString(), {
    status: 200
  })
}