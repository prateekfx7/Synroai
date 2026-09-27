import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const helvetica = localFont({
  src: [
    {
      path: '../Helvetica.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../Helvetica.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../Helvetica-Bold.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../Helvetica-Bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../Helvetica-Bold.woff',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../Helvetica-Bold.woff',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Synro | Autonomous AMR Decentralized Fleet',
  description:
    'Synro - Decentralized multi-robot fleet coordination and space-time reservation for Autonomous Mobile Robots (AMRs) in modern smart logistics.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={helvetica.variable}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="256x256" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={`${helvetica.className} font-sans bg-[#edf0f4] text-slate-900 min-h-screen antialiased selection:bg-[#ff334b] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
