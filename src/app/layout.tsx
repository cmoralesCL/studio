import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google'; // Using Inter as a common, readable font. Geist can also be used.
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'OKR Tracker',
  description: 'Track your Objectives and Key Results effectively.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        {children}
        <Toaster /> {/* Add Toaster here for global notifications */}
      </body>
    </html>
  );
}
