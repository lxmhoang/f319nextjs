'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ArrowLeftEndOnRectangleIcon, ArrowRightStartOnRectangleIcon, ArrowsRightLeftIcon, ChartBarIcon, ChatBubbleLeftIcon, EyeIcon, MegaphoneIcon, UserIcon } from '@heroicons/react/24/solid';
import { RssIcon } from '@heroicons/react/16/solid';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Overview', href: '/profile', icon: UserIcon },
  { name: 'Theo dõi', href: '/profile/pred', icon: BookmarkIcon},
  {
    name: 'Ứng tiền', href: '/profile/deposit',
    icon: ArrowLeftEndOnRectangleIcon,
  },
  {
    name: 'Rút tiền', href: '/profile/requestwithdraw',
    icon: ArrowRightStartOnRectangleIcon,
  },
  {
    name: 'Lich su Giao dịch', href: '/profile/transactions',
    icon: ArrowsRightLeftIcon,
  },
  {
    name: 'Hoạt động', href: '/profile/activities',
    icon: RssIcon,
  },
  {
    name: 'Feedback', href: '/profile/feedback',
    icon: MegaphoneIcon,
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
            <LinkIcon className="w-6 fill-yellow-500" title="aaa" color='text-cyan-500' />
            <p className=" md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
