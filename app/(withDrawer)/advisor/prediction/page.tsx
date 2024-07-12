

import ReviewPrediction from "@/app/ui/expert/reviewPrediction"
import Link from "next/link"

export default async function Page({ params }: { params: { id: string } }) {


  return (



      <div className="flex mt-10 mr-4 flex-col gap-2 ">
        <ReviewPrediction doneFetching={async () => {
        'use server'
      } } />
      
      </div>

      )
  }