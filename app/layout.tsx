import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Vertex MVP',
  description: 'Student talent ranking MVP',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <nav className="top">
            <Link href="/" className="row"><strong>Vertex</strong><span className="small">MVP</span></Link>
            <div className="links small">
              <Link href="/signup">Sign Up</Link>
              <Link href="/profile/edit">Profile</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/students">Students</Link>
              <Link href="/jobs">Jobs</Link>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
