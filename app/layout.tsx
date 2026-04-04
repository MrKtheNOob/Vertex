import './globals.css';
import AppChrome from '@/components/AppChrome';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Vertex',
  description: 'Student talent ranking platform',
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
