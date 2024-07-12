
import { useAppContext } from "@/app/lib/context";
import { getUserInfoFromSession } from "@/app/lib/firebaseadmin/adminauth";
import { getMyTransHistory } from "@/app/lib/server";
import { addComma } from "@/app/lib/utils";
import { TranType, Transaction, tranTypeText } from "@/app/model/transaction";
import MyTransView from "@/app/ui/profile/my-trans-view";
import { Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { Label, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";


export default async function Page() {

  const trans = await getMyTransHistory()
  const userInfo = await getUserInfoFromSession()


  return (
    <div>
      {
      userInfo && trans.length > 0 ? ( <MyTransView  />) : 
        userInfo ? (<>Chưa có giao dịch nào </>) : (<>Chưa đăng nhập</>)
      }


    </div>
  )

}