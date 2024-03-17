'use client'
import {
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Button
  } from "@nextui-org/react";
  import Link from 'next/link';
import NavLinks from "./nav-links";
import { signOut, signInWithGoogle, onAuthStateChanged } from "../lib/firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TopNav({initialUser}: {initialUser: any}) {

	const user = useUserSession(initialUser) ;

	const handleSignOut = (event: { preventDefault: () => void; }) => {
		event.preventDefault();
		signOut();
	};

	const handleSignIn = (event: { preventDefault: () => void; }) => {
		event.preventDefault();
		signInWithGoogle();
	};
    return (
    <Navbar  maxWidth='full'  justify-between="left">
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-5" justify="start">
        <NavLinks />
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    );

}


function useUserSession(initialUser: any) {
	// The initialUser comes from the server via a server component
	const [user, setUser] = useState(initialUser);
	const router = useRouter()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged((authUser) => {
			setUser(authUser)
		})

		return () => unsubscribe()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		onAuthStateChanged((authUser) => {
			if (user === undefined) return

			// refresh when user changed to ease testing
			if (user?.email !== authUser?.email) {
				router.refresh()
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return user;
}