import { Divider } from "@nextui-org/react";
import ReviewExpert from "../ui/admin/reviewExpert";

export default async function Page({params} : {params: {id: string}} ) {
  
  
    return (
      
      
      <div>
        Danh sach chuyen gia dang theo doi
    <Divider />
     <ReviewExpert />

    <Divider />
        Danh sach Khuyen nghi
    <Divider />
     .....

      </div>
      
      )
    }