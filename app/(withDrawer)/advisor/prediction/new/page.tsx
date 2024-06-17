

import  { PredictCreationForm } from "@/app/ui/expert/create-prediction-form";

export default async function Page() {

  // const preds = await getMyWIPPreds()// clientSearchCollection('expert/' + user.uid + '/preds', { status: "Inprogress" }, predConverter)
  // const sum = preds.map((i) => i.portion).reduce((a, b) => a + b, 0)
  // const remainPortion = 100 - sum
  // console.log("getMyWIPPreds : " + JSON.stringify(preds))
  
  // const queryClient = new QueryClient()
  
  return (
    <>

{/* 
<QueryClientProvider client={queryClient}> */}
      {/* <PredictCreationPage  /> */}
      <PredictCreationForm />
      {/* </QueryClientProvider> */}
    </>
  )


}