
"use server"
// khong dung firebase client o day vi nhu the request.auth se bi null
import { z } from 'zod';
import { ref, uploadBytes } from "firebase/storage";
import { addANewTransaction, serverAddNewModal, serverGetModal, serverQueryCollection, serverSetDoc, serverUpdateDoc } from './firebaseadmin/adminfirestore';
import { getFirestore } from 'firebase-admin/firestore';
import { storage } from './firebase/firebase';
import { getCurrentUser } from './firebaseadmin/adminauth';
import { User, userAdminConverter } from '../model/user';
import { Expert, ExpertStatus } from '../model/expert';
import { Transaction } from '../model/transaction';
import { Prediction, predAdminConverter } from '../model/prediction';
import { revalidatePath } from 'next/cache';
import { compressFile } from './utils';



// const storageRef = ref(storage, '/eeechild');

// Expert Creation
const ExpertFormSchema = z.object({
  name: z.string({
    invalid_type_error: 'wrong type of name field'
  }),
  monthlyPrice: z.number(),
  permPrice: z.number(),
  shortIntro: z.string({
    invalid_type_error: 'Chọn 1 cái shortIntro'
  }),
  // subscriptionPrice: z.enum(['1mil', '2mil'], {
  //   invalid_type_error: 'Chọn 1 cái giá nào',
  // }),
  // date: z.string(),
})

const RegisterExpert = ExpertFormSchema;

export type RegisterExpertFormState = {
  errors?: {
    name?: string[]
    monthlyPrice?: string[]
    permPrice?: string[]
    shortIntro?: string[];
    generic?: string[]
  };
  message?: string | null;
  justDone?: boolean
};

export async function editExpert(fileWrapper: FormData | undefined,_prevState: RegisterExpertFormState, formData: FormData) {

  const curUser = await getCurrentUser()
  if (!curUser) {
    return {
      errors: {
        uid: ["uid khong ton tai"],
        name: [""],
        // subscriptionPrice: [""],
        shortIntro: [""]
      },
      message: 'Không tìm thấy user',
      justDone: false
    };
  }

  console.log("uid for expert register : " + curUser?.uid)
  const uid = curUser.uid
  const newName = formData.get('name')
  const newshortIntro = formData.get('shortIntro')
  const newmonthlyPrice =  Number(formData.get('monthlyPrice'))
  const newPermPrice = Number(formData.get('permPrice'))
  const validatedFields = RegisterExpert.safeParse({
    name: formData.get('name'),
    shortIntro: formData.get('shortIntro'),
    monthlyPrice: Number(formData.get('monthlyPrice')),
    permPrice: Number(formData.get('permPrice')),
    // subscriptionPrice: formData.get('subscriptionPrice'),
    // avatar: formData.get('avatar'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      justDone: false
    };
  }

  // if (newName != curExpert.name || newshortIntro != curExpert.shortIntro || newmonthlyPrice != curExpert.monthPerform || newPermPrice || curExpert.permPrice) {

    await serverUpdateDoc('expert/' + uid, {
      name: formData.get('name'),
      shortIntro: formData.get('shortIntro'),
      monthlyPrice: formData.get('monthlyPrice'),
      permPrice: formData.get('permPrice'),
    })
  // } else {
  //   console.log('no new info to update')
  // }
  // const avatar = formData.get('avatar') as File

  // console.log('attached info ===================== type ' + attached.type + '   size   ' + attached.size)

  if (fileWrapper) {
    
    const attached = fileWrapper.get('avatar') as File
    
    console.log('attached info ===================== type ' + attached.type + '   size   ' + attached.size)

    // console.log('aaaa has file ===================== type ' + attached.type + '   size   ' + attached.size)
    const storageRef = ref(storage, '/expertAvatar/' + uid)
    const snapshot = await uploadBytes(storageRef, attached)
    console.log('Uploaded a blob or file! with ref : ' + snapshot.ref.toString() + " pah " +
      snapshot.ref.fullPath);
    await serverUpdateDoc('/expert/' + uid, { avatar: snapshot.ref.fullPath })
    console.log("successful update avatar ref to expert data, begin to return ")

    revalidatePath('/advisor/edit');
    return {
      errors: {},
      message: "Đã sửa xong",
      justDone: true
    };
  } else {
    console.log('aaaa NO file =====================')
    console.log('done, no upload file')
    revalidatePath('/advisor/edit');
    // redirect('/profile');
    return {
      message: 'Đã sửa xong',
      errors: {},
      justDone: true
    };
  }


}

export async function registerExpert(_prevState: RegisterExpertFormState, formData: FormData) {

  const curUser = await getCurrentUser()

  // console.log("client auth current user" + JSON.stringify(auth))
  // console.log("uid for expert register : " + curUser?.uid)

  // const cookieStore = cookies()
  // const token = cookieStore.get('firebaseIdToken')
  // console.log("token " + token)

  // const uid = getUidFromIdToken(token?.value ?? "")
  // console.log('token get : ' + JSON.stringify(token))
  if (!curUser) {
    return {
      errors: {
        uid: ["uid khong ton tai"],
        name: [""],
        // subscriptionPrice: [""],
        shortIntro: [""]
      },
      message: 'Không tìm thấy user',
      justDone: false
    };
  }

  console.log("uid for expert register : " + curUser?.uid)
  const uid = curUser.uid
  const validatedFields = RegisterExpert.safeParse({
    name: formData.get('name'),
    shortIntro: formData.get('shortIntro'),
    monthlyPrice: Number(formData.get('monthlyPrice')),
    permPrice: Number(formData.get('permPrice')),
    // subscriptionPrice: formData.get('subscriptionPrice'),
    avatar: formData.get('avatar'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      justDone: false
    };
  }
  const monthlyPrice = Number(formData.get('monthlyPrice'))
  const permPrice = Number(formData.get('permPrice'))
  const fee = monthlyPrice * 5 + permPrice
  console.log('000' + uid)
  getFirestore
  const userInfo = await serverGetModal<User>('user/' + uid, userAdminConverter)// getAUserByIDBE(uid) // shit
  console.log('dfff')
  if (!(monthlyPrice && permPrice && userInfo?.amount && userInfo.amount >= fee)) {
    return {
      errors: {
        generic: ["khong du tien"]
      },
      message: 'khong du tien, so tien cua ban chi co ' + userInfo?.amount + ' trong khi phi  dang ky la ' + fee,
      justDone: false
    };
    // ok
  }

  const remain = userInfo.amount - fee

  console.log('111')
  await serverUpdateDoc('user/' + uid, { amount: remain })
  // await updateUser(uid, {amount:remain})



  console.log('aaa')
  // const docRef = doc(db, 'expert/' + uid)
  // const docRef = await  dbAdmin.collection('expert').doc(uid).set({
  //     name: formData.get('name'),
  //     shortIntro: formData.get('shortIntro'),
  //     monthlyPrice: formData.get('monthlyPrice'),
  //     permPrice: formData.get('permPrice'),
  //     // subscriptionPrice: formData.get('subscriptionPrice'),
  //     status: ExpertStatus.activated,
  //     created: new Date(),
  //     visible: true
  //   })

  await serverSetDoc('expert/' + uid, {
    name: formData.get('name'),
    shortIntro: formData.get('shortIntro'),
    monthlyPrice: formData.get('monthlyPrice'),
    permPrice: formData.get('permPrice'),
    // subscriptionPrice: formData.get('subscriptionPrice'),
    status: ExpertStatus.activated,
    created: new Date(),
    visible: true
  })

  console.log('done add new expert' + uid)
  const file = formData.get('avatar') as File
  if (file) {
    const storageRef = ref(storage, '/expertAvatar/' + uid)
    const snapshot = await uploadBytes(storageRef, file)
    console.log('Uploaded a blob or file! with ref : ' + snapshot.ref.toString() + " pah " +
      snapshot.ref.fullPath);
    await serverUpdateDoc('/expert/' + uid, { avatar: snapshot.ref.fullPath })
    // await updateDoc(docRef, { avatar: snapshot.ref.fullPath })
    console.log("successful update avatar ref to expert data, begin to return ")
    // revalidatePath('/profile');
    // redirect('/profile');
    return {
      errors: {},
      message: "Bạn bây giờ đã là chuyên gia",
      justDone: true
    };


  } else {
    console.log('done, no upload file')
    // revalidatePath('/profile');
    // redirect('/profile');
    return {
      message: 'Bạn bây giờ đã là chuyên gia',
      errors: {},
      justDone: true
    };
  }



}

// Transaction Creataion

const TransactionFormSchema = z.object({
  tranType: z.string(),
  toUid: z.string().nullable(),
  fromUid: z.string().nullable(),
  amount: z.number(),
  notebankacc: z.string().optional(),
  note: z.string({
    invalid_type_error: 'Chọn 1 cái note'
  }).optional()
}).refine(input => {

  console.log("refine")
  if (input.tranType == 'p2p') {
    if (input.toUid == undefined || input.fromUid == undefined) {
      return false
    }
  } else
    if (input.tranType == 'deposit') {
      if (input.toUid == undefined || input.fromUid != undefined) {
        console.log("refine to Uid" + input.toUid)
        console.log("refine to fromUid" + input.fromUid)
        return false
      }
    } else
      if (input.tranType == 'withDraw') {
        if (input.notebankacc == undefined || input.notebankacc.length < 10) {
          return false
        }
        if (input.toUid != undefined || input.fromUid == undefined) {
          return false
        }
      } else {
        return false
      }
  return true
})

export type AddNewTransFormState = {
  errors?: {
    toUid?: string[];
    fromUid?: string[];
    amount?: string[];
    date?: string[];
    note?: string[];
    tranType?: string[];
    notebankacc?: string[],
    logic?: string[]
  };
  tran?: Transaction;
  message?: string | null;
  justDone?: boolean
};

export async function createNewTransaction(prevState: AddNewTransFormState, formData: FormData) {
  console.log("transaction to be added : ")
  const validatedFields = TransactionFormSchema.safeParse({
    toUid: formData.get('toUid') as string,
    tranType: formData.get('tranType'),
    amount: Number(formData.get('amount')),
    // toUid: formData.get('toUid'),
    fromUid: formData.get('fromUid') as string,
    notebankacc: formData.get('notebankacc') as string
  });

  console.log("transaction to be added : " + formData.get('tranType') + formData.get('amount') + formData.get('fromUid') + " ----" + formData.get('toUid') + " notebank acc  " + formData.get('notebankacc'))
  if (!validatedFields.success) {
    console.log("error: " + JSON.stringify(validatedFields.error.flatten()))
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Hãy điền đầy đủ thông tin',
      justDone: false
    };
  }
  console.log("transaction to be added : ")
  const thuquy = await getCurrentUser()
  if (!thuquy) {

    console.log("failed to get thu quy ")
    return {
      errors: [],
      message: 'khong tim thay thu quy',
      justDone: false
    };
  }

  const tranType = formData.get('tranType') as string
  const notebankacc = formData.get('notebankacc') as string
  const toUid = tranType == 'withDraw' ? process.env.THUQUY_UID : formData.get('toUid') as string
  const fromUid = tranType == 'deposit' ? process.env.THUQUY_UID ?? "unknown" : formData.get('fromUid') as string

  const tran: Transaction = {
    tranType: formData.get('tranType') as string,
    toUid: toUid ?? "",
    fromUid: fromUid ?? "",
    amount: Number(formData.get('amount')),
    date: new Date(),
    notebankacc: notebankacc,
    status: tranType == 'deposit' ? "adminCreated" : "pending"
  }

  console.log("transaction to be added : " + JSON.stringify(tran))

  if (tranType == 'withDraw') {
    const result = await serverQueryCollection<User>('user', [{ key: 'uid', operator: '==', value: fromUid }], userAdminConverter)
    if (result.length != 1) {
      console.log('sth wrong with uid, number of user found :')

      return {
        errors: {
          anmount: [""],
          notebankacc: [""],

          logic: ["sth wrong with uid, number of user found :" + result.length.toString()]
        },
        message: 'sth wrong with uid, number of user found :  ' + result.length.toString(),
        justDone: false
      }
    }
    if (tran.amount > result[0].amount) {
      console.log('amount withDraw is > user current amount')
      return {
        errors: {
          anmount: [""],
          notebankacc: [""],
          logic: ['amount withDraw is > user current amount']
        },
        message: 'amount withDraw is > user current amount',
        justDone: false
      }

    }
  }


  const result = await addANewTransaction(tran)
  if (result.success) {

    console.log("transaction has been added with ref " + result.message)
    return {
      errors: {},
      message: JSON.stringify(result),
      tran: tran,
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
  console.log(JSON.stringify(accessId))
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


export async function createNewPrediction(prevState: PredictionFormState, formData: FormData) {
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

  const curUser = await getCurrentUser()
  const uid = curUser?.uid
  // console.log("uid pass with formData" + uid)
  // console.log("client auth current user" + JSON.stringify(auth.currentUser))
  if (uid) {
    // const customClaims = await getCurrentUser()
    // const isExpert = customClaims.isExpert
    const userInfo = await serverGetModal<User>('user/' + uid, userAdminConverter)
    if (!userInfo || !userInfo.isExpert) {
      console.log("not expert")
      return {
        errors: {
          logic: ['Ban khong phai chuyen gia' + uid]
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
  const priceIn = Number(formData.get('priceIn'))
  const priceOut = Number(formData.get('takeProfitPrice'))
  const cutLoss = Number(formData.get('cutLossPrice'))
  const portion = Number(formData.get('portion'))

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
    ownerId: uid
  }

  console.log('prediction : ' + JSON.stringify(pred))


  const result = await serverAddNewModal<Prediction>('expert/' + uid + '/preds', pred, predAdminConverter)
  if (result) {

    console.log("prediction has been added : " + JSON.stringify(result))
    // redirect("/admin")
    return {
      errors: {},
      message: JSON.stringify(result),
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