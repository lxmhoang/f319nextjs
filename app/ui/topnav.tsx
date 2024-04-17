'use client'
import {
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
    Button
  } from "@nextui-org/react";
  import Link from 'next/link';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from "../lib/firebase/firebase";
import { signInWithGoogle } from "../lib/firebase/auth";
import { useUserInfo } from "../lib/firebase/getUser";

export default function TopNav() {
  // const [signInWithGoogle, userCredential, signing, error] = useSignInWithGoogle(auth);
  const [signOut] = useSignOut(auth);
  const [user2, role, loading] = useUserInfo(false)
  const [user, loadingAuthState, errorAuthState] = useAuthState(auth);
  // console.log(error ? "sign in eror : " + JSON.stringify(error) : "no error ")
  // console.log(error ? "sign in errorAuthState : " + JSON.stringify(errorAuthState) : "no errorAuthState ")
  const login = () => {
     try { 
      signInWithGoogle()
     } catch (error) {
      console.log("error sign in " + JSON.stringify(error))
     }
  };
  const logout = () => {
    signOut();
  };
  

	// const user = useUserSession(initialUser) ;
 
    return (
    <Navbar className="dark h-[88px] border"  maxWidth='full' height="200px"  justify-between="left">
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
        <Link href={{pathname:`/admin`}}>  admin</Link>        
        </div>
        <div className="profile p-4">
        <Link href={{pathname:`/profile/registerExpert`}}>Đăng ký chuyên gia</Link>        
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
    
      (
        <>
        <Link href="#" onClick={() =>login()} >Login By Google</Link>
        {/* <div>{error ? "sign in eror : " + JSON.stringify(error) : "no error "}</div> */}
        </>
			)
      
      }
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    );

}

