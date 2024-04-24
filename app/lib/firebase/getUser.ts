'use client'

import { User, onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { auth } from "./firebase"
import { getUserClaims } from "../firebaseadmin/firebaseadmin"

export function useUserInfo(checkRole: boolean) {

	const [user, setUser] = useState<User | null>()
	const [claim, setClaim] = useState<{[key: string] : any}>({})
	const [loading, setLoading] = useState<boolean>(true)
	const router = useRouter()

	useEffect(() => {

		const unsubscribe = onAuthStateChanged(auth, (authUser) => {
				setUser(authUser)
		})

		return () => unsubscribe()
	}, [])

	useEffect(() => {
		onAuthStateChanged(auth, (authUser) => {
			console.log("state changeeeee phia duoi" + authUser);
			if (user == undefined) return
			console.log("2222" + user.uid + checkRole);
			if (checkRole && user.uid) {
				console.log("check user detrail : " + JSON.stringify(user))
				// comment doan duoi thi chay duoc
				const claim = getUserClaims(user.uid, user.email)
					if (claim) {
						setLoading(false)
						setClaim(claim)
					} else {
						setLoading(false)
						setClaim({})
					}
				
			}
			console.log("email compare: " + user?.email + authUser?.email);
			if (user?.email !== authUser?.email) {
				router.refresh()
			}
		})
	}, [user])

	return [user, claim, loading] as const

}


