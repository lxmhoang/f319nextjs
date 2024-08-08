'use client'

import { login, refreshToken } from "@/app/lib/client"
import { useAppContext } from "@/app/lib/context"
import { Button, Label } from "flowbite-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  const [info, setInfo] = useState<string>('')
  const [reload, setReload] = useState<boolean>(false)
  const { firebaseUser } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (error.message == 'auth/session-cookie-expired') {
      if (firebaseUser) {
        //  const newToken = firebaseUser.getIdToken(true)
        setInfo('Phiên đăng nhập hết hạn, hệ thống đang tự động đăng nhập lại  .... ')
        // setTimeout(() => {
          refreshToken(firebaseUser).then((result) => {
            if (result.success) {
              setInfo('Đăng nhập lại thành công, bấm F5 hoặc nút bên dưới để làm mới trình duyệt')
              setReload(true)

              router.refresh()
              // reset()
            } else {
              setInfo(result.error)
            }
    
          })
  
        // }, 3000)

      } else if (firebaseUser === null) {
        login()
      } else {
        setInfo('Phiên đăng nhập hết hạn, hệ thống đang kiểm tra lại thông tin  .... ')
      }
      
    } else {
      setInfo(error.message)

    }

  }, [])


  return (
    <div className="space-y-2 p-4">
      <Label >{info}</Label>
       { reload && <Button onClick={() => {
        reset()
        // router.refresh()
        }}>Load lại trang </Button> }
    </div>
  )



}