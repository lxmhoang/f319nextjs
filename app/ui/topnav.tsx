'use client'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenu,
  NavbarMenuItem, Link,
  NavbarMenuToggle,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
// import Link from 'next/link';
import {  useSignOut } from 'react-firebase-hooks/auth';
import { auth, db } from "../lib/firebase/firebase";
import { signInWithGoogle } from "../lib/firebase/auth";
import { useUserInfo } from "../lib/firebase/getUser";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";

export default function TopNav() {
  // const [signInWithGoogle, userCredential, signing, error] = useSignInWithGoogle(auth);
  const [signOut] = useSignOut(auth);
  const [user, role, loading] = useUserInfo(true)
  const [userInfo, loadingUserInfo, error] = useDocument(
    doc(db, 'user/' + user?.uid)
  );
  const amount = userInfo?.data() ? userInfo?.data()?.amount : ''
  const menuLabel = userInfo?.data() ?  user?.displayName + "   " + amount : "Menu"
  const login = () => {
    try {
      let cache = localStorage.getItem("referalID")
      signInWithGoogle(cache)
    } catch (error) {
      console.log("error sign in " + JSON.stringify(error))
    }
  };

  const dropDownInfo = [
    { key: "profile", href: "/profile", label: "Profile" },
    { key: "expert", href: "/profile/expert", label: "Expert" },
    { key: "signout", label: "Sign out", onclick :  {signOut} }
  ]


  const MenuButton = ({ title, menuInfo }: { title: string, menuInfo: { key: string }[] }) => {
    return (

      <Dropdown>
        <DropdownTrigger>
          <Button
            // color={color}
            variant="bordered"
            className="capitalize"
          >
            {title}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dropdown Variants" items={dropDownInfo}
        >
          {
            (item) => (
              // <DropdownItem key={item.key} href={item.href}>{item.label}</DropdownItem>

          <DropdownItem
            key={item.key}
            href={item.href}
            color={item.key === "signout" ? "danger" : "default"}
            className={item.key === "signout" ? "text-danger" : ""}
            onClick={item.key === "signout" ? signOut : () => {}}
          >
            {item.label}
          </DropdownItem>
            )

          }

        </DropdownMenu>
      </Dropdown>
    );

  }

  return (
    <Navbar className="dark h-[88px] border" maxWidth='full' justify-between="left">
      <NavbarBrand className="p-3">
        {/* <AcmeLogo /> */}
        <Link href="/">  <p className="text-4xl">Cùng nhau thành công</p> </Link>


      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-5" justify="start">
        {/* <NavLinks /> */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex p-2">
          {user ? (
            <>
              {role.isAdmin ? (
                <div className="profile p-4">
                  <Link href="/admin">  admin</Link>
                </div>
              ) : (<></>)}
              <div>
              </div>
              <div className="profile p-2">
                <MenuButton title={menuLabel} menuInfo={dropDownInfo} />
              </div>
            </>
          ) :

            (
              <>
                <Link onClick={() => login()} >Login By Google</Link>
                {/* <div>{error ? "sign in eror : " + JSON.stringify(error) : "no error "}</div> */}
              </>
            )

          }
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );

}

