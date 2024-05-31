// import { expertAdminConverter, predAdminConverter, userAdminConverter } from "@/app/lib/firebaseadmin/adminconverter";
// import { serverQueryCollection, serverSetDoc, serverUpdateDoc } from "@/app/lib/firebaseadmin/firebaseadmin";
import { serverQueryCollection, serverUpdateDoc } from "@/app/lib/firebaseadmin/adminfirestore";
import getStockData, { getTodayMatchedVolume } from "@/app/lib/getStockData";
import { getPivotDates } from "@/app/lib/statistic";
import { getPerformanceSince } from "@/app/lib/utils";
import { expertAdminConverter } from "@/app/model/expert";
import { Prediction, predAdminConverter } from "@/app/model/prediction";
import { subscriptionAdminConverter } from "@/app/model/subscription";

const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

// update performance of every activated expert, run at 5PM every day

export async function GET(request: Request) {
  try {
    var message: string[] = ["start \n"]

    const pivotDates = getPivotDates(new Date())
    const pivotWeek = pivotDates[0]
    const pivotMonth = pivotDates[1]
    const pivotQuarter = pivotDates[2]
    const pivotYear = pivotDates[3]
    const minDate = pivotDates.reduce((a, b) => { return a < b ? a : b; });

    message.push('pivotWeek ' + pivotWeek.toLocaleDateString('vi') + '\n')
    message.push('pivotMonth ' + pivotMonth.toLocaleDateString('vi') + '\n')
    message.push('pivotQuarter ' + pivotQuarter.toLocaleDateString('vi') + '\n')
    message.push('pivotYear ' + pivotYear.toLocaleDateString('vi') + '\n')
    message.push('minDate ' + minDate.toLocaleDateString('vi') + '\n')



    console.log('minDat22e ==== : ' + minDate.toLocaleDateString('vi') + ' expert count ')
    let experts = await serverQueryCollection('expert', [{ key: 'status', operator: '==', value: 'activated' }], expertAdminConverter)


    // console.log('2222222 ==== : ' + minDate.toLocaleDateString('vi') + ' expert count ' + experts.length)
    for (const expert of experts) {
      // var perform = 1.0
      const eid = expert.id
      let allPreds = await serverQueryCollection<Prediction>('expert/' + eid + '/preds', [{ key: 'dateIn', operator: '>=', value: minDate }], predAdminConverter)

      // let openPreds = allPreds.filter((item) => {
      //   return item.status == "Inprogress"
      // })

      console.log('minDate ==== : ' + minDate.toLocaleDateString('vi'))
      message.push('expert id : ' + eid + ' name ' + expert.name + '\n\n\n\n')

      const weekData = await getPerformanceSince(pivotWeek, allPreds)
      message.push(...weekData.message)

      const monthData = await getPerformanceSince(pivotMonth, allPreds)
      message.push(...monthData.message)

      const quarterData = await getPerformanceSince(pivotQuarter, allPreds)
      message.push(...quarterData.message)

      const yearData = await getPerformanceSince(pivotYear, allPreds)
      message.push(...yearData.message)

      const perInfo = {
        curPerformance: {
          week: weekData.performance,
          month: monthData.performance,
          quarter: quarterData.performance,
          year: yearData.performance
        }
      }

      let result = await serverUpdateDoc('expert/' + eid, perInfo)
      message.push('\n expert performance info ' + JSON.stringify(perInfo.curPerformance) + '\n\n\n\n')

    }
    // }

    // update followerNum for every expert

    message.push(' =======================================================    \n')
    message.push(' Begin to followerNum for every expert    \n')

    const expertIDs = experts.map(doc => doc.id)

    const allSub = await serverQueryCollection('subscription', [{ key: 'endDate', operator: '>=', value: new Date() }], subscriptionAdminConverter)
    const sumSubValue = allSub.map ((item) => item.value).reduce((a,b) => a+b , 0)
    const currentSub = allSub.filter((item) => { 
      const endDate = item.endDate ?? new Date('2030-01-01')
      return item.perm || endDate >= new Date()
    })

    const subs = currentSub.map((item) => {
      return {
        uid: item.uid,
        eid: item.eid
      }
    })

    message.push(' allSub' + JSON.stringify(allSub) + '   \n')


    const result = expertIDs.map((id) => {
      return {
        id: id,
        num: subs.filter((sub) => {
          return sub.eid == id
        }
        ).length
      }
    })

    message.push(' result' + JSON.stringify(result) + '   \n')

    var nosub = 0
    for (const e of result) {
      message.push(' update expert ' + e.id + ' with follower Num' + e.num + '  \n')
      await serverUpdateDoc('expert/' + e.id, { followerNum: e.num })
      nosub += e.num
    }

    const noe = experts.length
    await serverUpdateDoc('stats/latest', { noe: noe, nosub: nosub, sumSubValue: sumSubValue })

  } catch (error) {
    return new Response(`Webhook error: ` + JSON.stringify(error), {
      status: 400,
    })
  }

  return new Response(message.toString(), {
    status: 200
  })
}