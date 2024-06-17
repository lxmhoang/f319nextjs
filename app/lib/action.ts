
"use server"
// khong dung firebase client o day vi nhu the request.auth se bi null
import { z } from 'zod';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addANewTransaction, serverAddNewModal, serverGetModal, serverQueryCollection, serverSetDoc, serverUpdateDoc } from './firebaseadmin/adminfirestore';
import { storage } from './firebase/firebase';
import { getUserInfoFromSession, getthuquyUID, setClaim } from './firebaseadmin/adminauth';
import { User, userAdminConverter } from '../model/user';
import { tranAdminConverter, Transaction, TranType } from '../model/transaction';
import { Prediction, predAdminConverter } from '../model/prediction';
import { revalidatePath } from 'next/cache';



// const TransactionFormSchema = z.object({
//   amount: z.number(),
//   notebankacc: z.string().optional(),
// })

// export type AddNewTransFormState = {
//   errors?: {
//     amount?: string[];
//     date?: string[];
//     note?: string[];
//     notebankacc?: string[],
//     logic?: string[]
//   };
//   tran?: Transaction;
//   message?: string | null;
//   justDone?: boolean
// };

// export async function createWithDrawTransaction(prevState: AddNewTransFormState, formData: FormData) {
//   console.log("transaction to be added : ")
//   const validatedFields = TransactionFormSchema.safeParse({
//     amount: Number(formData.get('amount')),
//     notebankacc: formData.get('notebankacc') as string
//   });

//   console.log("transaction to be added : " + formData.get('amount') + " notebank acc  " + formData.get('notebankacc'))
//   if (!validatedFields.success) {
//     console.log("error: " + JSON.stringify(validatedFields.error.flatten()))
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Hãy điền đầy đủ thông tin',
//       justDone: false
//     };
//   }

//   const notebankacc = formData.get('notebankacc') as string

//   // must be perform with authed user
//   const userInfo = await getUserInfoFromSession()
//   if (!userInfo.authenticated || !userInfo.uid) {
//     return {
//       errors: [],
//       message: 'User not found',
//       justDone: false
//     };
//   }

//   const thuquyid = await getthuquyUID()

//   if (!thuquyid) {
//     return {
//       errors: [],
//       message: 'Thu quy not found',
//       justDone: false
//     };
//   }

//   // const toUid = process.env.THUQUY_UID ?? "thuquy"

//   const tran: Transaction = {
//     tranType: TranType.withDraw,
//     toUid: thuquyid,
//     fromUid: userInfo.uid,
//     amount: Number(formData.get('amount')),
//     date: new Date(),
//     notebankacc: notebankacc,
//     status: "pending"
//   }

//   console.log("transaction to be added : " + JSON.stringify(tran))

//   const userData = await serverGetModal<User>('user/' + userInfo.uid, userAdminConverter)
//   if (!userData) {
//     console.log('sth wrong with uid')

//     return {
//       errors: {

//       },
//       message: 'Can not verify amount ',
//       justDone: false
//     }
//   }
//   if (tran.amount > userData.amount) {
//     console.log('amount withDraw is > user current amount')
//     return {
//       errors: {
//         anmount: [""],
//         notebankacc: [""],
//         logic: ['amount withDraw is > user current amount']
//       },
//       message: 'amount withDraw is > user current amount',
//       justDone: false
//     }

//   }



//   const result = await addANewTransaction(tran)
//   if (result.success) {

//     console.log("transaction has been added with ref " + result.message)
//     return {
//       errors: {},
//       message: JSON.stringify(result),
//       tran: tran,
//       justDone: true
//     }
//   } else {
//     console.log("transaction FAILED TO added")
//     return {
//       errors: {},
//       message: 'failed to add transaction',
//       justDone: false
//     }
//   }
// }

// Search User

const SearchUserForPaymentFormSchema = z.object({
  accessId: z.string({
    invalid_type_error: ' payment Id phai la chuoi'
  })

})


const SearchUser = SearchUserForPaymentFormSchema



export type SearchUseFormState = {
  errors?: {
    [key: string]: string[]
  };
  user?: string;
  message?: string | null;
};

export async function searchUserForPayment(prevState: SearchUseFormState, formData: FormData) {
  const accessId = formData.get('accessId')
  const validatedFields = SearchUser.safeParse({
    accessId: formData.get('accessId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Hãy điền đầy đủ thông tin',
    };
  }

  const searchResult = await serverQueryCollection<User>("user", [{ key: "accessId", operator: "==", value: accessId as string }], userAdminConverter)

  if (searchResult && searchResult.length == 1) {
    return {
      message: "Good ",
      user: JSON.stringify(searchResult[0])
    }
  } else if (!searchResult || searchResult.length == 0) {
    return {
      errors: {
        general: ["No user found"]
      },
      message: "No user found"
    }

  } else {
    return {
      errors: {
        general: ["too many user found"]
      },
      message: "too many user found"
    }

  }

}


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
  priceIn: z.number(),
  priceOut: z.number(),
  cutLoss: z.number(),
  dateIn: z.date(),
  deadLine: z.date(),
  portion: z.number(),
  // note?:z.date().optional()
})


export async function createNewPrediction(selectedStockPrice : number | undefined,prevState: PredictionFormState, formData: FormData) {
  console.log("Prediction to be added : ")
  const validatedFields = PredictionFormSchema.safeParse({
    assetName: formData.get('assetName') as string,
    priceIn: Number(formData.get('priceIn')),
    priceOut: Number(formData.get('takeProfitPrice')),
    cutLoss: Number(formData.get('cutLossPrice')),
    portion: Number(formData.get('portion')),
    dateIn: new Date(),
    deadLine: new Date(formData.get('deadLine') as string),
    // note: formData.get('note'),
  });

  console.log("Prediction to be added : portion " + formData.get('portion') + " assetName " + formData.get('assetName') + formData.get('priceIn') + formData.get('takeProfitPrice') + " ----" + formData.get('cutLossPrice') + Date() + formData.get('deadLine'))
  if (!validatedFields.success) {
    console.log("error: " + JSON.stringify(validatedFields.error.flatten()))
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Hãy điền đầy đủ thông tin',
      justDone: false
    };
  }
  // const uid = formData.get('uid') as string
  // console.log("uid " + uid);
  // if (uid) {

  const userInfo = await getUserInfoFromSession()
  if (userInfo && userInfo.authenticated && userInfo.uid) {
    // const userInfo = await serverGetModal<User>('user/' + uid, userAdminConverter)
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
  const assetName = formData.get('assetName') as string
  const dateIn = new Date()
  const deadLine = new Date(formData.get('deadLine') as string)
  const priceIn = formData.get('priceIn') ? Number(formData.get('priceIn')) :  selectedStockPrice
  const priceOut = Number(formData.get('takeProfitPrice'))
  const cutLoss = Number(formData.get('cutLossPrice'))
  const portion = Number(formData.get('portion'))

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
    dateIn: dateIn,
    priceIn: priceIn,
    priceOut: priceOut,
    cutLoss: cutLoss,
    deadLine: deadLine,
    status: "Inprogress",
    note: '',
    portion: portion,
    ownerId: userInfo.uid
  }

  console.log('prediction : ' + JSON.stringify(pred))


  const result = await serverAddNewModal<Prediction>('expert/' + userInfo.uid + '/preds', pred, predAdminConverter)
  if (result) {
    console.log("prediction has been added : " + JSON.stringify(result))
    if (userInfo.expertType == 'rank') {
      const resultForRank = await serverSetDoc('rankPred/' + result.id , predAdminConverter.toFirestore(pred))
      console.log("prediction from Rank Expert has been added : " + JSON.stringify(resultForRank))
    }
    // redirect("/admin")
    return {
      errors: {},
      message: "",
      // pred: result,
      justDone: true
    }
  } else {
    console.log("transaction FAILED TO added")
    return {
      errors: {},
      message: 'failed to add transaction',
      justDone: false
    }
  }
}