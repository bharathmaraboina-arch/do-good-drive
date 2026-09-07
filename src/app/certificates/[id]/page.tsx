'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/marketplace-context';
import OfficialCertificate from '@/components/certificates/OfficialCertificate';
import {
  ShieldCheck,
  Printer,
  Share2,
  Check,
  ArrowLeft,
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function CertificateVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const certificateId = params?.id as string;
  const { getCertificateById } = useMarketplace();
  const [copied, setCopied] = useState(false);

  const certificate = getCertificateById(certificateId);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#FBFAF8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#E8E3E8] shadow-lg text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-[#25232A]">Certificate Record Not Found</h1>
          <p className="text-sm text-[#6B6870] leading-relaxed">
            The credential ID <span className="font-mono text-[#6D3A70] font-semibold">{certificateId}</span> could not be verified in the Do Good Drive registry, or may have been updated.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/feed"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6D3A70] hover:bg-[#552C59] text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Platform</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#FBFAF8] text-[#25232A]">
      {/* Top Navigation & Status Banner */}
      <header className="bg-white border-b border-[#E8E3E8] sticky top-0 z-30 shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/feed"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6870] hover:text-[#6D3A70] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>
            <div className="h-4 w-[1px] bg-[#E8E3E8]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider block leading-none">
                  Verified Credential
                </span>
                <span className="text-[11px] text-[#6B6870] font-mono">
                  {certificate.certificateNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6D3A70] bg-[#F1E7F3] hover:bg-[#E8D9EB] rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Verification Link</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Verification Card Callout */}
        <div className="bg-white border border-[#E8E3E8] rounded-2xl p-5 shadow-sm print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D]">
                  <Check className="w-3 h-3" /> Valid & Authenticated
                </span>
                <span className="text-xs text-[#6B6870]">
                  Issued on {formattedDate}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#25232A]">
                Volunteer Service Certification for {certificate.volunteerFullName}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6870]">
                Formally issued by{' '}
                <strong className="text-[#6D3A70] font-semibold">{certificate.ngoName}</strong> honoring{' '}
                <strong className="text-[#25232A] font-semibold">{certificate.hours} hours</strong> of certified community participation.
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E8E3E8] text-right">
              <span className="text-[11px] text-[#6B6870] font-medium">Security Verification Code</span>
              <span className="text-xs font-mono font-bold text-[#6D3A70] bg-[#FAF5FA] px-2.5 py-1 rounded border border-[#E8E3E8]">
                {certificate.verificationCode}
              </span>
            </div>
          </div>
        </div>

        {/* The Official Certificate */}
        <div className="py-2">
          <OfficialCertificate certificate={certificate} />
        </div>

        {/* Verification Registry Details & Trust Assurance */}
        <div className="bg-white border border-[#E8E3E8] rounded-2xl p-6 shadow-sm print:hidden space-y-4">
          <h3 className="text-sm font-bold text-[#25232A] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6D3A70]" />
            About Do Good Drive Credential Verification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#6B6870]">
            <div className="space-y-1 bg-[#FAF5FA] p-3 rounded-xl border border-[#E8E3E8]">
              <span className="font-bold text-[#25232A] block">1. Non-Profit Accreditation</span>
              <p className="leading-relaxed">
                Issuing organizations must be verified 501(c)(3) or accredited non-profits with approved platform charters.
              </p>
            </div>
            <div className="space-y-1 bg-[#FAF5FA] p-3 rounded-xl border border-[#E8E3E8]">
              <span className="font-bold text-[#25232A] block">2. In-Person Attendance</span>
              <p className="leading-relaxed">
                Attendance and completed shifts are marked directly by authorized NGO administrators upon activity conclusion.
              </p>
            </div>
            <div className="space-y-1 bg-[#FAF5FA] p-3 rounded-xl border border-[#E8E3E8]">
              <span className="font-bold text-[#25232A] block">3. Cryptographic Authenticity</span>
              <p className="leading-relaxed">
                Each certificate carries an immutable verification hash verifiable by academic institutions, employers, and partners.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
