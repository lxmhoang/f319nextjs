'use client';
import { CustomerField } from 'app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/app/ui/button';
import { registerExpert } from '@/app/lib/action';
import { useFormState } from 'react-dom';
import { User } from 'firebase/auth';
import {Image} from "@nextui-org/react";
import { useState } from 'react';

export default function Form({ subscriptionPrice, userInfo }: { subscriptionPrice: string[], userInfo: User }) {


  const [uploadAvatar, setAvatar] = useState<File>()
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(registerExpert, initialState);
  return (
    // <div>{state.error ? "adsf" : "asdfsdeee"}</div>
    <div className='p-6'>
      {/* <div>{ state.message.length == 0 ? "no error" : "cccc" + Object.keys(JSON.stringify(state.errors)).length}</div> */}
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
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-  -900" />
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
      
          {/* subscription price */}
          <div className="mb-4">
            <label htmlFor="customer" className="mb-2 block text-sm font-medium">
              Choose subscription price
            </label>
            <div className="relative">
              <select
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
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.subscriptionPrice &&
                state.errors.subscriptionPrice.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
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
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-  -900" />
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
