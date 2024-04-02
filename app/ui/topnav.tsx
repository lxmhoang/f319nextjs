'use client'
import {
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
    Button
  } from "@nextui-org/react";
  import Link from 'next/link';
// import NavLinks from "./nav-links";
// import { signInWithGoogle, onAuthStateChanged } from "../lib/firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { GoogleAuthProvider, User } from "firebase/auth";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, User } from 'firebase/auth';
import { useAuthState, useSignInWithGoogle, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from "../lib/firebase/firebase";
// import { getUser } from "../lib/firebase/getUser";

export default function TopNav() {
  // const session = useSession() 
  // console.log("session" + session.status)
  // const auth = getAuth(firebaseApp)
  const [signInWithGoogle, userCredential, signing, error] = useSignInWithGoogle(auth);
  const [signOut] = useSignOut(auth);
  const [user, loadingAuthState, errorAuthState] = useAuthState(auth);
  
  const login = () => {
    signInWithGoogle()
  };
  const logout = () => {
    signOut();
  };
  

	// const user = useUserSession(initialUser) ;
 
    return (
    <Navbar className="h-[88px] border"  maxWidth='full' height="200px"  justify-between="left">
      <NavbarBrand className="p-3">
        {/* <AcmeLogo /> */}
        <Link href={{pathname:`/`}}>  <p className="font-bold text-inherit">KHUYẾN NGHỊ CHỨNG KHOÁN</p> </Link>
      
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-5" justify="start">
        {/* <NavLinks /> */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex p-2">
        {user ? (
				<>
        <div className="profile p-4">
        <Link href={{pathname:`/profile/registerExpert`}}>   Đăng ký chuyên gia</Link>        
        </div>
					<div className="profile p-4">
          <Link href={{pathname:`/profile`}}> 
          {user.displayName}
          </Link>  
          </div>

          {/* <NavbarItem> */}
            <Button href="#" onClick={() => signOut()}>
                  Sign Out
            </Button>
          {/* </NavbarItem>  */}
				</>
			) :
      signing ? (<div>Singing in </div>) :
      
      (
        <Link href="#" onClick={() =>login()} >Login</Link>
			)
      
      }
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    );

}


// function useUserSession(initialUser: User) {
// 	// The initialUser comes from the server via a server component
// 	const [user, setUser] = useState(initialUser);
// 	const router = useRouter()

// 	useEffect(() => {
// 		const unsubscribe = onAuthStateChanged((authUser) => {
//       console.log("vvvv")
//       if (authUser != null) {
//         setUser(authUser)
//       }
// 		})

// 		return () => unsubscribe()
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [])

// 	useEffect(() => {
//     console.log("rrtttt")
// 		onAuthStateChanged((authUser) => {
//       console.log("auth state changed")
// 			if (user === undefined) return

// 			// refresh when user changed to ease testing
// 			if (user?.email !== authUser?.email) {
// 				router.refresh()
// 			}
// 		})
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [user])

//   console.log("6666")
// 	return user;
// }