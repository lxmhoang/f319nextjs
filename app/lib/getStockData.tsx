"use server"
const vn100Code = '21'
const vn30Code = '11'
const hoseCode = '1'
const hnxCode = '2'
const hnx30Code = '12'
const upcomCode = '9'

const MIN_VOLUME = 100000

    // https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=21   - vn 100
    // https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=11   -vn 30
    // https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=1  - hose 
    // https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=2  - hnx
    // https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=12  - hn30
    // https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=9  - upcom
    // https://s.cafef.vn/ajax/pagenew/databusiness/congtyniemyet.ashx?centerid=0&skip=0&take=20000&major=0 all company


export default async function getStockData() {
    try {
        const responsevn100 = await fetch("https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=" + vn100Code);
        const responsevn30 = await fetch("https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=" + vn30Code);
        const responsehose = await fetch("https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=" + hoseCode);
        const responsehnx = await fetch("https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=" + hnxCode);
        const responsehnx30 = await fetch("https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=" + hnx30Code);
        const responseupcom = await fetch("https://dev-s.cafef.vn/ajax/ajaxliveboard.ashx?floorcode=" + upcomCode);


        const resultvn100 = await responsevn100.json();
        const resultvn30 = await responsevn30.json();
        const resulthose = await responsehose.json();
        const resulthnx = await responsehnx.json();
        const resulthnx30 = await responsehnx30.json();
        const resultupcom = await responseupcom.json();

        const arrvn100 = (resultvn100.Data as {[key:string] : number}[]).filter(d =>d.TotalVolume > MIN_VOLUME) 
        const arrvn30 = (resultvn30.Data as {[key:string] : number}[]).filter(d =>d.TotalVolume > MIN_VOLUME) 
        const arrvnhose = (resulthose.Data as {[key:string] : number}[]).filter(d =>d.TotalVolume > MIN_VOLUME) 
        const arrvnhnx = (resulthnx.Data as {[key:string] : number}[]).filter(d =>d.TotalVolume > MIN_VOLUME) 
        const arrvnhnx30 = (resulthnx30.Data as {[key:string] : number}[]).filter(d =>d.TotalVolume > MIN_VOLUME) 
        const arrvnupcom = (resultupcom.Data as {[key:string] : number}[]).filter(d =>d.TotalVolume > MIN_VOLUME) 

        var symbols = arrvn100.map(d => d.Symbol)
        let merge2 = arrvn100.concat(arrvn30.filter(d => !symbols.includes(d.Symbol)))

        symbols = merge2.map(d => d.Symbol)
        let merge3 = merge2.concat(arrvnhose.filter(d => !symbols.includes(d.Symbol)))
        
        symbols = merge3.map(d => d.Symbol)
        let merge4 = merge3.concat(arrvnhnx.filter(d => !symbols.includes(d.Symbol)))
        
        symbols = merge4.map(d => d.Symbol)
        let merge5 = merge4.concat(arrvnhnx30.filter(d => !symbols.includes(d.Symbol)))
        
        symbols = merge5.map(d => d.Symbol)
        let merge6 = merge5.concat(arrvnupcom.filter(d => !symbols.includes(d.Symbol)))


        console.log("arr length " + merge6.length )
        
        console.log(merge6 )
        return merge6
      } catch (err) {
        throw err 
      } finally {
      }

}