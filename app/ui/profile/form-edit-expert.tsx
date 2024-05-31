'use client';
import Link from 'next/link';
import {
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image'
import { useFormState } from 'react-dom';
import { Button, Divider } from "@nextui-org/react";
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../confirm';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { RegisterExpertFormState, editExpert } from '../../lib/action';
import React from 'react';
import { User } from '@/app/model/user';
import { Expert } from '@/app/model/expert';
import { getBlob, ref } from 'firebase/storage';
import { storage } from '@/app/lib/firebase/firebase';
import { compressFile } from '@/app/lib/utils';
import { Spinner } from 'flowbite-react';




export function FormEditExpert({ userInfo, expert }: { userInfo: User, expert: Expert }) {

    const [selectedMonthLyPrice, setselectedMonthLyPrice] = useState<number>(expert.monthlyPrice)
    const [selectedPermPrice, setselectedPermPrice] = useState<number>(expert.permPrice)
    const registerPrice = Number(Number(selectedMonthLyPrice * 5) + Number(selectedPermPrice))

    const [uploadAvatar, setUpload] = useState<File>()
    const [currentExpertAvatar, setCurrentExpertAvatar] = useState<Blob>()
    const [compressing, setCompressing] = useState<boolean>(false)
    const [didChange, setDidChange] = useState<boolean>(false)

    const initialState = { message: "", errors: {}, justDone: false };
    const [fileInside, setFileInside] = useState<FormData>()
    const [state, dispatch] = useFormState<RegisterExpertFormState, FormData>(editExpert.bind(null, fileInside), initialState);


    const avatarURL = uploadAvatar ? URL.createObjectURL(uploadAvatar) : currentExpertAvatar ? URL.createObjectURL(currentExpertAvatar) : undefined

    const [showModal, setShowModal] = useState(false);
    const handleSelectedImage = async (image: File) => {
        if (image.size > 2000000) {
            setCompressing(true)
            const compressedFile = await compressFile(image)
            setCompressing(false)
            setUpload(compressedFile)
            const formData = new FormData()
            formData.set('avatar', compressedFile)
            setFileInside(formData)
        } else {
            setUpload(image)
            const formData = new FormData()
            formData.set('avatar', image)
            setFileInside(formData)
        }
    }

    const checkInfoChange = (formData: FormData) => {

        const formProps = Object.fromEntries(formData);
        const didChange = (formProps.name != expert.name)
            || (formProps.shortIntro != expert.shortIntro)
            || (Number(formProps.monthlyPrice) != expert.monthlyPrice)
            || (Number(formProps.permPrice) != expert.permPrice)
        setDidChange(didChange)
    }

    useEffect(() => {


        const getAvatarBlob = async (url: string) => {
            const blob = await getBlob(ref(storage, url))
            setCurrentExpertAvatar(blob)

        }

        if (expert && expert.avatar && uploadAvatar == undefined) {
            getAvatarBlob(expert.avatar)
        }


    }, [uploadAvatar])


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
            setFileInside(undefined)
            setUpload(undefined)
            // router.replace("/advisor")
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
            <div className='mb-5'>
                Edit

            </div>
            <Divider />
            <form action={dispatch} className='mt-5' onChange={(e) => {
                const formData = new FormData(e.currentTarget)
                checkInfoChange(formData)



            }}>


                <div className="rounded-md bg-black-50">
                    <input type="hidden" id="uid" name="uid" value={userInfo.uid} />
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
                                    defaultValue={expert.name ?? ""}
                                    className="peer block w-full rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                                    required
                                    onChange={(e) => {
                                        // const newValue = e.target.value
                                        // if (newValue != expert.name) {
                                        //     setDidChange(true)
                                        // }
                                    }}



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
                            <input
                                id="monthlyPrice"
                                name="monthlyPrice"
                                type="number"
                                placeholder="Số tiền nhận mỗi tháng cho một user theo dõi theo tháng"
                                defaultValue={selectedMonthLyPrice}
                                className="peer block w-full rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                                required
                                onChange={(e) => {
                                    const newValue = Number(e.target.value)
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
                                    const newValue = Number(e.target.value)
                                    setselectedPermPrice(newValue)
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
                    {/* Price register  */} --
                    {/* {registerPrice} --
                    {selectedMonthLyPrice} --
                    {selectedPermPrice}
                    === {selectedPermPrice + selectedMonthLyPrice * 5} */}
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
                    {/* {expert?.avatar} */}

                    {/* {avatarURL} */}
                    <div className='block'>
                        <input
                            type="file"
                            placeholder='change avatar'
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files ? e.target.files[0] : undefined;
                                if (file) {
                                    setDidChange(true)
                                    handleSelectedImage(file)
                                }
                            }}
                        />

                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <Link
                        href="/"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Cancel
                    </Link>
                    <Button type="submit" color='primary' isDisabled={compressing || (!didChange && uploadAvatar == undefined)}>{"Update thông tin "}</Button>
                </div>
            </form>
            {!compressing && avatarURL ?
                (<div >
                    <Image
                        src={avatarURL}
                        alt="avatar of expert"
                        width={200}
                        height={200}
                    />
                </div>)
                : <div>
                    Compressing ....
                    <Spinner />
                </div>

            }
        </div>
    );
}
