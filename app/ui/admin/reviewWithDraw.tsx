'use client'

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useState } from "react";
import { Button } from "../button";
import { addDoc } from "firebase/firestore";

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "notebankacc",
    label: "Note bank Acc",
  },
  {
    key: "status",
    label: "STATUS",
  },
];


export default function ReviewWithDraw({trans, submit} : {trans:
  {
    id: string,
    amount: number,
    status: string,
    notebankacc: string,
    key: string
  
  }[], submit: (tranIDs: string[]) => void}) {

const [selectedKeys, setSelectedKeys] = useState< Set<string>>(new Set([]));
console.log('selected ' + selectedKeys)
console.log('selected keys ' + selectedKeys == "all" ? "aaa" :  Array.from(selectedKeys.values()))

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
      <TableBody items={trans}>
        {(item) => (
          <TableRow key={item.key}>
            {
            (columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            
            }
          </TableRow>
        )}
      </TableBody>
    </Table>
    <Button aria-disabled={trans.length == 0} onClick = {() => {
        submit(Array.from(selectedKeys.values()))
    }}>
      
      Duyệt</Button>
      </>
  )
}