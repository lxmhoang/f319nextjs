'use client'
import { useAppContext } from "@/app/lib/context";
import { addComma } from "@/app/lib/utils";
import { TranType, Transaction, tranTypeText } from "@/app/model/transaction";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react"
import { useEffect, useState } from "react"

export default function MyTransView() {
    // const trans : Transaction[] = JSON.parse(transInfo)
    const { user } = useAppContext()
    const trans = user?.transaction ?? []
    console.log('trans ==== ' + JSON.stringify(trans))
    // const trans : Transaction[] = JSON.parse(transInfo)

    // const innerWidth = typeof window == 'undefined' ? 400 : window.innerWidth

    const [width, setWidth] = useState<number>(500)
    const num = width < 200 ? 3 : width < 300 ? 4 : 7
    const columns = masterCols//.slice(0, num)
    const updateDimensions = () => {
        if (typeof window !== 'undefined') {
            console.log("width " + window.innerWidth)
            setWidth(window.innerWidth);
        }
    }

    const transForTable = trans.map((item) => {
        const prefix = item.toUid == user?.uid ? "+" : "-"
        console.log('aaaaa ' + JSON.stringify(item))
        return {
          amount: prefix + addComma(item.amount),
          date: new Date(item.date).toLocaleString('vi'),// new Date(item.date).toLocaleDateString('vi'),
          status: item.status,
          tranType: item.tranType,
          note: item.note ?? "",
          id: item.id,
        }
      }) 

    useEffect(() => {
        if (typeof window !== 'undefined') {
          window.addEventListener("resize", updateDimensions);
        }
        return () => window.removeEventListener("resize", updateDimensions);
      }, []);

    if (!user) {
        return (
            <>Loading user</>
        )
    }
    if (user.transaction.length == 0) {
        return (
            <>Chưa có giao dịch nào</>
        )
    }


    return (

        
        <div>
            <Table className="overflow-x-auto  mt-8" aria-label="TransHistoryTable">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
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
                                        <TableCell>{ getKeyValue(item, columnKey) as string}</TableCell>
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
        label: "Ngày",
    },
    {
        key: "tranType",
        label: "Phân loại giao dịch",
    },
    {
        key: "note",
        label: "Chi tiết            ",
    },
    {
        key: "status",
        label: "Status",
    },
    // {
    //   key: "id",
    //   label: "ID",
    // }
];