'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  QrCode,
  BarChart3,
  Award,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import QrAttendanceDemoModal from './QrAttendanceDemoModal';
import AnalyticsReportDemoModal from './AnalyticsReportDemoModal';

interface SponsoredProductCardProps {
  className?: string;
  variant?: 'feed_sidebar' | 'dashboard_rail' | 'inline_banner';
}

export default function SponsoredProductCard({
  className = '',
  variant = 'feed_sidebar',
}: SponsoredProductCardProps) {
  const [isQrDemoOpen, setIsQrDemoOpen] = useState(false);
  const [isAnalyticsDemoOpen, setIsAnalyticsDemoOpen] = useState(false);

  return (
    <>
      <div
        className={`bg-gradient-to-b from-white via-[#FAF5FA]/60 to-white rounded-xl border border-[#E8E3E8] p-4 shadow-xs relative overflow-hidden group hover:border-[#6D3A70]/40 transition-all ${className}`}
      >
        {/* Subtle Top Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6D3A70] via-[#A85AAA] to-[#D97706]" />

        {/* Sponsor Label */}
        <div className="flex items-center justify-between gap-2 mb-2.5 pt-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B8790] flex items-center gap-1">
            <span>Sponsored</span>
            <span>&bull;</span>
            <span className="text-[#6D3A70] font-extrabold">ImpactOS Pro</span>
          </span>
          <span className="text-[9.5px] font-extrabold text-[#B45309] bg-[#FEF3C7] border border-[#F59E0B]/30 px-1.5 py-0.5 rounded">
            ⚡ 14-Day Free Trial
          </span>
        </div>

        {/* Headline & Body */}
        <div className="space-y-1.5">
          <h3 className="text-xs sm:text-sm font-bold text-[#25232A] group-hover:text-[#6D3A70] transition-colors leading-snug">
            Automate Volunteer Management &amp; QR Attendance
          </h3>
          <p className="text-[11px] text-[#6B6870] leading-relaxed">
            Eliminate manual sign-in sheets. ImpactOS delivers instant GPS-verified QR check-ins, automated audit-ready CSR reports, and 1-click certificate dispatch.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-1.5 my-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6D3A70] bg-[#FAF5FA] border border-[#E8E3E8] px-2 py-0.5 rounded-md">
            <QrCode className="w-3 h-3 text-[#6D3A70]" />
            <span>QR Kiosk Check-In</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6D3A70] bg-[#FAF5FA] border border-[#E8E3E8] px-2 py-0.5 rounded-md">
            <BarChart3 className="w-3 h-3 text-[#6D3A70]" />
            <span>ESG &amp; 501(c)(3) Reports</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6D3A70] bg-[#FAF5FA] border border-[#E8E3E8] px-2 py-0.5 rounded-md">
            <Award className="w-3 h-3 text-[#6D3A70]" />
            <span>Bulk Certificates</span>
          </span>
        </div>

        {/* Dual Actions */}
        <div className="pt-2 border-t border-[#E8E3E8] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsQrDemoOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6D3A70] hover:text-[#552C59] hover:underline cursor-pointer"
          >
            <span>Live QR Demo</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <Link
            href="/solutions/pro"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-2xs transition-colors shrink-0"
          >
            <span>Try Pro Free</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Interactive QR Demo Modal */}
      <QrAttendanceDemoModal
        isOpen={isQrDemoOpen}
        onClose={() => setIsQrDemoOpen(false)}
      />

      {/* Interactive Analytics Demo Modal */}
      <AnalyticsReportDemoModal
        isOpen={isAnalyticsDemoOpen}
        onClose={() => setIsAnalyticsDemoOpen(false)}
      />
    </>
  );
}
