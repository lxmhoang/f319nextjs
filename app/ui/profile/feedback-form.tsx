'use client';
import {
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button as ButtonReact, useDisclosure } from '@nextui-org/react';
import { User } from '@/app/model/user';
import { TextInput } from 'flowbite-react';
import { actionFeedback } from '@/app/lib/actions/actionFeedBack';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


interface TransCreationProps {
  user: User,
}

export default function FeedbackForm(Props: TransCreationProps) {

  const { user } = Props;

  const initialFormState = { message: "", success: false };
  const [state, dispatch] = useFormState(actionFeedback, initialFormState);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter()

  useEffect(() => {
    if (state.message.length > 0) {
      setShowModal(true)

    }


  }, [state])


  return (
    <>
      <Modal className='dark' isOpen={showModal} onOpenChange={undefined}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <p>
                  {state.message}
                </p>
              </ModalBody>
              <ModalFooter>
                <ButtonReact color="primary" onPress={() => {
                  if (state.success) {
                    router.push('/profile')
                      
                  } else {

                  }

                  setShowModal(!showModal)
                  
                  }}>
                  OK
                </ButtonReact>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className='p-1'>
      </div>

      {/* <div>{ state.message.length == 0 ? "no error" : "cccc" + Object.keys(JSON.stringify(state.errors)).length}</div> */}
      <form action={dispatch}>
        <div className="rounded-md bg-black-50">
          {/* Name */}
          <div className="">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium w-max-sm">
              Rất cám ơn bạn gửi feedback, góp ý, thắc mắc cho chúng tôi. <br />
            </label> 

            <div className="mb-8">
              <TextInput
                name="content"
                type="text"
                placeholder='Feedback / góp ý / thắc mắc'
                className="peer block max-w-sm rounded-md boreder border-gray-200 py-2 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                required
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
         
          </div>
          <div className="mb-4">
            <label htmlFor="notebankacc" className="mb-2 block text-sm font-medium">
            (Không bắt buộc) Trong trường hợp bạn muốn để lại thông tin liên lạc để nhận phản hồi, xin hãy để lại  thông tin liên lạc <br/> Đội ngũ admin trực 24/7 sẽ nhanh chóng xử lý và phản hồi sớm nhất 
            </label>
            <TextInput name="contact" type="text"  placeholder="SĐT / Email / Thông tin liên lạc (Không bắt buộc)"  className='max-w-sm' />
          
          </div>
          <div className="mt-6 flex justify-start gap-4">
          {/* <Link
            href="/"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link> */}
          <Button type="submit" aria-disabled={user == undefined}>Gửi</Button>
        </div>
        </div>

        
      </form>
    </>
  );

}
