'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import {
    CurrencyDollarIcon,
    HeartIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/app/ui/button';
import { SearchUseFormState, createNewPrediction, createNewTransaction, registerExpert, searchUserForPayment } from '@/app/lib/action';
import { useFormState } from 'react-dom';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button as ButtonReact, useDisclosure, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { CompanyRTInfo, User } from '@/app/lib/definitions';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { useFetchData } from '@/app/lib/hooks/useFetchData';


let parser = (data: { [key: string]: any }) => {
    const arr = data.Data as { [key: string]: number }[]
    return arr
}

type rawCom = {
    [key: string]: number
}


let parserCompRTInfo = (array: { [key: string]: any }[]) => {
    if (array.length == 0)
        return null
    const data = array[0]
    const result: CompanyRTInfo = {
        code: data.a,
        thamChieu: data.b,
        maxPrice: data.c,
        minPrice: data.d,
        muagia3Price: data.e,
        muagia3Volume: data.f,
        muagia2Price: data.g,
        muagia2Volume: data.h,
        muagia1Price: data.i,
        muagia1Volume: data.j,
        khoplenhTangGiam: data.k,
        khoplenhPrice: data.l,
        khoplenhVolume: data.m,
        khoplenhTotalVolume: data.n,
        bangia1Price: data.o,
        bangia1Volume: data.p,
        bangia2Price: data.q,
        bangia2Volume: data.r,
        bangia3Price: data.s,
        bangia3Volume: data.t,
        u: data.u,
        khoplenhMax: data.v,
        khoplenhMin: data.w,
        nuocngoaiBuy: data.x,
        nuocngoaiSell: data.t,
        z: data.a,
        time: data.time,
        tb: data.tb,
        ts: data.ts
    }

    return result;
}

export default function PredictCreationForm() {

    const [comps, error] = useFetchData()
    const [selectedComp, setSelectedCompComp] = useState<rawCom>()

    // const [compInfo, err] = useFetchData<CompanyRTInfo | null>("https://banggia.cafef.vn/stockhandler.ashx?userlist=" + selectedComp?.Symbol ?? "", parserCompRTInfo)   

    const [user] = useAuthState(getAuth())

    const initialFormState = { message: "", errors: {}, justDone: false };
    const [addPredictState, dispatchAddtran] = useFormState(createNewPrediction, initialFormState);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    if (addPredictState.justDone == true) {
        onOpen()
        addPredictState.justDone = false
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
                                    {addPredictState.message}
                                </p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Nullam pulvinar risus non risus hendrerit venenatis.
                                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
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
            {/* <div className='p-1'>
                {selectedComp ? selectedComp.Symbol : ""}
            </div> */}
            <form action={dispatchAddtran} className='p-4'>
                <div className="relative mb-4"> {selectedComp != null && selectedComp != undefined ? (<>Giá mua vào hiện tại {selectedComp.HighPrice} </>) : (<> Hãy chọn 1 cổ phiếu</>)}</div>

                <div className="relative mb-4">

                    {
                        (Array.isArray(comps)) ?
                            (<Autocomplete
                                name="stockCode"
                                // onKeyDown={(e) => e.co()}
                                onKeyDown={(e: any) => e.continuePropagation()}
                                label="Chọn 1 công ty"
                                className="max-w-xs"
                                isRequired
                                onSelectionChange={(index) => {
                                    console.log('aa' + index)
                                    setSelectedCompComp(comps[index as number])
                                }}
                            >

                                {comps.map((code, index) => (

                                    <AutocompleteItem key={index} value={code.Symbol} className="">
                                        {code.Symbol}
                                    </AutocompleteItem>
                                ))}
                            </Autocomplete>)
                            :
                            (<>Loading list ... </>)


                    }
                </div>
                <label htmlFor="takeProfitPrice" className="mb-2 block text-sm font-medium">
                    Giá mục tiêu chốt lãi
                </label>
                <div className="mb-4 max-w">
                    <input
                        name="takeProfitPrice"
                        className="peer block w-1/3 rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-grey-500 text-sky-500"
                        placeholder="Giá mục tiêu chốt lời"
                        // startContent={<HeartIcon size={18} />}
                        type="number"
                    />
                </div>
                <label htmlFor="cutLossPrice" className="mb-2 block text-sm font-medium">
                    Giá cắt lỗ
                </label>
                <div className="mb-4 max-w">
                    <input
                        name="cutLossPrice"
                        className="peer block w-1/3 rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-grey-500 text-sky-500"
                        placeholder="Nhap gia cat lo"
                        // startContent={<HeartIcon size={18} />}
                        type="number"
                    />
                </div>
                <label htmlFor="deadLine" className="mb-2 block text-sm font-medium">
                    Ngày cuối cùng nắm giữ
                </label>
                <div className="mb-4 max-w">
                    <input
                        name="deadLine"
                        className="peer block w-1/3 rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-grey-500 text-sky-500"
                        placeholder="Nhap ngay ket thuc"
                        // startContent={<HeartIcon size={18} />}
                        type="date"
                    />
                </div>
                {/* <div id="customer-error" aria-live="polite" aria-atomic="true">
                    {addPredictState.errors?.paymentId &&
                        addPredictState.errors.paymentId.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div> */}


                <Button type="submit">Search</Button>
                {/* <div id="customer-error" aria-live="polite" aria-atomic="true">
                    {addPredictState.errors?.assetName &&
                        addPredictState.errors?.general.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div> */}
            </form>
            <Divider />
            {/* {user ? (
                <ul>
                    <li>UID: {user.uid}</li>
                    <li>Display name: {user.displayName}</li>
                    <li>Amount: {user.amount}</li>
                    <li>Email: {user.email}</li>
                    <li>metadata: {JSON.stringify(user.metadata)}</li>
                    <li>phoneNumber: {user.phoneNumber}</li>
                    <li>disabled: {user.disabled ? "yes" : "no"}</li>
                </ul>

            ) : (
                <>
                    <Divider /></>
            )} */}

            <Divider />
            {/* {JSON.stringify(searchState.user)} */}
            <Divider />
            {/* <div>{ addPredictState.message.length == 0 ? "no error" : "cccc" + Object.keys(JSON.stringify(addPredictState.errors)).length}</div> */}

        </>
    );

}
