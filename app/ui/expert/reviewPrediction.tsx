'use client'

import { Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useEffect, useState } from "react";
// import { Button } from "../button";
import { getRealTimeStockData } from "@/app/lib/getStockData";
import { Prediction } from "@/app/model/prediction";
import { Button, Label, Spinner } from "flowbite-react";
import { closeWIPPreds, getAllMypreds, getMyWIPPreds } from "@/app/lib/server";
import { perfConver } from "@/app/lib/utils";


export default function ReviewPrediction({ doneFetching, wip }: {
  // preds: Prediction[]
  // preds:
  // WIPPrediction[],
  doneFetching: (totalPortion: number) => void,
  wip: boolean
}) {


  const closePreds = async (predIds: string[]) => {
    // setClosingPreds(true)
    try {

      await closeWIPPreds(predIds)
      console.log('done closing PREDS')
      await fetchPred()

    } catch (e) {

      console.log('error ' + JSON.stringify(e))
    }
    // setClosingPreds(false)
  }

  const fetchPred = async () => {
    const result = wip ? await getMyWIPPreds() : await getAllMypreds()
    setPreds(result)
    setSelectedKeys(new Set([]))
  }
  // const [closingPreds, setClosingPreds] = useState<boolean>(false)
  const [preds, setPreds] = useState<Prediction[]>()
  const wipPreds = preds?.filter((item) => { 
    return item.status == 'Inprogress'
  })
  const closedPreds = preds?.filter((item) => { 
    return  item.status !== 'Inprogress'}).map((pred) => {
      return {
        id: pred.id,
        assetName: pred.assetName,
        priceIn: pred.priceIn.toFixed(2),
        priceRelease: pred.priceRelease?.toFixed(2),
        perm: perfConver(pred.priceRelease! / pred.priceIn),
        priceOut: pred.priceOut.toFixed(2),
        deadLine: pred.deadLine.toLocaleDateString('vi'),
        dateIn: pred.dateIn.toLocaleDateString('vi'),
        cutLoss: pred.cutLoss.toFixed(2),
        status: pred.status,
        portion: pred.portion.toString() + '%'
      }
    })

  console.log('closed preds333 ' + JSON.stringify(closedPreds))
  const [wipdata, setWIPData] = useState<PredictionReview[]>();
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));

  const innerWidth = typeof window == 'undefined' ? 400 : window.innerWidth

  const [width, setWidth] = useState<number>(innerWidth)
  const space = width <= 768 ? width : width - 256
  const num = Math.trunc(space * 0.8 / 80)
  const columns = masterCols//.slice(0, num)
  // console.log('columns ' + columns)
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

  useEffect(() => {

    fetchPred()

  }, [])

  useEffect(() => {
    const fetchRealTimeStockData = async () => {
      if (!wipPreds) {
        return
      }
      if (wipPreds.length == 0) {
        setWIPData([])
      }
      console.log('wip ' + JSON.stringify(wipPreds))

      const stockList = wipPreds.map((e) => {
        return e.assetName
      })
      const data = await getRealTimeStockData(stockList ?? [])
      console.log("stock rt price: " + JSON.stringify(data))
      const dataList: PredictionReview[] = wipPreds.map((pred) => {
        const curPrice = data ? data[pred.assetName] : undefined
        if (!curPrice) {
          throw new Error('can not get real time stock data of asset ' + pred.assetName)
        }
        // console.log("vvvv : " + pred.deadLine)
        return {
          id: pred.id,
          assetName: pred.assetName,
          priceIn: pred.priceIn.toFixed(2),
          priceOut: pred.priceOut.toFixed(2),
          deadLine: pred.deadLine.toLocaleDateString('vi'),
          dateIn: pred.dateIn.toLocaleDateString('vi'),
          cutLoss: pred.cutLoss.toFixed(2),
          status: pred.status,
          curPrice: curPrice.low.toFixed(2),
          curStatus: (curPrice.low * 100 / pred.priceIn - 100).toFixed(2) + "%",
          portion: pred.portion.toString() + '%'
        }
      })
      setWIPData(dataList)
    };

    if (preds ) {
      if (preds.length > 0) {
        const sum = preds.map((i) => i.portion).reduce((a, b) => a + b, 0)
        doneFetching(sum)
        fetchRealTimeStockData();
      } else {
        doneFetching(0)
      }


    }


  }, [preds]);

  // console.log('master preds ' + JSON.stringify(preds))

  return (
    <>
      {/* { preds && preds.length == 0 && (
        <>
          Chưa có khuyến nghị nào được tạo<Link href="/advisor/prediction/new" className="text-sky-400"> Tạo khuyến nghị </Link>
        </>
      )} */}
      { preds && wipdata ? (<>
      <Label value="Các khuyến nghị đang tiếp diễn" />
        <Table removeWrapper className="overflow-x-auto mb-4 " color="primary" aria-label="Example table with dynamic content"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          // onSelectionChange={setSelectedKeys}>
          // selectedKeys={selectedKeys}
          onSelectionChange={(keys) => {
            if (keys == 'all') {
              console.log('aaaa')
              // setSelectedKeys(new Set(["aa","vvv"]))
            } else {
              const set = keys as Set<string>
              setSelectedKeys(set)
            }
          }}>

          <TableHeader className="dark:bg-transparent bg-red-400" columns={columns}>
            {(column) => <TableColumn className="dark:bg-slate-800 " key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody className="dark:bg-red-400" items={wipdata}>
            {(item) => (
              <TableRow className="dark:bg-transparent bg-transparent" key={item.id}>
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
        <Button className="max-w-sm" disabled={selectedKeys.size == 0}  onClick={() => {
          // const array = Array.from(selectedKeys);
          closePreds(Array.from(selectedKeys.values()))
          // submit(Array.from(selectedKeys.values()))
        }}>

          Kết thúc</Button></>) : preds ? (<></>):(<><Spinner /></>)
      }

      <Divider className="mt-8 mb-8" />

      {preds && closedPreds && closedPreds.length > 0 ? (<>
      <Label value="Các khuyến nghị đã kết thúc" />
        <Table removeWrapper className="overflow-x-auto mb-4 " color="primary" aria-label="Example table with dynamic content">
          <TableHeader className="dark:bg-transparent bg-red-400" columns={masterClosedCols}>
            {(column) => <TableColumn className="dark:bg-slate-800 " key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody className="dark:bg-red-400" items={closedPreds}>
            {(item) => (
              <TableRow className="dark:bg-transparent bg-transparent" key={item.id}>
                {
                  (columnKey) => {

                    if (columnKey == 'perm') {
                      const value = item.perm.info
                      return (<TableCell className={item.perm.color}>{value}</TableCell>)
                    }
                    return (
                      <TableCell>{getKeyValue(item, columnKey) as string}</TableCell>
                    )
                  }
                }
              </TableRow>
            )}
          </TableBody>
        </Table>
      </>) : preds ? (<></>) :  (<><Spinner /></>)}
    </>
  )
}

const masterClosedCols = [
  {
    key: "assetName",
    label: "St",
  },
  {
    key: "portion",
    label: "Tỷ lệ",
  },
  {
    key: "dateIn",
    label: "date In",
  },
  {
    key: "priceIn",
    label: "Giá vào",
  },
  {
    key: "priceRelease",
    label: "Giá chốt",
  },
  {
    key: "perm",
    label: "Lời lỗ",
  },
  {
    key: "priceOut",
    label: "Gia muc tieu",
  },
  {
    key: "cutLoss",
    label: "Gia cutloss",
  },
  {
    key: "deadLine",
    label: "deadLine",
  },

  // {
  //   key: "status",
  //   label: "STATUS",
  // },
];


const masterCols = [
  {
    key: "assetName",
    label: "St",
  },
  {
    key: "portion",
    label: "Tỷ lệ",
  },
  {
    key: "curStatus",
    label: "Biến động",
  },
  {
    key: "curPrice",
    label: "Giá hiện tai",
  },
  {
    key: "priceIn",
    label: "Giá vào",
  },
  {
    key: "priceOut",
    label: "Gia muc tieu",
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

  // {
  //   key: "status",
  //   label: "STATUS",
  // },
];

type PredictionReview = {
  id: string | undefined,
  assetName: string,
  priceIn: string,
  priceOut: string,
  deadLine: string,
  dateIn: string,
  cutLoss: string,
  curPrice: string,
  status: string,
  portion: string
}