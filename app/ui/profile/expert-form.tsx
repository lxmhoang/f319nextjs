'use client';
import Link from 'next/link';
import {
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom';
import { Button, Divider } from "@nextui-org/react";
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../confirm';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { RegisterExpertFormState, editExpert } from '../../lib/actions/actionEditExpert';
import React from 'react';

import { Expert } from '@/app/model/expert';
import { compressFile, convert } from '@/app/lib/utils';
import { Checkbox, Label, Radio, Spinner, TextInput } from 'flowbite-react';
import { useAppContext } from '@/app/lib/context';
import { postIdToken } from '@/app/lib/firebase/auth';
import { redirect } from 'next/navigation';

// export function ExpertFormComponent({ expert }: { expert: Expert | undefined }) {

//     const userInfo = useAppContext()


//     return (
//         <>
//             {userInfo && userInfo.firebaseUser ?
//                 <FormExpert expert={expert} />
//                 :
//                 <div>Loading user info</div>
//             }
//         </>
//     )

// }


export function ExpertFormComponent({ expertInfo }: { expertInfo: string | undefined }) {

    const expert: Expert | undefined = expertInfo ? JSON.parse(expertInfo) : undefined

    const userInfo = useAppContext()

    const router = useRouter()


    // const [selectedMonthLyPrice, setselectedMonthLyPrice] = useState<number>(expert ? expert.monthlyPrice : 100000)
    // const [selectedPermPrice, setselectedPermPrice] = useState<number>(expert ? expert.permPrice : 500000)
    // const registerPrice = Number(Number(selectedMonthLyPrice * 5) + Number(selectedPermPrice))

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


    const amount = userInfo.user?.amount ?? 0

    const [uploadAvatar, setUpload] = useState<File>()
    const [acceptTNC, setAcceptTNC] = useState<boolean>(false)

    const [compressing, setCompressing] = useState<boolean>(false)
    const [didChange, setDidChange] = useState<boolean>(false)

    const initialState = { message: undefined, errors: {}, justDone: false };
    const [fileInside, setFileInside] = useState<FormData>()

    const currentAvatarURL = expert ? expert.imageURL :
        userInfo.firebaseUser?.photoURL


    const [state, dispatch] = useFormState<RegisterExpertFormState, FormData>(editExpert.bind(null, fileInside, currentAvatarURL, expert == undefined), initialState);

    const [showModal, setShowModal] = useState(false);
    // console.log('form state ' + JSON.stringify(state) + showModal)
    useEffect(() => {
        const refreshToken = async () => {
            if (!userInfo.firebaseUser) { return }
            const newIdtoken = await userInfo.firebaseUser.getIdToken(true)
            console.log(' ========= newIdtoken ' + newIdtoken)
            const newResult = await userInfo.firebaseUser.getIdTokenResult()
            console.log(' ========= newResult ' + JSON.stringify(newResult.claims))
            var result: boolean
            try {
                result = await postIdToken(newIdtoken)
            } catch (e) {
                console.log('sth wrong with post new ID token')
                result = false
            }
            if (result) {
                console.log('aaaaa done post new ID token')
                state.message = null
            } else {
                console.log('sth wrong with post new ID token')
                state.message = null
            }

        }

        if (state.justDone && userInfo.firebaseUser) {
            if (!expert) {
                refreshToken()
            } else {
                redirect('/advisor')
                // router.replace
            }
        }
        setDidChange(false)

    }, [state])


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


    console.log("state " + JSON.stringify(state) + showModal)
    if (state.message && state.message.length > 0 && showModal == false) {
        setShowModal(true)
    }
    const handleTapOkey = async () => {
        // handleNewPassword();
        // go go go
        if (state.justDone && userInfo.firebaseUser && !expert) {

            setShowModal(false);
            router.replace('/advisor')
        } else {
            state.message = undefined
            state.justDone = false
            setShowModal(false);
        }
    };

    const handleConfirmationCancel = () => {
        setShowModal(false);
    };

    return (


        <div className='p-1'>
            <ConfirmationModal
                isOpen={showModal}
                onClose={handleConfirmationCancel}
                onLeftButtonClick={handleTapOkey}
                title={state.message ?? "No message"}
                message={""}
                leftButtonText='Okey'
            />
            <div className='mb-1'>
                {expert ? "Edit expert info" : "Create new expert"}
            </div>
            <Divider />
            <form action={dispatch} className='mt-5' onChange={(e) => {
                const formData = new FormData(e.currentTarget)
                checkInfoChange(formData)
            }}>

                <div className="rounded-md bg-black-50">
                    {/* <input type="hidden" id="uid" name="uid" value={userInfo.uid} /> */}
                    {/* Name */}
                    <div className="mb-4 max-w-sm">
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
                                    defaultValue={expert ? expert.name : userInfo.firebaseUser?.displayName ?? ""}
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
                    {
                        (expert && expert.expertType == 'solo') && (
                            <PlanSection expert={expert} state={state} />
                        )
                    }


                    {!expert && (
                        <div className="mb-4 max-w-sm">
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
                                    <Label className=''>{"Solo, thu nhập từ tập follower riêng "}</Label>
                                </div>
                                {
                                    type == "solo" &&
                                    <>
                                        <div className='ml-12'>
                                            <Radio id="expertPeriod" name="expertPeriod" defaultChecked={period == "perm"} value="perm" onChange={(e) => {
                                                if (e.target.checked) {
                                                    setPeriod("perm")
                                                }
                                            }} />
                                            <Label className=''>{"Trọn đời " + convert(Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_PERM))}</Label>
                                        </div>

                                        <div className='ml-12'>
                                            <Radio id="expertPeriod" name="expertPeriod" defaultChecked={period == "yearly"} value="yearly" onChange={(e) => {
                                                if (e.target.checked) {
                                                    setPeriod("yearly")
                                                }
                                            }} />
                                            <Label className=''>{"Một năm " + convert(Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_SOLO_YEAR))}</Label>
                                        </div>
                                        <div className='ml-12'>
                                        {period && <PlanSection expert={expert} state={state} />}
                                        </div>

                                    </>
                                }

                                {/* <span className="mb-2 text-xs font-normal">
                                *Có thể chọn đua rank dự thưởng
                            </span> */}
                                <div className="flex items-center gap-2">
                                    <Radio id="expertRankType" name="expertType" defaultChecked={type == "rank"} value="rank" onChange={(e) => {
                                        if (e.target.checked) {
                                            setType("rank")
                                            setPeriod(undefined)
                                        }
                                    }} />
                                    <Label className=''>{"Rank, thu nhập từ đoạt top performance từng kỳ "}

                                    </Label>

                                </div>
                                {
                                    type == "rank" &&
                                    <>
                                        <div className='ml-12'>
                                            <Radio id="expertPeriod" name="expertPeriod" value="perm" defaultChecked={period == "perm"} onChange={(e) => {
                                                if (e.target.checked) {
                                                    setPeriod("perm")
                                                }
                                            }} />
                                            <Label className=''>{"Trọn đời " + convert(Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_PERM))}</Label>
                                        </div>

                                        <div className='ml-12'>
                                            <Radio id="expertPeriod" name="expertPeriod" value="yearly" defaultChecked={period == "yearly"} onChange={(e) => {
                                                if (e.target.checked) {
                                                    setPeriod("yearly")
                                                }
                                            }} />
                                            <Label className=''>{"Một năm " + convert(Number(process.env.NEXT_PUBLIC_EXPERT_REG_FEE_RANK_YEAR))}</Label>
                                        </div></>
                                }
                            </fieldset>

                            {(!type || !period) && <span className='text-rose-300 text-sm'>Hãy chọn loại tư vấn và thời hạn tư vấn</span>}
                        </div>)}

                    {
                        (expert) && (
                            <>
                                <div className="mb-4 max-w-sm">
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
                                    <div className="ml-8 mb-4 max-w-sm">
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


                    {/* Short intro */}
                    <div className="mb-4 max-w-sm">
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
                                    defaultValue={expert ? expert.shortIntro : "Chuyên gia tư vấn " + userInfo.firebaseUser?.displayName}
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
                    <div className='mb-4 max-w-sm'>
                        <label htmlFor="avatarInfo" className="mb-2 block text-sm font-medium">
                            Ảnh đại diện
                        </label>
                        <div className="m-4">
                            {!compressing && avatarURL ?
                                (<div >
                                    <Image className='rounded-full'
                                        src={avatarURL}
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
                                    <> <span className='text-rose-300 text-sm'>Hãy upload ảnh đại diện</span></>
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
                    (<div className="flex justify-start gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <Checkbox id="accept" checked={acceptTNC} onChange={(e) => {
                                setAcceptTNC(e.target.checked)

                            }} />
                            <Label htmlFor="accept" className="flex">
                                Tôi đã đọc và đồng ý với&nbsp;
                                <a href="/tnc" className="text-cyan-600 hover:underline dark:text-cyan-500">
                                    điều khoản và điền kiện của trang web
                                </a>
                            </Label>
                        </div>
                    </div>)}
                {(fee != undefined && fee > amount) && <span className='text-rose-400 text-sm'>Phí đăng ký là {fee} trong khi số tiền của bạn là {amount}, vui lòng nạp thêm</span>}

                <div className="flex justify-start gap-4 mt-12">
                    <Link
                        href="/"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Cancel
                    </Link>
                    <Button type="submit" color='primary' isDisabled={(fee == undefined || fee > amount) || (!acceptTNC && !expert) || compressing || !avatarURL || (expert != undefined && !didChange && !fileInside)}>{expert ? "Update thông tin " +
                        ((fee && fee > 0) ? convert(fee ?? 0) : "") : "Đăng ký" + convert(fee ?? 0)}</Button>
                </div>
            </form>

        </div>
    );
}


function PlanSection({expert, state} : {expert : Expert | undefined, state: RegisterExpertFormState}) {

    return (
        <>
            {/* monthly  price */}
            <div className="mb-4 max-w-sm">
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
                        defaultValue={expert?.monthlyPrice}
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
            <div className="mb-4 max-w-sm">
                <label htmlFor="permPrice" className="mb-2 block text-sm font-medium">
                    Ra giá cho gói theo dõi vĩnh viễn
                </label>
                <div className="relative">
                    <TextInput
                        // id="permPrice"
                        name="permPrice"
                        type="number"
                        step={10000}
                        min={500000}
                        max={50000000}
                        placeholder="Số tiền nhận 1 lần cho mỗi người theo dõi vĩnh viễn"
                        // defaultValue={selectedPermPrice}
                        defaultValue={expert?.permPrice}
                        className="peer block w-full rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                        required

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
            </div>
        </>
    )

}