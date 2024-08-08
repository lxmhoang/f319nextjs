'use client';
import { useRouter } from 'next/navigation'

import { useFormState } from 'react-dom';
import { createRef, useEffect, useState } from 'react';
import { Divider, Button, Link } from '@nextui-org/react';
import { ConfirmationModal } from '../confirm';
import { getVNXALLStockData } from '../../lib/getStockData';
import { createNewPrediction } from '@/app/lib/action';
import { Datepicker, Label, TextInput } from 'flowbite-react';
import { priceStockInTime, StockPriceRT } from '@/app/lib/utils';
import { SubmitButton } from '../submitButton';


let parser = (data: { [key: string]: any }) => {
    const arr = data.Data as { [key: string]: number }[]
    return arr
}

type rawCom = {
    [key: string]: number
}

const marks = Array.from(Array(11).keys()).map((num) => {
    return {
        value: num * 10,
        label: (num * 10).toString() + "%"
    }
})

export function PredictCreationForm({ remainPortion }: { remainPortion: number }) {


    const [stocksData, setStocksData] = useState<StockPriceRT[]>([])
    const [selectedStock, setSelectedStock] = useState<StockPriceRT | undefined>()
    const selectedPrice = selectedStock ? priceStockInTime(selectedStock, 'favorHigh') : undefined
    const minTakeProfitPrice = selectedPrice ? Math.round(selectedPrice * 1.2 * 100) / 100 : undefined
    const maxCutLossPrice = selectedPrice ? Math.round(selectedPrice * 0.8 * 100) / 100 : undefined

    const router = useRouter()

    const initialFormState = { message: "", errors: {}, justDone: false };
    const [addPredictState, dispatchAddtran] = useFormState(createNewPrediction.bind(null, selectedStock?.code, selectedPrice), initialFormState);
    const [showModal, setShowModal] = useState(false);
    const minDeadLine = new Date(new Date().getTime() + (10 * 24 * 60 * 60 * 1000)) // 10 ngay sau 
    const defaultDeadLine = new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)) // 20 ngay sau


    useEffect(() => {
        // console.log("state " + JSON.stringify(addPredictState) + showModal)
        if (addPredictState.justDone == false && addPredictState.message && addPredictState.message.length > 0) {
            setShowModal(true)
        }
        if (addPredictState.justDone == false && addPredictState.message && addPredictState.message.length > 0) {
            // show popup
            // console.log('11111')
            setShowModal(true)
        } else {
            if (addPredictState.justDone == true) {
                setShowModal(true)
            }
        }

    }, [addPredictState])


    const handleCloseModal = () => {
        if (addPredictState.justDone == true) {
            router.push('/advisor/prediction')
        }
        setShowModal(false)
    };

    useEffect(() => {
        // console.log(' getting local stock list')
        const fetchData = async () => {
            // const result = await getLocalStockList() as { code: string, name: string }[]
            try {
                const result = await getVNXALLStockData()
                setStocksData(result)
            } catch (error) {
                setStocksData([])
            }

        }
        fetchData()

    }, [])

    const ref = createRef<HTMLFormElement>();
    const codeInputRef = createRef<HTMLInputElement>()

    if (!stocksData) {
        return (
            <>Loading ... </>
        )
    }

    return (
        <>
            <>
            </>
            <div className="relative mb-8 p-4 space-y-2">
                {/* <Label value="Hãy chọn 1 cổ phiếu" /> */}
                <div className=""> {!selectedStock ?
                    (<> Nhập mã cổ phiếu</>) :
                    selectedPrice ?

                        (<>{selectedStock.name}</>) :
                        <>Đang lấy giá cổ phiếu ... </>

                }</div>
                <div className='flex space-x-4'>
                    <TextInput ref={codeInputRef} className='w-[140px]' onChange={(e) => {
                        let onlyChar = e.target.value.replace(/[^a-zA-Z0-9]/gm, "")
                        let value = onlyChar.toUpperCase()
                        if (value.length > 3 && !value.startsWith('FUE')) {
                            value = value.slice(value.length - 3, value.length)
                        } else if (value.length > 8 && value.startsWith('FUE')) {
                            value = value.slice(value.length - 8, value.length)
                        }
                        e.target.value = value
                    }} />
                    <Button color='primary' onClick={() => {
                        if (codeInputRef.current) {
                            const result = stocksData.find((it) => { return it.code == codeInputRef.current!.value })
                            console.log('result ' + JSON.stringify(result))
                            // if (result) {
                            setSelectedStock(result)
                            ref.current?.reset()

                            // }
                        }

                    }} > Chọn </Button>
                </div>
            </div>

            <Divider />
            {
                selectedStock && selectedPrice && selectedPrice && maxCutLossPrice && minTakeProfitPrice && (
                    <form ref={ref} action={dispatchAddtran} className='p-4'  >

                        <div className="mb-4 mr-8 block max-w-screen-sm">
                            Giá mua hiện tại (không thể thay đổi)
                            <TextInput className='w-1/2' type="number"  name="tempPriceIn" defaultValue={selectedPrice.toString()} disabled />
                        </div>
                        <div className="mb-2 mr-4 block max-w-screen-sm gap-2" >
                            <Label value={"Chọn giá chốt lãi (dương ít nhất 20%), từ " + minTakeProfitPrice + " trở lên"} />
                            <TextInput className='w-1/2' type="number" step="any" name="takeProfitPrice"
                                defaultValue={(minTakeProfitPrice + 1).toString()} placeholder={" >=  " + minTakeProfitPrice.toString()} required disabled={selectedPrice == undefined}
                            />
                        </div>
                        <div className="mb-8 max-w max-w-screen-sm">
                            <Label value={"Chọn giá cắt lỗ (âm ít nhất 20%), từ " + maxCutLossPrice.toString() + " trở xuống "} />
                            <TextInput className='w-1/2'  type="number" step="any" name="cutLossPrice" defaultValue={(maxCutLossPrice - 1).toString()} required disabled={selectedPrice == undefined}
                            />
                        </div>

                        <div className="mb-8 block max-w-screen-sm">
                            <div className="mb-2 "><Label htmlFor="deadLine" value="Deadline nắm giữ, (sau ngày này hệ thống sẽ tự chốt theo giá thị trường" /></div>
                            <div className="mb-2"><Label htmlFor="desDeadLine" className='text-xs' value={"Deadline phải ít nhất sau hôm nay 10 ngày, từ " + minDeadLine.toLocaleDateString('vi')} /></div>
                            <Datepicker className='w-1/2' name="deadLine" defaultDate={defaultDeadLine} minDate={minDeadLine} autoHide={true} maxDate={new Date(2027, 1, 1)} required />
                        </div>
                        {remainPortion != undefined && (<div className="mb-14 max-w-sm">

                            <div className="mb-2"><Label className="mb-14 max-w-xs" value={"Phân bổ tỷ lệ cổ phiếu này trên tổng vốn. Bạn còn " + remainPortion + "%"} /></div>

                            <TextInput className='w-1/2' step={1} type="number" name="portion" placeholder={"<= " + remainPortion} max={remainPortion} required />
                            
                        </div>)}
                        <div className='mb-4 mr-4 max-w-full'>
                            {(remainPortion != undefined && remainPortion < 100) && (<div className='mb-4 mt-4 '> <p>{100 - remainPortion}% vốn đang ngâm trong các khuyến nghị đang tiếp diễn, cân nhắc <Link href="/advisor">kết thúc một vài cái </Link> để tăng tỷ lệ cho khuyến nghị đang tạo</p> </div>)}

                        </div>

                        <SubmitButton pendingText={'Đang tạo  ... '}  color="indigo" > Tạo khuyến nghị </SubmitButton>


                    </form>
                )
            }
            <Divider />

            <ConfirmationModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onLeftButtonClick={handleCloseModal}
                title={""}
                message={addPredictState.message ?? "No message"}
                leftButtonText={"Okey"}
            />

        </>
    );

}
