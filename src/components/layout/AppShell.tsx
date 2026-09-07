'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import {
  Newspaper,
  CalendarCheck,
  Compass,
  User,
  ShieldCheck,
  HandHeart,
  Users,
  Building2,
  Briefcase,
  Bookmark,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface AppShellProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export function AppShell({ children, hideSidebar }: AppShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { role } = useAuth();
  const currentRole: UserRole = role || 'volunteer';

  const shouldHideSidebar = hideSidebar ?? (pathname === '/feed');

  const bottomNavItems = {
    volunteer: [
      { name: 'Feed', href: '/feed', icon: Newspaper },
      { name: 'Hub', href: '/volunteer/dashboard', icon: CalendarCheck },
      { name: 'Drives', href: '/volunteer/opportunities', icon: Compass },
      { name: 'Impact', href: '/volunteer/impact', icon: ShieldCheck },
      { name: 'Profile', href: '/onboarding/volunteer', icon: User },
    ],
    ngo: [
      { name: 'Feed', href: '/feed', icon: Newspaper },
      { name: 'Ops Hub', href: '/ngo/dashboard', icon: HandHeart },
      { name: 'Drives', href: '/ngo/opportunities', icon: CalendarCheck },
      { name: 'Volunteers', href: '/ngo/volunteers', icon: Users },
      { name: 'Profile', href: '/onboarding/ngo', icon: Building2 },
    ],
    corporate: [
      { name: 'Feed', href: '/feed', icon: Newspaper },
      { name: 'CSR Hub', href: '/corporate/dashboard', icon: Briefcase },
      { name: 'Find NGOs', href: '/corporate/ngos', icon: Compass },
      { name: 'Shortlist', href: '/corporate/shortlist', icon: Bookmark },
      { name: 'Profile', href: '/onboarding/corporate', icon: Building2 },
    ],
  }[currentRole];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF8]">
      <TopBar onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

      {shouldHideSidebar ? (
        /* Clean 3-Column / Feed Layout without permanent desktop sidebar */
        <div className="flex-1 flex flex-col w-full">
          {/* Render mobile drawer only when triggered */}
          {isMobileSidebarOpen && (
            <Sidebar
              isMobileOpen={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
          )}

          <main className="flex-1 w-full min-w-0 pb-20 lg:pb-8">
            {children}
          </main>
        </div>
      ) : (
        /* Standard Workspace Shell with left sidebar */
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-7 min-w-0 pb-20 lg:pb-8">
            {children}
          </main>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-[#E8E3E8] h-14 px-1 flex items-center justify-around"
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#6D3A70] font-bold' : 'text-[#8B8790] hover:text-[#25232A]'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-[#F1E7F3] text-[#6D3A70]' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="mt-0.5 leading-none">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
