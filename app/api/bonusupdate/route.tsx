
// import { getBonusInfo, getTodayMatchedVolume } from "@/app/lib/getStockData"
// import { serverCount, serverGetAllInprogressPred, serverMarkPredCutLoss, serverMarkPredExpired, serverMarkPredWin, serverUpdateStats } from "@/app/lib/server"
// import { contentOf, datesGreaterThan } from "@/app/lib/utils"

import { bonusAppliedToPred } from "@/app/lib/getStockData"
import { serverGetAllInprogressPred, serverUpdatePredBonus } from "@/app/lib/server"
import { contentOf } from "@/app/lib/utils"


// // ********* update status of every wip preds, base on  realtime stock price  , run in tranding time  *********
// // ********* update total pred stats , consider to remove later *********

// const

export async function GET(request: Request) {
    var message: string[] = ["start \n"]
    const toDayTime = Date.now()
    try {
        const allInprogressPreds = await serverGetAllInprogressPred()
        for (const doc of allInprogressPreds) {
            const pred = doc.data()
            message.push('checking pred : ' + JSON.stringify(pred))


            // check bonus
            if (!pred.bonus) {
                const bonus: BonusData[] = await bonusAppliedToPred(pred)
                if (bonus.length > 0 ) {


                    message.push('bonus found, will update it : ' + JSON.stringify(bonus))
                    pred.bonus = bonus
    
                    message.push('bonus : ' + JSON.stringify(bonus))
                    await serverUpdatePredBonus(pred, bonus)

                }
            }

        }
    } catch (error) {
        return new Response(`Error update stats of preds with error: ` + JSON.stringify(error), {
            status: 400,
        })
    }

    return new Response(contentOf(message), {
        status: 200
    })
}