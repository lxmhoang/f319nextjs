import { Card, CardBody, CardFooter, CardHeader, Divider, Image } from "@nextui-org/react";
import Link from 'next/link'
import { useDownloadURL } from "react-firebase-hooks/storage";
import { storage } from "../lib/firebase/firebase";
import { ref as storageRef } from 'firebase/storage';
import { CameraIcon, HeartIcon, BeakerIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "./button";
import { activateExpert, banExpert } from "../lib/firebaseadmin/firebaseadmin";
import { ExpertStatus } from "../lib/definitions";
// import { BeakerIcon } from "@heroicons/react/16/solid";

export default function ExpertRow({item}: {item: {avatar: string,imageURL: string, id: string, name: string, followerNum: number, selfIntro: string, shortInfo: string, status: ExpertStatus}}) {
  
  const [imagedownloadURL] =   useDownloadURL( item.avatar ? storageRef(  storage, item.avatar) : null) 
  const banUser = () => {
    banExpert(item.id)
  }
  const activateUser = () => {
    activateExpert(item.id)
  }

  const renderButton = (status: ExpertStatus) => {
    console.log('status : ' + status)
    switch (status) {
        // console.log('status : ' + status)
        case ExpertStatus.activated : 
        return  (
            <Button  onClick = {() => banUser()}>Ban nó</Button>
            )
        case ExpertStatus.banned : 
        return  (
            <Button  onClick = {() => activateUser()}>Bỏ ban</Button>
            )
        case ExpertStatus.paymentPending : 
        return  (
            <Button  onClick = {() => activateUser()}>Đã trả tiền, kích hoạt</Button>
            )
        case ExpertStatus.suspended : 
        return  (
            <Button  onClick = {() => {}}>Tự dừng tài khoản</Button>
            )
        case ExpertStatus.unknown : 
        return  (
            <Button  onClick = {() => {}}>Unknown</Button>
            )
    }

  }


  return (
    <li className="flex justify-between gap-x-6 py-5">
    <div className="flex min-w-0 gap-x-4">
        {/* {imagedownloadURL} */}
        {imagedownloadURL ? ( <img className="h-24 w-24 flex-none  bg-gray-50" src= {imagedownloadURL} alt="" />) : (<UserCircleIcon className="h-24 w-24 text-white-500" />)}
        
        {/* <UserCircleIcon className="h-24 w-24 text-white-500" /> */}
      <div className="min-w-0 flex-auto">
        <p className="text-sm font-semibold leading-6 text-white-900">{item.name}</p>
        {/* <p className="mt-1 truncate text-xs leading-5 text-gray-500">{item.status}</p> */}
      </div>
      <div className="min-w-0 flex-auto">
        <p className="text-sm font-semibold leading-6 text-white-900">{item.status}</p>
        {/* <p className="mt-1 truncate text-xs leading-5 text-gray-500">{item.status}</p> */}
      </div>
    </div>
    <div className="shrink-0 sm:flex sm:flex-col sm:items-end p-10">
      {/* <p className="text-sm leading-6 text-white-900">{item.status}</p> */}
      {/* <p className="mt-1 text-xs leading-5 text-gray-500">Last seen </p> */}

    <div className="flex sm:flex sm:flex-col sm:items-end p-10">
    <div className="text-sm leading-6 text-white-900">{item.status}</div>
        {renderButton(item.status)}
        
      {/* <p className="mt-1 text-xs leading-5 text-gray-500">Last seen </p> */}
    </div>
    </div>
  </li>
  )


}