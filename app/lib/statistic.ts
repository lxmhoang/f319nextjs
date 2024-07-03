export function getPivotDates(date: Date | undefined) {
    const d = date ?? new Date()

    var pivotWeek = new Date(d)
    pivotWeek.setDate(pivotWeek.getDate() - (pivotWeek.getDay() + 6) % 7 )
    pivotWeek.setUTCHours(-7,0,0,0)

    var weekEnd = new Date(pivotWeek)
    weekEnd.setDate(pivotWeek.getDate() + 6)
    weekEnd.setUTCHours(-7,-5,0,0)

    var pivotMonth = new Date(d)
    pivotMonth.setDate(1)
    pivotMonth.setUTCHours(-7,0,0,0)

    var monthEnd = new Date(pivotMonth)
    monthEnd.setMonth(pivotMonth.getMonth() + 1)
    monthEnd.setUTCHours(16,55,0,0)
    // monthTo.setDate(0)
    // monthTo.setUTCHours(-7,0,0,0)

    
    var month = d.getMonth() + 1
    var quarter = Math.ceil(month / 3)
    console.log('quarter ' + quarter)
    var firstMonth = (quarter - 1) * 3 
    console.log('firstMonth ' + firstMonth)
    // var lastMonth = firstMonth + 2

    var pivotQuarter = new Date(d)
    pivotQuarter.setDate(1)
    pivotQuarter.setMonth(firstMonth)
    pivotQuarter.setUTCHours(-7,0,0,0)

    var quarterEnd = new Date(pivotQuarter)
    quarterEnd.setMonth(firstMonth + 3)
    // quarterTo.setDate(0)
    quarterEnd.setUTCHours(16,55,0,0)

    var pivotYear = new Date(d)
    pivotYear.setDate(1)
    pivotYear.setMonth(0)
    pivotYear.setUTCHours(-7,0,0,0)

    var yearEnd = new Date(pivotYear)
    // yearTo.setDate(0)
    // yearTo.setMonth(0)
    yearEnd.setFullYear(pivotYear.getFullYear() + 1)
    yearEnd.setUTCHours(16,55,0,0)
    // yearTo.setUTCHours(-7,0,0,0)

    return {pivotWeek, pivotMonth, pivotQuarter, pivotYear, weekEnd, monthEnd, quarterEnd, yearEnd}

        // var m = Math.floor(d.getMonth() / 3) + 2;

}