import Link from "next/link";
import ExpertCard from "./expertcard";
import { Expert } from "../lib/definitions";
import { User } from "@nextui-org/user";

export default function ExpertListing({ expertList }: { expertList: Expert[] }) {
  
  return (

    <div className="p-5">

      <div>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {expertList.map(
          (expert, index) => {
            const image = expert.imageURL
            //   console.log("aaaa" + expert.imageURL);
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