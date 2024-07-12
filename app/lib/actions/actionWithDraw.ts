
"use server"
// khong dung firebase client o day vi nhu the request.auth se bi null
import { z } from 'zod';
import { getthuquyUID } from './../firebaseadmin/adminauth';
import { Transaction, TranType } from '../../model/transaction';
import { getUserDBInfo, serverAddANewTransaction } from '../server';



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
  const userData = await getUserDBInfo() 
  if (!userData) {
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
    fromUid: userData.uid,
    amount: Number(formData.get('amount')),
    date: Date.now(),
    notebankacc: notebankacc,
    status: "Pending"
  }

  console.log("transaction to be added : " + JSON.stringify(tran))

  
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



  const tranID = await serverAddANewTransaction(tran)
  if (tranID) {

    console.log("transaction has been added with ref " + tranID)
    return {
      errors: {},
      message: 'Bộ phận admin sẽ nhanh chóng review và chuyền tiền sớm cho quý khách theo thông tin ' + notebankacc,
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