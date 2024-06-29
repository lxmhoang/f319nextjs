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
  DropdownItem,
  Divider
} from "@nextui-org/react";

import Image from 'next/image'
import Link from 'next/link';
import clsx from 'clsx';
import { signInWithGoogle, signOut } from "../lib/firebase/auth";
import { useAppContext } from "../lib/context";
import { useState } from "react";
import { convert } from "../lib/utils";
import { DarkThemeToggle } from "flowbite-react";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { login } from "../lib/client";




export default function TopNav() {
  const searchParams = useSearchParams()
  const refID = searchParams ? searchParams.get('ref')?.toString() : undefined

  try {
    if (refID && (typeof window !== "undefined")) {
      localStorage.setItem("referalID", refID)
      console.log(' refID saved ' + refID)
    }

  } catch (e) {

  }

  const pathname = usePathname() ?? ""

  const expertBarMenuList = [
    { key: "home", href: "/", label: "Home", activated: true, highlighted: pathname === '/' },
    { key: "expert", href: "/expert", label: "Chuyên gia", activated: true },
    { key: "myprofile", href: "/profile", label: "Hồ sơ của tôi", activated: true },
    { key: "myexpert", href: "/advisor", label: "Hồ sơ chuyên gia của tôi", activated: true },
    // { key: "signout", href: "", label: "Sign out", activated: true }
  ]

  const userBarMenuList = [
    { key: "home", href: "/", label: "Home", activated: true },
    { key: "expert", href: "/expert", label: "Chuyên gia", activated: true },
    { key: "myprofile", href: "/profile", label: "Hồ sơ của tôi", activated: true },
    { key: "myexpert", href: "/register", label: "Đăng ký chuyên gia", activated: true },
  ]

  const guessBarMenuList =
    [
      { key: "home", href: "/", label: "Home", activated: true },
      { key: "expert", href: "/expert", label: "Chuyên gia", activated: true },
      { key: "myprofile", href: "/profile", label: "Hồ sơ của tôi", activated: false },
      // { key: "signin", href: "", label: "Sign in", activated: true }
    ]

  // const isAdvisor = pathname.startsWith('/advisor')

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, firebaseUser } = useAppContext()
  const barInfo =
    (user && user.isExpert) ? expertBarMenuList
      :
      user ? userBarMenuList : guessBarMenuList

  const dropDownInfo =
    user && user.isExpert ?
      [
        // { key: "home", href: "/", label: "Home", activated: true },
        // { key: "expert", href: "/expert", label: "Chuyên gia", activated: true },
        // { key: "divider", href: "#", label: "", activated: true },
        // { key: "myprofile", href: "/profile", label: "Hồ sơ của tôi", activated: true },
        // { key: "myexpert", href: "/advisor", label: "Hồ sơ chuyên gia của tôi", activated: true },
        { key: "signout", href: "", label: "Sign out", activated: true }
      ]
      :
      [
        // { key: "home", href: "/", label: "Home", activated: true },
        // { key: "expert", href: "/expert", label: "Expert List", activated: true },
        // { key: "divider", href: "#", label: "", activated: true },
        // { key: "myexpert", href: "/advisor", label: "Hồ sơ chuyên gia của tôi", activated: false },
        // { key: "myprofile", href: "/profile", label: "Hồ sơ của tôi", activated: user != undefined },
        user ? { key: "signout", href: "", label: "Sign out", activated: true } :
          { key: "signin", href: "", label: "Sign in", activated: true }
      ]
  const MenuButton = ({ title, menuInfo, avatarURL }: { title: string, menuInfo: { key: string }[], avatarURL: string | null | undefined }) => {
    return (

      <Dropdown>
        <DropdownTrigger>
          <Button
            // color={color}
            variant="bordered"
            className="capitalize flex"
          >
            {
              avatarURL && <Image className="rounded-full"
                src={avatarURL}
                priority={true}
                // style={{ width: '100%', height: 'auto' }}
                // style={styles.image}
                alt="Thumb"

                height={30}
                width={30}
              />
            }

            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gold" className="w-6 h-6">
              <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
            </svg> */}

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
                textValue={item.label}
                // href={item.href}
                color={item.key === "signout" ? "danger" : "default"}
                className={item.key === "signout" ? "text-danger" : ""}
                onClick={
                  item.key === "signout" ? () => { signOut() } : item.key === 'signin' ? () => { login() } : () => { }}
              >
                <Link href={{ pathname: item.href }}>{item.label}</Link>

              </DropdownItem>
            )

          }

        </DropdownMenu>

      </Dropdown>
    );

  }


  const amount = user ? convert(user?.amount) : ''
  // const name = user?.displayName ?? user?.email ?? ""
  // console.log("amount : " + amount)
  const menuLabel = user ? user.displayName : "Sign in"


  return (
    <Navbar shouldHideOnScroll={false} position="sticky" isBordered className="bg-transparent dark:bg-transparent h-[66px] sm:h-[66px] " maxWidth='full'
      justify-between="left" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="w-[44px] h-[66px] sm:w-[66px] sm:h-[66px] sm:hidden"
      />

      <DarkThemeToggle className="sm:hidden" />
      <NavbarMenu>

        {dropDownInfo.map((item, index) => {
          if (item.key == 'divider') {
            return (<Divider key={`${item}-${index}`} />)
          }


          return (
            <NavbarMenuItem key={`${item}-${index}`} onClick={(e) => {
              e.preventDefault()
              if (item.activated) {
                if (item.key == 'signin') {
                  login()
                }
                if (item.key == 'signout') {
                  signOut()
                }
                setIsMenuOpen(false)

              } else {
                if (item.key == 'myprofile') {
                  login()
                }
                if (item.key == 'myexpert') {
                  redirect('/advisor/register')
                }
              }
              // console.log('eeee')

            }} >
              <Link
                className="w-full"
                href={item.activated ? { pathname: item.href } : ""}
              >
                <p className={clsx({
                  "text-white-600": item.activated == true,
                  "text-gray-600": item.activated == false
                })}>
                  {item.label}
                </p>
              </Link>
            </NavbarMenuItem>
          )
        })}
      </NavbarMenu>
      <NavbarBrand className="">
      </NavbarBrand>

      {/* <NavbarContent className="hidden sm:flex gap-5" justify="start">
        <NavLinks />
      </NavbarContent> */}

      {(firebaseUser === undefined) ? (<>Loading</>) :
        // (firebaseUser === null) ? (<>Null</>) : 
        (
          <NavbarContent className=" sm:flex gap-4" justify="start">
            {barInfo.map((item, index) => {
              if (item.key == 'signout') {
                return (<></>)
              }
              return (
                <NavbarItem className="hidden sm:flex" key={`${item}-${index}`} onClick={(e) => {
                  // console.log('eeee')
                  e.preventDefault()
                  if (item.activated) {
                    if (item.key == 'signin') {
                      login()
                    }
                    if (item.key == 'signout') {
                      signOut()
                    }
                  } else {
                    if (item.key == 'myprofile') {
                      login()
                    }
                    if (item.key == 'myexpert') {
                      redirect('/advisor/register')
                    }
                  }
                }} >
                  <Link
                    className="w-full"
                    // href={item.activated ? { pathname: item.href } : ""}
                    href={{ pathname: item.href }}
                  >
                    <p className={clsx("p-2 rounded-md", {
                      "dark:bg-slate-50 bg-slate-600": item.key == 'home' ? pathname === '/' : pathname.startsWith(item.href),
                      "dark:text-slate-600 text-slate-50": item.key == 'home' ? pathname === '/' : pathname.startsWith(item.href),
                      // "bg-gray-600": item.activated == false,

                      // "text-white-600": item.activated == true,
                      // "text-gray-600": item.activated == false
                    })}>
                      {item.label}
                    </p>
                  </Link>
                </NavbarItem>
              )
            })}

            <div className="profile">
              <MenuButton title={menuLabel} menuInfo={dropDownInfo} avatarURL={firebaseUser?.photoURL} />
            </div>
            <DarkThemeToggle className="hidden sm:block" />

            {/* <NavbarItem className="flex">
          {user ? (
            <>
              <></>
              <div className="profile p-2">
                <MenuButton title={menuLabel} menuInfo={dropDownInfo} />
              </div>
            </>
          ) :

            (
              <>
                <Button onClick={() => login()} >Login By Google</Button>
              </>
            )

          }
        </NavbarItem> */}
          </NavbarContent>
        )
      }

    </Navbar >
  );

}


