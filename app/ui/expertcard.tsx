import { Card, CardBody, CardFooter, CardHeader, Divider, Image } from "@nextui-org/react";
import Link from 'next/link'
export default function ExpertCard({expert}: {expert: {imageURL: string, id: string, name: string, followerNum: number, selfIntro: string, shortInfo: string}}) {
    return (
      <Link href={{pathname:`/expertdetails/${expert.id}`}}>
    <div className="border p-2 rounded-sm">
    <Card className="">
  <CardHeader className=" gap-3">
    {<Image
      alt="nextui logo"
      radius="sm"
      // fill = "true"
      src = {expert.imageURL}
    /> }
  </CardHeader>

  <div className="flex flex-wrap">
      <p className="text-small text-default-500">{expert.name}</p>
    </div>
  <Divider/>
  <CardBody>
    <p>Tỷ lệ lãi 12/94</p>
  </CardBody>
  {/* <Divider/> */}
  {/* <CardFooter> */}
    {/* <Link
      isExternal
      showAnchorIcon
      href="https://github.com/nextui-org/nextui"
    >
     {expert.selfIntro}
    </Link> */}
  {/* </CardFooter> */}
</Card>
</div></Link>);
}