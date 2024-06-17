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
import { UserIcon } from '@heroicons/react/16/solid';
import { useAppContext } from '@/app/lib/context';
import { Spinner } from 'flowbite-react';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = (type: string) =>  [
  { name: 'Overview', href: '/advisor', icon: HomeIcon },
  { name: 'Edit info', href: '/advisor/edit', icon: UserIcon },
  {
    name: 'Thêm khuyến nghị', href: '/advisor/prediction/new',
    icon: PlusIcon,
  },
  {
    name: 'Lịch sử khuyến nghị', href: '/advisor/prediction',
    icon: ClipboardDocumentIcon,
  },
  type == 'solo' ? 
  { name: 'Người theo dõi', href: '/advisor/subscription', icon: UserGroupIcon } :
  { name: 'Rank', href: '/advisor/rank', icon: UserGroupIcon },
];

export default function NavLinks({expertType} : {expertType: string | undefined}) {
  const pathname = usePathname();

  if (!expertType) {
    return (
      <>  </>
    )
  } 
  return (
    <>

      {links(expertType).map((link) => {
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
