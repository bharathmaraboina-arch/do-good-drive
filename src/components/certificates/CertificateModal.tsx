'use client';

import React, { useState } from 'react';
import { VolunteerCertificate } from '@/lib/types';
import OfficialCertificate from './OfficialCertificate';
import { X, Printer, Share2, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: VolunteerCertificate | null;
}

export default function CertificateModal({
  isOpen,
  onClose,
  certificate,
}: CertificateModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/certificates/${certificate.id}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#FBFAF8] rounded-2xl shadow-2xl border border-[#E8E3E8] overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E8E3E8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F1E7F3] text-[#6D3A70] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#25232A]">
                Official Volunteer Certificate
              </h2>
              <p className="text-xs text-[#6B6870]">
                Issued by {certificate.ngoName} • {certificate.certificateNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA] rounded-lg transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-4 sm:p-6 bg-[#FBFAF8] max-h-[75vh] overflow-y-auto">
          <OfficialCertificate certificate={certificate} />
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-white border-t border-[#E8E3E8]">
          <div className="flex items-center gap-2 text-xs text-[#6B6870]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Cryptographically Verified & Accredited</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#6D3A70] bg-[#F1E7F3] hover:bg-[#E8D9EB] rounded-lg transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Verification Link</span>
                </>
              )}
            </button>

            {/* Standalone Verification Page Link */}
            <Link
              href={`/certificates/${certificate.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#45424B] hover:text-[#25232A] bg-[#FAF5FA] hover:bg-[#F1E7F3] border border-[#E8E3E8] rounded-lg transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Public Page</span>
            </Link>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
