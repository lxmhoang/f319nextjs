'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ArrowLeftEndOnRectangleIcon, ArrowsRightLeftIcon, ChartBarIcon, ChatBubbleLeftIcon, UserIcon } from '@heroicons/react/24/solid';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Overview', href: '/profile', icon: UserIcon },
  { name: 'Khuyến nghị', href: '/profile/pred', icon: ChartBarIcon},
  {
    name: 'Ứng tiền', href: '/profile/deposit',
    icon: ArrowLeftEndOnRectangleIcon,
  },
  {
    name: 'Rút tiền', href: '/profile/requestwithdraw',
    icon: ArrowLeftEndOnRectangleIcon,
  },
  {
    name: 'Giao dịch', href: '/profile/transactions',
    icon: ArrowsRightLeftIcon,
  }
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className= {clsx('flex h-[48px] grow items-center justify-center gap-2 rounded-md  p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
            {
 
              'bg-sky-100 text-blue-600': pathname === link.href,

            },)}
          >
            <LinkIcon className="w-6" title="aaa" />
            <p className=" md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
