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
import { useEffect, useState } from "react";
import { convert } from "../lib/utils";
import { Badge } from "@nextui-org/badge";
import { DarkThemeToggle, Label } from "flowbite-react";
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";
import { didTapNotificationWithKey, login } from "../lib/client";
import { UserNoti } from "../model/noti";

type MenuDropDownItem = {
  key: string,
  href?: string,
  type: string,
  title: string, 
  description?: string, 
  activated: boolean,
  highlighted?: boolean 
}


export default function TopNav() {
  const searchParams = useSearchParams()
  const refID = searchParams ? searchParams.get('ref')?.toString() : undefined


  try {

    if (refID) {
      const existingCache = localStorage.getItem("referalID")
      if (!existingCache) {
        localStorage.setItem("referalID", refID)
      }
    }

  } catch (e) {

    console.log('error saving referalID to local storage ' + JSON.stringify(e))
  }


  useEffect(() => {

    localStorage.setItem('flowbite-theme-mode', 'dark')

  }, [])
  const pathname = usePathname() ?? ""

  const expertBarMenuList = [
    { key: "home", href: "/", label: "Trang chủ", activated: true },
    { key: "expert", href: "/expert", label: "Chuyên gia", activated: true },
    { key: "myprofile", href: "/profile", label: "Hồ sơ của tôi", activated: true },
    { key: "myexpert", href: "/advisor", label: "Hồ sơ chuyên gia", activated: true },
    { key: "intro", href: "/intro", label: "Cách vận hành", activated: true },
  ]

  const userBarMenuList = [
    { key: "home", href: "/", label: "Trang chủ", activated: true },
    { key: "expert", href: "/expert", label: "Chuyên gia", activated: true },
    { key: "myprofile", href: "/profile", label: "Hồ sơ của tôi", activated: true },
    { key: "regexpert", href: "/register", label: "Trở thành chuyên gia", activated: true },
    { key: "intro", href: "/intro", label: "Cách vận hành", activated: true },
  ]

  const guessBarMenuList =
    [
      { key: "home", href: "/", label: "Trang chủ", activated: true },
      { key: "expert", href: "/expert", label: "Chuyên gia", activated: true },
      { key: "myprofile", href: "/profile", label: "Hồ sơ của tôi", activated: false },
      // { key: "login", href: "/login", label: "Login", activated: true },
      { key: "intro", href: "/intro", label: "Cách vận hành", activated: true },
    ]


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, firebaseUser } = useAppContext()
  const barInfo =
    (user && user.isExpert) ? expertBarMenuList
      :
      user ? userBarMenuList : guessBarMenuList

  const displayNoti : UserNoti[] = user?.notifies ? user.notifies.filter((item) => {
    return (item.dateTime > Date.now() - 1000 * 3600 * 24 * 5) 
   }) : []

   const countNoti = displayNoti.filter((item) => {
    return  (!item.tapTime) 
   })

  const notifyItem: MenuDropDownItem[] = displayNoti.map((item, index) => {
    return {
      type: 'notification',
      title: item.title,
      href: item.urlPath ?? "",
      description: item.content,
      key: item.id ?? item.dateTime.toString(),
      activated: true,
      highlighted: !item.tapTime
    }
  })
  const badgeNum = countNoti.length

  const dropDownInfo: MenuDropDownItem[] =
    user ?
      [

        ...notifyItem,
        { key: "morenoti", href: "/profile/activities", title: "Xem tất cả thông báo ", activated: true, type: 'notification' },
        { key: "signout", href: "", title: "Sign out", activated: true, type: 'signout' },
        { key: "feedback", href: "/profile/feedback", title: "Khiếu nại, góp ý", activated: true, type: 'feedback' }
      ]
      :
      [
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
          onAction={(key) => {
            console.log(key)
            if (!['morenoti', 'signout', 'signin'].includes(key as string)) {
              if (user) {
                const notiTapped = displayNoti.find((item) => { return item.id == key})
                if (notiTapped && !notiTapped.tapTime) {
                  didTapNotificationWithKey(user.uid, key as string)
                }
              }
            }
          }
          }
        >
          {
            (item) => (
              <DropdownItem
                key={item.key}
                title={item.title}
                description={item.description}
                href={item.href}
                color={item.type === "signout" ? "danger" : "default"}
                className={clsx('max-w-xs',
                  {
                    "text-danger ": item.type === "signout",
                    "dark:bg-blue-800 bg-amber-200" : item.highlighted
                    // "bg-sky-500 text-black" : item.type === 'notification'
                  }
                )}

                onClick={
                  item.key === "signout" ? () => {
                    signOut().then((result) => {
                      router.push('/')

                    })
                  } : item.key === 'signin' ? () => { login() } : () => { }}
              >


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
  const router = useRouter()


  return (
    <Navbar shouldHideOnScroll={false} position="sticky" isBordered className="bg-transparent dark:bg-transparent h-[66px] sm:h-[66px] " maxWidth='full'
      justify-between="left" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="w-[44px] h-[66px] sm:w-[66px] sm:h-[66px] sm:hidden"
      />

      {/* <DarkThemeToggle className="sm:hidden" /> */}
      { <NavbarMenu>

        {barInfo.map((item, index) => {
          if (item.key == 'divider') {
            return (<Divider key={`${item}-${index}`} />)
          }


          return (
            <NavbarMenuItem key={`${item.key}`} onClick={(e) => {
            
              // e.preventDefault()
              if (item.activated) {
                if (item.key == 'signin') {
                  login()
                }
                if (item.key == 'signout') {

                  signOut().then((result) => {
                    router.push('/')

                  })
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
                <p className='text-white-600'
                
                // {clsx({
                //   "text-white-600": item.activated == true,
                //   "text-gray-600": item.activated == false
                // })}
                >
                  {item.label}
                </p>
              </Link>
            </NavbarMenuItem>
          )
        })}
      </NavbarMenu> }
     
      <NavbarBrand className="">
      <Link href={'/intro'}>
        <p className=""> <span className="sm:ml-10 font-sans  dark:text-cyan-500 text-violet-600 text-md sm:text-2xl"> Cùng nhau thành công </span></p>
      </Link>
      </NavbarBrand>

      {/* <NavbarContent className="hidden sm:flex gap-5" justify="start">
        <NavLinks />
      </NavbarContent> */}

      {(firebaseUser === undefined) ? (<>Loading</>) :
        // (firebaseUser === null) ? (<>Null</>) : 
        (
          <NavbarContent className=" sm:flex gap-4" justify="end">
            {barInfo.map((item, index) => {
              if (item.key == 'signout') {
                return (<></>)
              }
              return (
                <NavbarItem className="hidden sm:flex" key={`${item}-${index}`} onClick={(e) => {
                  // console.log('eeee')
                  console.log('clicked with key ' + JSON.stringify(item))
                  // e.preventDefault()
                  if (item.activated) {
                    if (item.key == 'signin') {
                      login()
                    }
                    if (item.key == 'signout') {
                      signOut().then((result) => {
                        router.push('/')

                      })
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

            <div className="">
              <MenuButton title={menuLabel} menuInfo={dropDownInfo} avatarURL={firebaseUser?.photoURL} />
            </div>
            {/* <DarkThemeToggle className="" /> */}

          </NavbarContent>
        )
      }

    </Navbar >
  );

}


