"use server"

import { promises as fs } from 'fs';
const urlSSIStock = 'https://iboard-query.ssi.com.vn/v2/stock/'
// const urlRealTime = 'https://banggia.cafef.vn/stockhandler.ashx?userlist='
const urlSSIVNXALL = 'https://iboard-query.ssi.com.vn/v2/stock/group/VNXALL'

type realTimeStockInfo = { ss: string, cv: string, h: number, l: number, r: number, o: number, mp: number, pcp: number } // r tham chieu, mp dong cua

import axios from 'axios'
import { Prediction, PredictionReview } from '../model/prediction';
import { possibleBonusTimeRangeWithPredInfo, StockPriceRT } from './utils';


export async function getRealTimeStockData(stocks: string[]) {
  try {
    const param = stocks
    // console.log("params " + param)
    const responses = await Promise.all(stocks.map(async code => {
      const res = await fetch(urlSSIStock + code, { next: { revalidate: 0 } })
      const json = await res.json()
      const data = json.data
      // console.log('data  aaaa' + JSON.stringify(data))
      const priceRT: StockPriceRT = {
        code: code,
        name: data.cv,
        high: data.h/1000,
        low: data.l/1000,
        tc: data.r/1000,
        open: data.o/1000,
        close: data.mp/1000,
        preClosed: data.pcp/1000
      }

      return priceRT

    }
    )
    )

    // const data = await fetch(urlRealTime + param, {
    //   next: { revalidate: 0 },
    // })
    // const result = await data.json()
    let object: { [key: string]: StockPriceRT } = {}
    responses.map((item) => {
      if (item.low == 0 && item.high == 0 && item.tc == 0) {
        console.log(' khong lay duoc gia cua co phieu ' + item.code + '  api ngoai tra ve 0  ' )
      } else [
        object[item.code] = item

      ]
    })


    return object
  }
  catch (err) {
    throw err
  }
}

export async function getTodayMatchedVolume(stock: string) {
  try {
    const response = await fetch(urlSSIStock + stock + '/matched-vol-by-price', {
      next: { revalidate: 0 },
      method: "GET",
      headers: {
        "origin": "https://iboard.ssi.com.vn",
        "cache-control": "no-cache",
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const resBody = await response.json() as {
      code: string,
      message: string,
      data: {
        price: number,
        stockSymbol: string
      }[]
    }

    return resBody.data.map((item) => item.price / 1000)
  }
  catch (err) {
    throw err
  }
}

export async function getVNXALLStockData() {
  try {
    const res = await fetch(urlSSIVNXALL, { next: { revalidate: 0 }, })
    if (res.ok) {
      const json = await res.json()
      const data = json.data as realTimeStockInfo[]
      const list = data.map((item) => {
        const obj: StockPriceRT = {
          code: item.ss,
          name: item.cv,
          high: item.h / 1000,
          low: item.l / 1000,
          tc: item.r / 1000,
          open: item.o / 1000,
          close: item.mp / 1000,
          preClosed: item.pcp / 1000
        }
        return obj
      })
      return list

    } else {
      throw new Error('Failed to fetch data')
    }

  }
  catch (err) {
    throw err
  }

}




 async function fetchBonusData(fDate: string, tDate: string, code: string = '') {
  var data: BonusData[] = []
  const channels = ['13', '14', '15']

  for (const channel of channels) {
    const bonus = await getBonusInChannel(channel, fDate, tDate, code)
    data.push(...bonus)
  }
  return data
}

async function getBonusInChannel(channel: string, fDate: string, tDate: string, code: string = '') {
  var page = 0
  var data: BonusData[] = []
  do {
    page += 1
    console.log('channel    ' + channel + '     page :   ' + page)
    var dataPage = await getBonusInPage(channel, page, fDate, tDate, code)
    const transform = dataPage.data.map((item) => {
      const result: BonusData = {
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

  return data

}

const reqTokenVietStock = '20hpo4ABlvS1SejdZAriCKUCMn9OYzDjtBRxGcyA0AlIIbabjOSPLlQjQlLelQRskI12TEoCfnZXVdLIfY4zFpy3v7YXTDs0CfTHlIF8Z9o1'

async function getBonusInPage(channel: string, page: number, fDate: string, tDate: string, code: string, reqToken: string = reqTokenVietStock) {
  // 13 tra co tuc tien mat * , RateTypeID = 1
  // 14 thuong co phieu *, RateTypeID = 2
  // 15 tra co tuc bang co phieu * , RateTypeID = 1
  // 16 phat hanh them
  const response = await axios.post<[Bonus[], [number]]>('https://finance.vietstock.vn/data/eventstypedata', {
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
      data: data,
      end: data[data.length - 1].Row == total
    }

  } else {
    return {
      data: [],
      end: true
    }

  }
  // console.log(' ---- ' + data[data.length-1].Row  + '  =====   ' + total)

}


export async function bonusAppliedToPred(pred: Prediction) {

  const possibleTime = possibleBonusTimeRangeWithPredInfo(new Date(pred.dateIn), new Date(pred.dateRelease ?? Date.now()))

  const leftStr = possibleTime.possibleGDKHQTimeStart.toLocaleDateString('en-CA')
  const rightStr = possibleTime.possibleGDKHQTimeEnd.toLocaleDateString('en-CA')
  console.log('       =======  aaaaaaaa       ' + leftStr + '    =====      ' + rightStr)
  const bonus = await fetchBonusData(leftStr, rightStr, pred.assetName)
  console.log('bonus applied :  ' + JSON.stringify(bonus))
  return bonus

}