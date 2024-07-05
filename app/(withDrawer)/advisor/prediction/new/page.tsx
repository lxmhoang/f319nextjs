import { getMyWIPPreds } from "@/app/lib/server";
import { PredictCreationForm } from "@/app/ui/expert/create-prediction-form";

export default async function Page() {
  const wipPreds = await getMyWIPPreds()
  const totalUsedPortion = wipPreds.map((item) => { return item.portion}).reduce((a, b) => a + b, 0)

  return (
    <>
      <PredictCreationForm remainPortion={100-totalUsedPortion}  />
    </>
  )


}