'use client';
import { useRouter } from 'next/navigation'

import { useFormState } from 'react-dom';
import { createRef, useEffect, useState } from 'react';
import { Divider, useDisclosure, Autocomplete, AutocompleteItem, Slider, Button } from '@nextui-org/react';
import { ConfirmationModal } from '../confirm';
import { getLocalStockList, getRealTimeStockData } from '../../lib/getStockData';
import { createNewPrediction } from '@/app/lib/action';
// import { Button } from '../button';
import { Datepicker, Label, TextInput } from 'flowbite-react';
import ReviewPrediction from './reviewPrediction';


let parser = (data: { [key: string]: any }) => {
    const arr = data.Data as { [key: string]: number }[]
    return arr
}

type rawCom = {
    [key: string]: number
}
// {
//     value: 0,
//     label: "0%",
//   },

const marks = Array.from(Array(11).keys()).map((num) => {
    return {
        value: num * 10,
        label: (num * 10).toString() + "%"
    }
})

export function PredictCreationForm() {

    const [remainPortion, setRemainPortion] = useState<number>()
    const [selectedStock, setSelectedStock] = useState<{ code: string, name: string }>()
    const [selectedStockPrice, setSelectedStockPrice] = useState<{ high: number, low: number }>()
    const [stocksData, setStocksData] = useState<{ code: string, name: string }[]>([])
    const stockCodes = stocksData.map((item) => item.code)
    const [portion, setPortion] = useState<number>(0)
    const minTakeProfitPrice = selectedStockPrice ? Math.round(selectedStockPrice.high * 1.2 * 100) / 100 : undefined
    const maxCutLossPrice = selectedStockPrice ? Math.round(selectedStockPrice.high * 0.8 * 100) / 100 : undefined

    const router = useRouter()

    const initialFormState = { message: "", errors: {}, justDone: false };
    const [addPredictState, dispatchAddtran] = useFormState(createNewPrediction.bind(null, selectedStockPrice?.high), initialFormState);
    const [showModal, setShowModal] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const minDeadLine = new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000)) // 5 ngay sau 
    const defaultDeadLine = new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)) // 20 ngay sau
    if (addPredictState.justDone == true) {
        setShowModal(true)
        addPredictState.justDone = false
    }

    const handleLeftBtn = () => {
        router.push('/advisor/prediction')
        setShowModal(false)
    };

    const handleCloseModal = () => {
        setShowModal(false)
    };

    useEffect(() => {
        console.log(' getting local stock list')
        const fetchData = async () => {
            const result = await getLocalStockList() as { code: string, name: string }[]

            // console.log('fetched local stock list' + result)
            setStocksData(result)
        }
        fetchData()

    }, [])

    useEffect(() => {
        const fetchData = async () => {
            console.log('aaaa --- selected stock : ' + selectedStock)
            if (selectedStock) {
                const result = await getRealTimeStockData([selectedStock.code])
                const price = result[selectedStock.code]
                setSelectedStockPrice(price)
            } else {
                setSelectedStockPrice(undefined)
            }
        }
        ref.current?.reset()
        fetchData()


    }, [selectedStock])


    const ref = createRef<HTMLFormElement>();

    return (
        <>
            <>
                {/* <div>selected  : {selectedStock.code ?? "undefined"}</div>
         price : {queryPrice.error ? "Error" : queryPrice.isLoading ? 'Loading ' : queryPrice.data ? JSON.stringify(queryPrice.data)  : "No data" } 
        {} */}
            </>

            <Divider />
            <form ref={ref} action={dispatchAddtran} className='p-4'  >
                {/* <Label value="Hãy chọn 1 cổ phiếu" /> */}
                <div className="relative mb-2"> {!selectedStock ?
                    (<> Hãy chọn 1 cổ phiếu</>) :
                    selectedStockPrice ?

                        (<>{selectedStock.name}</>) :
                        <>Fetching stock price</>

                }</div>
                {/* <input type="hidden" name="priceIn" value={selectedStockPrice ?? 0}></input> */}
                {/* <input type="hidden" name="uid" value={getAuth().currentUser?.uid ?? ""}></input> */}
                <div className="relative mb-8">

                    {
                        (stockCodes.length > 0) ?
                            (<Autocomplete
                                allowsEmptyCollection={false}
                                // defaultSelectedKey={selectedStock.code}
                                // onClose={() => {}}
                                onClear={() => { setSelectedStock(undefined) }}
                                aria-label='assetNamePicker'
                                name="assetName"
                                // onKeyDown={(e) => e.co()}
                                onKeyDown={(e: any) => e.continuePropagation()}
                                // label="Chọn 1 công ty"
                                className="max-w-xs"
                                isRequired
                                onSelectionChange={(key) => {
                                    console.log('aaaaaaa --- index' + key)
                                    if (key) {
                                        const index = key as number
                                        setSelectedStock(stocksData[index])
                                    } else {
                                        setSelectedStock(undefined)
                                    }
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


                {
                    selectedStock && selectedStockPrice && maxCutLossPrice && minTakeProfitPrice && (
                        <><div className="mb-2 mr-4 block max-w-screen-sm">
                            Giá mua vào hiện tại {selectedStockPrice?.high}
                        </div>
                            {/* <></> */}
                            <div className="mb-2 mr-4 block max-w-screen-sm">
                                <Label value={"Chọn giá chốt lãi (120-200%): " + minTakeProfitPrice + "-" + (selectedStockPrice.high * 2).toFixed(1) + ""} />
                                <TextInput className='w-1/2' step={0.1} type="number" name="takeProfitPrice" 
                                 defaultValue={minTakeProfitPrice} placeholder={"Chọn trong khoảng " + minTakeProfitPrice.toString() + "-" + (selectedStockPrice.high * 2)} required disabled={selectedStockPrice == undefined} onChange={(e) => {
                                    // console.log('aaaa ' + e.target.value)
                                    //       const value = Number(e.target.value)
                                    //       if (value < minTakeProfitPrice) {
                                    //         console.log('vvvvv ')
                                    //           e.target.value = minTakeProfitPrice.toFixed(1)
                                    //       }
                                    //       if (value > selectedStockPrice?.high * 2) {
                                    //         console.log('zzzzz ')
                                    //           e.target.value = (selectedStockPrice?.high * 2).toFixed(1)

                                    //       }
                                }} onBlur={(e) => {
                                    // console.log('aaaa ' + e.target.value)
                                    const value = Number(e.target.value)
                                    if (value < minTakeProfitPrice) {
                                        e.target.value = minTakeProfitPrice.toString()
                                    }
                                    if (value > selectedStockPrice?.high * 2) {
                                        e.target.value = (selectedStockPrice?.high * 2).toString()

                                    }
                                }} />
                            </div>
                            <div className="mb-8 max-w max-w-screen-sm">
                                <Label value={"Chọn giá cắt lỗ (50-80%): " + (selectedStockPrice.high / 2).toString() + "-" + maxCutLossPrice} />
                                =={maxCutLossPrice}=={selectedStockPrice.high}****
                                <TextInput className='w-1/2' step={0.01} type="number" name="cutLossPrice" placeholder={"Chọn trong khoảng " + (selectedStockPrice.high / 2).toString() + "-" + maxCutLossPrice} defaultValue={maxCutLossPrice} required disabled={maxCutLossPrice == undefined} onBlur={(e) => {
                                    // console.log('aaaa ' + e.target.value)
                                    const value = Number(e.target.value)
                                    if (value > maxCutLossPrice) {
                                        e.target.value = maxCutLossPrice.toString()
                                    }
                                    if (value < selectedStockPrice.high / 2) {
                                        e.target.value = (selectedStockPrice.high / 2).toString()

                                    }


                                }} />
                            </div>

                            <div className="mb-8 block max-w-screen-sm">
                                <div className="mb-2"><Label htmlFor="deadLine" value="Deadline nắm giữ, sau ngày này sẽ tự chốt theo giá thị trường" /></div>
                                <div className="mb-2"><Label htmlFor="desDeadLine" value={"Chọn kể từ ngày  " + minDeadLine.toLocaleDateString('vi')} /></div>
                                <Datepicker className='w-1/2' name="deadLine" defaultDate={defaultDeadLine} minDate={minDeadLine} autoHide={true} maxDate={new Date(2027, 1, 1)} required />
                            </div>
                            {remainPortion != undefined && (<div className="mb-14 max-w-sm">

                                <div className="mb-2"><Label className="mb-14 max-w-xs" value={"Phân bổ tỷ lệ cổ phiếu này trên tổng vốn. Bạn còn " + remainPortion + "%"} /></div>
                                {/* <div>
                                    <p>Các khuyến nghị đang tiếp diễn </p>
                                </div> */}

                                <Slider
                                    name='portion'
                                    label={"Đã chọn " + portion + "%"}
                                    step={10}
                                    maxValue={100}
                                    minValue={0}
                                    value={portion}
                                    showSteps
                                    showTooltip
                                    showOutline
                                    onChange={(e) => {
                                        if (typeof e == 'number') {
                                            if (e > remainPortion) {
                                                setPortion(remainPortion)
                                            } else {
                                                setPortion(e)
                                            }
                                        }
                                    }
                                    }
                                    marks={marks}

                                    className="max-w-sm mt-30"
                                />
                            </div>)}
                            <div className='mb-4 mr-4 max-w-full'>
                                {(remainPortion != undefined && remainPortion < 100) && (<div className='mb-4 mt-4 '> <p>{100 - remainPortion}% vốn đang ngâm trong các khuyến nghị đang tiếp diễn, kết thúc một vài cái để tăng tỷ lệ cho khuyến nghị đang tạo</p> </div>)}
                                <div className="">
                                    <ReviewPrediction doneFetching={(total) => {
                                        setRemainPortion(100 - total);
                                    }} wip={true} />
                                </div>
                            </div>
                            <Button type="submit" color='primary' isDisabled={portion == 0}>Tạo khuyến nghị </Button>
                        </>

                    )
                }
                <div id="customer-error" aria-live="polite" aria-atomic="true">
                    {/* {addPredictState.errors?.priceOut &&
                        addPredictState.errors.priceOut.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))} */}
                </div>
                {/* <label htmlFor="cutLossPrice" className="mb-2 block text-sm font-medium">
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
                </div> */}
                <div id="customer-error" aria-live="polite" aria-atomic="true">
                    {/* {addPredictState.errors?.cutLoss &&
                        addPredictState.errors.cutLoss.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))} */}
                </div>
                {/* <label htmlFor="deadLine" className="mb-2 block text-sm font-medium">
                    Ngày cuối cùng nắm giữ
                </label> */}
                {/* <div className="mb-4 max-w">
                    <input
                        name="deadLine"
                        className="peer block w-1/3 rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-grey-500 text-sky-500"
                        placeholder="Nhap ngay ket thuc"
                        // startContent={<HeartIcon size={18} />}
                        type="date"
                    />
                </div> */}


                <div id="customer-error" aria-live="polite" aria-atomic="true">
                    {/* {addPredictState.errors?.deadLine &&
                        addPredictState.errors.deadLine.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))} */}
                </div>


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
                title={"Đã tạo xong khuyến nghị"}
                message={addPredictState.message ?? "No message"}
                leftButtonText={"Okey"}
            />

        </>
    );

}
