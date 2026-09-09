'use client';

import React from 'react';
import {
  X,
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  ShieldCheck,
  Building2,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface AnalyticsReportDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName?: string;
}

export default function AnalyticsReportDemoModal({
  isOpen,
  onClose,
  entityName = 'GreenCanopy Initiative',
}: AnalyticsReportDemoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E8E3E8] overflow-hidden my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF5FA] border-b border-[#E8E3E8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6D3A70] text-white flex items-center justify-center shadow-xs">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#25232A]">
                  Audit-Ready Impact &amp; ESG Report Sample
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]/30">
                  ⚡ Board &amp; CSR Compliance
                </span>
              </div>
              <p className="text-[11px] text-[#6B6870]">
                Live preview for: <span className="font-semibold text-[#6D3A70]">{entityName}</span> &bull; 2026 Season
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8B8790] hover:text-[#25232A] rounded-lg hover:bg-[#F1E7F3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content */}
        <div className="p-6 space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#FAF5FA] p-3.5 rounded-xl border border-[#E8E3E8]">
              <span className="text-[10px] uppercase font-bold text-[#8B8790] block">
                Total Verified Hours
              </span>
              <p className="text-2xl font-bold text-[#6D3A70] mt-1">1,248.5 <span className="text-xs text-[#8B8790]">hrs</span></p>
              <span className="text-[10px] text-[#15803D] font-medium block mt-0.5">+18.4% vs last quarter</span>
            </div>

            <div className="bg-[#FAF5FA] p-3.5 rounded-xl border border-[#E8E3E8]">
              <span className="text-[10px] uppercase font-bold text-[#8B8790] block">
                Economic Impact Value
              </span>
              <p className="text-2xl font-bold text-[#25232A] mt-1">$39,702</p>
              <span className="text-[10px] text-[#6B6870] font-medium block mt-0.5">@ $31.80/hr federal rate</span>
            </div>

            <div className="bg-[#FAF5FA] p-3.5 rounded-xl border border-[#E8E3E8]">
              <span className="text-[10px] uppercase font-bold text-[#8B8790] block">
                Volunteer Retention
              </span>
              <p className="text-2xl font-bold text-[#15803D] mt-1">84.2%</p>
              <span className="text-[10px] text-[#8B8790] font-medium block mt-0.5">Repeat participants</span>
            </div>

            <div className="bg-[#FAF5FA] p-3.5 rounded-xl border border-[#E8E3E8]">
              <span className="text-[10px] uppercase font-bold text-[#8B8790] block">
                ESG Compliance Score
              </span>
              <p className="text-2xl font-bold text-[#6D3A70] mt-1">98 / 100</p>
              <span className="text-[10px] text-[#15803D] font-medium block mt-0.5">Full audit verification</span>
            </div>
          </div>

          {/* Activity Breakdown Visual Bars */}
          <div className="bg-[#FBFAF8] rounded-xl p-4 border border-[#E8E3E8] space-y-3">
            <h4 className="text-xs font-bold text-[#25232A] uppercase tracking-wider flex items-center justify-between">
              <span>Initiative Impact Breakdown</span>
              <span className="text-[11px] text-[#6B6870] font-normal">All numbers geofence &amp; sign-off verified</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-medium mb-1">
                  <span>Urban Reforestation &amp; Riparian Buffer Planting</span>
                  <span className="font-bold text-[#6D3A70]">540 hrs &bull; 43.2%</span>
                </div>
                <div className="w-full h-2 bg-[#E8E3E8] rounded-full overflow-hidden">
                  <div className="h-full bg-[#6D3A70] rounded-full" style={{ width: '43.2%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium mb-1">
                  <span>Autumn Seed Harvesting &amp; Native Nursery</span>
                  <span className="font-bold text-[#6D3A70]">390 hrs &bull; 31.2%</span>
                </div>
                <div className="w-full h-2 bg-[#E8E3E8] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8E5292] rounded-full" style={{ width: '31.2%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium mb-1">
                  <span>Public River Corridor Stewardship &amp; Cleanups</span>
                  <span className="font-bold text-[#6D3A70]">318.5 hrs &bull; 25.6%</span>
                </div>
                <div className="w-full h-2 bg-[#E8E3E8] rounded-full overflow-hidden">
                  <div className="h-full bg-[#A85AAA] rounded-full" style={{ width: '25.6%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Export Toolbar Mock */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#FAF5FA] rounded-xl border border-[#E8E3E8]">
            <div className="flex items-center gap-2 text-xs text-[#25232A]">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>Certified under 501(c)(3) &amp; GRI Sustainability Standards</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert('Demo PDF Export: In production Pro, downloads instant high-resolution branded PDF.')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6D3A70] bg-white border border-[#E8E3E8] hover:bg-[#F1E7F3] rounded-lg shadow-2xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                type="button"
                onClick={() => alert('Demo CSV Export: In production Pro, exports multi-tab spreadsheet formatted for IRS 990 & ESG audits.')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6D3A70] bg-white border border-[#E8E3E8] hover:bg-[#F1E7F3] rounded-lg shadow-2xs transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV/Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E8E3E8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6B6870]">
            Ready to generate live board reports with 1 click?
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-[#6B6870] hover:text-[#25232A]"
            >
              Close
            </button>
            <Link
              href="/solutions/pro"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
            >
              <span>Unlock Live Reports with Pro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
