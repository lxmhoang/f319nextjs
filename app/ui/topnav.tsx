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
import { Badge } from "@nextui-org/badge";
import { DarkThemeToggle, Label } from "flowbite-react";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { didTapNotificationWithKey, getTapNotificationKeys, login } from "../lib/client";

type MenuDropDownItem = {
  key: string,
  href?: string,
  type: string,
  //  pathName: string,
  title: string, description?: string, activated: boolean,
  // hash?: string
}


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

  const userNotifies: MenuDropDownItem[] = user?.notifies ? user.notifies.map((item, index) => {
    console.log('urlpath ' + item.urlPath)
    // const pathName = item.urlPath?.split('#')[0] ?? ""
    // const hash = item.urlPath?.split('#')[1]
    return {
      // pathName: pathName,
      type: 'notification',
      title: item.title,
      href: item.urlPath ?? "",
      description: item.content,
      key: item.dateTime.toString(),
      activated: true,
      // hash: hash

    }
  }) : []

  const readKeys = getTapNotificationKeys()
  const badgeNum = userNotifies.map((item) => item.key).filter((el) => {
    return !readKeys.includes(el)
  }).length

  const dropDownInfo: MenuDropDownItem[] =
    user ?
      [

        ...userNotifies,
        // { key: "home", href: "/", label: "Home", activated: true },
        // { key: "expert", href: "/expert", label: "Chuyên gia", activated: true },
        // { key: "divider", href: "#", label: "", activated: true },
        // { key: "myprofile", href: "/profile", label: "Hồ sơ của tôi", activated: true },
        // { key: "myexpert", href: "/advisor", label: "Hồ sơ chuyên gia của tôi", activated: true },
        { key: "morenoti", href: "/profile/activities", title: "Xem tất cả thông báo ", activated: true, type: 'notification' },
        { key: "signout", href: "", title: "Sign out", activated: true, type: 'signout' }
      ]
      :
      [
        // { key: "home", href: "/", label: "Home", activated: true },
        // { key: "expert", href: "/expert", label: "Expert List", activated: true },
        // { key: "divider", href: "#", label: "", activated: true },
        // { key: "myexpert", href: "/advisor", label: "Hồ sơ chuyên gia của tôi", activated: false },
        // { key: "myprofile", href: "/profile", label: "Hồ sơ của tôi", activated: user != undefined },
          { key: "signin", href: "", title: "Sign in", activated: true, type: 'signin' }
      ]
  const MenuButton = ({ title, menuInfo, avatarURL }: { title: string, menuInfo: { key: string }[], avatarURL: string | null | undefined }) => {
    return (

      <Dropdown>
        <Badge content={badgeNum} color="secondary" className={badgeNum == 0 ? "invisible" : "visible"}>
          <DropdownTrigger>
            <Button variant="flat" className="capitalize flex" >
              {avatarURL && 
              <Image className="rounded-full" src={avatarURL} priority={true} alt="Thumb" height={30} width={30} />
              }
              {title}
            </Button>
          </DropdownTrigger>
        </Badge>
        <DropdownMenu
          aria-label="Dropdown Variants" items={dropDownInfo}
          onAction = {(key) => {
            console.log(key)
            if (!['morenoti','signout','signin'].includes(key as string)) {
              didTapNotificationWithKey(key as string)
            }
          }
          }
        >
          {
            (item) => (
              // <DropdownItem key={item.key} href={item.href}>{item.label}</DropdownItem>

              <DropdownItem
              // onClick={(e) => {
              //   console.log('zzzz')
              // }}
                key={item.key}
                title={item.title}
                description={item.description}
                href={item.href}
                color={item.type === "signout" ? "danger" : "default"}
                className={clsx('max-w-sm', 
                { 
                  "text-danger " : item.type === "signout",
                  // "bg-sky-500 text-black" : item.type === 'notification'
                }
              )}

                onClick={
                  item.key === "signout" ? () => { signOut() } : item.key === 'signin' ? () => { login() } : () => { }}
              >
                <div>
                  {/* <Link href={{ pathname: item.pathName, hash: item.hash }}> */}
                  {/* <p className="break-word">{item.label}</p>
                      <p className="break-word">{item.label}</p> */}
                  {/* {item.label} */}
                  {/* <Label value={item.label} /> */}
                  {/* </Link> */}
                </div>

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
                href={item.activated ? item.href ?? "" : ""}
              >
                <p className={clsx({
                  "text-white-600": item.activated == true,
                  "text-gray-600": item.activated == false
                })}>
                  {item.title}
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
                    href={item.activated ? { pathname: item.href } : ""}
                  // href={{ pathname: item.href }}
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
              {/* {getTapNotificationKeys()} */}
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


