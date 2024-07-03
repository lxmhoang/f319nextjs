// import { expertAdminConverter, predAdminConverter, userAdminConverter } from "@/app/lib/firebaseadmin/adminconverter";
// import { serverQueryCollection, serverSetDoc, serverUpdateDoc } from "@/app/lib/firebaseadmin/firebaseadmin";
import { serverQueryCollection, serverSetDoc, serverUpdateDoc } from "@/app/lib/firebaseadmin/adminfirestore";
import { getPivotDates } from "@/app/lib/statistic";
import { contentOf, datesGreaterThan, getPerformanceSince } from "@/app/lib/utils";
import { ExpertStatus, expertAdminConverter } from "@/app/model/expert";
import { Prediction, predAdminConverter } from "@/app/model/prediction";
import { subscriptionAdminConverter } from "@/app/model/subscription";


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
    // let expertRank = await serverQueryCollection('expert', [{ key: 'expertType', operator: '==', value: 'rank' }], expertAdminConverter)
    // let experts = expertRank.filter((item) => { return item.status == 'activated'})
    const experts = await serverQueryCollection('expert', 
      [  
        //  { key: "expertType", operator: "==", value: "rank" },
          { key: "status", operator: "==", value: "activated" }    

      ], 
      expertAdminConverter,
    )

    // const rankExpert = experts.filter((item) => { return item.expertType == 'rank'})


    // console.log('2222222 ==== : ' + minDate.toLocaleDateString('vi') + ' expert count ' + experts.length)
    message.push('start checking performance of ALL( not only ranked) expert ; ' )

    for (const expert of experts) {
      
      const dateExpire = new Date(expert.expertExpire)  
      if (datesGreaterThan(toDay, dateExpire)) {
        message.push(' phat hien expired expert : ' + JSON.stringify(expert))
        await serverUpdateDoc('expert/' + expert.id , {status: ExpertStatus.expired})
        
      }
    

      message.push('start checking performance of this expert ; ' + expert.name)
      // var perform = 1.0
      const eid = expert.id
      let wipPreds = await serverQueryCollection<Prediction>('expert/' + eid + '/preds', 
      [
        // { key: 'dateIn', operator: '>=', value: minDate },
        { key: 'status', operator: '!=', value: 'Inprogress' }

      ],
       predAdminConverter)

       let allPreds = wipPreds.filter((item) => {
        return item.dateIn >= minDate
       })

      // let openPreds = allPreds.filter((item) => {
      //   return item.status == "Inprogress"
      // })

      message.push('Kiem tra expert id : ' + eid + ' name ' + expert.name )


      message.push('Tinh toan performance theo tuan ' )

      const weekData = await getPerformanceSince(pivotWeek, allPreds)
      message.push(...weekData.message)

      message.push('Tinh toan performance theo thang ' )
      const monthData = await getPerformanceSince(pivotMonth, allPreds)
      message.push(...monthData.message)

      message.push('Tinh toan performance theo quy ' )
      const quarterData = await getPerformanceSince(pivotQuarter, allPreds)
      message.push(...quarterData.message)

      message.push('Tinh toan performance theo nam ' )
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

      await serverUpdateDoc('expert/' + eid, perInfo)
      message.push('\n expert ' + expert.name + ' performance info : ' + JSON.stringify(perInfo.curPerformance) + '\n\n\n\n')

    }
    // }

    // update followerNum for every expert

    message.push(' =======================================================    \n')
    message.push(' Begin to  update followerNum for every SOLO expert    \n')
    console.log('=======================================================')
    const soloExperts =  experts.filter((item) => { return item.expertType == 'solo'})

    const numOfSoloExperts = soloExperts.length

    const numOfRankExperts = experts.length - numOfSoloExperts

    const soloExpertIDs = soloExperts.map(doc => doc.id)

    const allSub = await serverQueryCollection('subscription', [], subscriptionAdminConverter)
    const sumAllSubValue = allSub.map ((item) => item.value).reduce((a,b) => a+b , 0)
    
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

    message.push(' currentSub duoc don gian hoa : ' + JSON.stringify(subs) + '   \n')
    
    const result = soloExpertIDs.map((id) => {
      return {
        id: id,
        num: subs.filter((sub) => {
          return sub.eid == id
        }
        ).length
      }
    })

    message.push(' KV result of counting follower num for solo expert' + JSON.stringify(result) + '   \n')

    var numOfAllSub = 0
    for (const e of result) {
      message.push(' update solo expert ' + e.id + ' with follower Num  : ' + e.num + '  \n')
      await serverUpdateDoc('expert/' + e.id, { followerNum: e.num })
      numOfAllSub += e.num
    }

    const numOfAllExpert = experts.length
    const dateTimeNowStr = (new Date()).getTime().toString()

    message.push(' =======================================================    \n')
    message.push(' Theo quá trình trên, tiện tay đếm tổng số chuyên gia, số lượng sub ,tổng giá trị sub    \n')
    console.log('=======================================================')
    const data =  { numOfAllExpert, numOfAllSub: numOfAllSub,  sumAllSubValue , numOfSoloExperts, numOfRankExperts}
    await serverSetDoc('stats/' + dateTimeNowStr, data)
    await serverSetDoc('stats/latest', data, true)

  } catch (error) {
    return new Response(`Webhook error: ` + JSON.stringify(error), {
      status: 400,
    })
  }

  return new Response(contentOf(message), {
    status: 200
  })
}