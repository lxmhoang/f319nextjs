'use client'
import { getAnExpertById, getExperts } from "@/app/lib/firebase/firestore";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import ExpertCard from "@/app/ui/expertcard";
import Image from "next/image";
import { Accordion, AccordionItem, Switch } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import clsx from 'clsx';

export default async function Page({ params }: { params: { id: string } }) {


  return (



      <div className="flex flex-col gap-2">
        <Switch color="success">
          Nạp tiền
        </Switch>
      </div>

      )
  }