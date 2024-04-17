'use client'

import { User, onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { auth } from "./firebase"
import { getUserClaims } from "../firebaseadmin/firebaseadmin"

export function useUserInfo(checkRole: boolean) {

	const [user, setUser] = useState<User>()
	const [role, setRole] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(true)
	// const [error, setError] = useState()
	const router = useRouter()

	useEffect(() => {

		const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser)      }
		})

		return () => unsubscribe()
	}, [])

	useEffect(() => {
		onAuthStateChanged(auth, (authUser) => {
			if (user === undefined) return

            if (checkRole && user.uid) {
                getUserClaims(user.uid).then ((claim) => {
                    if (claim && claim.role) {
                        setLoading(false)
                        setRole(claim.role)
                    } else {
                        setLoading(false)
                        setRole("")
                    }
                })
            }

			if (user?.uid !== authUser?.uid) {
				router.refresh()
			}
		})
	}, [user])

	return [user, role, loading]
  
}


