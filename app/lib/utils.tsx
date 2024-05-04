export function convert(num: number) {
    let formatter = Intl.NumberFormat('en', { notation: 'compact' });
    return formatter.format(num)
  }

  export function addComma(num: number) {

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }