'use client';
import Link from 'next/link';
import {
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image'

import clsx from 'clsx';
import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom';
import { Button, Divider } from "@nextui-org/react";
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../confirm';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { RegisterExpertFormState, editExpert } from '../../lib/actions/actionEditExpert';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button as ButtonReact } from '@nextui-org/react';
import React from 'react';

import { Expert } from '@/app/model/expert';
import { addComma, compressFile, convert, tnc } from '@/app/lib/utils';
import { Blockquote, Checkbox, Label, Radio, Spinner, TextInput } from 'flowbite-react';
import { useAppContext } from '@/app/lib/context';
import { redirect } from 'next/navigation';
import { refreshToken } from '@/app/lib/client';
import { PhoneIcon } from '@heroicons/react/16/solid';

export function ExpertFormComponent({ expertInfo }: { expertInfo: string | undefined }) {

    const expert: Expert | undefined = expertInfo ? JSON.parse(expertInfo) : undefined

    const { user, firebaseUser } = useAppContext()
    const amount = user?.amount ?? 0
    const defaultName = user?.displayName ?? ""

    const router = useRouter()
    const [showTNC, setShowTNC] = useState<boolean>(false)
    const [type, setType] = useState<"rank" | "solo" | undefined>()
    const [period, setPeriod] = useState<"perm" | "yearly" | undefined>()
    const [upgrade, setUpgrade] = useState<boolean>(false)

    var fee: number | undefined = undefined

    if (!expert && type && period) {

        fee = type == "rank" ? period == "perm" ?
            Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_PERM) :
            Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_YEAR)
            : period == "perm" ?
                Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_PERM) :
                Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_YEAR)
    } else if (expert) {
        if (upgrade) {
            if (expert.expertType == 'rank') {
                fee = Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_PERM) - Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_YEAR)
            } else if (expert.expertType == 'solo') {
                fee = Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_PERM) - Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_YEAR)
            } else {
                throw new Error('expertType is wrong ' + expert.expertExpire)
            }
        } else {
            fee = 0
        }

    }


    // const amount = userInfo.user?.amount ?? 0

    const [uploadAvatar, setUpload] = useState<File>()
    const [acceptTNC, setAcceptTNC] = useState<boolean>(false)

    const [compressing, setCompressing] = useState<boolean>(false)
    const [didChange, setDidChange] = useState<boolean>(false)

    const initialState = { message: undefined, errors: {}, justDone: false };
    const [fileInside, setFileInside] = useState<FormData>()

    const currentAvatarURL = expert ? expert.imageURL :
        firebaseUser?.photoURL


    const [state, dispatch] = useFormState<RegisterExpertFormState, FormData>(editExpert.bind(null, fileInside, currentAvatarURL, expert == undefined), initialState);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {


        console.log("state " + JSON.stringify(state) + showModal)

        if (state.justDone == false && state.message && state.message.length > 0) {
            // show popup
            console.log('11111')
            setShowModal(true)
        } else {
            if (state.justDone == true) {
                if (!expert) {
                    console.log('just create new expert. refresh token first then show popup in this function')
                    if (firebaseUser) {
                        refreshToken(firebaseUser).then((result) => {
                            if (result.success) {
                                setShowModal(true)
                            } else {

                                setShowModal(true) // =))))
                            }
                        }
                        )
                    }
                } else {
                    console.log('just done editing expert')
                    // just done editing expert
                    // show popup
                    setShowModal(true)
                }
            }
        }

        setDidChange(false)

    }, [state])



    const handleTapOkey = async () => {
        if (!state.justDone) {
            console.log('handleTapOkey not done yet 111')
            setShowModal(false)
        } else {
            if (expert) {
                console.log('handleTapOkey edit expert done 222')
                // tap okey after edit expert info
                router.replace('/advisor')
                // done 
            } else {
                // tap okey after register expert and update token
                console.log('handleTapOkey  createe expert done ')
                router.replace('/advisor')

            }
        }
        // handleNewPassword();
        // go go go
        if (state.justDone && !expert) {
            setShowModal(false);
            router.replace('/advisor')
        } else {
            setShowModal(false);
        }
    };


    const avatarURL = uploadAvatar ?
        URL.createObjectURL(uploadAvatar) :
        // currentExpertAvatar ? 
        //     URL.createObjectURL(currentExpertAvatar) : 
        //     userInfo.firebaseUser?.photoURL
        currentAvatarURL

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

    // const [hint, setHint] = useState<string>()

    const checkInfoChange = (formData: FormData) => {
        const formProps = Object.fromEntries(formData);
        console.log("form props " + JSON.stringify(formProps))

        const didChange = expert ?
            (formProps.expertPeriod && formProps.expertPeriod != expert.expertPeriod)
            || (Number(formProps.monthlyPrice) != expert.monthlyPrice)
            || (Number(formProps.permPrice) != expert.permPrice)
            :
            true

        setDidChange(didChange)
    }

    if (firebaseUser == null && firebaseUser != undefined) {
        console.log('not authen, redirect to home page')
        redirect('/')
    }

    return (
        <div className="p-4">
            {firebaseUser === undefined  ? <>Loading</>
                :
                (user?.isExpert && !expert) ? <>Đã là chuyên gia rồi </> : 

                <div className='pl-3 pr-3 sm:pl-10 sm:pr-10 mx-auto'>
                    {/* {JSON.stringify(state)} */}
                    {/* {userInfo.user?.expertType} */}
                    <ConfirmationModal
                        isOpen={showModal}
                        onClose={() => { setShowModal(false) }}
                        onLeftButtonClick={handleTapOkey}
                        title={""}
                        message={state.message ?? ""}
                        leftButtonText='Okey'
                    />
                    <div className='mb-8'>
                        <Blockquote>
                            {expert ? "Cập nhật thông tin chuyên gia" : "Đăng ký chuyên gia"}
                        </Blockquote>
                        <p className='mt-2 text-xs'> * Để tránh 1 số chuyên gia lôi kéo nhà đầu tư, thông tin đăng ký (ảnh, giới thiệu ngắn) <span className='text-rose-400 font-bold dark:text-amber-500'>không được</span> bao gồm thông tin cá nhân, sdt, group tele, zalo ... dưới mọi hình thức  </p>
                        {/* <p className='text-xs'>Để tránh việc 1 số chuyên gia sau khi có uy tín đã mời gọi nhà đầu tư sang các group zalo, telegram riêng không đảm bảo đồng nhất khuyến nghị, từ 01/07/2023, group chat của mỗi chuyên gia sẽ bị disable, thông tin chuyên gia sẽ không được gợi ý sđt, zalo, tele ... hay bất kỳ thông tin riêng dưới mọi hình thức </p> */}
                    </div>
                    <Divider />
                    <form action={dispatch} className='mt-5' onChange={(e) => {
                        const formData = new FormData(e.currentTarget)
                        checkInfoChange(formData)
                    }}>

                        <div className="rounded-md bg-black-50">
                            {/* <input type="hidden" id="uid" name="uid" value={userInfo.uid} /> */}
                            {/* Name */}
                            <div className="mb-4 max-w-md">
                                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                                    Tên hiển thị
                                </label>
                                <div className="relative mt-2 rounded-md ">
                                    <div className="relative">
                                        <TextInput
                                            // id="name"
                                            disabled={expert != undefined}
                                            name="name"
                                            type="text"
                                            placeholder="Tên sẽ được hiển thị "
                                            defaultValue={expert ? expert.name : defaultName ?? ""}
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
                            <div className="mb-4 max-w-md">
                                <label htmlFor="phong" className="mb-2 block text-sm font-medium">
                                    Số điện thoại <span className='text-xs'>  (chỉ dùng cho dịch vụ trợ giúp, sẽ không hiển thị với người dùng) </span>
                                </label>
                                <div className="relative mt-2 rounded-md ">
                                    <div className="relative">
                                        <TextInput
                                            // id="name"
                                            disabled={expert != undefined}
                                            name="phone"
                                            type="number"
                                            placeholder="0912345678"
                                            defaultValue={expert ? expert.phone : ""}
                                            className="peer block w-full rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                                            

                                        />
                                        <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-  -900" />
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
                            {
                                (expert) && (
                                    <>
                                        <div className="mb-4 max-w-md">
                                            <div className='block'>
                                                <div>
                                                    <Label className='text-md'>{"Loại tài khoản: " + expert.expertType}</Label>
                                                </div>
                                                <div>
                                                    <Label className='text-md'>{"Ngày hết hạn:  " + (expert.expertPeriod == 'yearly' ? (new Date(expert.expertExpire)).toLocaleDateString('vi') : "Trọn đời")}</Label>
                                                </div>
                                            </div>

                                        </div>

                                        {expert.expertPeriod == 'yearly' && (
                                            <div className="ml-8 mb-4 max-w-md">
                                                <fieldset className="flex max-w-md flex-col gap-4">
                                                    {/* <legend className="mb-4">Upgrade thời hạn </legend> */}
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox id="expertPeriod" name="expertPeriod" defaultChecked={false} value="perm" onChange={(e) => {
                                                            setUpgrade(e.target.checked)
                                                        }} />
                                                        <Label className=''>{"Nâng cấp lên trọn đời"}</Label>
                                                        {upgrade && <Label className=''>{" phí :  " + convert(fee ?? 0)}</Label>}

                                                    </div>
                                                </fieldset>
                                            </div>)
                                        }
                                    </>
                                )
                            }
                            {
                                (expert && expert.expertType == 'solo') && (
                                    <PlanSection period={period} expert={expert} state={state} upgradeSelected={upgrade} />
                                )
                            }


                            {!expert && (
                                <div className="mb-4 mt-8 max-w-md">
                                    {/* <Label className='text-lg' value={"Chi phí mở tài khoản " + process.env.NEXT_PUBLIC_EXPERT_REG_FEE} /> */}
                                    <fieldset className="flex max-w-md flex-col gap-4">
                                        <legend className="mb-4">Chọn loại tài khoản </legend>
                                        <div className="flex items-center gap-2">
                                            <Radio id="expertSoloType" name="expertType" defaultChecked={type == "solo"} value="solo" onChange={(e) => {
                                                if (e.target.checked) {
                                                    setType("solo")
                                                    setPeriod(undefined)
                                                }
                                            }} />
                                            <Label className=''>{"Solo, thu nhập từ follower riêng với các gói theo dõi "}</Label>
                                        </div>
                                        {
                                            type == "solo" &&
                                            <>
                                                <p className='text-sm ml-12'>Chọn chu kỳ chuyên gia SOLO</p>
                                                <div className='ml-12'>
                                                    <Radio id="expertPeriod" name="expertPeriod" defaultChecked={period == "perm"} value="perm" onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setPeriod("perm")
                                                        }
                                                    }} />
                                                    <Label className='text-sm'>{"Trọn đời " + addComma(Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_PERM))}</Label>
                                                </div>

                                                <div className='ml-12'>
                                                    <Radio id="expertPeriod" name="expertPeriod" defaultChecked={period == "yearly"} value="yearly" onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setPeriod("yearly")
                                                        }
                                                    }} />
                                                    <Label className='text-sm'>{"Một năm " + addComma(Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_YEAR))}</Label>
                                                </div>
                                                <div className='ml-12'>
                                                    {period && <PlanSection period={period} expert={expert} state={state} upgradeSelected={upgrade} />}
                                                </div>

                                            </>
                                        }
                                        <Divider className='mb-2 mt-2' />
                                        <div className="flex items-center gap-2">
                                            <Radio id="expertRankType" name="expertType" defaultChecked={type == "rank"} value="rank" onChange={(e) => {
                                                if (e.target.checked) {
                                                    setType("rank")
                                                    setPeriod(undefined)
                                                }
                                            }} />
                                            <Label className=''>{"Rank, thu nhập từ đoạt top performance theo tuần, tháng, quý năm "}

                                            </Label>

                                        </div>
                                        {
                                            type == "rank" &&
                                            <>
                                                <p className='text-sm ml-12'>Chọn chu kỳ chuyên gia RANK</p>
                                                <div className='ml-12'>
                                                    <Radio id="expertPeriod" name="expertPeriod" value="perm" defaultChecked={period == "perm"} onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setPeriod("perm")
                                                        }
                                                    }} />
                                                    <Label className='ml-2'>{"Trọn đời " + addComma(Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_PERM))}</Label>
                                                </div>

                                                <div className='ml-12'>
                                                    <Radio id="expertPeriod" name="expertPeriod" value="yearly" defaultChecked={period == "yearly"} onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setPeriod("yearly")
                                                        }
                                                    }} />
                                                    <Label className='ml-2'>{"Một năm " + addComma(Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_YEAR))}</Label>
                                                </div></>
                                        }
                                    </fieldset>

                                    {(!type || !period) && <span className='text-amber-300 text-xs'>Hãy chọn loại chuyên gia và thời hạn </span>}
                                </div>)}




                            {/* Short intro */}
                            <div className="mb-4 mt-8 max-w-md">
                                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                                    Giới thiệu ngắn
                                </label>
                                <div className="relative mt-2 rounded-md">
                                    <div className="relative">
                                        <TextInput
                                            disabled={expert != undefined}
                                            id="shortIntro"
                                            name="shortIntro"
                                            type="text"
                                            placeholder="Viết giới thiệu ngắn "
                                            defaultValue={expert ? expert.shortIntro : "Chuyên gia tư vấn " + defaultName}
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
                            <div className='mb-4 max-w-md mt-8'>
                                <label htmlFor="avatarInfo" className="mb-2 block text-sm font-medium">
                                    Ảnh đại diện
                                </label>
                                <div className="m-4">
                                    {!compressing && avatarURL ?
                                        (<div >
                                            <Image src={avatarURL} className='rounded-full'

                                                // style={{ width: '100%', height: 'auto' }}
                                                priority={true}

                                                alt="avatar of expert"
                                                width={100}
                                                height={100}
                                            />
                                        </div>)
                                        : compressing ?
                                            <div>
                                                Compressing ....
                                                <Spinner />
                                            </div>
                                            :
                                            <> <span className='text-amber-300 text-xs'>Bạn cần upload ảnh đại diện</span></>
                                    }
                                </div>

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
                                {/* <div>
                        {!avatarURL &&  <span className='text-red-400 text-sm'>Hãy upload ảnh đại diện</span>}
                        </div> */}

                            </div>
                        </div>
                        {expert == undefined &&
                            (<div className=" justify-start gap-4 mt-12">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="accept" checked={acceptTNC} onChange={(e) => {
                                        setAcceptTNC(e.target.checked)

                                    }} />
                                    <Label htmlFor="accept" className="flex">
                                        Tôi đã đọc và đồng ý với <span onClick={() => {
                                        setShowTNC(true)
                                        // alert('kkk')
                                    }} className='text-cyan-500'>điều khoản và điền kiện</span> của trang web
                                        
                                    </Label>
                                </div>
                                {!acceptTNC && <> <span className='text-amber-300 text-xs'>Bạn cần đồng ý với điều khoản sử dụng</span></>}
                            </div>)}
                        {(fee != undefined && fee > amount) && <span className='text-rose-400 text-sm'>Phí đăng ký là {addComma(fee)} trong khi số tiền của bạn là {addComma(amount)}, vui lòng nạp thêm <Link
                            href="/profile/deposit"
                            className="px-1 text-sm font-medium text-cyan-600 dark:text-cyan-500"
                        >
                            ở đây
                        </Link> </span>}


                        <div className="flex justify-start gap-4 mt-12">
                            <Link
                                href="/"
                                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                            >
                                Cancel
                            </Link>
                            <Button type="submit" color='primary' isDisabled={(fee == undefined || fee > amount) || (!acceptTNC && !expert) || compressing || !avatarURL || (expert != undefined && !didChange && !fileInside)}>{expert ? "Update thông tin " +
                                ((fee && fee > 0) ? convert(fee ?? 0) : "") : "Đăng ký với chi phí: " + addComma(fee ?? 0)}</Button>
                        </div>
                    </form>

                </div>
            }


      <Modal className='dark' isOpen={showTNC} onOpenChange={undefined}
        scrollBehavior={"inside"} >
      
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Điều khoản và điều kiện</ModalHeader>
              <ModalBody>
                    {tnc} 
              </ModalBody>
              <ModalFooter>
                <ButtonReact color="primary" onPress={() => {
                  setShowTNC(false)
                  
                  }}>
                  OK
                </ButtonReact>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        </div>
    );
}


function PlanSection({ period, expert, state , upgradeSelected }: { period: "perm" | "yearly" | undefined, expert: Expert | undefined, state: RegisterExpertFormState , upgradeSelected: boolean}) {
    const disableInputPermPerice =    ((
        (!expert && period != "perm" ) ||
        (expert && expert.expertPeriod != 'perm') 
    ) && 
    !upgradeSelected)

    const defaultValueForPermPrice = (expert && expert.expertPeriod == 'perm') ? 
    expert.permPrice : 
        !expert ? 5000000 : 
         expert.monthlyPrice ? expert.monthlyPrice * 10 : 5000000

    console.log('disableInputPermPerice ' + disableInputPermPerice)


    return (
        <>
        {/* {JSON.stringify(expert)} */}
            <p className='text-sm'>Chọn các gói theo dõi, đây sẽ là thu nhập của bạn</p>
            {/* monthly  price */}
            
            <div className="mb-4 max-w-md mt-4">
                <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                    Ra giá gói theo dõi theo tháng
                </label>
                <div className="relative">
                    <TextInput
                        // id="monthlyPrice"
                        step={10000}
                        name="monthlyPrice"
                        type="number"
                        min={100000}
                        max={10000000}
                        placeholder="Số tiền nhận mỗi tháng cho một user theo dõi theo tháng"
                        // defaultValue={selectedMonthLyPrice}
                        defaultValue={expert?.monthlyPrice ?? 500000}
                        className="peer block w-full rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                        required
                    // onChange={(e) => {
                    //     const newValue = Number(e.target.value)
                    //     setselectedMonthLyPrice(Number(e.target.value))
                    // }}

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
            {(
                <div className="mb-4 max-w-md">
                    {period == 'yearly' && (<p className='mb-2 text-xs text-amber-500'>Chuyên gia chu kỳ 1 năm không thể cung cấp gói theo dõi vĩnh viễn, chọn chu kỳ trọn đời để kích hoạt gói này </p>)}
                    <label htmlFor="permPrice" className={clsx("mb-2 block text-sm font-medium", {
                        'text-zinc-500': disableInputPermPerice,
                        'text-zinc-200': !disableInputPermPerice,

                    })}>
                        Ra giá cho gói theo dõi vĩnh viễn
                    </label>
                    <div className="relative">
                        <TextInput
                            // id="permPrice"
                            disabled={disableInputPermPerice}
                            name="permPrice"
                            type="number"
                            step={10000}
                            min={500000}
                            max={50000000}
                            placeholder="Số tiền nhận 1 lần cho mỗi người theo dõi vĩnh viễn"
                            // defaultValue={selectedPermPrice}
                            defaultValue={defaultValueForPermPrice}
                            className="peer block w-full rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                            required={!disableInputPermPerice}

                        // onChange={(e) => {
                        //     const newValue = Number(e.target.value)
                        //     setselectedPermPrice(newValue)
                        // }}
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
                </div>)}
        </>
    )


}