"use server"

import { promises as fs } from 'fs';
const vn100Code = '21'
const vn30Code = '11'
const hoseCode = '1'
const hnxCode = '2'
const hnx30Code = '12'
const upcomCode = '9'
const urlFloor = 'https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode='
const urlMatchTime = 'https://iboard-query.ssi.com.vn/stock/'
const urlRealTime = 'https://banggia.cafef.vn/stockhandler.ashx?userlist='
const urlBonus = 'https://finance.vietstock.vn/data/eventstypedata'
const urlCompanyInfo = 'https://s.cafef.vn/ajax/pagenew/databusiness/congtyniemyet.ashx?centerid=0&skip=0&take=2000&major=0'
const urlSSIVNXALL = 'https://iboard-query.ssi.com.vn/v2/stock/group/VNXALL'

type companyInfo = {Symbol: string, CompanyName: string}
type realTimeStockInfo = { ss: string, cv: string, h: number, l: number, r: number} // r tham chieu
type stockToday = {Symbol: string, TotalVolume: number, HighPrice: number 
}

import axios from 'axios'
import { Prediction, PredictionReview } from '../model/prediction';
import { possibleBonusTimeRangeWithPredInfo } from './utils';


export async function getRealTimeStockData(stocks: string[]) {
  try {
    const param = stocks
    console.log("params " + param)
    const data = await fetch(urlRealTime + param, {
      next: { revalidate: 0 },
    })
    const result = await data.json()
    let object : {[key: string] : {high: number, low: number}} = {}

    result.map((d: { a: string, v: number,w : number }) => {
      const key = d.a as string
      const value = {
        high :d.v ,// d.v is hight, d.w is low,
        low: d.w
      }
      if (d.v == 0 || d.w == 0) {
        console.log(' khong lay duoc gia cua co phieu ' + d.a + '  api ngoai tra ve 0  ' + d.a )
      } else {
        object[key] = value
      }
    })
    console.log("getRealTimeStockData " + JSON.stringify(object))

    return object
  }
  catch (err) {
    throw err
  }
}

export async function getTodayMatchedVolume(stock: string) {
  try {
    const response = await fetch(urlMatchTime + stock + '/matched-vol-by-price',{
      method: "GET",
      headers: {
        "origin": "https://iboard.ssi.com.vn",
        "cache-control": "no-cache",
      }})
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const resBody = await response.json() as {
      code: string,
      message: string,
      data: {
        price: number,
        stockSymbol: string
        // "buyUpVol": 1500,
        // "changeType": "U",
        // "sellDownVol": 0,
        // "totalVol": 1500,
        // "unknownVol": 0

      }[]
    }

    return resBody.data.map((item) => item.price/1000)
  }
  catch (err) {
    throw err
  }
}

export async function getLocalStockList() {

  const string = await fs.readFile(process.cwd() + '/public/stockListnew.json', 'utf-8')
  // const array =  string.split(',')
  const array =  JSON.parse(string)
  return array
}


export async function getRealtimeStockList() {
  const stockListInfo = await getStockData()
  // const companyInfo = await getCompanyInfo()
  // const stockTodayWithComName = stockToday.map((item) => {
  //   const name = companyInfo.find((it) => it.Symbol == item)?.CompanyName ?? "__"

  //     return {
  //       code: item,
  //       name: name
  //     }

  // })
  return stockListInfo.map ((item) => {
    return {
      code: item.ss,
      name: item.cv,
      low: item.l/1000,
      high: item.h/1000,
      tc: item.r/100
    }
  })
}

async function getCompanyInfo() {
  try {
    const res = await fetch (urlCompanyInfo)
    if (res.ok) {
      const json = await res.json()
      const result = json.Data as companyInfo[]
      console.log(result[3])
      return result
      // console.log('aaaaa ' + JSON.stringify(json))

    } else  {
      throw new Error('Failed to fetch data')
    }

  }
  catch (err) {
    throw err
  }
  
}

export default async function getStockData() {
  try {
    const res = await fetch (urlSSIVNXALL)
    if (res.ok) {
      const json = await res.json()
      const result = json.data as realTimeStockInfo[]
      // console.log('result ')
      // console.log(result[3])
      return result
      // console.log('aaaaa ' + JSON.stringify(json))

    } else  {
      throw new Error('Failed to fetch data')
    }

  }
  catch (err) {
    throw err
  }

}



// export default async function getStockData(minVolume: number) {
//   try {

//     const [responsevn100, responsevn30, responsehose, responsehnx, responsehnx30, responseupcom] = await Promise.all([
//       fetch(url + vn100Code),
//       fetch(url + vn30Code),
//       fetch(url + hoseCode),
//       fetch(url + hnxCode),
//       fetch(url + hnx30Code),
//       fetch(url + upcomCode),
//     ]


//     )
//     const [
//       resultvn100,
//       resultvn30,
//       resulthose,
//       resulthnx,
//       resulthnx30,
//       resultupcom
//     ] = await Promise.all([
//       responsevn100.json(),
//       responsevn30.json(),
//       responsehose.json(),
//       responsehnx.json(),
//       responsehnx30.json(),
//       responseupcom.json()
//     ]);
//     // const resultvn30 = await responsevn30.json();
//     // const resulthose = await responsehose.json();
//     // const resulthnx = await responsehnx.json();
//     // const resulthnx30 = await responsehnx30.json();
//     // const resultupcom = await responseupcom.json();

//     const arrvn100 = (resultvn100.Data as stockToday[]).filter(d => d.TotalVolume > minVolume)
//     const arrvn30 = (resultvn30.Data as stockToday[]).filter(d => d.TotalVolume > minVolume)
//     const arrvnhose = (resulthose.Data as stockToday[]).filter(d => d.TotalVolume > minVolume)
//     const arrvnhnx = (resulthnx.Data as stockToday[]).filter(d => d.TotalVolume > minVolume)
//     const arrvnhnx30 = (resulthnx30.Data as stockToday[]).filter(d => d.TotalVolume > minVolume)
//     const arrvnupcom = (resultupcom.Data as stockToday[]).filter(d => d.TotalVolume > minVolume)

//     var symbols = arrvn100.map(d => d.Symbol)
//     let merge2 = arrvn100.concat(arrvn30.filter(d => !symbols.includes(d.Symbol)))

//     symbols = merge2.map(d => d.Symbol)
//     let merge3 = merge2.concat(arrvnhose.filter(d => !symbols.includes(d.Symbol)))

//     symbols = merge3.map(d => d.Symbol)
//     let merge4 = merge3.concat(arrvnhnx.filter(d => !symbols.includes(d.Symbol)))

//     symbols = merge4.map(d => d.Symbol)
//     let merge5 = merge4.concat(arrvnhnx30.filter(d => !symbols.includes(d.Symbol)))

//     symbols = merge5.map(d => d.Symbol)
//     let merge6 = merge5.concat(arrvnupcom.filter(d => !symbols.includes(d.Symbol)))


//     console.log("arr length " + merge6.length)

//     // console.log(merge6 )
//     return merge6
//   } catch (err) {
//     throw err
//   } finally {
//   }

// }

// export async function getBonusData(fDate:string , tDate:string, code: string = '') {

//   var data: BonusData[] = await fetchBonusData(fDate, tDate, code)
//   return JSON.stringify(data)

// }

export async function fetchBonusData(fDate:string , tDate:string, code: string = '') {
  var data: BonusData[] = []
  const channels = [ '13', '14', '15']

  for (const channel of channels) {
    const bonus = await getBonusInChannel(channel,fDate , tDate, code)
    data.push(...bonus)
  }
  return data
}

async function getBonusInChannel(channel: string, fDate:string , tDate:string, code: string = '') {
  var page = 0
  var data: BonusData[] = []
  do {
    page += 1
    console.log('channel    ' + channel + '     page :   ' + page) 
    var dataPage = await getBonusInPage(channel, page, fDate, tDate, code)
    const transform = dataPage.data.map((item) => {
      const result : BonusData = {
        id: item.EventID.toString(),
        EventID: item.EventID,
        ChannelID: channel,
        Code: item.Code,
        CompanyName: item.CompanyName,
        GDKHQDate: Number(item.GDKHQDate.slice(6, 19)),
        NDKCCDate: Number(item.NDKCCDate.slice(6, 19)),
        // Time: item.Time ? Number(item.Time.slice(6, 19)) : 0,
        Note: item.Note,
        // Name: item.Name ? '',
        Exchange: item.Exchange,
        DateOrder: Number(item.DateOrder.slice(6, 19)),
        Rate: item.Rate,
        RateTypeID: item.RateTypeID
      }
      return result
    })

    data.push(...transform)


  } while (dataPage.end == false)

  return  data

}

const reqTokenVietStock = '20hpo4ABlvS1SejdZAriCKUCMn9OYzDjtBRxGcyA0AlIIbabjOSPLlQjQlLelQRskI12TEoCfnZXVdLIfY4zFpy3v7YXTDs0CfTHlIF8Z9o1'

 async function getBonusInPage(channel:string, page: number, fDate: string, tDate:string, code: string, reqToken:string = reqTokenVietStock) {
  // 13 tra co tuc tien mat * , RateTypeID = 1
  // 14 thuong co phieu *, RateTypeID = 2
  // 15 tra co tuc bang co phieu * , RateTypeID = 1
  // 16 phat hanh them
  const response = await axios.post<[Bonus[],[number]]>('https://finance.vietstock.vn/data/eventstypedata', {
    eventTypeID: '1',
    channelID: channel,
    fDate: fDate,
    tDate: tDate,
    page: page.toString(),
    pageSize: '100',
    code: code,
    __RequestVerificationToken: reqToken,
  }, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': 'language=vi-VN; ASP.NET_SessionId=efwxelr40mit1ztqvddwg2yp; __RequestVerificationToken=63nV_V_fPgrRMCaGk6VfWJ8nwRa_1c0A9X5BSq_JcgxeQSpODI9VpXpuK78PB9rf_xN98OV44aM40IRr2_1hrY16-7t2wyHGSLFSnW0OiKY1; Theme=Light; AnonymousNotification=; _gid=GA1.2.2000859721.1721806345; _pbjs_userid_consent_data=3524755945110770; dable_uid=83947402.1712061204172; isShowLogin=true; finance_viewedstock=A32,BIC,; __qca=I0-928512372-1721911656155; __gads=ID=41a19db9cec3ccdc:T=1721806346:RT=1721917488:S=ALNI_MZMQpPnFfQl2jdz8BQnDEU8jDPdFg; __gpi=UID=00000ea4050226c3:T=1721806346:RT=1721917488:S=ALNI_Mb5RveO4lpCVCZqNcGJYbqlHZpUPA; __eoi=ID=f239fb23539c613a:T=1721806346:RT=1721917488:S=AA-AfjbGfgWuyE485YVtfCc7LkpD; _gat_UA-1460625-2=1; cto_bidid=vjghzF9vQWNNJTJGSXhFa1JnSjFSVUpoZVhteGRxRVRhM2dncmFqTUhjdVpVZmVjbGRHdWNjdG5sakhkaHRxaVh3cld5VXpDWTclMkZ6TEVkcmtNTE9JYUg1dnVaTGhYeHpWSXpJSXBmM2R3cHhPb21KMWxvZE5IaDhncHBQY3BZQU5zYzlITGFOQU40VE43Z3RRSkdnQ21VTnVXY3d3JTNEJTNE; _ga_EXMM0DKVEX=GS1.1.1721917487.7.1.1721917508.39.0.0; _ga=GA1.2.718181391.1721806344; cto_bundle=sY9jFl9iNmdreSUyRlBWc2ZkMkhXVnI1V2x4djlLRHlpUG5HTUhBM3k1TUpEVWN1elVkcXNTSFEycVBFR2VWcWRjOGIzY29PR01XTmFRbzIlMkJ4SW9Kb2hxdGRQQ2RpbmVYMXp5ejJ1cWx6alRsY0h3dzBHT0JCalBFWHM0djdkS1FGM1lNWlVtM2lHdSUyRjV1cFU0b0cySEZkQmszQ3ozZmV2aWV2YktUJTJCeWtYYWZtVWJPQXM2WTQxZE5Nc3VUbFJNRmdNOG9tb0hEVkcxeVp2RlQzR3NZTFRoRXJGektEZDNxQVZrRmVtekQ2cE1SR2xJSWtwRDRXNmlVY1o2U3ZiOUhnejMlMkJPZw; ASP.NET_SessionId=wu5oihbopjdjsuartrtwpyq0; language=vi-VN',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    }
  }

  )


  if (response.data) {
    console.log('response :  ' + JSON.stringify(response.data))
  
    const data = response.data[0]
    const total = response.data[1][0]
    return {
      data : data,
      end: data[data.length-1].Row == total
    }

  } else {
    return {
      data : [],
      end:true
    }

  }
  // console.log(' ---- ' + data[data.length-1].Row  + '  =====   ' + total)
 
}


export async function bonusAppliedToPred(pred: Prediction) {

  const possibleTime = possibleBonusTimeRangeWithPredInfo(new Date(pred.dateIn), new Date(pred.dateRelease ?? Date.now()))

  const leftStr = possibleTime.possibleGDKHQTimeStart.toLocaleDateString('en-CA')
  const rightStr = possibleTime.possibleGDKHQTimeEnd.toLocaleDateString('en-CA')
  console.log('       =======  aaaaaaaa       ' + leftStr +   '    =====      ' + rightStr )
  const bonus = await fetchBonusData(leftStr, rightStr, pred.assetName)
  console.log('bonus applied :  ' + JSON.stringify(bonus))
  return  bonus
  
}