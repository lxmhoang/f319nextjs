import { Expert } from "../model/expert";
import { Prediction } from "../model/prediction";
import { TranType } from "../model/transaction";
import { User } from "../model/user";
import { getTodayMatchedVolume } from "./getStockData";

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
      item.eid == expert.id) && (item.endDate >= new Date() || item.perm == true)
  })
  console.log('follow Info ' + JSON.stringify(followInfo))
  if (!followInfo) {
    return false
  }
  const today = new Date()
  const endDate = followInfo.endDate
  return (followInfo.perm == true || followInfo.endDate >= new Date())


}

export function perfConver(per: number) {
  const prefix = per > 1 ? "+" : per == 1 ? "" : "-"
  const color = per > 1 ? "text-sky-400" : per == 1 ? "text-white" : "text-red-400"
  const distant = per > 1 ? per - 1 : 1 - per
  // console.log('number ' + per + '  color  ' + color)
  const str = prefix + (distant * 100).toFixed(2) + "%"
  return {
    color: color,
    info: str
  }
}

export async function getPerformanceSince(date: Date, data: Prediction[]) {

  console.log('getPerformanceSince')
  let openPreds = data.filter((item) => {
    return item.status == "Inprogress" && item.dateIn >= date
  })
  let closedPreds = data.filter((item) => {
    return item.status != "Inprogress" && item.dateIn >= date
  })

  var perform = 1
  var message: string[] = []

  message.push('start checking pred since  : ' + date.toLocaleString('vi'))
  message.push('  Check Open Preds  .. ')

  for (const pred of openPreds) {

    message.push('pred id : ' + pred.id ?? "")
    const matchedPriceToday = await getTodayMatchedVolume(pred.assetName)
    message.push(' asset ' + pred.assetName + ' priceIn: ' + pred.priceIn + ' priceOut = ' + pred.priceOut + ' cutloss ' + pred.cutLoss + ' deadline ' + pred.deadLine.toLocaleString('vi') + ' portion ' + pred.portion + '% . \n MatchedPriceToday :  ' + matchedPriceToday.toString())

    const max = Math.max.apply(Math, matchedPriceToday)
    const min = Math.min.apply(Math, matchedPriceToday)
    message.push('  max : ' + max + '  min:  ' + min + '  date :  ' + (new Date()).toLocaleString('vi') + '\n')

    const toDayValue = true ? min : max
    const curPerform = true ? toDayValue / pred.priceIn : pred.priceIn / toDayValue
    const curProfit = (curPerform - 1) * pred.portion / 100 + 1
    message.push('incremental ratio of this pred ===== ' + ((curPerform - 1) * 100).toFixed(2) + '%  profit ' + + ((curProfit - 1) * 100).toFixed(2) + '% \n\n')
    perform = perform * curProfit
  }


  message.push(' Checking Closed Preds  ... ')
  for (const pred of closedPreds) {
    if (pred.priceRelease) {
      const ratio = pred.priceRelease / pred.priceIn
      const predPerform = true ? ratio : 1 / ratio
      const profit = (predPerform - 1) * pred.portion / 100 + 1
      message.push('  Perform of close Pred ' + pred.id + ' datein : ' + pred.dateIn.toLocaleDateString('vi') + ' ===== ' + predPerform + '  profit ' + profit + '\n')
      perform = perform * profit
    }
  }

  return {
    performance: perform,
    message: message
  }
}

import imageCompression from "browser-image-compression";
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
      return 1;
    }

    if (n1[field] < n2[field]) {
      return -1;
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