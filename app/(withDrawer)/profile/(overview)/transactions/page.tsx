'use client'
import { useAppContext } from "@/app/lib/context";
import { getMyTransHistory } from "@/app/lib/firebase/firestore";
import { addComma } from "@/app/lib/utils";
import { TranType, Transaction, tranTypeText } from "@/app/model/transaction";
import { Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { Label, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";


export default function Page() {
  // const initValue = typeof window == undefined ? 100 : window.innerWidth
  const [width, setWidth] = useState<number>(200)
  // const space = width <= 768 ? width : width - 256
  // const num = Math.trunc(space * 0.8 / 50)
  const num = width < 500 ? 3 : width < 600 ? 4 : 7
  const columns = masterCols.slice(0, num)
  const updateDimensions = () => {
    if (typeof window !== 'undefined') {
      console.log("width " + window.innerWidth)
      setWidth(window.innerWidth);
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", updateDimensions);
    }
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  
  const {user} = useAppContext()
  const [trans, setTrans] = useState<Transaction[] | undefined>(undefined)
  const uid = user ? user.uid : ""
  const transForTable = trans ?  trans.map((item) => {
    const prefix = item.toUid == uid ? "+" : "-"
    return {
      amount: prefix + addComma(item.amount),
      date: item.date.toLocaleDateString('vi'),
      status: item.status,
      tranType: item.tranType,
      note: item.notebankacc,
      id: item.id,
    }
  }) : undefined
  // const transCome = trans.filter((item) => {return item.toUid == uid})
  // .map((item) => {
  //   return {
  //     amount: addComma(item.amount),
  //     date: item.date.toLocaleDateString('vi'),
  //     status: item.status,
  //     tranType: item.tranType,
  //     note: item.notebankacc,
  //     id: item.id,
  //   }
  // })
  // const transGo = trans.filter((item) => {return item.fromUid == uid})
  // .map((item) => {
  //   return {
  //     amount: addComma(item.amount),
  //     date: item.date.toLocaleDateString('vi'),
  //     status: item.status,
  //     tranType: item.tranType,
  //     note: item.notebankacc,
  //     id: item.id,
  //   }
  // })

  useEffect(() => {
    const fetchData = async (uid: string) => {
      const result = await getMyTransHistory(uid)
      console.log('result ' + JSON.stringify(result))
      setTrans(result)
    }

    if (user?.uid) {
      fetchData(user.uid)
    }


  }, [user?.uid])


  return (
    <div>
      {}
      
      {transForTable ? (
      <Table className="w-full  mt-8" aria-label="TransHistoryTable">
        <TableHeader columns={columns}>
          {(column) => <TableColumn  key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={transForTable}>
          {(item) => (
            <TableRow key={item.id}>
              {
                (columnKey) => {
                  if (columnKey == 'tranType') {
                    let value = Number(getKeyValue(item, columnKey))
                    return (
                    <TableCell>{tranTypeText(value)}</TableCell>
                    )

                  }
                  return (
                    <TableCell>{getKeyValue(item, columnKey) as string}</TableCell>
                  )
                }

              }
            </TableRow>
          )}
        </TableBody>
      </Table>)
      :
      (
        <Spinner />
      )
      
    }
      {/* <Divider className="mt-8 mb-8"/>
      <Label className="mt-2 mb-4" value="Tiền đi" />
      <Table  className="w-full mt-8" aria-label="TransHistoryTable">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={transGo}>
          {(item) => (
            <TableRow  key={item.id}>
              {
                (columnKey) => {
                  if (columnKey == 'tranType') {
                    let value = Number(getKeyValue(item, columnKey))
                    return (
                    <TableCell>{tranTypeText(value)}</TableCell>
                    )

                  }
                  return (
                    <TableCell>{getKeyValue(item, columnKey) as string}</TableCell>
                  )
                }

              }
            </TableRow>
          )}
        </TableBody>
      </Table> */}
    </div>
        
  
  
  )
    
}

const masterCols = [

  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "date",
    label: "Ngày",
  },
  {
    key: "tranType",
    label: "Type",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "notebankacc",
    label: "Note",
  },
  // {
  //   key: "id",
  //   label: "ID",
  // }
];