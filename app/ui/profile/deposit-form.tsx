'use client';

import { Blockquote } from 'flowbite-react';
import { useAppContext } from '@/app/lib/context';
import Link from 'next/link';

import Image from 'next/image'



export default function DepositForm() {

  const { user, firebaseUser } = useAppContext()

  if (user == undefined) {
    return (
      <> Loading ... </>
    )
  }

  const imageURL = '/images/QRtpbank.png'


  return (
    <div>
      {user && (<p className="mb-4">Mã định danh duy nhất của bạn là {user.accessId.toUpperCase()}</p>)}
      <p className='mb-4'>Để nạp tiền, chuyển khoản tới  <span className='text-lg font-semibold dark:text-cyan-500 text-violet-600'>STK 31900319002, ngân hàng TP Bank </span> với nội dung :

      </p>

      <Blockquote className='mb-4'>
        DEPOSIT {user.accessId.toUpperCase()}
      </Blockquote>
      
      Dựa theo số tiền chuyển khoản, bộ phận kế toán trực 24/7 sẽ cộng số tiền tương đương vào số dư tài khoản cho quý nhà đầu tư, mọi thắc mắc xin liên hệ <Link className='dark:text-cyan-500 text-violet-600' href = 'https://t.me/f319mod'> t.me/f319mod</Link> 
      <Image width={300} height={380} priority={true} src={imageURL}  className="mt-10 w-[300px] h-[380px] " alt={""}
                  />

      <div className="">

      </div>

    </div>
  );

}
