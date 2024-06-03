import Link from "next/link";
import ExpertCard from "./expertcard";
import { User } from "@nextui-org/user";
import { Expert } from "../model/expert";

export default function ExpertListing({ expertList }: { expertList: Expert[] }) {
  
  return (

    <div className="p-2">

      <div>
      </div>
      {/* <div className="block sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"> */}
      <div className="flex flex-wrap">
        {expertList.map(
          (expert, index) => {
            return <div key={index}>
            
              <ExpertCard expert={expert} key={index}/>
            </div>
          }
          // <Card title={expert.name}/>
        )
        }
      </div>
    </div>
  )
}