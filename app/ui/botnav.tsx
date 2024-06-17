'use client'

import Link from "next/link";
import { useAppContext } from "../lib/context";
import clsx from 'clsx';
import { usePathname } from "next/navigation";
import { HomeIcon } from "@heroicons/react/16/solid";
import { ChartBarIcon, UserCircleIcon, WalletIcon } from "@heroicons/react/16/solid";

export default function BottomNav() {
    const { user } = useAppContext()
    const isExpert = user?.isExpert ?? false
    const pathname = usePathname() ?? "/"

    const tabInfo = isExpert ?
        [
            {
                title: "Home",
                key: "Home",
                icon: HomeIcon,
                path: "/",
                actived: !(pathname.includes('/wallet') || pathname.includes('/profile') || pathname.includes('/advisor') || pathname.includes('/expert'))
            },
            {
                title: "Expert",
                key: "Expert",
                icon: ChartBarIcon,
                path: "/expert",
                actived: pathname.startsWith('/expert')
            },
            {
                title: "Wallet",
                key: "Wallet",
                icon: WalletIcon,
                path: "/wallet",
                actived: pathname.includes('/wallet')
            },
            {
                title: "Corner",
                key: "Corner",
                icon: WalletIcon,
                path: "/advisor",
                actived: pathname.startsWith('/advisor')
            },
            {
                title: "Profile",
                key: "Profile",
                icon: UserCircleIcon,
                path: "/profile",
                actived: pathname.includes('/profile')
            }
        ]
        :
        [
            {
                title: "Home",
                key: "Home2",
                icon: HomeIcon,
                path: "/",
                actived: !(pathname.includes('/wallet') || pathname.includes('/profile') || pathname.includes('/advisor') || pathname.includes('/expert'))
            },
            {
                title: "Expert",
                key: "Expert2",
                icon: ChartBarIcon,
                path: "/expert",
                actived: pathname.startsWith('/expert')
            },
            {
                title: "Wallet",
                key: "Wallet2",
                icon: WalletIcon,
                path: "/wallet",
                actived: pathname.startsWith('/wallet')
            },
            {
                title: "Profile",
                key: "Profile2",
                icon: UserCircleIcon,
                path: "/profile",
                actived: pathname.startsWith('/profile')
            }
        ]


    return (
        <>
            <div className={clsx('dark:bg-slate-900 bg-white grid h-[54px] max-w-lg mx-auto mt-4 font-medium', {
                'grid-cols-4': tabInfo.length == 4,
                'grid-cols-5': tabInfo.length == 5,
            })}>
                {tabInfo.map((tab) => {
                    return (
                        <div key={tab.key} className={clsx("inline-flex flex-col items-center justify-center border-gray-200  group dark:border-gray-600 ", {
                            "dark:bg-blue-800 dark:text-gray-200 bg-gray-100 text-gray-600": tab.actived,
                            "dark:bg-blue-600 dark:text-blue-300 bg-gray-300 text-gray-800": !tab.actived,
                        })} >
                            <Link href={tab.path} type="button" className="">
                                <div className="px-2">
                                    {/* {tab.actived ? "a" : "n"} */}
                                    <tab.icon className={clsx('w-5 h-5', {
                                        // "dark:text-blue-500": tab.actived,
                                        // "dark:text-blue-600": !tab.actived,
                                    })} fill="currentColor" />
                                </div>
                                <div><span className={clsx("text-sm ", {

                                    // "dark:text-red-500": tab.actived,
                                    // "dark:text-blue-600": !tab.actived,

                                })}>{tab.title}</span></div>
                            </Link>
                        </div>
                    )
                }
                )}
            </div></>
    );

}


