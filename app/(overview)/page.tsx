import Image from "next/image";
import { getExperts } from "../lib/firebase/firestore";
import { Card, CardBody, CardFooter, CardHeader, Divider, Link } from "@nextui-org/react";
import ExpertCard from "../ui/expertcard";
import ExpertListing from "../ui/expert-listing";
import Breadcrumbs from "../ui/breadcrumbs";


export default async function Home() {
  const experts = await getExperts({visible: true});
  return (
    <>    
    <Breadcrumbs breadcrumbs={[
      { label: 'Danh sach chuyen gia', href: '/' }
    ]} />
    <ExpertListing expertList={experts} />    
    </>
    );
    }
    