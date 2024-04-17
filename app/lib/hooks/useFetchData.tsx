

import { useState, useEffect } from 'react';
import getStockData from '../getStockData';

// Custom hook for fetching data
export function useFetchData() {
  const [data, setData] = useState<{[key: string] : number}[]>();
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStockData()
      console.log("stock list length : " + data.length)
      setData(data)
     
    };

    fetchData();
  }, []);

  return [ data , error];
}