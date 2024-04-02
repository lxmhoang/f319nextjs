
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


const storageRef = ref(storage, '/eeechild');

const ExpertFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Chọn 1 cái tên'
  }),
  shortIntro: z.string({
    invalid_type_error: 'Chọn 1 cái shortIntro'
  }),
  subscriptionPrice: z.enum(['1mil', '2mil'], {
    invalid_type_error: 'Chọn 1 cái giá nào',
  }),
  date: z.string(),

})

const RegisterExpert = ExpertFormSchema.omit({ id: true, date: true});

export type RegisterExpertFormState = {
  errors?: {
    name?: string[];
    subscriptionPrice?: string[];
    shortIntro?: string[];
    avatar?: File
  };
  message?: string | null;
};

export async function registerExpert(prevState: RegisterExpertFormState, formData: FormData) {
  console.log('1' + JSON.stringify(formData))
  const validatedFields = RegisterExpert.safeParse({
    name: formData.get('name'),
    shortIntro: formData.get('shortIntro'),
    subscriptionPrice: formData.get('subscriptionPrice'),
    avatar: formData.get('avatar'),
  });

  console.log('from' + validatedFields)
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {

    console.log('3' + JSON.stringify(validatedFields.error.flatten().fieldErrors))
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Hãy điền đầy đủ thông tin',
    };
  }

  const uid = formData.get('uid')

  // if (!uid) {

  // }

  const expertCollection = collection(db, 'expert')
  const docRef = doc(db, 'expert/' + uid)
  setDoc(docRef, {
      name: formData.get('name'),
      shortIntro: formData.get('shortIntro'),
      subscriptionPrice: formData.get('subscriptionPrice'),
      status: 'submitted',
      created: new Date(),
      visible: true
  }).then(
    ()=>{
      console.log('done add new expert' + docRef.id)
      const file = formData.get('avatar') as File
      if (file) {
        const storageRef =  ref(storage, '/expertAvatar/' + docRef.id)
        uploadBytes(storageRef, file).then(
          (snapshot) => {
          console.log('Uploaded a blob or file! with ref : ' + snapshot.ref.toString() + " pah " + 
          snapshot.ref.fullPath);
          updateDoc(docRef, {avatar : snapshot.ref.fullPath}).then(
            ()=> {
              console.log("successful update avatar ref to expert data ")
              // revalidatePath('/profile');
              // redirect('/profile');
            },
            (reason) => {
              console.log("faield to update avatar ref, reason " + reason)

            }

          )
          // snapshot.ref.toString
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
 