import { Geist, Geist_Mono } from 'next/font/google';

import '@workspace/ui/globals.css';

import { Metadata, Viewport } from 'next';
import { TRPCReactProvider } from '@/trpc/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import { cn } from '@workspace/ui/lib/utils';
import { getBaseUrl } from '@/lib/utils';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans'
});
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  metadataBase: new URL(
    getBaseUrl()
  ),
  title: 'Edge',
  description: 'Basketball Referee Management System',
  openGraph: {
    title: 'Edge',
    description: 'Basketball Referee Management System',
    url: getBaseUrl(),
    siteName: 'Edge'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Edge',
    creator: '@Edge'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={cn(
          'bg-background text-foreground min-h-screen font-sans antialiased',
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
