"use server"

import { promises as fs } from 'fs';
const vn100Code = '21'
const vn30Code = '11'
const hoseCode = '1'
const hnxCode = '2'
const hnx30Code = '12'
const upcomCode = '9'
const url = 'https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode='
const urlMatchTime = 'https://iboard-query.ssi.com.vn/stock/'
const urlRealTime = 'https://banggia.cafef.vn/stockhandler.ashx?userlist='

const MIN_VOLUME = 100000


export async function getBonusInfo2() {
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
myHeaders.append("Cookie", "language=vi-VN; ASP.NET_SessionId=efwxelr40mit1ztqvddwg2yp; __RequestVerificationToken=63nV_V_fPgrRMCaGk6VfWJ8nwRa_1c0A9X5BSq_JcgxeQSpODI9VpXpuK78PB9rf_xN98OV44aM40IRr2_1hrY16-7t2wyHGSLFSnW0OiKY1; Theme=Light; AnonymousNotification=; _gid=GA1.2.2000859721.1721806345; _pbjs_userid_consent_data=3524755945110770; dable_uid=83947402.1712061204172; isShowLogin=true; finance_viewedstock=A32,BIC,; __qca=I0-928512372-1721911656155; __gads=ID=41a19db9cec3ccdc:T=1721806346:RT=1721917488:S=ALNI_MZMQpPnFfQl2jdz8BQnDEU8jDPdFg; __gpi=UID=00000ea4050226c3:T=1721806346:RT=1721917488:S=ALNI_Mb5RveO4lpCVCZqNcGJYbqlHZpUPA; __eoi=ID=f239fb23539c613a:T=1721806346:RT=1721917488:S=AA-AfjbGfgWuyE485YVtfCc7LkpD; _gat_UA-1460625-2=1; cto_bidid=vjghzF9vQWNNJTJGSXhFa1JnSjFSVUpoZVhteGRxRVRhM2dncmFqTUhjdVpVZmVjbGRHdWNjdG5sakhkaHRxaVh3cld5VXpDWTclMkZ6TEVkcmtNTE9JYUg1dnVaTGhYeHpWSXpJSXBmM2R3cHhPb21KMWxvZE5IaDhncHBQY3BZQU5zYzlITGFOQU40VE43Z3RRSkdnQ21VTnVXY3d3JTNEJTNE; _ga_EXMM0DKVEX=GS1.1.1721917487.7.1.1721917508.39.0.0; _ga=GA1.2.718181391.1721806344; cto_bundle=sY9jFl9iNmdreSUyRlBWc2ZkMkhXVnI1V2x4djlLRHlpUG5HTUhBM3k1TUpEVWN1elVkcXNTSFEycVBFR2VWcWRjOGIzY29PR01XTmFRbzIlMkJ4SW9Kb2hxdGRQQ2RpbmVYMXp5ejJ1cWx6alRsY0h3dzBHT0JCalBFWHM0djdkS1FGM1lNWlVtM2lHdSUyRjV1cFU0b0cySEZkQmszQ3ozZmV2aWV2YktUJTJCeWtYYWZtVWJPQXM2WTQxZE5Nc3VUbFJNRmdNOG9tb0hEVkcxeVp2RlQzR3NZTFRoRXJGektEZDNxQVZrRmVtekQ2cE1SR2xJSWtwRDRXNmlVY1o2U3ZiOUhnejMlMkJPZw; ASP.NET_SessionId=wu5oihbopjdjsuartrtwpyq0; language=vi-VN");
myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36");

const raw = "eventTypeID=1&channelID=13&code=&catID=-1&fDate=2024-01-01&tDate=2024-07-26&page=1&pageSize=20&orderBy=Date1&orderDir=DESC&__RequestVerificationToken=bRaxCMW3TfWugNpoKXmHM8BV5D8yOppv9YDy21YizrgzkCrpF2C3Rdty1fjj-sBdC50ZIA877oT1_lzIn3-5p9QJXDaz_kgw6Temv3puP5k1";

const requestOptions : RequestInit = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  mode: 'cors',
  redirect: "follow"
};

try{
const res = await fetch("https://finance.vietstock.vn/data/eventstypedata", requestOptions)
console.log('vvv')
return 'text' + JSON.stringify(res)
} catch (err) {
  return 'zzz' + JSON.stringify(err)
}

}

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



export default async function getStockData() {
  try {

    const [responsevn100, responsevn30, responsehose, responsehnx, responsehnx30, responseupcom] = await Promise.all([
      fetch(url + vn100Code),
      fetch(url + vn30Code),
      fetch(url + hoseCode),
      fetch(url + hnxCode),
      fetch(url + hnx30Code),
      fetch(url + upcomCode),
    ]


    )
    const [
      resultvn100,
      resultvn30,
      resulthose,
      resulthnx,
      resulthnx30,
      resultupcom
    ] = await Promise.all([
      responsevn100.json(),
      responsevn30.json(),
      responsehose.json(),
      responsehnx.json(),
      responsehnx30.json(),
      responseupcom.json()
    ]);
    // const resultvn30 = await responsevn30.json();
    // const resulthose = await responsehose.json();
    // const resulthnx = await responsehnx.json();
    // const resulthnx30 = await responsehnx30.json();
    // const resultupcom = await responseupcom.json();

    const arrvn100 = (resultvn100.Data as { [key: string]: number }[]).filter(d => d.TotalVolume > MIN_VOLUME)
    const arrvn30 = (resultvn30.Data as { [key: string]: number }[]).filter(d => d.TotalVolume > MIN_VOLUME)
    const arrvnhose = (resulthose.Data as { [key: string]: number }[]).filter(d => d.TotalVolume > MIN_VOLUME)
    const arrvnhnx = (resulthnx.Data as { [key: string]: number }[]).filter(d => d.TotalVolume > MIN_VOLUME)
    const arrvnhnx30 = (resulthnx30.Data as { [key: string]: number }[]).filter(d => d.TotalVolume > MIN_VOLUME)
    const arrvnupcom = (resultupcom.Data as { [key: string]: number }[]).filter(d => d.TotalVolume > MIN_VOLUME)

    var symbols = arrvn100.map(d => d.Symbol)
    let merge2 = arrvn100.concat(arrvn30.filter(d => !symbols.includes(d.Symbol)))

    symbols = merge2.map(d => d.Symbol)
    let merge3 = merge2.concat(arrvnhose.filter(d => !symbols.includes(d.Symbol)))

    symbols = merge3.map(d => d.Symbol)
    let merge4 = merge3.concat(arrvnhnx.filter(d => !symbols.includes(d.Symbol)))

    symbols = merge4.map(d => d.Symbol)
    let merge5 = merge4.concat(arrvnhnx30.filter(d => !symbols.includes(d.Symbol)))

    symbols = merge5.map(d => d.Symbol)
    let merge6 = merge5.concat(arrvnupcom.filter(d => !symbols.includes(d.Symbol)))


    console.log("arr length " + merge6.length)

    // console.log(merge6 )
    return merge6
  } catch (err) {
    throw err
  } finally {
  }

}