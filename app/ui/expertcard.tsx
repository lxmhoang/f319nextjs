import { Card, CardBody, CardFooter, CardHeader, Divider, Link, Image } from "@nextui-org/react";

export default function ExpertCard({expert}: {expert: {imageURL: string, id: string, name: string, followerNum: number, selfIntro: string, shortInfo: string}}) {
    return (
    <div className="border p-5 rounded-sm">
    <Card className="w-120 h-120 p-4">
  <CardHeader className=" gap-3">
    {<Image
      alt="nextui logo"
      radius="sm"
      // fill = "true"
      src = {expert.imageURL}
    /> }
    <div className="flex flex-wrap">
      <p className="text-md"></p>
      <p className="text-small text-default-500">{expert.name}</p>
    </div>
  </CardHeader>
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
</div>);
}