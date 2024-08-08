
"use server"
import { z } from 'zod';
import { getUserInfoFromSession } from './firebaseadmin/adminauth';
import { Prediction } from '../model/prediction';
import { getExpert, getMyWIPPreds, serverAddANewPred } from './server';
import { getRealTimeStockData } from './getStockData';
import { inTradingTime, priceStockInTime } from './utils';


// Add prediction

export type PredictionFormState = {
  errors?: {
    // assetType?: string[];
    assetName?: string[];
    priceIn?: string[];
    priceOut?: string[];
    cutLoss?: string[];
    dateIn?: string[];
    dateOut?: string[];
    portion?: string[];
    // note?: string[];
    logic?: string[]
  };
  // pred?: Prediction;
  message?: string | null;
  justDone?: boolean
};

const PredictionFormSchema = z.object({
  // assetType: z.string(),
  assetName: z.string(),
  priceOut: z.number(),
  cutLoss: z.number(),
  dateIn: z.date(),
  deadLine: z.date(),
  portion: z.number(),
  // note?:z.date().optional()
})


export async function createNewPrediction(assetName: string | undefined, selectedStockPrice: number | undefined, prevState: PredictionFormState, formData: FormData) {
  console.log("Prediction to be added : " + assetName + selectedStockPrice + JSON.stringify(formData))
  
  if (!selectedStockPrice || !assetName) {
    return {
      errors: {},
      message: "Khong tim thay thong tin gia hoac thong tin co phieu",
      // pred: result,
      justDone: false
    }
  }
  const validatedFields = PredictionFormSchema.safeParse({
    assetName: assetName,
    priceIn: selectedStockPrice,
    priceOut: Number(formData.get('takeProfitPrice')),
    cutLoss: Number(formData.get('cutLossPrice')),
    portion: Number(formData.get('portion')),
    dateIn: new Date(),
    deadLine: new Date(formData.get('deadLine') as string),
    // note: formData.get('note'),
  });



  console.log("Prediction to be added : portion " + formData.get('portion') + " assetName " +  assetName + '  selected stock price ' + selectedStockPrice  + formData.get('takeProfitPrice') + " ----" + formData.get('cutLossPrice') + Date() + formData.get('deadLine'))

  if (!validatedFields.success) {
    console.log("error: " + JSON.stringify(validatedFields.error.flatten()))
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Hãy điền đầy đủ thông tin',
      justDone: false
    };
  }

  const stockPrice = await getRealTimeStockData([assetName])
  const curPrice = priceStockInTime(stockPrice[assetName], 'favorHigh' , Date.now()) 
  const gap = curPrice - selectedStockPrice

  if (gap > 0.5 || gap < -0.5) {
    return {
      errors: {},
      message: "Giá cổ phiếu đã thay đổi quá 500đ so với lúc bạn điền thông tin, hãy refresh và thử lại " + curPrice + "----" + selectedStockPrice,
      // pred: result,
      justDone: false
    }
  }

  const toDay = new Date()
  const priceIn = selectedStockPrice
  const priceOut = Number(formData.get('takeProfitPrice'))
  const cutLoss = Number(formData.get('cutLossPrice'))
  const deadLine = new Date(formData.get('deadLine') as string)
  const portion = Number(formData.get('portion'))

  let message = ""

  if (selectedStockPrice * 0.8 < cutLoss) {
    return {
      errors: {},
      message: "Giá cắt lỗ quá tiệm cận giá mua vào, chỉ có thể cắt lỗ khi qúa -20%",
      // pred: result,
      justDone: false
    }
  }

  if (selectedStockPrice * 1.2 > priceOut) {
    return {
      errors: {},
      message: "Giá chốt lời quá tiệm cận giá mua vào, chỉ có thể chốt lời ít nhất 20%",
      // pred: result,
      justDone: false
    }
  }

  const wipPreds = await getMyWIPPreds()
  const totalUsedPortion = wipPreds.map((item) => { return item.portion}).reduce((a, b) => a + b, 0) 

  if (totalUsedPortion + portion > 100 ) {
    return {
      errors: {},
      message: "Tỷ trọng khuyến nghị quá cao, tối đa " + (100 - totalUsedPortion),
      // pred: result,
      justDone: false
    }

  }


  
  // const uid = formData.get('uid') as string
  // console.log("uid " + uid);
  // if (uid) {

  const userInfo = await getUserInfoFromSession()
  if (userInfo && userInfo.authenticated && userInfo.uid) {
    if (!(userInfo.isExpert && userInfo.isExpert == true)) {
      console.log("not expert")
      return {
        errors: {
          logic: ['Ban khong phai chuyen gia' + userInfo.uid]
        },
        justDone: false
      }
    } else {
      console.log('this is expert' + JSON.stringify(userInfo))
    }
  } else {
    console.log("not user ")
    return {
      errors: {
        logic: ['Not sign in']
      },
      justDone: false
    }
  }

  const expertInfo = await getExpert(userInfo.uid)
  if (!expertInfo) {
    return {
      errors: {
        logic: ['Expert not found']
      },
      justDone: false
    }

  }
  // const assetName = formData.get('assetName') as string


  if (!priceIn) {
    return {
      errors: {},
      message: "Not found price In",
      // pred: result,
      justDone: false
    }
  }

  const pred: Prediction = {
    assetName: assetName,
    dateIn: Date.now(),
    priceIn: priceIn,
    priceOut: priceOut,
    cutLoss: cutLoss,
    deadLine: deadLine.getTime(),
    status: "Inprogress",
    note: '',
    portion: portion,
    ownerId: userInfo.uid
  }

  console.log('prediction : ' + JSON.stringify(pred))

  const  result = await serverAddANewPred(pred, expertInfo)
  
  if (result) {
    return {
      errors: {},
      message: "Tạo khuyến nghị " + assetName + " thành công",
      // pred: result,
      justDone: true
    }
  } else {
    return {
      errors: {},
      message: "Có lỗi khi tạo khuyến nghị ",
      // pred: result,
      justDone: false
    }
  }
 
}