'use client'

import { useAppContext } from "@/app/lib/context";

export default  function Page() {

  const {user} = useAppContext()  
  
  if (user == undefined) {
     return (
      <> Please Sign in</>
     )
  }

  const ref = user.accessId
  
    return (
      <div>
        {user.displayName}
      
      <div>
       Share url này để kiếm tiền affiliate : 
       
       
       <p>http://localhost:3000/{ref}</p>

      </div>
      
      </div>
      )
    }