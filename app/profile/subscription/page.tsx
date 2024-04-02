'use client'
import { getAnExpertById, getExperts } from "@/app/lib/firebase/firestore";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import ExpertCard from "@/app/ui/expertcard";
import Image from "next/image";
import {Accordion, AccordionItem} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import clsx from 'clsx';

export default async function Page({params} : {params: {id: string}} ) {
  
  
  return (
    
    
    <div>
    subscription page 
    </div>
    
    )
  }