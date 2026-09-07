'use client';

import React from 'react';
import { VolunteerCertificate } from '@/lib/types';
import { Award, CheckCircle2, ShieldCheck, Calendar, Clock, MapPin, Building2, ExternalLink } from 'lucide-react';

interface OfficialCertificateProps {
  certificate: VolunteerCertificate;
  showActions?: boolean;
  onPrint?: () => void;
  className?: string;
}

export default function OfficialCertificate({
  certificate,
  showActions = false,
  onPrint,
  className = '',
}: OfficialCertificateProps) {
  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedActivityDate = new Date(certificate.activityDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`w-full ${className}`}>
      {/* Printable Certificate Frame */}
      <div
        id={`certificate-${certificate.id}`}
        className="certificate-container relative mx-auto max-w-[860px] bg-[#FFFDF9] text-[#25232A] p-6 sm:p-10 md:p-12 rounded-lg shadow-xl border-[4px] border-[#6D3A70] selection:bg-[#F1E7F3] overflow-hidden"
        style={{
          boxShadow: '0 20px 40px -15px rgba(109, 58, 112, 0.15), 0 0 0 1px rgba(109, 58, 112, 0.2)',
        }}
      >
        {/* Inner Dual Inset Border */}
        <div className="absolute inset-3 sm:inset-4 border border-[#A85AAA]/40 rounded-sm pointer-events-none" />
        <div className="absolute inset-4 sm:inset-5 border-[1.5px] border-[#6D3A70]/30 rounded-sm pointer-events-none" />

        {/* Decorative Classical Corner Ornaments */}
        <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-[#6D3A70] pointer-events-none" />
        <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-[#6D3A70] pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-[#6D3A70] pointer-events-none" />
        <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-[#6D3A70] pointer-events-none" />

        {/* Subtle Watermark Guilloche Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#6D3A70_1px,transparent_1px)] [background-size:16px_16px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col justify-between min-h-[540px]">
          {/* Top Header: Issuing NGO & Platform Emblem */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              {/* NGO Badge Emblem */}
              <div className="w-12 h-12 rounded-full bg-[#FAF5FA] border-2 border-[#6D3A70] flex items-center justify-center text-[#6D3A70] shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-sm sm:text-base font-bold text-[#6D3A70] tracking-wide uppercase">
                  {certificate.ngoName}
                </h3>
                <p className="text-[11px] text-[#6B6870] font-medium">
                  {certificate.ngoRegistrationNumber || 'Accredited Non-Profit Organization'} • Verified Issuing Authority
                </p>
              </div>
            </div>

            {/* Main Title Heading */}
            <div className="pt-2">
              <span className="inline-block text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#8E5292] uppercase bg-[#F1E7F3]/70 px-4 py-1 rounded-full">
                Official Credential of Achievement
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#25232A] tracking-tight">
                Certificate of Volunteer Service
              </h1>
            </div>
          </div>

          {/* Recipient Attribution */}
          <div className="text-center my-6 space-y-3">
            <p className="text-xs sm:text-sm text-[#6B6870] uppercase tracking-[0.2em] font-semibold">
              This is proudly presented to
            </p>

            <div className="inline-block relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#6D3A70] px-6 py-1 tracking-wide">
                {certificate.volunteerFullName}
              </h2>
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#6D3A70] to-transparent mt-1" />
            </div>

            <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#45424B] leading-relaxed pt-1">
              For exemplary dedication, verified attendance, and selfless community service participated in the initiative
            </p>

            <div className="bg-[#FAF5FA] border border-[#E8E3E8] inline-block px-5 py-2 rounded-lg max-w-lg shadow-sm">
              <p className="font-serif font-bold text-sm sm:text-base text-[#25232A]">
                &ldquo;{certificate.opportunityTitle}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-4 mt-1 text-[11px] text-[#6B6870]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#6D3A70]" /> {formattedActivityDate}
                </span>
                <span>•</span>
                <span className="font-medium text-[#6D3A70]">{certificate.cause}</span>
              </div>
            </div>
          </div>

          {/* Service Hours Plaque & Verification Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center max-w-xl mx-auto my-4 w-full">
            {/* Hours Plaque */}
            <div className="sm:col-span-2 flex items-center gap-4 bg-[#F1E7F3]/50 border border-[#A85AAA]/40 p-3 sm:p-4 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-[#6D3A70] text-white flex flex-col items-center justify-center font-bold shadow-sm">
                <span className="text-lg leading-none">{certificate.hours}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-90">HRS</span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#15803D]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ATTENDANCE CONFIRMED & HOURS VERIFIED</span>
                </div>
                <p className="text-[11px] text-[#6B6870] mt-0.5">
                  Accredited by {certificate.ngoName} under Do Good Drive Standards
                </p>
              </div>
            </div>

            {/* Official Medallion Seal */}
            <div className="flex items-center justify-center">
              <div className="relative w-20 h-20 rounded-full border-2 border-[#D97706] bg-gradient-to-b from-[#FEF3C7] to-[#FDE68A] flex flex-col items-center justify-center text-center p-1 shadow-md">
                <div className="absolute inset-1 rounded-full border border-dashed border-[#B45309]/50" />
                <Award className="w-6 h-6 text-[#92400E] mb-0.5" />
                <span className="text-[7.5px] font-extrabold text-[#78350F] tracking-tighter uppercase leading-tight">
                  OFFICIAL SEAL
                </span>
                <span className="text-[6.5px] text-[#92400E] font-semibold">VERIFIED 2026</span>
              </div>
            </div>
          </div>

          {/* Signatures & Accreditation Footer */}
          <div className="pt-6 border-t border-[#E8E3E8] mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center items-end">
              {/* NGO Representative Signature */}
              <div className="space-y-1">
                <div className="font-serif italic text-lg sm:text-xl text-[#6D3A70] tracking-wide h-8 flex items-center justify-center border-b border-[#25232A]/30 mx-4">
                  {certificate.ngoRepresentativeName}
                </div>
                <p className="text-[11px] font-bold text-[#25232A] uppercase tracking-wider">
                  {certificate.ngoRepresentativeName}
                </p>
                <p className="text-[10px] text-[#6B6870]">
                  {certificate.ngoRepresentativeTitle}, {certificate.ngoName}
                </p>
              </div>

              {/* Platform Verification Registrar */}
              <div className="hidden sm:block space-y-1">
                <div className="font-serif italic text-lg sm:text-xl text-[#6D3A70] tracking-wide h-8 flex items-center justify-center border-b border-[#25232A]/30 mx-4">
                  Elena Rostova
                </div>
                <p className="text-[11px] font-bold text-[#25232A] uppercase tracking-wider">
                  Elena Rostova
                </p>
                <p className="text-[10px] text-[#6B6870]">
                  Registrar General, Do Good Drive Registry
                </p>
              </div>

              {/* Certificate Security ID & Hash */}
              <div className="space-y-1 text-right sm:text-right">
                <div className="flex items-center justify-end gap-1 text-[11px] font-mono text-[#6D3A70]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="font-bold">{certificate.certificateNumber}</span>
                </div>
                <p className="text-[10px] text-[#6B6870]">
                  Verification Code: <span className="font-mono text-[#25232A]">{certificate.verificationCode}</span>
                </p>
                <p className="text-[9px] text-[#8B8790]">
                  Issued: {formattedDate} • dogooddrive.org/certificates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-${certificate.id},
          #certificate-${certificate.id} * {
            visibility: visible;
          }
          #certificate-${certificate.id} {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            max-width: 100% !important;
            height: 100vh;
            margin: 0 !important;
            padding: 32px !important;
            border-width: 4px !important;
            box-shadow: none !important;
            background-color: #FFFDF9 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
