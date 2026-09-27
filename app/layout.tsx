import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Synro | Autonomous AMR Decentralized Fleet',
  description:
    'Synro - Decentralized multi-robot fleet coordination and space-time reservation for Autonomous Mobile Robots (AMRs) in modern smart logistics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f5f6f8] text-[#1d1d1f] min-h-screen antialiased selection:bg-[#0071e3]/20">
        {children}
      </body>
    </html>
  );
}
