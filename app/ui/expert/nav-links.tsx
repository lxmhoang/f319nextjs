'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ClipboardDocumentIcon, PlusIcon } from '@heroicons/react/24/solid';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Overview', href: '/advisor', icon: HomeIcon },
  {
    name: 'Thêm khuyến nghị', href: '/advisor/prediction/new',
    icon: PlusIcon,
  },
  {
    name: 'Lịch sử khuyến nghị', href: '/advisor/prediction',
    icon: ClipboardDocumentIcon,
  },
  { name: 'Subscription', href: '/advisor/subscription', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  console.log("refresh nav bar")
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
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
