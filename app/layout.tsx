import './globals.css';
import type { ReactNode } from 'react';
import AppChrome from '@/components/AppChrome';

export const metadata = {
  title: 'Vertex MVP',
  description: 'Student talent ranking MVP',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
