export function getPivotDates(date: Date | undefined) {
    const d = date ?? new Date()

    var pivotWeek = new Date(d)
    pivotWeek.setDate(pivotWeek.getDate() - (pivotWeek.getDay() + 6) % 7 )
    pivotWeek.setUTCHours(-7,0,0,0)

    var weekTo = new Date(pivotWeek)
    weekTo.setDate(pivotWeek.getDate() + 6)
    weekTo.setUTCHours(-7,-5,0,0)

    var pivotMonth = new Date(d)
    pivotMonth.setDate(1)
    pivotMonth.setUTCHours(-7,0,0,0)

    var monthTo = new Date(pivotMonth)
    monthTo.setMonth(pivotMonth.getMonth() + 1)
    monthTo.setUTCHours(16,55,0,0)
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

    var quarterTo = new Date(pivotQuarter)
    quarterTo.setMonth(firstMonth + 3)
    // quarterTo.setDate(0)
    quarterTo.setUTCHours(16,55,0,0)

    var pivotYear = new Date(d)
    pivotYear.setDate(1)
    pivotYear.setMonth(0)
    pivotYear.setUTCHours(-7,0,0,0)

    var yearTo = new Date(pivotYear)
    // yearTo.setDate(0)
    // yearTo.setMonth(0)
    yearTo.setFullYear(pivotYear.getFullYear() + 1)
    yearTo.setUTCHours(16,55,0,0)
    // yearTo.setUTCHours(-7,0,0,0)

    return [pivotWeek, pivotMonth, pivotQuarter, pivotYear, weekTo, monthTo, quarterTo, yearTo]

        // var m = Math.floor(d.getMonth() / 3) + 2;

}