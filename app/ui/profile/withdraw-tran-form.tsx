'use client';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button as ButtonReact } from '@nextui-org/react';
import { User } from '@/app/model/user';
import { TextInput } from 'flowbite-react';
import { actionWithDraw } from '@/app/lib/actions/actionWithDraw';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


interface TransCreationProps {
  user: User,
}

export default function WithDrawTransCreationForm(Props: TransCreationProps) {

  const { user } = Props;

  const initialFormState = { message: "", errors: {}, justDone: false };
  const [formState, dispatch] = useFormState(actionWithDraw, initialFormState);
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
      setShowModal(formState.message.length > 0)

  } , [formState])

  // if (formState.justDone == true) {
  //   onOpen()
  //   addTransState.justDone = false
  // }
  return (
    <>
      <Modal className='dark' isOpen={showModal} >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Đã nhận được yêu cầu rút tiền</ModalHeader>
              <ModalBody>
                <p>
                  {formState.message}
                </p>
              </ModalBody>
              <ModalFooter>
                <ButtonReact color="primary" onPress={() => {
                  if (formState.justDone) {
                    router.push('/profile/transactions')    
                  }
                  setShowModal(false)
                }}>
                  Ok
                </ButtonReact>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* <div className='p-1'> */}
        <p className='mb-8'>Số dư : {user.amount}</p>
      {/* </div> */}

      {/* <div>{ state.message.length == 0 ? "no error" : "cccc" + Object.keys(JSON.stringify(state.errors)).length}</div> */}
      <form action={dispatch}>
        <div className="rounded-md bg-black-50">
          {/* Name */}
          <div className="">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium w-max-sm">
              Nhập số tiền muốn rút
            </label>

            <div className="mb-4">
              <TextInput
                id="amount"
                step={1000}
                name="amount"
                type="number"
                // min={100000}
                // max={user.amount}
                placeholder='Số tiền muốn rút'
                // defaultValue={selectedMonthLyPrice}
                // defaultValue={Math.round(user?.amount/2)}
                className="peer block max-w-sm rounded-md boreder border-gray-200 py-2 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                required
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
         
          </div>
          <div className="mb-4">
            <label htmlFor="notebankacc" className="mb-2 block text-sm font-medium">
              Nhập thông tin chuyển khoản
            </label>
            <TextInput id="notebankacc" name="notebankacc" type="text"  placeholder="Thông tin tài khoản ngân hàng" required className='max-w-sm' />

          </div>
        <div className="mt-6 flex justify-start gap-4">

          <Button type="submit" aria-disabled={user == undefined}>Rút tiền về tài khoản </Button>
        </div>
          
        </div>

      </form>
    </>
  );

}
