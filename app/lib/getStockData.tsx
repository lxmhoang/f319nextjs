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

export async function getRealTimeStockData(stocks: string[]) {
  try {
    const param = stocks
    console.log("params " + param)
    const data = await fetch(urlRealTime + param)
    const result = await data.json()
    let object : {[key: string] : number} = {}
    result.map((d: { a: string, v: number }) => {
      const key = d.a as string
      const value = d.v // hight, d.w is low
      object[key] = value
    })

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

  const string = await fs.readFile(process.cwd() + '/public/stockList.json', 'utf-8')
  const array =  string.split(',')
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