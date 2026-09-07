'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Home, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function UnauthorizedPage() {
  const { role, profile } = useAuth();

  const getTargetDashboard = () => {
    switch (role) {
      case 'ngo':
        return '/ngo/dashboard';
      case 'corporate':
        return '/corporate/dashboard';
      case 'volunteer':
      default:
        return '/volunteer/dashboard';
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-[#FEF3C7] border border-[#B45309]/20 text-[#B45309] flex items-center justify-center shadow-xs">
        <ShieldAlert className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="max-w-md space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309] block">
          403 &bull; Access Restricted
        </span>
        <h1 className="text-2xl font-bold text-[#25232A]">Unauthorized Role Access</h1>
        <p className="text-xs text-[#6B6870] leading-relaxed">
          Your current account role (<strong>{role || 'Guest'}</strong>) does not have authorization to view or edit this section. Please navigate to your designated role dashboard or choose another role.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={getTargetDashboard()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
        >
          <span>Go to My Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/choose-role"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#25232A] bg-white border border-[#E8E3E8] hover:bg-[#FAF5FA] rounded-lg shadow-xs transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Switch Role Track</span>
        </Link>
      </div>
    </div>
  );
}
