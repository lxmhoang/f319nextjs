'use client';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button as ButtonReact, useDisclosure } from '@nextui-org/react';
import { User } from '@/app/model/user';
import { TextInput } from 'flowbite-react';
import { actionWithDraw } from '@/app/lib/actions/actionWithDraw';


interface TransCreationProps {
  user: User,
}

export default function WithDrawTransCreationForm(Props: TransCreationProps) {

  const { user } = Props;

  const initialFormState = { message: "", errors: {}, justDone: false };
  const [addTransState, dispatchAddtran] = useFormState(actionWithDraw, initialFormState);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (addTransState.justDone == true) {
    onOpen()
    addTransState.justDone = false
  }
  return (
    <>
      <Modal className='dark' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p>
                  {addTransState.message}
                </p>
              </ModalBody>
              <ModalFooter>
                <ButtonReact color="danger" variant="light" onPress={onClose}>
                  Close
                </ButtonReact>
                <ButtonReact color="primary" onPress={onClose}>
                  Action
                </ButtonReact>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className='p-1'>
      </div>

      {/* <div>{ state.message.length == 0 ? "no error" : "cccc" + Object.keys(JSON.stringify(state.errors)).length}</div> */}
      <form action={dispatchAddtran}>
        <div className="rounded-md bg-black-50">
          {/* Name */}
          <div className="">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium w-max-sm">
              Nhập số tiền
            </label>

            <div className="mb-4">
              <TextInput
                id="amount"
                step={1000}
                name="amount"
                type="number"
                min={100000}
                max={user.amount}
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
            {/* <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="notebankacc"
                  name="notebankacc"
                  type="text"
                  placeholder="Thông tin tài khoản ngân hàng"
                  className="peer block w-full rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                  required
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-  -900" />
              </div>
            </div> */}
            {/* <div id="customer-error" aria-live="polite" aria-atomic="true">
              {addTransState.errors?.notebankacc &&
                addTransState.errors.notebankacc.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div> */}

            {/* <div id="customer-error" aria-live="polite" aria-atomic="true">
              {addTransState.errors?.logic &&
                addTransState.errors.logic.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div> */}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit" aria-disabled={user == undefined}>Đăng ký</Button>
        </div>
      </form>
    </>
  );

}
