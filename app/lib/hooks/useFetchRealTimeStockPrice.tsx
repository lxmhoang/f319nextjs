

// import { useState, useEffect } from 'react';
// import getStockData, { getRealTimeStockData } from '../getStockData';

// // Custom hook for fetching data
// export function useFetchRealTimeStockPrice(stocks: string[]) {
//   const [data, setData] = useState<{[key: string] : {high: number, low: number}}>();
//   // const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getRealTimeStockData(stocks)
//       console.log("stock rt price: " + JSON.stringify(data))
//       setData(data)
     
//     };

//     const unsubscribe = () => {
//       console.log("stock rt price22: " )
//       if (stocks && stocks.length > 0) {
//         fetchData();
  
//       }

//     }


//     return unsubscribe
//   }, [stocks]);


//   return [ data , error] as const;
// }