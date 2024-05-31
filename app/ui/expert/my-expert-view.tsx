import { Expert } from "@/app/model/expert";
import ExpertCard from "../expertcard";
import { collection, or, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ReviewPrediction from "./reviewPrediction";
import { useFetchRealTimeStockPrice } from "@/app/lib/hooks/useFetchRealTimeStockPrice";
import { useEffect, useState } from "react";
import { getRealTimeStockData } from "@/app/lib/getStockData";
import { predConverter } from "@/app/model/prediction";


export default function MyExpertView({ expert }: { expert: Expert }) {

    const ref = query(collection(db, 'expert/' + expert.id + '/preds')).withConverter(predConverter);


    const [data, setData] = useState<{ [key: string]: number }>();
    const [preds, loading, error] = useCollectionData(ref);
    console.log('predddd ' + JSON.stringify(preds))
    const stockList = preds?.map((e) => {
        return e.assetName
    })

    console.log(JSON.stringify(expert))
    useEffect(() => {
        const fetchData = async () => {
            const data = await getRealTimeStockData(stockList ?? [])
            console.log("stock rt price: " + JSON.stringify(data))
            setData(data)

        };
        const stockList = preds?.map((e) => {
            return e.assetName
        })

        if (stockList && stockList.length > 0) {
            fetchData();

        }


    }, [preds]);
    //   const [rtPrice, error2] = useFetchRealTimeStockPrice(stockList ?? [])

    return (
        <>
            {/* {JSON.stringify(preds)}dd */}
            <ExpertCard expert={expert} />
            <ReviewPrediction preds={preds != undefined ? preds.map((pred) => {
                const curPrice = data ? data[pred.assetName] : 0
                console.log("vvvv : " + pred.deadLine)
                return {
                    id: pred.id,
                    assetName: pred.assetName,
                    priceIn: pred.priceIn.toFixed(2),
                    priceOut: pred.priceOut.toFixed(2),
                    deadLine: pred.deadLine.toLocaleDateString('vi'),
                    dateIn: pred.dateIn.toLocaleDateString('vi'),
                    cutLoss: pred.cutLoss.toFixed(2),
                    status: pred.status,
                    curPrice: curPrice.toFixed(2),
                    curStatus: (curPrice * 100 / pred.priceIn - 100).toFixed(2) + "%"
                }
            }) : []} submit={function (predIDs: string[]): void {
                throw new Error("Function not implemented.");
            }} />


        </>
    )
}