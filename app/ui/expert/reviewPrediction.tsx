'use client'

import { Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useEffect, useState } from "react";
// import { Button } from "../button";
import { getRealTimeStockData } from "@/app/lib/getStockData";
import { Prediction, PredictionReview } from "@/app/model/prediction";
import { Button, Label, Spinner, Toast } from "flowbite-react";
import { clientGetAllMyPreds, closeWIPPreds } from "@/app/lib/server";
import { perfConver, valueWithBonus } from "@/app/lib/utils";


export default function ReviewPrediction({ doneFetching }: {
  // preds: Prediction[]
  // preds:
  // WIPPrediction[],
  doneFetching: (totalPortion: number) => void
}) {


  const closePreds = async (predIds: string[]) => {
    // setClosingPreds(true)
    try {

      await closeWIPPreds(predIds)
      console.log('done closing PREDS : ' + predIds)
      await fetchPred()

    } catch (e) {

      console.log('error ' + JSON.stringify(e))
    }
    // setClosingPreds(false)
  }

  const fetchPred = async () => {
    const res = await clientGetAllMyPreds()
    const preds: Prediction[] = JSON.parse(res)
    setPreds(preds)
    setSelectedKeys(new Set([]))
  }
  // const [closingPreds, setClosingPreds] = useState<boolean>(false)
  const [preds, setPreds] = useState<Prediction[]>()
  const wipPreds = preds?.filter((item) => {
    return item.status == 'Inprogress'
  })
  // const under5DaysID = wipPreds?.filter((item) => {
  //   item
  // })
  const closedPreds = preds?.filter((item) => {
    return item.status !== 'Inprogress'
  }).map((pred) => {
    const actualPrice = valueWithBonus(pred.priceRelease!, pred.bonus ?? [])
    return {
      id: pred.id,
      assetName: pred.assetName,
      priceIn: pred.priceIn.toFixed(2),
      priceRelease: pred.priceRelease?.toFixed(2),
      perm: perfConver(actualPrice / pred.priceIn),
      priceOut: pred.priceOut.toFixed(2),
      deadLine: new Date(pred.deadLine).toLocaleDateString('vi'),
      dateIn: new Date(pred.dateIn).toLocaleDateString('vi'),
      cutLoss: pred.cutLoss.toFixed(2),
      status: pred.status,
      portion: pred.portion.toString() + '%'
    }
  })

  const [wipdata, setWIPData] = useState<PredictionReview[]>();
  const disabledKeys = wipdata?.filter((item) => { return item.disableClose }).map((item) => item.id ?? "") ?? []

  const [showToast, setShowToast] = useState(false);
  console.log('disabledKeys ' + JSON.stringify(disabledKeys))
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
      // console.log('wip ' + JSON.stringify(wipPreds))

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
        const predAge = (new Date()).getTime() - pred.dateIn
        console.log("predAge : " + predAge)
        return {
          id: pred.id,
          assetName: pred.assetName,
          priceIn: pred.priceIn.toFixed(2),
          priceOut: pred.priceOut.toFixed(2),
          deadLine: new Date(pred.deadLine).toLocaleDateString('vi'),
          dateIn: new Date(pred.dateIn).toLocaleDateString('vi'),
          cutLoss: pred.cutLoss.toFixed(2),
          status: pred.status,
          bonus: pred.bonus,

          curPrice: curPrice.low.toFixed(2),
          curStatus: valueWithBonus(curPrice.low, pred.bonus ?? [])  / pred.priceIn ,
          portion: pred.portion.toString() + '%',
          disableClose: predAge < 1000 * 5 * 24 * 3600
        }
      })
      setWIPData(dataList)
    };

    if (wipPreds && doneFetching) {
      if (wipPreds.length > 0) {
        const sum = wipPreds.map((i) => i.portion).reduce((a, b) => a + b, 0)
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
      {(preds && preds.length == 0) && (<> Chưa tạo khuyến nghị nào </>)}
      {(!wipdata && wipPreds && wipPreds.length > 0) && (<>Loading ... </>)}
      {wipdata ? (<>
        <Label value="Các khuyến nghị đang tiếp diễn" className="mb-4" />
        <div><span className="text-yellow-500">*</span> <span className="text-xs"> : đã bao gồm chia cổ tức</span></div>

        <div className="">
        {true && (<Table removeWrapper className="overflow-x-auto mb-4 mt-4 " color="primary" aria-label="Example table with dynamic content"
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
              for (const disableKey of disabledKeys) {
                if (set.has(disableKey)) {
                  setShowToast((state) => !state)
                  set.delete(disableKey)
                }
              }
              // set.delete
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
                    if (columnKey == 'curStatus') {
                      const profit = getKeyValue(item, columnKey) as number
                      
                      return (
                        //
                        <TableCell  className={perfConver(profit).color}>{perfConver(profit).info} {(item.bonus && item.bonus.length > 0 ) && <span className="text-yellow-500">*</span>}</TableCell>
                      )
                    }

                    return (
                      <TableCell >{getKeyValue(item, columnKey) as string}</TableCell>
                    )
                  }

                }
              </TableRow>
            )}
          </TableBody>
        </Table>)}
        {showToast && (<Toast className="mx-auto">
          {/* <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200"> */}
            {/* <HiFire className="h-5 w-5" /> */}
          {/* </div> */}
          <div className="ml-3 text-sm font-normal">Không thể chọn kết thúc khuyến nghị chưa quá 5 ngày</div>
          <Toast.Toggle onDismiss={() => setShowToast(false)} />
        </Toast>)
        }
        </div>

        <Button className="max-w-sm" disabled={selectedKeys.size == 0} onClick={() => {
          // const array = Array.from(selectedKeys);
          closePreds(Array.from(selectedKeys.values()))
          // submit(Array.from(selectedKeys.values()))
        }}>

          Kết thúc</Button>
          
          </>) : preds ? (<></>) : (<>Loading ... </>)
      }

      <Divider className="mt-8 mb-8" />

      {preds && closedPreds && closedPreds.length > 0 ? (<>
        <Label value="Các khuyến nghị đã kết thúc" />
        {/* {JSON.stringify(closedPreds)} */}

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
                      return (
                        <TableCell className={item.perm.color}>{value}</TableCell>
                    )
                    }
                    return (
                      <TableCell>
                        
                        {getKeyValue(item, columnKey) as string}
                        </TableCell>
                    )
                  }
                }
              </TableRow>
            )}
          </TableBody>
        </Table>
      </>) : preds ? (<></>) : (<>Loading ... </>)}
    </>
  )
}

const masterClosedCols = [
  {
    key: "assetName",
    label: "Mã",
  },
  {
    key: "portion",
    label: "Tỷ lệ",
  },
  {
    key: "dateIn",
    label: "Ngày mua",
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
    label: "Mã ",
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
    label: "Ngày mua",
  },

  // {
  //   key: "status",
  //   label: "STATUS",
  // },
];
