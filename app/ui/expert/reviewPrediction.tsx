'use client'

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useState } from "react";
import { Button } from "../button";
import { addDoc } from "firebase/firestore";
import { Prediction } from "@/app/lib/definitions";

const columns = [
  {
    key: "assetName",
    label: "AssetName",
  },
  {
    key: "priceIn",
    label: "Giá mua vào",
  },
  {
    key: "priceOut",
    label: "Gia mong đợi",
  },
  {
    key: "cutLoss",
    label: "Gia cutloss",
  },
  {
    key: "deadLine",
    label: "deadLine",
  },
  {
    key: "dateIn",
    label: "date In",
  },

  {
    key: "status",
    label: "STATUS",
  },
];


export default function ReviewPrediction({ preds, submit }: {
  preds:
  { id: string | undefined, 
    assetName: string, 
    priceIn: number, 
    priceOut: number, 
    deadLine: string,
    dateIn: string,
    cutLoss: number }[], 
    submit: (predIDs: string[]) => void
}) {

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));
  console.log('selected ' + selectedKeys)
  console.log('selected keys ' + selectedKeys == "all" ? "aaa" : Array.from(selectedKeys.values()))

  return (
    <>
      <Table className="dark" aria-label="Example table with dynamic content"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        // onSelectionChange={setSelectedKeys}>
        // selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          if (keys == 'all') {

          } else {
            const set = keys as Set<string>
            setSelectedKeys(set)

          }
        }}>

        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={preds}>
          {(item) => (
            <TableRow key={item.id}>
              {
                (columnKey) => <TableCell>{getKeyValue(item, columnKey) as string}</TableCell>

              }
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Button aria-disabled={preds.length == 0} onClick={() => {
        submit(Array.from(selectedKeys.values()))
      }}>

        Duyệt</Button>
    </>
  )
}