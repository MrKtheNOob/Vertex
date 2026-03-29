'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const nav = [
  { href: '/signup', label: 'Sign Up' },
  { href: '/profile/edit', label: 'Profile' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/students', label: 'Students' },
  { href: '/jobs', label: 'Jobs' },
];

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <div className={isLanding ? 'app-shell landing-shell' : 'app-shell'}>
      {!isLanding && (
        <header className="topbar">
          <Link href="/" className="brand">
            <span className="brand-dot" />
            Vertex
            <span className="small">MVP</span>
          </Link>
          <nav className="top-links">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="nav-pill">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
      )}
      {children}
    </div>
  );
}
