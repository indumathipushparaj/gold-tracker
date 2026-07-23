import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/AppShell';
import { Toaster } from 'sonner'
import AuthProvider from '@/components/AuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'gold-tracker',
  description: 'Track your gold purchases and current value',
  icons: {
    icon: '/gold-tracker-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
       <AuthProvider>
    <AppShell>{children}</AppShell>
    <Toaster theme="dark" position="top-right" richColors />
  </AuthProvider>
      </body>
    </html>
  );
}
