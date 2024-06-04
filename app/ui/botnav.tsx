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
    const pathname = usePathname()

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
                key: "Home",
                icon: HomeIcon,
                path: "/",
                actived: true
            },
            {
                title: "Expert",
                key: "Expert",
                icon: ChartBarIcon,
                path: "/expert",
                actived: true
            },
            {
                title: "Wallet",
                key: "Wallet",
                icon: WalletIcon,
                path: "/wallet",
                actived: true
            },
            {
                title: "Profile",
                key: "Profile",
                icon: UserCircleIcon,
                path: "/profile",
                actived: true
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
                        <div key={tab.key} className="inline-flex flex-col items-center justify-center   border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600 dark:text-gray-400 text-gray-500 " >
                            <Link href={tab.path} type="button" className="">
                                <div className="px-2">
                                    <tab.icon className={clsx('w-5 h-5', {
                                        "dark:text-blue-500": tab.actived,
                                        "dark:text-blue-600": tab.actived,
                                    })} fill="currentColor" />
                                </div>
                                <div><span className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:group-hover:text-blue-500">{tab.title}</span></div>
                            </Link>
                        </div>
                    )
                }
                )}
            </div></>
    );

}


