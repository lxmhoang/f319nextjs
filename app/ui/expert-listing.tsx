import ExpertCard from "./expertcard";

export default function ExpertListing({expertList} : {expertList: {imageURL: string, id: string, name: string, followerNum: number, selfIntro: string, shortInfo: string}[]}) {
    return (
<div className="p-5">
    <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {expertList.map(
            (expert, index) =>  {
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