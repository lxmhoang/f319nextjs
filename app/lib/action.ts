
"use server"
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { useCollectionDataOnce, useDocument, useDocumentOnce } from 'react-firebase-hooks/firestore';
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase/firebase';
import { storage } from './firebase/firebase';
import firebase from 'firebase/compat/app';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { ExpertStatus, Prediction, Transaction, User, userConverter } from './definitions';
import { addANewTransaction, searchCollection, searchUser } from './firebase/firestore';
import { error } from 'console';
import { getUserClaims } from './firebaseadmin/firebaseadmin';
import { getAuth } from 'firebase-admin/auth';


const storageRef = ref(storage, '/eeechild');

// Expert Creation
const ExpertFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'wrong type of name field'
  }),
  shortIntro: z.string({
    invalid_type_error: 'Chọn 1 cái shortIntro'
  }),
  subscriptionPrice: z.enum(['1mil', '2mil'], {
    invalid_type_error: 'Chọn 1 cái giá nào',
  }),
  date: z.string(),
})

const RegisterExpert = ExpertFormSchema.omit({ id: true, date: true });

export type RegisterExpertFormState = {
  errors?: {
    uid?: string[]
    name?: string[];
    subscriptionPrice?: string[];
    shortIntro?: string[];
    avatar?: File
  };
  message?: string | null;
};


export async function registerExpert(prevState: RegisterExpertFormState, formData: FormData) {
  const validatedFields = RegisterExpert.safeParse({
    name: formData.get('name'),
    shortIntro: formData.get('shortIntro'),
    subscriptionPrice: formData.get('subscriptionPrice'),
    avatar: formData.get('avatar'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Hãy điền đầy đủ thông tin',
    };
  }

  const uid = formData.get('uid')
  if (!uid) {
    return {
      errors: {
        uid: ["uid khong ton tai"],
        name: [""],
        subscriptionPrice: [""],
        shortIntro: [""]
      },
      message: 'Hãy điền đầy đủ thông tin',
    };
  }
  
  const docRef = doc(db, 'expert/' + uid)
  setDoc(docRef, {
    name: formData.get('name'),
    shortIntro: formData.get('shortIntro'),
    subscriptionPrice: formData.get('subscriptionPrice'),
    status: ExpertStatus.paymentPending,
    created: new Date(),
    visible: true
  }).then(
    () => {
      console.log('done add new expert' + docRef.id)
      const file = formData.get('avatar') as File
      if (file) {
        const storageRef = ref(storage, '/expertAvatar/' + docRef.id)
        uploadBytes(storageRef, file).then(
          (snapshot) => {
            console.log('Uploaded a blob or file! with ref : ' + snapshot.ref.toString() + " pah " +
              snapshot.ref.fullPath);
            updateDoc(docRef, { avatar: snapshot.ref.fullPath }).then(
              () => {
                console.log("successful update avatar ref to expert data ")
                // revalidatePath('/profile');
                // redirect('/profile');
              },
              (reason) => {
                console.log("faield to update avatar ref, reason " + reason)
              }

            )
          },
          (reason) => {
            console.log("faield to upload avatar ref, reason " + reason)
          }
        );

      } else {
        console.log('done, no upload file')
        // revalidatePath('/profile');
        // redirect('/profile');
      }
    },
    (error) => {

    }
  )
  return {
    message: 'Database Error: Failed to Create Invoice.',
    error: {}
  };
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
}).refine( input => {

  console.log("refine")
  if (input.tranType == 'p2p') {
    if (input.toUid == undefined || input.fromUid == undefined) {
      return false
    }
  } else
  if (input.tranType == 'deposit') {
    if (input.toUid == undefined || input.fromUid != undefined) {
      console.log("refine to Uid" + input.toUid )
      console.log("refine to fromUid" + input.fromUid )
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
  console.log("transaction to be added : " )
  const validatedFields = TransactionFormSchema.safeParse({
    toUid: formData.get('toUid') as string,
    tranType: formData.get('tranType'),
    amount: Number(formData.get('amount')),
    // toUid: formData.get('toUid'),
    fromUid: formData.get('fromUid') as string,
    notebankacc: formData.get('notebankacc') as string
  });

  console.log("transaction to be added : " + formData.get('tranType') +  formData.get('amount') +  formData.get('fromUid') + " ----"  +  formData.get('toUid') + " notebank acc  " + formData.get('notebankacc')    )
  if (!validatedFields.success) {
    console.log("error: " + JSON.stringify(validatedFields.error.flatten()))
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Hãy điền đầy đủ thông tin',
      justDone: false
    };
  }
  console.log("transaction to be added : " )

  const tranType = formData.get('tranType') as string
  const notebankacc = formData.get('notebankacc') as string
  const toUid = tranType == 'withDraw' ? process.env.THUQUY_UID : formData.get('toUid') as string
  const fromUid = tranType == 'deposit' ? process.env.THUQUY_UID : formData.get('fromUid') as string

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
    const result = await searchUser({uid: fromUid})
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
  if (result) {

  console.log("transaction has been added : " + JSON.stringify(result))
  // redirect("/admin")
    return {
      errors: {},
      message:  JSON.stringify(result),
      tran: result,
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
  paymentId: z.string({
    invalid_type_error: ' payment Id phai la chuoi'
  }).min(4, "paymentId co it nhat 4 ky tu")

})


const SearchUser = SearchUserForPaymentFormSchema



export type SearchUseFormState = {
  errors?: {
    [key: string] : string[]
    // general?: string[]
    // paymentId?: string[];
  };
  user?: User;
  message?: string | null;
};

export async function searchUserForPayment(prevState: SearchUseFormState, formData: FormData) {
  const paymentId = formData.get('paymentId')
  
  // if (!paymentId) {
  //   return {
  //     errors: {
  //       paymentId: ["hay dien payment ID"]
  //     },
  //     message: 'Hãy điền đầy đủ thông tin',
  //   };

  // }
  console.log(JSON.stringify(paymentId))
  const validatedFields = SearchUser.safeParse({
    paymentId: formData.get('paymentId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Hãy điền đầy đủ thông tin',
    };
  }

  const searchResult = await searchCollection<User>("user", { paymentId: paymentId }, userConverter)

  if (searchResult && searchResult.length == 1) {
    return {
      message: "Good ",
      user: searchResult[0]
    }
  } else if (!searchResult || searchResult.length == 0) {
    return {
      errors : {
        general: ["No user found"]
      },
      message: "No user found"
    }

  } else {
    return {
      errors :  {
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
    // note?: string[];
    logic?: string[]
  };
  pred?: Prediction;
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
  dateOut: z.date(),
  // note?:z.date().optional()
})


export async function createNewPrediction(prevState: PredictionFormState, formData: FormData) {
  console.log("Prediction to be added : " )
  const validatedFields = PredictionFormSchema.safeParse({
    assetName: formData.get('assetName') as string,
    priceIn: Number(formData.get('priceIn')),
    priceOut: Number(formData.get('priceOut')),
    cutLoss: Number(formData.get('cutLoss')),
    dateIn: formData.get('dateIn'),
    dateOut: formData.get('dateOut'),
    // note: formData.get('note'),
  });

  console.log("Prediction to be added : " + formData.get('assetName') +  formData.get('priceIn') +  formData.get('priceOut') + " ----"  +  formData.get('cutLoss')  +  formData.get('dateIn')  +  formData.get('dateOut')  )
  if (!validatedFields.success) {
    console.log("error: " + JSON.stringify(validatedFields.error.flatten()))
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Hãy điền đầy đủ thông tin',
      justDone: false
    };
  }
  const uid = formData.get('uid') as string
  if (uid) {
    const userRecord = await getAuth().getUser(uid)
    const isExpert = userRecord.customClaims?.isExpert
    if (isExpert == false) {
      return {
        errors: {
          logic: ['Ban khong phai chuyen gia']
        },
        justDone: false
      }
    }
  } else {
    return {
      errors: {
        logic: ['this is not user ']
      },
      justDone: false
    }

  }
  const assetName = formData.get('assetName') as string
  const dateIn = new Date(formData.get('dateIn') as string)
  const dateOut = new Date(formData.get('dateOut') as string)
  const priceIn = Number(formData.get('priceIn'))
  const priceOut = Number(formData.get('priceOut'))
  const cutLoss = Number(formData.get('cutLoss'))

  const pred: Prediction = {
    assetName: assetName,
    dateIn: dateIn,
    dateOut: dateOut,
    priceIn: priceIn,
    priceOut: priceOut,
    cutLoss: cutLoss,
    status: "justCreated"
  }

  console.log("pred to be added : " + JSON.stringify(pred))

  return {
    errors: {},
    message: "alalala",
    justDone: false
  }

  

  // const result = await addANewTransaction(tran)
  // if (result) {

  // console.log("transaction has been added : " + JSON.stringify(result))
  // // redirect("/admin")
  //   return {
  //     errors: {},
  //     message:  JSON.stringify(result),
  //     tran: result,
  //     justDone: true
  //   }
  // } else {
  //   console.log("transaction FAILED TO added")
  //   return {
  //     errors: {},
  //     message: 'failed to add transaction',
  //     justDone: false
  //   }
  // }
}