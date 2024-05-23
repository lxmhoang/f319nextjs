'use client';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { useFormState } from 'react-dom';
import {Image} from "@nextui-org/react";
import { useState } from 'react';
import { ConfirmationModal } from '../confirm';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
import { RegisterExpertFormState, registerExpert } from '../../lib/action';
import { User } from '../../lib/definitions';
import React from 'react';
import { Button } from '../button';

export default function ExpertRegisterForm({  userInfo }: { userInfo: User }) {

  const [selectedMonthLyPrice, setselectedMonthLyPrice] = useState(100000)
  const [selectedPermPrice, setselectedPermPrice] = useState(500000)
  const registerPrice = selectedMonthLyPrice * 5 + selectedPermPrice
  const [uploadAvatar, setAvatar] = useState<File>()
  const initialState = { message: "", errors: {}, justDone: false};
  const [state, dispatch] = useFormState<RegisterExpertFormState, FormData>(registerExpert, initialState);
  const router = useRouter()

  const [showModal, setShowModal] = useState(false);


  console.log("stateeee" + JSON.stringify(state))
  if ((state.message) && showModal == false) {
    setShowModal(true)
}
  const handleConfirmationConfirm = async () => {
    // handleNewPassword();
    // go go go

    setShowModal(false);
    state.message = undefined
    if (state.justDone) {
      state.justDone = false
      router.replace("/advisor")
    }
  };

  const handleConfirmationCancel = () => {
    setShowModal(false);
  };

  return (
    
    <div className='p-6'>
       <ConfirmationModal
                isOpen={showModal}
                onClose={handleConfirmationCancel}
                onLeftButtonClick={handleConfirmationConfirm}
                title={state.message ?? "No message"}
                message={""}
                leftButtonText='Okey'
            />
      <form action = {dispatch}>

     
        <div className="rounded-md bg-black-50">
          <input type="hidden" id="uid" name="uid" value={userInfo.uid}/>
         {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Tên hiển thị
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tên sẽ được hiển thị "
                  defaultValue={userInfo.displayName ?? ""}
                  className="peer block w-full rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                  required
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-  -900" />
              </div>
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
      
          {/* monthly  price */}
          <div className="mb-4">
            <label htmlFor="customer" className="mb-2 block text-sm font-medium">
              Ra giá gói theo dõi theo tháng
            </label>
            <div className="relative">
              {/* <select
                id="subscriptionPrice"
                name="subscriptionPrice"
                className="peer block w-1/2 cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 text-sky-500 placeholder:text-gray-500"
                defaultValue="{subscriptionPrice[0]}"
                aria-describedby="customer-error"
              >
                <option value="" disabled>
                   Chọn mức giá theo tháng cho người theo dõi
                </option>
                {subscriptionPrice?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select> */}
                              <input
                  id="monthlyPrice"
                  name="monthlyPrice"
                  type="number"
                  placeholder="Số tiền nhận mỗi tháng cho một user theo dõi theo tháng"
                  defaultValue={selectedMonthLyPrice}
                  className="peer block w-full rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                  required
                  onChange={(e) => {
                    setselectedMonthLyPrice(Number(e.target.value))
                  }}

                />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.monthlyPrice &&
                state.errors.monthlyPrice.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          {/* Perm price */}
          <div className="mb-4">
            <label htmlFor="permPrice" className="mb-2 block text-sm font-medium">
              Ra giá cho gói theo dõi vĩnh viễn 
            </label>
            <div className="relative">
                              <input
                  id="permPrice"
                  name="permPrice"
                  type="number"
                  placeholder="Số tiền nhận 1 lần cho mỗi người theo dõi vĩnh viễn"
                  defaultValue={selectedPermPrice}
                  className="peer block w-full rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                  required step={50000}
                  
                  onChange={(e) => {
                    setselectedPermPrice(Number(e.target.value))
                  }}
                />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.permPrice &&
                state.errors.permPrice.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          {/* Price register  */}
          <> Chi phí mở tài khoản (Giá gói tháng * 5 + Giá gói vĩnh viễn): {registerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>
          {/* Short intro */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Giới thiệu ngắn
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="shortIntro"
                  name="shortIntro"
                  type="text"
                  placeholder="Viết giới thiệu ngắn "
                  defaultValue="default short info"
                  className="peer block w-full rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-grey-500 text-sky-500"
                  required
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-  -900" />
              </div>
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.shortIntro &&
                state.errors.shortIntro.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
           {/* Upload file */}

        <input
          type="file"
          placeholder='select avatar'
          name="avatar"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : undefined;
            // if (file != undefined) {
              setAvatar(file)

            // }
            // setSelectedFile(file);
          }}
        />

          {uploadAvatar && (
          <div className='flex column p-4 w-100 h-100'>
            <Image
              src={URL.createObjectURL(uploadAvatar)}
              // style={styles.image}
              alt="Thumb"
            />
            {/* <button onClick={removeSelectedImage} style={styles.delete}>
              Remove This Image
            </button> */}
          </div>
        )}
        {/* <button onClick={upload}>Upload file</button> */}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Đăng ký</Button>
        </div>
      </form>
    </div>
  );
}
