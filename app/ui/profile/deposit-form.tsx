'use client';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button as ButtonReact, useDisclosure } from '@nextui-org/react';
import { User } from '@/app/model/user';
import { Blockquote, TextInput } from 'flowbite-react';
import { actionWithDraw } from '@/app/lib/actions/actionWithDraw';
import { useAppContext } from '@/app/lib/context';
import { addComma } from '@/app/lib/utils';



export default function DepositForm() {

  const { user, firebaseUser } = useAppContext()

  if (user == undefined) {
      return (
          <> Loading ... </>
      )
  }


  return (
    <div>
    {/* {user.uid} */}
    <div>
        {/* <div className='mb-4'>{user.displayName}</div> */}

        {user && (<p className="mb-4">Mã định danh duy nhất của bạn là {user.accessId.toUpperCase()}</p>)}
        <p className='mb-4'>Để nạp tiền, chuyển khoản tới số tài khoản 00577718001, ngân hành TP Bank với nội dung : 
        
        </p>

    <Blockquote className='mb-4'>
      DEPOSIT {user.accessId.toUpperCase()}
    </Blockquote>

       Sau tối đa 10 phút bộ phận kế toán sẽ cập nhất số dư tài khoản cho quý nhà đầu tư, mọi thắc mắc xin liên hệ 0987333333

        <div className="">

        </div>

    </div>

</div>
  );

}
