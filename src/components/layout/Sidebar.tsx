'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Compass,
  CalendarCheck,
  User,
  PlusCircle,
  Building2,
  HandHeart,
  Briefcase,
  ShieldCheck,
  Users,
  Bookmark,
  X,
  LogOut,
  Newspaper,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { role, signOut } = useAuth();
  const currentRole: UserRole = role || 'volunteer';

  const navItems = {
    volunteer: [
      { name: 'Community Feed', href: '/feed', icon: Newspaper },
      { name: 'Volunteer Hub', href: '/volunteer/dashboard', icon: CalendarCheck },
      { name: 'Discover Drives', href: '/volunteer/opportunities', icon: Compass },
      { name: 'Saved Drives', href: '/volunteer/saved', icon: Bookmark },
      { name: 'My Applications', href: '/volunteer/applications', icon: User },
      { name: 'My Impact', href: '/volunteer/impact', icon: ShieldCheck },
      { name: 'Volunteer Profile', href: '/onboarding/volunteer', icon: User },
    ],
    ngo: [
      { name: 'Community Feed', href: '/feed', icon: Newspaper },
      { name: 'Operations Hub', href: '/ngo/dashboard', icon: HandHeart },
      { name: 'Manage Drives', href: '/ngo/opportunities', icon: CalendarCheck },
      { name: 'Volunteers & Hours', href: '/ngo/volunteers', icon: Users },
      { name: 'Post a New Drive', href: '/ngo/opportunities/new', icon: PlusCircle },
      { name: 'Corporate Connections', href: '/ngo/corporate-partners', icon: Building2 },
      { name: 'NGO Profile', href: '/onboarding/ngo', icon: Building2 },
    ],
    corporate: [
      { name: 'Community Feed', href: '/feed', icon: Newspaper },
      { name: 'Corporate Hub', href: '/corporate/dashboard', icon: Briefcase },
      { name: 'Discover NGOs', href: '/corporate/ngos', icon: Compass },
      { name: 'Shortlisted NGOs', href: '/corporate/shortlist', icon: Bookmark },
      { name: 'Corporate Profile', href: '/onboarding/corporate', icon: Building2 },
    ],
  }[currentRole];

  const content = (
    <div className="flex flex-col h-full justify-between p-3.5 bg-white border-r border-[#E8E3E8]">
      <div>
        {/* Mobile close button */}
        <div className="flex lg:hidden items-center justify-between pb-3 mb-3 border-b border-[#E8E3E8]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6870]">
            Navigation
          </span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-md text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section title */}
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8B8790]">
          {currentRole} Workspace
        </div>

        {/* Nav list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#FAF5FA] text-[#6D3A70] font-semibold border border-[#E8E3E8] shadow-xs'
                    : 'text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-[#F1E7F3] text-[#6D3A70]' : 'text-[#8B8790]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Public Discovery Links */}
        <div className="mt-6 pt-3 border-t border-[#E8E3E8]">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8B8790]">
            Quick Jump
          </div>
          <div className="space-y-1">
            <Link
              href="/"
              onClick={onCloseMobile}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA] transition-colors"
            >
              <Compass className="w-4 h-4 text-[#8B8790]" />
              <span>Public Landing</span>
            </Link>
            <Link
              href="/choose-role"
              onClick={onCloseMobile}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#8B8790]" />
              <span>Role Onboarding</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-[#E8E3E8]">
        <div className="p-2.5 bg-[#FAF5FA] rounded-xl border border-[#E8E3E8] mb-2.5">
          <p className="text-[11px] font-semibold text-[#25232A]">Do Good Drive</p>
          <p className="text-[10px] text-[#8B8790] leading-relaxed mt-0.5">
            Transparent community-first social impact network.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onCloseMobile();
            signOut();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#6B6870] hover:text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#25232A]/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-xs bg-white h-full z-10 shadow-xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
