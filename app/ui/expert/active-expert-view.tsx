import { Expert, predConverter } from "@/app/lib/definitions";
import ExpertCard from "../expertcard";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ReviewPrediction from "./reviewPrediction";


export default function ActiveExpertView({expert} : {expert:Expert}) { 

  const ref = query(collection(db, 'expert/' + expert.id + '/preds'),where("status","==","justCreated")).withConverter(predConverter);


  const [preds, loading, error] = useCollectionData(ref);
     
    return (
        <>
        <ExpertCard expert={expert} />
        <ReviewPrediction preds={preds != undefined ? preds.map((pred) => {

            const dateInSecond = Number(pred.dateIn) * 1000
            const dateIn = new Date(dateInSecond)
            const deadLineSecond = Number(pred.deadLine) * 1000
            const deadLine = new Date(deadLineSecond)
            console.log("date : " + dateIn)
            return {
                id : pred.id,
                assetName: pred.assetName,
                priceIn: pred.priceIn,
                priceOut: pred.priceOut,
                cutLoss: pred.cutLoss,
                deadLine: deadLine.toLocaleString("en-GB"),
                dateIn: dateIn.toLocaleString("en-GB"),
                status: pred.status
            }
        }) : []} submit={function (predIDs: string[]): void {
                throw new Error("Function not implemented.");
            } } />
        
        
        </>
    )
}