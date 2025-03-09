'use client';

import clsx from 'clsx';
import { Menu } from 'lib/vvveb/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function FooterMenuItem({ item }: { item: Menu }) {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.url);

  useEffect(() => {
    setActive(pathname === item.url);
  }, [pathname, item.url]);

  return (
    <li>
      <Link
        href={item.url}
        className={clsx(
          'block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300',
          {
            'text-black dark:text-neutral-300': active
          }
        )}
      >
        {item.name}
      </Link>
    </li>
  );
}

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null;

  return (
    <nav>
      <ul>
        {menu.map((item: Menu) => {
          return <FooterMenuItem key={item.menuItemId} item={item} />;
        })}
      </ul>
    </nav>
  );
}
