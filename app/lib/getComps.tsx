// import { string } from "zod"
// // import { Company } from "./definitions"


// export default async function getComps() {

//     const response = await fetch(`https://s.cafef.vn/ajax/pagenew/databusiness/congtyniemyet.ashx?centerid=0&skip=0&take=20000&major=0`, { cache: 'force-cache' })

//     let data =  await response.json()
//     const arr = (data.Data as Company[]).filter((element) => {
//         const codeCheck =  element.Symbol.length == 3
//         const centerCheck =  (element.TradeCenterId == 1 || element.TradeCenterId == 2 || element.TradeCenterId == 9)
//         return codeCheck && centerCheck
//     })
    
//     return arr
    
 
// }