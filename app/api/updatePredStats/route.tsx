
import { getTodayMatchedVolume } from "@/app/lib/getStockData"
import { serverCount, serverGetAllInprogressPred, serverMarkPredCutLoss, serverMarkPredExpired, serverMarkPredWin, serverUpdateStats } from "@/app/lib/server"
import { contentOf, datesGreaterThan } from "@/app/lib/utils"


// ********* update status of every wip preds, base on  realtime stock price  , run in tranding time  *********
// ********* update total pred stats , consider to remove later *********

export async function GET(request: Request) {
  var message: string[] = ["start \n"]
  try {
    const allInprogressPreds = await serverGetAllInprogressPred()
    for (const doc of allInprogressPreds) {
      const pred = doc.data()
      const ref = doc.ref
      message.push('pred path : ' + ref.path + '\n')
      const matchedPriceToday = await getTodayMatchedVolume(pred.assetName)
      message.push(' asset ' + pred.assetName + ' priceIn: ' + pred.priceIn + ' priceOut = ' + pred.priceOut + ' cutloss ' + pred.cutLoss + ' deadline ' + new Date(pred.deadLine).toLocaleDateString('vi') + ' portion ' + pred.portion + '% . \n MatchedPriceToday :  ' + matchedPriceToday.toString())
      if (matchedPriceToday.length > 0) {
        const max = Math.max.apply(Math, matchedPriceToday)
        const min = Math.min.apply(Math, matchedPriceToday)
        message.push('  max : ' + max + '  min:  ' + min + '  date :  ' + (new Date()).toLocaleDateString('vi') + '\n')
  
        if (max >= pred.priceOut) {
  
          message.push('hit price Out, close ' + ref.path + 'with price Release ' + pred.priceOut + '\n')
          await serverMarkPredWin(pred)
  
        } else if (min <= pred.cutLoss) {
  
          message.push('hit cutLoss, close ' + ref.path + ' with price Release ' + pred.cutLoss + '\n')
          await serverMarkPredCutLoss(pred)
  
        } else if (datesGreaterThan(new Date(), new Date(pred.deadLine))) {
          
          const priceRelease = true ? min / 1000 : max / 1000
          message.push(' hit deadLine , close ' + ref.path + 'with price Release ' + priceRelease + '\n')
          await serverMarkPredExpired(pred, priceRelease)
  
        } else {
          message.push(' still In progress \n')
          // continue Inprogress
        }

      } else {
        message.push(' truoc phien, chua co data hoac ko ai nhom ngo co phieu nay')
      }
    }

    const countAllPred = await serverCount('preds')
    await serverUpdateStats({ openPreds: allInprogressPreds.length, allPreds: countAllPred })

  } catch (error) {
    return new Response(`Error update stats of preds with error: ` + JSON.stringify(error), {
      status: 400,
    })
  }

  return new Response(contentOf(message), {
    status: 200
  })
}