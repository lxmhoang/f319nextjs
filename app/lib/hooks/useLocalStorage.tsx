import { useState } from "react"

const useLocalStorage = (key: string, initialValue: string) => {
  var initValue =  "" 
  
  try {
    const value = window.localStorage.getItem(key)
    // Check if the local storage already has any values,
    // otherwise initialize it with the passed initialValue
    initValue = value ? value : ""
  } catch (error) {
    console.log(error)
  }

  const [state, setState] = useState(initValue)

  const setValue = ((value: string) => {
    if (value == null || value == undefined) {
      return
    }
    try {
      // If the passed value is a callback function,
      //  then call it with the existing state.
      window.localStorage.setItem(key, value)
      setState(value)
    } catch (error) {
      console.log(error)
    }
  })

  return [state, setValue] as const
}

export default useLocalStorage