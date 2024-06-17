
"use server"
// khong dung firebase client o day vi nhu the request.auth se bi null
import { z } from 'zod';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addANewTransaction, serverAddNewModal, serverGetModal, serverQueryCollection, serverSetDoc, serverUpdateDoc } from './../firebaseadmin/adminfirestore';

import { getUserInfoFromSession, getthuquyUID, setClaim } from './../firebaseadmin/adminauth';
import { User, userAdminConverter } from '../../model/user';
import { tranAdminConverter, Transaction, TranType } from '../../model/transaction';
import { Prediction, predAdminConverter } from '../../model/prediction';
import { revalidatePath } from 'next/cache';



const TransactionFormSchema = z.object({
  amount: z.number(),
  notebankacc: z.string(),
})

export type AddNewTransFormState = {
  errors?: {
    amount?: string[];
    date?: string[];
    note?: string[];
    notebankacc?: string[],
    logic?: string[]
  };
  tran?: Transaction;
  message?: string | null;
  justDone?: boolean
};

export async function actionWithDraw(prevState: AddNewTransFormState, formData: FormData) {
  console.log("transaction to be added : ")
  const validatedFields = TransactionFormSchema.safeParse({
    amount: Number(formData.get('amount')),
    notebankacc: formData.get('notebankacc') as string
  });

  console.log("transaction to be added : " + formData.get('amount') + " notebank acc  " + formData.get('notebankacc'))
  if (!validatedFields.success) {
    console.log("error: " + JSON.stringify(validatedFields.error.flatten()))
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Hãy điền đầy đủ thông tin',
      justDone: false
    };
  }

  const notebankacc = formData.get('notebankacc') as string

  // must be perform with authed user
  const userInfo = await getUserInfoFromSession()
  if (!userInfo) {
    return {
      errors: [],
      message: 'User not found',
      justDone: false
    };
  }

  const thuquyid = await getthuquyUID()

  if (!thuquyid) {
    return {
      errors: [],
      message: 'Thu quy not found',
      justDone: false
    };
  }

  // const toUid = process.env.THUQUY_UID ?? "thuquy"

  const tran: Transaction = {
    tranType: TranType.withDraw,
    toUid: thuquyid,
    fromUid: userInfo.uid,
    amount: Number(formData.get('amount')),
    date: new Date(),
    notebankacc: notebankacc,
    status: "pending"
  }

  console.log("transaction to be added : " + JSON.stringify(tran))

  const userData = await serverGetModal<User>('user/' + userInfo.uid, userAdminConverter)
  if (!userData) {
    console.log('sth wrong with uid')

    return {
      errors: {

      },
      message: 'Can not verify amount ',
      justDone: false
    }
  }
  if (tran.amount > userData.amount) {
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