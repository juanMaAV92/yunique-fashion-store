import type { Metadata } from 'next';
import './globals.css';
import { inter } from '@/config/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: 'Yunique Fashion Store',
  description: 'Una tiend Yunica',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
