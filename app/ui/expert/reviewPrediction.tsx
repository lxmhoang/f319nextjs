'use client'

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { Timestamp } from "firebase/firestore";

const masterCols = [
  {
    key: "assetName",
    label: "AssetName",
  },
  {
    key: "curStatus",
    label: "curStatus",
  },
  {
    key: "priceIn",
    label: "Giá mua vào",
  },
  {
    key: "curPrice",
    label: "curPrice",
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
  {
    id: string | undefined,
    assetName: string,
    priceIn: number,
    priceOut: number,
    deadLine: string,
    dateIn: string,
    cutLoss: number,
    curPrice: number,
    status: string
  }[],
  submit: (predIDs: string[]) => void
}) {

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));
  const [width, setWidth] = useState<number>(window.innerWidth)
  console.log('selected ' + selectedKeys)
  console.log('selected keys ' + selectedKeys == "all" ? "aaa" : Array.from(selectedKeys.values()))
  const space = width <= 768 ? width : width - 256
  const num = Math.trunc(space * 0.8 / 100)
  console.log('preds ' + JSON.stringify(preds))
  const columns = masterCols.slice(0, num)

  const updateDimensions = () => {
    if (typeof window !== 'undefined') {
      console.log("width " + window.innerWidth)
      setWidth(window.innerWidth);
    }
  }
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  console.log('master preds ' + JSON.stringify(preds))
  return (
    <>
      {width}
      <Table className=" w-full" aria-label="Example table with dynamic content"
        // selectionMode="multiple"
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
                (columnKey) => {
                  // if (columnKey == 'deadLine') {
                  //   const value = new Date(item.deadLine.seconds * 1000).toDateString()
                  //   return (<TableCell>{value.toLocaleString()}</TableCell>)
                  // }
                  // if (columnKey == 'dateIn') {
                  //   const value = new Date(item.dateIn.seconds * 1000).toDateString()
                  //   return (<TableCell>{value.toLocaleString()}</TableCell>)
                  // }


                  return (
                    <TableCell>{getKeyValue(item, columnKey) as string}</TableCell>
                  )
                }

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