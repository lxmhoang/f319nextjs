
import { Expert } from "@/app/model/expert";
import ReviewPrediction from "./reviewPrediction";
import ExpertHorView from "../expertHorView";


export default async function MyExpertView({ expert }: { expert: Expert }) {

    

    return (
        <>
            {/* {JSON.stringify(preds)}dd */}
            <ExpertHorView expertInfo={JSON.stringify(expert)} />
            <ReviewPrediction doneFetching={async function (totalPortion: number): Promise<void> {
                'use server'
                // throw new Error("Function not implemented.");
            } } />


        </>
    )
}