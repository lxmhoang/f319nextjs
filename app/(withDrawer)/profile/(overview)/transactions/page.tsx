'use client'
import { useAppContext } from "@/app/lib/context";
import { Transaction, transConverter } from "@/app/lib/definitions";
import { clientSearchCollection, getMyTransHistory } from "@/app/lib/firebase/firestore";
import { addComma } from "@/app/lib/utils";
import { Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useEffect, useState } from "react";


export default function Page() {
  const [width, setWidth] = useState<number>(window.innerWidth ?? 100)
  const space = width <= 768 ? width : width - 256
  const num = Math.trunc(space * 0.8 / 100)
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
  
  const [trans, setTrans] = useState<Transaction[]>([])
  const {user} = useAppContext()
  const uid = user ? user.uid : ""
  const transCome = trans.filter((item) => {return item.toUid == uid})
  .map((item) => {
    return {
      amount: addComma(item.amount),
      date: item.date.toLocaleDateString('vi'),
      status: item.status,
      tranType: item.tranType,
      note: item.notebankacc,
      id: item.id,
    }
  })

  useEffect(() => {
    const fetchData = async (uid: string) => {
      const result = await getMyTransHistory(uid)
      console.log('result ' + JSON.stringify(result))
      setTrans(result)
    }

    if (user) {
      fetchData(user.uid)
    }


  }, [user])


  return (
    <div>
   

      Tiền đến
      <Table className="w-full" aria-label="TransHistoryTable">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={transCome}>
          {(item) => (
            <TableRow key={item.id}>
              {
                (columnKey) => {
                  return (
                    <TableCell>{getKeyValue(item, columnKey) as string}</TableCell>
                  )
                }

              }
            </TableRow>
          )}
        </TableBody>
      </Table>
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
    label: "Date",
  },
  {
    key: "notebankacc",
    label: "Note",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "tranType",
    label: "Type",
  },
  {
    key: "id",
    label: "ID",
  }
];