
import { getExperts, getPredsSince, getRankData, serverMarkExpertExpired, serverSetStats, serverUpdateExpertInfo, serverUpdateStats } from "@/app/lib/server";
import { getPivotDates } from "@/app/lib/statistic";
import { contentOf, datesGreaterThan, getPerformanceSince } from "@/app/lib/utils";


// ********* update performance of every activated expert, de tao rankInfo, run at 5PM every day *********
// ********** update followNum of every solo expert ******************
// *********  run at 5PM every day *********

export async function GET(request: Request) {
  const toDay = new Date()
  try {
    var message: string[] = ["start \n"]

    const pivotDates = getPivotDates(toDay)
    const pivotWeek = pivotDates.pivotWeek
    const pivotMonth = pivotDates.pivotMonth
    const pivotQuarter = pivotDates.pivotQuarter
    const pivotYear = pivotDates.pivotYear
    const minDate = [pivotWeek, pivotMonth, pivotQuarter, pivotYear].reduce((a, b) => { return a < b ? a : b; });

    message.push('pivotWeek ' + pivotWeek.toLocaleDateString('vi') )
    message.push('pivotMonth ' + pivotMonth.toLocaleDateString('vi') )
    message.push('pivotQuarter ' + pivotQuarter.toLocaleDateString('vi') )
    message.push('pivotYear ' + pivotYear.toLocaleDateString('vi') )
    message.push('minDate ' + minDate.toLocaleDateString('vi') )



    message.push('Earlies Date to check: ' + minDate.toLocaleDateString('vi') + ' expert count ')
    const experts = await getExperts([ { key: "status", operator: "==", value: "activated" }])
    message.push('start checking performance of ALL( not only ranked) expert ; ' )

    var numOfAllSub = 0
    var sumAllSubValue = 0
    var numOfSoloExperts = experts.filter((item) => {return item.expertType == 'solo'}).length
    var numOfRankExperts = experts.length - numOfSoloExperts
    for (const expert of experts) {

      numOfAllSub += expert.follower.length

      const subValueOfExpert = expert.follower.map((item) => item.value).reduce((a,b) =>  a + b, 0)
      sumAllSubValue += subValueOfExpert


      const dateExpire = new Date(expert.expertExpire)  
      if (datesGreaterThan(toDay, dateExpire)) {
        message.push(' phat hien expired expert : ' + JSON.stringify(expert))   
        await serverMarkExpertExpired(expert.id) 

      }

      message.push('start checking performance of this expert ; ' + expert.name)
      // var perform = 1.0
      const eid = expert.id
      let donePreds = await getPredsSince(minDate
        , false, eid) 
      message.push('number of done Preds ' + donePreds.length)
      message.push('Kiem tra expert id : ' + eid + ' name ' + expert.name )


      message.push('Tinh toan performance theo tuan ' )

      const weekData = await getPerformanceSince(pivotWeek, donePreds)
      message.push(...weekData.message)

      message.push('Tinh toan performance theo thang ' )
      const monthData = await getPerformanceSince(pivotMonth, donePreds)
      message.push(...monthData.message)

      message.push('Tinh toan performance theo quy ' )
      const quarterData = await getPerformanceSince(pivotQuarter, donePreds)
      message.push(...quarterData.message)

      message.push('Tinh toan performance theo nam ' )
      const yearData = await getPerformanceSince(pivotYear, donePreds)
      message.push(...yearData.message)

      const perInfo = {
          weekPerform: weekData.performance,
          monthPerform: monthData.performance,
          quarterPerform: quarterData.performance,
          yearPerform: yearData.performance
      }

      await serverUpdateExpertInfo(eid, perInfo)
      message.push('\n expert ' + expert.name + ' performance info : ' + JSON.stringify(perInfo) + '\n\n\n\n')

      message.push(' update follower Num')

      // const followerNum = expert.follower.filter((item) => { return item.endDate > Date.now()}).length
      // await serverUpdateExpertInfo(expert.id, { followerNum: followerNum })

    }

    const numOfAllExpert = experts.length
    const dateTimeNowStr = (new Date()).getTime().toString()

    message.push(' =======================================================    \n')
    message.push(' Theo quá trình trên, tiện tay đếm tổng số chuyên gia, số lượng sub ,tổng giá trị sub va rank Data   \n')
    message.push('=======================================================')

    const rankData = await getRankData()

    message.push(JSON.stringify(rankData))

    const data =  { numOfAllExpert, numOfAllSub: numOfAllSub,  sumAllSubValue , numOfSoloExperts, numOfRankExperts, rankData}


    await serverSetStats(data)
  } catch (error) {
    return new Response(`Webhook error: ` + JSON.stringify(error), {
      status: 400,
    })
  }

  return new Response(contentOf(message), {
    status: 200
  })
}