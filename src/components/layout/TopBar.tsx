'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Menu,
  LogOut,
  HeartHandshake,
  ChevronDown,
  UserCheck,
  Search,
  Newspaper,
  CalendarCheck,
  Compass,
  Bookmark,
  FileText,
  ShieldCheck,
  HandHeart,
  Users,
  Building2,
  Briefcase,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import { NotificationDropdown } from './NotificationDropdown';

interface TopBarProps {
  onToggleMobileSidebar: () => void;
}

export function TopBar({ onToggleMobileSidebar }: TopBarProps) {
  const { user, profile, role, signOut, setDemoRole, isSupabaseActive } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentRole: UserRole = role || 'volunteer';

  const roleNames: Record<UserRole, string> = {
    volunteer: 'Volunteer Space',
    ngo: 'NGO Workspace',
    corporate: 'Corporate CSR',
  };

  const navItemsByRole = {
    volunteer: [
      { name: 'Home', href: '/feed', icon: Newspaper },
      { name: 'Hub', href: '/volunteer/dashboard', icon: CalendarCheck },
      { name: 'Discover', href: '/volunteer/opportunities', icon: Compass },
      { name: 'Saved', href: '/volunteer/saved', icon: Bookmark },
      { name: 'Applications', href: '/volunteer/applications', icon: FileText },
      { name: 'Impact', href: '/volunteer/impact', icon: ShieldCheck },
    ],
    ngo: [
      { name: 'Home', href: '/feed', icon: Newspaper },
      { name: 'Hub', href: '/ngo/dashboard', icon: HandHeart },
      { name: 'Drives', href: '/ngo/opportunities', icon: CalendarCheck },
      { name: 'Volunteers', href: '/ngo/volunteers', icon: Users },
      { name: 'Connections', href: '/ngo/corporate-partners', icon: Building2 },
    ],
    corporate: [
      { name: 'Home', href: '/feed', icon: Newspaper },
      { name: 'Hub', href: '/corporate/dashboard', icon: Briefcase },
      { name: 'Discover', href: '/corporate/ngos', icon: Compass },
      { name: 'Shortlist', href: '/corporate/shortlist', icon: Bookmark },
    ],
  }[currentRole];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (currentRole === 'corporate') {
      router.push(`/corporate/ngos?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/volunteer/opportunities?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-[#E8E3E8] h-14">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3">
        {/* Left: Mobile menu trigger + Brand logo + Search */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 text-[#6B6870] hover:text-[#25232A] rounded-lg hover:bg-[#FAF5FA] transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/feed" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#6D3A70] text-white flex items-center justify-center shadow-xs group-hover:bg-[#552C59] transition-colors">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold tracking-tight text-[#25232A] leading-none">
                Do Good Drive
              </span>
              <span className="text-[9px] tracking-wider uppercase text-[#6B6870] font-semibold mt-0.5">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Compact Search Field */}
          <form onSubmit={handleSearch} className="relative hidden md:block ml-2">
            <Search className="w-3.5 h-3.5 text-[#8B8790] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentRole === 'corporate' ? 'Search NGOs, causes...' : 'Search drives, NGOs...'}
              className="w-36 lg:w-48 pl-8 pr-3 py-1 text-xs bg-[#FBFAF8] border border-[#E8E3E8] rounded-full text-[#25232A] placeholder-[#8B8790] focus:outline-none focus:ring-2 focus:ring-[#A85AAA] focus:bg-white transition-all"
            />
          </form>
        </div>

        {/* Center: Top Navigation Items mapped from Sidebar */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 lg:gap-2 h-full"
        >
          {navItemsByRole.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex flex-col items-center justify-center px-2 lg:px-2.5 h-full text-[11px] transition-colors group ${
                  isActive
                    ? 'text-[#25232A] font-semibold'
                    : 'text-[#6B6870] hover:text-[#25232A]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 mb-0.5 transition-colors ${
                    isActive
                      ? 'text-[#6D3A70]'
                      : 'text-[#8B8790] group-hover:text-[#25232A]'
                  }`}
                />
                <span className="leading-none">{item.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-[#6D3A70] rounded-t-full" />
                )}
              </Link>
            );
          })}

          {/* NGO Post Drive Primary Action */}
          {currentRole === 'ngo' && (
            <Link
              href="/ngo/opportunities/new"
              className="hidden lg:inline-flex items-center gap-1 ml-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Drive</span>
            </Link>
          )}
        </nav>

        {/* Right: Role Switcher, Notifications & Me Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Fast Role Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-[#6B6870] hover:text-[#25232A] px-2.5 py-1 rounded-lg border border-[#E8E3E8] hover:bg-[#FAF5FA] transition-colors cursor-pointer"
            >
              <span className="hidden xl:inline text-[#8B8790]">Role:</span>
              <span className="font-semibold text-[#6D3A70] capitalize">{currentRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8B8790]" />
            </button>

            {isRoleDropdownOpen && (
              <div
                className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl border border-[#E8E3E8] shadow-lg py-1.5 z-50 animate-in fade-in-0 duration-100"
                onClick={() => setIsRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8B8790]">
                  Switch Workspace
                </div>
                <button
                  type="button"
                  onClick={() => setDemoRole('volunteer')}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#FAF5FA] cursor-pointer transition-colors ${
                    currentRole === 'volunteer' ? 'font-semibold text-[#6D3A70] bg-[#FAF5FA]' : 'text-[#6B6870]'
                  }`}
                >
                  <span>Volunteer Space</span>
                  {currentRole === 'volunteer' && <UserCheck className="w-3.5 h-3.5 text-[#6D3A70]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setDemoRole('ngo')}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#FAF5FA] cursor-pointer transition-colors ${
                    currentRole === 'ngo' ? 'font-semibold text-[#6D3A70] bg-[#FAF5FA]' : 'text-[#6B6870]'
                  }`}
                >
                  <span>NGO Workspace</span>
                  {currentRole === 'ngo' && <UserCheck className="w-3.5 h-3.5 text-[#6D3A70]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setDemoRole('corporate')}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#FAF5FA] cursor-pointer transition-colors ${
                    currentRole === 'corporate' ? 'font-semibold text-[#6D3A70] bg-[#FAF5FA]' : 'text-[#6B6870]'
                  }`}
                >
                  <span>Corporate CSR</span>
                  {currentRole === 'corporate' && <UserCheck className="w-3.5 h-3.5 text-[#6D3A70]" />}
                </button>
              </div>
            )}
          </div>

          {/* In-App Notifications */}
          <NotificationDropdown />

          {/* Me / Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-[#FAF5FA] transition-colors cursor-pointer group"
              aria-label="Profile and account menu"
            >
              <div className="w-7 h-7 rounded-full bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-xs flex items-center justify-center">
                {profile?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden xl:flex items-center gap-1 text-left">
                <span className="text-xs font-semibold text-[#25232A]">Me</span>
                <ChevronDown className="w-3 h-3 text-[#8B8790]" />
              </div>
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl border border-[#E8E3E8] shadow-lg py-2 z-50 animate-in fade-in-0 duration-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-[#E8E3E8]">
                  <p className="text-xs font-bold text-[#25232A]">{profile?.fullName || 'User'}</p>
                  <p className="text-[11px] text-[#8B8790] truncate">{profile?.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6D3A70] font-semibold uppercase tracking-wider border border-[#E8E3E8]">
                      {currentRole}
                    </span>
                    {!isSupabaseActive && (
                      <span className="text-[10px] text-[#B45309] bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-[#B45309]/20 font-medium">
                        Dev Mode
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href={
                      currentRole === 'volunteer'
                        ? '/onboarding/volunteer'
                        : currentRole === 'ngo'
                        ? '/onboarding/ngo'
                        : '/onboarding/corporate'
                    }
                    className="block px-4 py-1.5 text-xs text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA] transition-colors"
                  >
                    View / Edit Profile
                  </Link>
                  <Link
                    href={`/${currentRole}/dashboard`}
                    className="block px-4 py-1.5 text-xs text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA] transition-colors"
                  >
                    Operations Hub
                  </Link>
                </div>

                {/* Quick Jump Section (preserved from former sidebar) */}
                <div className="border-t border-[#E8E3E8] pt-1 mt-1">
                  <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8B8790]">
                    Quick Jump
                  </div>
                  <Link
                    href="/"
                    className="block px-4 py-1.5 text-xs text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA] transition-colors"
                  >
                    Public Landing
                  </Link>
                  <Link
                    href="/choose-role"
                    className="block px-4 py-1.5 text-xs text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA] transition-colors"
                  >
                    Role Onboarding
                  </Link>
                  <Link
                    href="/admin/verifications"
                    className="block px-4 py-1.5 text-xs text-[#6D3A70] font-semibold hover:bg-[#FAF5FA] transition-colors"
                  >
                    Admin Verifications Portal
                  </Link>
                </div>

                <div className="border-t border-[#E8E3E8] mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-xs text-[#B91C1C] hover:bg-[#FEE2E2] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
