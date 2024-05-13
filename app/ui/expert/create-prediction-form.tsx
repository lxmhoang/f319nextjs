'use client';
import { useRouter } from 'next/navigation'

import { Button } from '@/app/ui/button';
import { createNewPrediction } from '@/app/lib/action';
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { Divider, useDisclosure, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { CompanyRTInfo } from '@/app/lib/definitions';
import { ConfirmationModal } from '../confirm';
import { useAppContext } from '@/app/lib/context';
import { getLocalStockList, getRealTimeStockData } from '@/app/lib/getStockData';


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

    // const [comps, error] = useFetchData()
    const [selectedStock, setSelectedStock] = useState<string>()
    const [selectedStockPrice, setSelectedStockPrice] = useState<number>()
    const [stockCodes, setStockCodes] = useState<string[]>([])
    // const [selectedComp, setSelectedCompComp] = useState<rawCom>()
    const minTakeProfitPrice = selectedStockPrice ? selectedStockPrice * 1.1 : 0
    const maxCutLossPrice = selectedStockPrice ? selectedStockPrice * 0.9 : 0

    // const [compInfo, err] = useFetchData<CompanyRTInfo | null>("https://banggia.cafef.vn/stockhandler.ashx?userlist=" + selectedComp?.Symbol ?? "", parserCompRTInfo)   

    const router = useRouter()
    const { user} = useAppContext()

    const initialFormState = { message: "", errors: {}, justDone: false };
    const [addPredictState, dispatchAddtran] = useFormState(createNewPrediction, initialFormState);
    const [showModal, setShowModal] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    console.log('render with add predict state : ' + JSON.stringify(addPredictState))
    if (addPredictState.justDone == true) {
        setShowModal(true)
        addPredictState.justDone = false
    }
    
    const handleLeftBtn = () => {
        router.push('/profile/expert')
        setShowModal(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        console.log('getting local stock list')
        const fetchData = async () => {
            const result = await getLocalStockList()

        console.log('fetched local stock list' + result)
            setStockCodes(result)
        }
        fetchData()

    } , [])

    useEffect(() => {
        const fetchData = async () => {
            console.log('getting price of selected stock : ' + selectedStock)
            if (selectedStock) {
                const result = await getRealTimeStockData([selectedStock])
                const price = result[selectedStock]
                setSelectedStockPrice(price)
            }
        }
        fetchData()


    }, [selectedStock])

    return (
        <>

            {/* <Modal className='dark' isOpen={isOpen} onOpenChange={onOpenChange}>
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
            </Modal> */}
            {/* <div className='p-1'>
                {selectedComp ? selectedComp.Symbol : ""}
            </div> */}
            <form action={dispatchAddtran} className='p-4'>


                <div className="relative mb-4"> {selectedStock != null && selectedStock != undefined ? (<>Giá mua vào hiện tại {selectedStockPrice} </>) : (<> Hãy chọn 1 cổ phiếu</>)}</div>
                <input type="hidden" name="priceIn" value={selectedStockPrice ?? 0}></input>
                {/* <input type="hidden" name="uid" value={getAuth().currentUser?.uid ?? ""}></input> */}
                <div className="relative mb-4">

                    {
                        (stockCodes.length > 0) ?
                            (<Autocomplete
                                name="assetName"
                                // onKeyDown={(e) => e.co()}
                                onKeyDown={(e: any) => e.continuePropagation()}
                                // label="Chọn 1 công ty"
                                className="max-w-xs"
                                isRequired
                                onSelectionChange={(index) => {
                                    console.log('aa' + index)
                                    setSelectedStock(stockCodes[index as number])
                                    // setSelectedCompComp(comps[index as number])
                                }}
                            >

                                {stockCodes.map((code, index) => (

                                    <AutocompleteItem key={index} value={code} className="">
                                        {code}
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
                        // min={minTakeProfitPrice}
                    />
                </div>
                <div id="customer-error" aria-live="polite" aria-atomic="true">
                    {/* {addPredictState.errors?.priceOut &&
                        addPredictState.errors.priceOut.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))} */}
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
                        //  max={maxCutLossPrice}
                    />
                </div>
                <div id="customer-error" aria-live="polite" aria-atomic="true">
                    {/* {addPredictState.errors?.cutLoss &&
                        addPredictState.errors.cutLoss.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))} */}
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
                <div id="customer-error" aria-live="polite" aria-atomic="true">
                    {/* {addPredictState.errors?.deadLine &&
                        addPredictState.errors.deadLine.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))} */}
                </div>


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
           
            <ConfirmationModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onLeftButtonClick={handleLeftBtn}
                title={"Đã tạo xong khuyeens nghị33"}
                message={addPredictState.message ?? "No message"}
                leftButtonText={"Okey"}
            />

        </>
    );

}
