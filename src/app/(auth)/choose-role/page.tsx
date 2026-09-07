'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  HeartHandshake,
  HandHeart,
  Users,
  Building2,
  Check,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

type PrimaryRole = 'VOLUNTEER' | 'NGO' | 'CORPORATE';

export default function ChooseRolePage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<PrimaryRole>(
    profile?.role === 'ngo'
      ? 'NGO'
      : profile?.role === 'corporate'
      ? 'CORPORATE'
      : 'VOLUNTEER'
  );

  const handleContinue = () => {
    switch (selectedRole) {
      case 'VOLUNTEER':
        router.push('/onboarding/volunteer');
        break;
      case 'NGO':
        router.push('/onboarding/ngo');
        break;
      case 'CORPORATE':
        router.push('/onboarding/corporate');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF8] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-9 h-9 rounded-lg bg-[#6D3A70] text-white flex items-center justify-center shadow-xs group-hover:bg-[#552C59] transition-colors">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#25232A]">
              Do Good Drive
            </span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF5FA] text-[#6D3A70] text-xs font-semibold mb-3 border border-[#E8E3E8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Step 1 of 2: Primary Role Selection</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#25232A]">
            Select Your Primary Marketplace Role
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8B8790] leading-relaxed">
            Please choose exactly one primary role to initiate your tailored profile onboarding.
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-3.5 mb-8">
          {/* Volunteer Option */}
          <div
            onClick={() => setSelectedRole('VOLUNTEER')}
            className={`p-5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              selectedRole === 'VOLUNTEER'
                ? 'bg-[#FAF5FA] border-[#6D3A70] ring-2 ring-[#6D3A70]/20 shadow-xs'
                : 'bg-white border-[#E8E3E8] hover:border-[#6D3A70]/40 hover:bg-[#FAF5FA]/40'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedRole === 'VOLUNTEER'
                    ? 'bg-[#6D3A70] text-white'
                    : 'bg-[#FAF5FA] text-[#6D3A70]'
                }`}
              >
                <HandHeart className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#25232A]">
                    Community Volunteer
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                    VOLUNTEER
                  </span>
                </div>
                <p className="text-xs text-[#6B6870] mt-1 leading-relaxed">
                  Discover local and remote community drives matching your skills, availability, and causes. Track your verified impact hours.
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                selectedRole === 'VOLUNTEER'
                  ? 'border-[#6D3A70] bg-[#6D3A70] text-white'
                  : 'border-[#E8E3E8] bg-white'
              }`}
            >
              {selectedRole === 'VOLUNTEER' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>

          {/* NGO Option */}
          <div
            onClick={() => setSelectedRole('NGO')}
            className={`p-5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              selectedRole === 'NGO'
                ? 'bg-[#FAF5FA] border-[#6D3A70] ring-2 ring-[#6D3A70]/20 shadow-xs'
                : 'bg-white border-[#E8E3E8] hover:border-[#6D3A70]/40 hover:bg-[#FAF5FA]/40'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedRole === 'NGO'
                    ? 'bg-[#6D3A70] text-white'
                    : 'bg-[#FAF5FA] text-[#6D3A70]'
                }`}
              >
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#25232A]">
                    Non-Profit Organization (NGO)
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                    NGO
                  </span>
                </div>
                <p className="text-xs text-[#6B6870] mt-1 leading-relaxed">
                  Post volunteer initiatives, broadcast field updates, manage applications, and connect with verified corporate CSR grant programs.
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                selectedRole === 'NGO'
                  ? 'border-[#6D3A70] bg-[#6D3A70] text-white'
                  : 'border-[#E8E3E8] bg-white'
              }`}
            >
              {selectedRole === 'NGO' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>

          {/* Corporate Option */}
          <div
            onClick={() => setSelectedRole('CORPORATE')}
            className={`p-5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              selectedRole === 'CORPORATE'
                ? 'bg-[#FAF5FA] border-[#6D3A70] ring-2 ring-[#6D3A70]/20 shadow-xs'
                : 'bg-white border-[#E8E3E8] hover:border-[#6D3A70]/40 hover:bg-[#FAF5FA]/40'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedRole === 'CORPORATE'
                    ? 'bg-[#6D3A70] text-white'
                    : 'bg-[#FAF5FA] text-[#6D3A70]'
                }`}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#25232A]">
                    Corporate CSR Partner
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                    CORPORATE
                  </span>
                </div>
                <p className="text-xs text-[#6B6870] mt-1 leading-relaxed">
                  Direct social responsibility funding, launch employee volunteer cohorts, and initiate formal partnerships with verified NGOs.
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                selectedRole === 'CORPORATE'
                  ? 'border-[#6D3A70] bg-[#6D3A70] text-white'
                  : 'border-[#E8E3E8] bg-white'
              }`}
            >
              {selectedRole === 'CORPORATE' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E8E3E8]">
          <Link href="/" className="text-xs text-[#8B8790] hover:text-[#25232A] transition-colors">
            &larr; Back to Home
          </Link>

          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Continue to {selectedRole} Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
