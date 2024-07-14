'use client';

import { Blockquote } from 'flowbite-react';
import { useAppContext } from '@/app/lib/context';



export default function DepositForm() {

  const { user, firebaseUser } = useAppContext()

  if (user == undefined) {
    return (
      <> Loading ... </>
    )
  }


  return (
    <div>
      {user && (<p className="mb-4">Mã định danh duy nhất của bạn là {user.accessId.toUpperCase()}</p>)}
      <p className='mb-4'>Để nạp tiền, chuyển khoản tới số tài khoản 00577718001, ngân hàng TP Bank với nội dung :

      </p>

      <Blockquote className='mb-4'>
        DEPOSIT {user.accessId.toUpperCase()}
      </Blockquote>

      Sau tối đa 10 phút bộ phận kế toán sẽ cập nhất số dư tài khoản cho quý nhà đầu tư, mọi thắc mắc xin liên hệ 0987333333

      <div className="">

      </div>

    </div>
  );

}
