import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Vertex MVP',
  description: 'Student talent ranking MVP',
};

const nav = [
  { href: '/signup', label: 'Sign Up' },
  { href: '/profile/edit', label: 'Profile' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/students', label: 'Students' },
  { href: '/jobs', label: 'Jobs' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
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
          {children}
        </div>
      </body>
    </html>
  );
}
