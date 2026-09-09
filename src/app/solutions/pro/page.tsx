'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Check,
  Sparkles,
  QrCode,
  BarChart3,
  Building2,
  Users,
  ShieldCheck,
  Award,
  ArrowRight,
  HelpCircle,
  Zap,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import QrAttendanceDemoModal from '@/components/pro/QrAttendanceDemoModal';
import AnalyticsReportDemoModal from '@/components/pro/AnalyticsReportDemoModal';

export default function SolutionsProPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [trialActivated, setTrialActivated] = useState(false);
  const [isQrDemoOpen, setIsQrDemoOpen] = useState(false);
  const [isAnalyticsDemoOpen, setIsAnalyticsDemoOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleActivateTrial = (tierName: string) => {
    setTrialActivated(true);
    setTimeout(() => {
      alert(`🎉 14-Day Free Trial activated for ${tierName}! All Pro features including QR Attendance Kiosks and automated reporting are now active in your workspace.`);
    }, 200);
  };

  const faqs = [
    {
      q: 'How does the Dynamic QR Attendance Kiosk work in field conditions?',
      a: 'Your event coordinators can display the QR code on any smartphone, tablet, or print it onto an event welcome sign. When volunteers arrive, they scan the code using their phone camera. The system verifies their GPS location against the drive geofence, confirms their attendance, and records their hours automatically with zero paper.',
    },
    {
      q: 'Can volunteers without smartphones still be checked in?',
      a: 'Yes! The kiosk includes an offline backup search where the event coordinator can type any part of the volunteer’s name and check them in with one tap.',
    },
    {
      q: 'How do the audit-ready reports help with IRS Form 990 or corporate ESG?',
      a: 'ImpactOS automatically calculates verified volunteer hours multiplied by the federal independent sector valuation rate ($31.80/hr). Reports export in 1 click to PDF and multi-tab Excel, complete with non-profit verification signatures and timestamp logs.',
    },
    {
      q: 'Can we cancel or change plans at any time?',
      a: 'Yes, there are no long-term contracts for monthly plans. You can upgrade, downgrade, or cancel at any time directly from your billing portal.',
    },
  ];

  return (
    <AppShell>
      {/* Top Banner if Trial Activated */}
      {trialActivated && (
        <div className="mb-6 p-4 rounded-xl bg-[#DCFCE7] border border-[#15803D]/20 text-[#15803D] text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
            <span>14-Day Free Trial is Active! You have full access to QR Attendance Kiosks and Automated Reports.</span>
          </div>
          <Link href="/ngo/opportunities" className="underline hover:opacity-80">
            Open Volunteer Drives &rarr;
          </Link>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto py-6 sm:py-10 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#6D3A70] bg-[#F1E7F3] border border-[#E8E3E8]">
          <Sparkles className="w-3.5 h-3.5 text-[#6D3A70]" />
          <span>ImpactOS for NGOs &amp; Corporates</span>
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#25232A] tracking-tight">
          The Operating System for Modern Social Impact
        </h1>

        <p className="text-sm sm:text-base text-[#6B6870] leading-relaxed max-w-2xl mx-auto">
          Save 12+ administrative hours weekly. Automate volunteer management with dynamic QR kiosk check-ins, generate audit-ready board &amp; ESG reports, and dispatch certified credentials in 1 click.
        </p>

        {/* Billing Cycle Switcher */}
        <div className="pt-4 flex items-center justify-center gap-3 text-xs font-medium">
          <span className={billingCycle === 'monthly' ? 'font-bold text-[#25232A]' : 'text-[#8B8790]'}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-12 h-6 rounded-full bg-[#6D3A70] p-1 flex items-center transition-colors cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={billingCycle === 'annual' ? 'font-bold text-[#25232A] flex items-center gap-1.5' : 'text-[#8B8790]'}>
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DCFCE7] text-[#15803D]">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        {/* Tier 1: Free Community */}
        <div className="bg-white rounded-2xl border border-[#E8E3E8] p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#25232A]">Community Marketplace</h3>
              <p className="text-xs text-[#6B6870]">
                Essential tools for grassroots non-profits and community volunteers.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#25232A]">$0</span>
              <span className="text-xs text-[#8B8790]">/ month free forever</span>
            </div>

            <div className="pt-4 border-t border-[#E8E3E8] space-y-2.5 text-xs text-[#25232A]">
              <span className="font-bold text-[#6B6870] uppercase text-[10px] tracking-wider block">
                Included Features:
              </span>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Unlimited volunteer applications &amp; drives</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Community feed posts &amp; social discussions</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Manual roster attendance &amp; hours verification</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Standard verifiable volunteer certificates</span>
              </div>
            </div>
          </div>

          <Link
            href="/feed"
            className="w-full py-2.5 px-4 text-xs font-semibold text-[#6D3A70] bg-[#FAF5FA] hover:bg-[#F1E7F3] border border-[#E8E3E8] rounded-xl text-center transition-colors"
          >
            Included with Free Account
          </Link>
        </div>

        {/* Tier 2: ImpactOS Pro for NGOs (Most Popular / Highlighted) */}
        <div className="bg-gradient-to-b from-[#FAF5FA] via-white to-white rounded-2xl border-2 border-[#6D3A70] p-6 shadow-xl relative flex flex-col justify-between space-y-6">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#6D3A70] text-white shadow-xs">
            ⭐ Recommended for NGOs
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#6D3A70]">ImpactOS Pro for NGOs</h3>
              <p className="text-xs text-[#6B6870]">
                Eliminate manual sign-ins and automate volunteer management &amp; reporting.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#6D3A70]">
                {billingCycle === 'annual' ? '$39' : '$49'}
              </span>
              <span className="text-xs text-[#8B8790]">/ month</span>
            </div>

            <div className="pt-4 border-t border-[#E8E3E8] space-y-2.5 text-xs text-[#25232A]">
              <span className="font-bold text-[#6D3A70] uppercase text-[10px] tracking-wider block">
                Everything in Free, plus:
              </span>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6D3A70] shrink-0 mt-0.5" />
                <span>
                  <strong>Dynamic QR Attendance Kiosk</strong> (GPS-verified mobile check-in)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6D3A70] shrink-0 mt-0.5" />
                <span>
                  <strong>1-Click Bulk Certificate Issuance</strong> with custom logo &amp; signatures
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6D3A70] shrink-0 mt-0.5" />
                <span>
                  <strong>Audit-Ready Form 990 &amp; Board Reports</strong> (PDF &amp; Excel)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6D3A70] shrink-0 mt-0.5" />
                <span>Volunteer retention analytics &amp; CRM history</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6D3A70] shrink-0 mt-0.5" />
                <span>Automated email &amp; push drive reminders</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleActivateTrial('ImpactOS Pro for NGOs')}
            className="w-full py-3 px-4 text-xs font-bold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Start 14-Day Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tier 3: Enterprise CSR */}
        <div className="bg-white rounded-2xl border border-[#E8E3E8] p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#25232A]">Enterprise CSR &amp; ESG</h3>
              <p className="text-xs text-[#6B6870]">
                Corporate employee volunteering, grant tracking, and ESG disclosures.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#25232A]">
                {billingCycle === 'annual' ? '$159' : '$199'}
              </span>
              <span className="text-xs text-[#8B8790]">/ month</span>
            </div>

            <div className="pt-4 border-t border-[#E8E3E8] space-y-2.5 text-xs text-[#25232A]">
              <span className="font-bold text-[#6B6870] uppercase text-[10px] tracking-wider block">
                Everything in Pro, plus:
              </span>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>
                  <strong>Full ESG &amp; Sustainability Audit Reporting</strong> (GRI/CSRD)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Employee Volunteering Program (EVP) portal</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Automated payroll grant matching &amp; tax receipts</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Verified non-profit partnership matchmaking concierge</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Dedicated account manager &amp; custom SSO</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleActivateTrial('Enterprise CSR Suite')}
            className="w-full py-2.5 px-4 text-xs font-bold text-[#25232A] bg-[#FAF5FA] hover:bg-[#F1E7F3] border border-[#E8E3E8] hover:border-[#6D3A70] rounded-xl text-center transition-colors cursor-pointer"
          >
            Request Enterprise Demo
          </button>
        </div>
      </div>

      {/* Interactive Feature Demo Showcase */}
      <div className="max-w-5xl mx-auto mb-16 p-6 sm:p-8 bg-gradient-to-r from-[#FAF5FA] via-white to-[#FAF5FA] rounded-2xl border border-[#E8E3E8] shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D3A70]">
            Interactive Previews
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#25232A]">
            Experience the Technology Before Subscribing
          </h2>
          <p className="text-xs text-[#6B6870]">
            Click below to test our dynamic QR attendance roll call and audit-ready report generator in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setIsQrDemoOpen(true)}
            className="p-5 rounded-xl bg-white border border-[#E8E3E8] hover:border-[#6D3A70] shadow-xs text-left group transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center group-hover:bg-[#6D3A70] group-hover:text-white transition-colors">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#25232A] group-hover:text-[#6D3A70] transition-colors flex items-center gap-1.5">
                <span>Test QR Attendance Kiosk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </h3>
              <p className="text-xs text-[#6B6870] mt-1">
                Simulate a volunteer mobile phone check-in and witness real-time GPS geofence verification.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsAnalyticsDemoOpen(true)}
            className="p-5 rounded-xl bg-white border border-[#E8E3E8] hover:border-[#6D3A70] shadow-xs text-left group transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center group-hover:bg-[#6D3A70] group-hover:text-white transition-colors">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#25232A] group-hover:text-[#6D3A70] transition-colors flex items-center gap-1.5">
                <span>View Sample Board &amp; ESG Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </h3>
              <p className="text-xs text-[#6B6870] mt-1">
                Inspect 1-click economic impact metrics, retention heatmaps, and IRS Form 990 export formats.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#25232A] text-center mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#E8E3E8] overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-4 text-left text-xs sm:text-sm font-bold text-[#25232A] flex items-center justify-between gap-3 cursor-pointer hover:bg-[#FAF5FA]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8B8790] transition-transform ${
                    expandedFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFaq === idx && (
                <div className="p-4 pt-0 text-xs text-[#6B6870] leading-relaxed border-t border-[#FAF5FA]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <QrAttendanceDemoModal
        isOpen={isQrDemoOpen}
        onClose={() => setIsQrDemoOpen(false)}
      />

      <AnalyticsReportDemoModal
        isOpen={isAnalyticsDemoOpen}
        onClose={() => setIsAnalyticsDemoOpen(false)}
      />
    </AppShell>
  );
}
