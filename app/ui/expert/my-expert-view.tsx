
import { Expert } from "@/app/model/expert";
import ReviewPrediction from "./reviewPrediction";
import ExpertHorView from "../expertHorView";


export default async function MyExpertView({ expert }: { expert: Expert }) {

    // const ref = query(collection(db, 'expert/' + expert.id + '/preds')).withConverter(predConverter);
    

    // const [data, setData] = useState<{ [key: string]: number }>();
    // const [preds, loading, error] = useCollectionData(ref);
    // console.log('predddd ' + JSON.stringify(preds))
    // const stockList = preds?.map((e) => {
    //     return e.assetName
    // })

    // console.log(JSON.stringify(expert))
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await getRealTimeStockData(stockList ?? [])
    //         console.log("stock rt price: " + JSON.stringify(data))
    //         setData(data)

    //     };
    //     const stockList = preds?.map((e) => {
    //         return e.assetName
    //     })

    //     if (stockList && stockList.length > 0) {
    //         fetchData();

    //     }


    // }, [preds]);
    //   const [rtPrice, error2] = useFetchRealTimeStockPrice(stockList ?? [])

    return (
        <>
            {/* {JSON.stringify(preds)}dd */}
            <ExpertHorView expertInfo={JSON.stringify(expert)} />
            <ReviewPrediction wip={false} doneFetching={async function (totalPortion: number): Promise<void> {
                'use server'
                // throw new Error("Function not implemented.");
            } } />


        </>
    )
}