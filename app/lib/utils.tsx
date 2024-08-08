import { List } from "flowbite-react";
import { Expert } from "../model/expert";
import { Prediction } from "../model/prediction";
import { TranType } from "../model/transaction";
import { User } from "../model/user";
import { getTodayMatchedVolume } from "./getStockData";

import clsx from 'clsx';

export function convert(num: number) {
  let formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(num)
}

export function addComma(num: number) {

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function didFollow(user: User, expert: Expert) {

  if (!user || !user.following) {
    return false
  }

  if (expert.expertType == 'rank') {
    return user.joinRank

  }

  const followInfo = user.following.find((item) => {
    return (
      item.eid == expert.id) && (new Date(item.endDate) >= new Date() || item.perm == true)
  })
  // console.log('follow Info ' + JSON.stringify(user.following))
  if (!followInfo) {
    return false
  }
  const today = new Date()
  const endDate = followInfo.endDate
  return (followInfo.perm == true || new Date(followInfo.endDate) >= new Date())


}

export function valueWithBonus(value: number, bonuses: BonusData[] | undefined) {
  if (!bonuses || bonuses.length == 0) {
    return value
  }
  var result = value

  // console.log('==== BONUS ==== ' + JSON.stringify(bonuses))
  for (const bonus of bonuses) {
    if (bonus.RateTypeID == 2) {
      const rate = bonus.Rate
      if (rate.split(':').length != 2) {
        throw new Error('rate is in wrong format ' + rate)
      }
      // console.log('==== rate ==== ' + JSON.stringify(rate))

      const arg1 = Number(rate.split(':')[0])
      const arg2 = Number(rate.split(':')[1])
      const mutiple = 1 + Number(arg2 / arg1)
      result = result * mutiple

      // console.log('==== result ==== ' + value + '  ' + arg1 + '  ' + arg2 + '  ' + result)
    } else if (bonus.RateTypeID == 1) {
      const percentage = Number(bonus.Rate)
      const addInValue = 10000 * percentage / 100

      result = result + addInValue / 1000
    }
  }

  return result


}

export function perfConver(per: number) {
  const prefix = per > 1 ? "+" : per == 1 ? "" : "-"
  const color = per > 1 ? "text-sky-400" : per == 1 ? "dark:text-white text-gray-500" : "text-red-400"
  const distant = per > 1 ? per - 1 : 1 - per
  // console.log('number ' + per + '  color  ' + color)
  const str = prefix + (distant * 100).toFixed(2) + "%"
  return {
    color: color,
    info: str
  }
}

export function possibleBonusTimeRangeWithPredInfo(buyDate: Date, sellDate: Date) {


  var addDate = 2
  // const buyDay = buyDate.getDay()
  // switch (buyDay) {
  //   case 0 : 
  //   case 1 : 
  //   case 2 : 
  //   case 3 : 
  //   case 4 : // thu nam
  //   addDate = 2
  //   break;
  //   case 5 : // thu sau
  //   addDate = 4
  //   break;
  //   case 6 : 
  //   addDate = 3
  //   break;
  // }  
  const possibleGDKHQTimeStart = new Date(buyDate.getTime() + addDate * 1000 * 3600 * 24)

  // console.log('buyyyy day   ====  ' + buyDate + ' possibleGDKHQTime start ' + possibleGDKHQTimeStart)

  const sellDay = sellDate.getDay()
  var subtractDate = 2
  switch (sellDay) {
    case 0:
      subtractDate = 3
      break;
    case 1:
      subtractDate = 4
      break;
    case 2: // thu 3
      subtractDate = 5
      break;
    case 3: // thu 4
    case 4: // thu nam
    case 5: // thu sau
    case 6: // thu 7
      subtractDate = 2
      break;
  }

  const possibleGDKHQTimeEnd = new Date(sellDate.getTime() - subtractDate * 1000 * 3600 * 24)

  possibleGDKHQTimeStart.setUTCHours(-7, 0, 0, 0)
  possibleGDKHQTimeEnd.setUTCHours(-7, 0, 0, 0)

  // console.log('buyyyy day   ====  ' + buyDate + ' possibleGDKHQTime start ' + possibleGDKHQTimeStart)
  // console.log('sell day   ====  ' + sellDate + ' possibleGDKHQTime End ' + possibleGDKHQTimeEnd)



  return { possibleGDKHQTimeStart, possibleGDKHQTimeEnd }

}

export async function getPerformanceSince(date: Date, data: Prediction[]) {

  let openPreds = data.filter((item) => {
    return item.status == "Inprogress" && item.dateIn >= date.getTime()
  })
  let closedPreds = data.filter((item) => {
    // console.log('pred date in ====== ' + new Date(item.dateIn).toLocaleDateString('vi'))
    return item.status != "Inprogress" && item.dateIn >= date.getTime()
  })

  var perform = 1
  var message: string[] = []

  message.push('start checking pred since  : ' + date.toLocaleString('vi'))
  message.push('  Check Open Preds  .. ')

  for (const pred of openPreds) {

    message.push('pred id : ' + pred.id ?? "")
    const matchedPriceToday = await getTodayMatchedVolume(pred.assetName)
    message.push(' asset ' + pred.assetName + ' priceIn: ' + pred.priceIn + ' priceOut = ' + pred.priceOut + ' cutloss ' + pred.cutLoss + ' deadline ' + pred.deadLine.toLocaleString('vi') + ' portion ' + pred.portion + '% . \n MatchedPriceToday :  ' + matchedPriceToday.toString())

    if (matchedPriceToday.length == 0) {
      continue;
    }
    const max = Math.max.apply(Math, matchedPriceToday)
    const min = Math.min.apply(Math, matchedPriceToday)
    message.push('  max : ' + max + '  min:  ' + min + '  date :  ' + (new Date()).toLocaleString('vi') + '\n')

    const toDayValue = true ? min : max
    const actualValue = valueWithBonus(toDayValue, pred.bonus)
    const curPerform = true ? actualValue / pred.priceIn : pred.priceIn / actualValue
    const curProfit = (curPerform - 1) * pred.portion / 100 + 1
    message.push('incremental ratio of this pred ===== ' + ((curPerform - 1) * 100).toFixed(2) + '%  profit ' + + ((curProfit - 1) * 100).toFixed(2) + '% \n\n')
    perform = perform * curProfit
  }


  message.push(' Checking Closed Preds  ... ')
  for (const pred of closedPreds) {
    if (pred.priceRelease) {
      const actualPrice = valueWithBonus(pred.priceRelease, pred.bonus ?? [])
      const ratio = actualPrice / pred.priceIn
      const predPerform = true ? ratio : 1 / ratio
      const profit = (predPerform - 1) * pred.portion / 100 + 1
      message.push('  Perform of close Pred ' + pred.id + ' datein : ' + new Date(pred.dateIn).toLocaleDateString('vi') + ' ===== ' + predPerform + '  profit ' + profit + '\n')
      perform = perform * profit
    }
  }

  return {
    performance: perform,
    message: message
  }
}

import imageCompression from "browser-image-compression";

import { DateTime } from "luxon";
const defaultOptions = {
  maxSizeMB: 1,
};

export async function compressFile(imageFile: File, options = defaultOptions) {

  console.log('size before ' + imageFile.size)
  const newFile = await imageCompression(imageFile, options);
  console.log('size after ' + newFile.size)
  return newFile
}

export function sortByField<T, Key extends keyof T>(data: T[], field: Key) {

  return data.toSorted((n1, n2) => {
    if (n1[field] > n2[field]) {
      return -1;
    }

    if (n1[field] < n2[field]) {
      return 1;
    }
    return 0;
  })
}

export function contentOf(arrayStr: string[], joinBy: string = '\n \n') {
  return arrayStr.reduce((a, b) => { return a + joinBy + b })
}

export const datesGreaterThan = (first: Date, second: Date) => {
  first.setUTCHours(0, 0, 0, 0) > second.setUTCHours(0, 0, 0, 0)
  return first > second
}

export function arrayFromData<Type>(data: any, converter?: (data: any) => Type) {

  // console.log('data ' + JSON.stringify(data))
  if (!data) {
    return []
  }
  let array: Type[] = []
  Object.keys(data).forEach((key: string) => {
    const childData = data[key]
    childData.id = key
    const val = converter ? converter(childData) : childData as Type

    array.push(val)

  });

  return array

}

interface IDwise {
  id?: string;
}

export function inTradingTime(time: number) {
  const date = DateTime.fromMillis(time).setZone('Asia/Ho_Chi_Minh')
  const day = date.weekday
  if (day == 7 || day == 6) {
    return false
  }

  if (date.hour < 9 || date.hour >= 15) {
    return false
  }

  return true

}


export function priceStockInTime(price: StockPriceRT, favor: 'favorHigh' | 'favorLow', time: number = Date.now()) {

  const dongcuahoacthamchieu = price.close == 0 ? price.tc : price.close

  // const test =   moment.tz("Asia/Ho_Chi_Minh").format()
  if (price.high == 0 && price.low == 0) {
    // ngay truoc phien, tra ve gia tham chieu hoac gia dong cua
    return dongcuahoacthamchieu
  }
  if (inTradingTime(time)) {
    if (favor == 'favorHigh') {
      return price.high == 0 ? dongcuahoacthamchieu : price.high
      // if (price.high == 0) { return dongcuahoacthamchieu }
    } else {
      return price.low == 0 ? dongcuahoacthamchieu : price.low
      // if (price.low == 0) { return dongcuahoacthamchieu }
    }
  } else {
    return dongcuahoacthamchieu
  }


}

export type StockPriceRT = {
  code: string,
  name: string,
  high: number;
  low: number;
  tc: number;
  open: number;
  close: number;
  preClosed: number;
}

export function dataFromArray<Type extends IDwise>(array: Type[]) {

  let data: any = {}
  for (const e of array) {
    if (e.id) {
      const subE: Omit<Type, 'id'> = e
      data[e.id] = subE
    }
  }

  return data

}
