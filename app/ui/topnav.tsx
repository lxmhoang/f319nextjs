'use client'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import Link from 'next/link';
import { auth,} from "../lib/firebase/firebase";
import { signInWithGoogle, signOut } from "../lib/firebase/auth";
import { useAppContext } from "../lib/context";

function convert(num: number) {
  let formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(num)
}

const dropDownInfo = [
  { key: "profile", href: "/profile", label: "Profile" },
  { key: "expert", href: "/profile/expert", label: "Expert" },
  { key: "signout", label: "Sign out" }
]
const MenuButton = ({ title, menuInfo }: { title: string, menuInfo: { key: string }[] }) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          // color={color}
          variant="bordered"
          className="capitalize flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gold" className="w-6 h-6">
            <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
          </svg>

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
              // href={item.href}
              color={item.key === "signout" ? "danger" : "default"}
              className={item.key === "signout" ? "text-danger" : ""}
              onClick={item.key === "signout" ? () => { signOut() } : () => { }}
            >
              <Link href={{pathname:item.href}}>{item.label}</Link>
             
            </DropdownItem>
          )

        }

      </DropdownMenu>
    </Dropdown>
  );

}


export default function TopNav() {

  const {user} = useAppContext()
  const amount = user ? convert(user?.amount) : ''
  const name = user?.displayName ?? user?.email
  console.log("amount : " + amount)
  const menuLabel = user ? amount : "Menu"
  const login = () => {
    try {
      let cache = localStorage.getItem("referalID")
      signInWithGoogle(cache)
    } catch (error) {
      console.log("error sign in " + JSON.stringify(error))
    }
  };




  console.log("refresh top nav")
  return (
    <Navbar className="dark h-[88px] sm:h-[88px] border " maxWidth='full' justify-between="left">
      <NavbarBrand className="">
        {/* <AcmeLogo /> */}
        <Link href="/">  <p className="text-2xl">319</p> </Link>
      </NavbarBrand>

      {/* <NavbarContent className="hidden sm:flex gap-5" justify="start">
        <NavLinks />
      </NavbarContent> */}
      <NavbarContent justify="end">
        <NavbarItem className="flex">
          {user ? (
            <>
              {user.isAdmin == true ? (
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
                <Button onClick={() => login()} >Login By Google</Button>
                {/* <div>{error ? "sign in eror : " + JSON.stringify(error) : "no error "}</div> */}
              </>
            )

          }
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );

}

