'use client'
import { Expert, expertConverter } from "@/app/lib/definitions";
import ExpertCard from "../expertcard";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase/firebase";
import { useCollectionData, useCollectionDataOnce } from "react-firebase-hooks/firestore";
import ExpertRow from "../expertrow";


import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useState } from "react";
// import router from "next/router";
import { redirect, useRouter } from "next/navigation";
const columns = [
  {
    key: "name",
    label: "Name",
  }
];
export default function ReviewExpert() {

  const router = useRouter()
  const ref = query(collection(db, 'expert')).withConverter(expertConverter);
  const [expertList, loading, error] = useCollectionData(ref);
  const [selectedKeys, setSelectedKeys] = useState< Set<string>>(new Set([]));
  const items = expertList ?? []
  console.log("bbbb" + items)
//   return (
// <>
//     <Table className="dark" aria-label="Example table with dynamic content" 
//     selectionMode="multiple"
//     selectedKeys={selectedKeys}
//     // onSelectionChange={setSelectedKeys}>
//     // selectedKeys={selectedKeys}
//     onRowAction = {function(key)  {
//       // alert(`Opening item ${key}...`)
//       // redirect("/expertdetails/"+key)
//       router.push("/expertdetails/"+key)
//     }}
//     onSelectionChange={(keys) => {
//       if (keys == 'all') {
          
//       } else {
//         const set = keys as Set<string>
//         setSelectedKeys(set)

//       }
//     }}>

//     <TableHeader columns={columns}>
//       {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
//     </TableHeader>
//     <TableBody items={items}>
//       {(item) => (
//         <TableRow key={item.id}>
//           {
//           (columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>
          
//           }
//         </TableRow>
//       )}
//     </TableBody>
//   </Table>
//   </>
//   )
  return (
    <>
    Expert List : 
    {
        expertList ? 
        (<div>  <ul role="list" className="divide-y divide-white-900">

            {expertList.map ((item, index) => {
                return (
                    <ExpertRow key={index} item={item} />
                )
            }

            )}
            
            </ul>
            
             </div>) : 
        (<div>No data</div>)
      }
      </>
  )
}