import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { FeedProvider } from '@/lib/feed-context';
import { OnboardingProvider } from '@/lib/onboarding-context';
import { MarketplaceProvider } from '@/lib/marketplace-context';
import { CorporateProvider } from '@/lib/corporate-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Do Good Drive Marketplace | Connect Volunteers, NGOs & Corporates',
  description:
    'A purposeful discovery and collaboration marketplace uniting dedicated volunteers, grassroots NGOs, and corporate CSR programs to drive real, transparent social impact.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FBFAF8] text-[#25232A]">
        <AuthProvider>
          <FeedProvider>
            <OnboardingProvider>
              <MarketplaceProvider>
                <CorporateProvider>{children}</CorporateProvider>
              </MarketplaceProvider>
            </OnboardingProvider>
          </FeedProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
