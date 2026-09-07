'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useCorporate } from '@/lib/corporate-context';
import {
  ArrowLeft,
  Bookmark,
  Send,
  Globe,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  UserCheck,
} from 'lucide-react';

interface NgoProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function CorporateNgoDetailPage({ params }: NgoProfilePageProps) {
  const resolvedParams = use(params);
  const {
    getNgoById,
    isShortlisted,
    toggleShortlistNgo,
    sendConnectionRequest,
    getConnectionRequest,
  } = useCorporate();

  const ngo = getNgoById(resolvedParams.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [introMessage, setIntroMessage] = useState(
    'We would like to explore partnering with your organization for CSR community engagement.'
  );
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!ngo) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h2 className="text-base font-bold text-[#25232A]">NGO Profile Not Found</h2>
          <Link
            href="/corporate/ngos"
            className="text-xs font-semibold text-[#6D3A70] hover:underline mt-2 inline-block"
          >
            &larr; Return to NGO Directory
          </Link>
        </div>
      </AppShell>
    );
  }

  const shortlisted = isShortlisted(ngo.profileId);
  const existingRequest = getConnectionRequest(ngo.profileId);

  const handleToggleShortlist = () => {
    toggleShortlistNgo(ngo.profileId);
    setToastMessage({
      text: shortlisted
        ? `Removed ${ngo.ngoName} from shortlist.`
        : `Added ${ngo.ngoName} to corporate shortlist.`,
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendRequest = () => {
    const res = sendConnectionRequest({
      ngoProfileId: ngo.profileId,
      initialMessage: introMessage,
    });

    if (res.success) {
      setIsModalOpen(false);
      setToastMessage({
        text: `Connection request sent to ${ngo.ngoName} with status PENDING.`,
      });
    } else {
      setToastMessage({
        text: res.message || 'Failed to send connection request.',
        isError: true,
      });
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Link
          href="/corporate/ngos"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6870] hover:text-[#25232A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to NGO Directory</span>
        </Link>
        <span className="text-[#E8E3E8]">&bull;</span>
        <Link href="/corporate/shortlist" className="text-xs font-medium text-[#6D3A70] hover:underline">
          View Shortlist &rarr;
        </Link>
      </div>

      {toastMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in duration-200 ${
            toastMessage.isError
              ? 'bg-[#FEE2E2] border border-[#B91C1C]/20 text-[#B91C1C]'
              : 'bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70]'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#6D3A70] shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="font-bold hover:opacity-75 cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-xl border border-[#E8E3E8] p-6 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-xl flex items-center justify-center shrink-0">
              {ngo.ngoName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-[#25232A]">{ngo.ngoName}</h1>
                <StatusBadge status={ngo.verificationStatus.toLowerCase()} size="sm" />
              </div>
              <p className="text-xs text-[#8B8790] mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#6D3A70]" />
                  {ngo.locations[0]}
                </span>
                <span>&bull;</span>
                <span>Established {ngo.registrationDetails.yearEstablished}</span>
                {ngo.website && (
                  <>
                    <span>&bull;</span>
                    <a
                      href={ngo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6D3A70] hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{ngo.website.replace('https://', '')}</span>
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleShortlist}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                shortlisted
                  ? 'bg-[#F1E7F3] text-[#6D3A70] border-[#E8E3E8]'
                  : 'bg-white text-[#6B6870] border-[#E8E3E8] hover:bg-[#FAF5FA]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${shortlisted ? 'fill-current' : ''}`} />
              <span>{shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
            </button>

            {existingRequest ? (
              <div className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 bg-[#FBFAF8] border-[#E8E3E8]">
                {existingRequest.status === 'ACCEPTED' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                    <span className="text-[#15803D]">Partnership Connected</span>
                  </>
                ) : existingRequest.status === 'DECLINED' ? (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-[#B91C1C]" />
                    <span className="text-[#B91C1C]">Request Declined</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-[#B45309]" />
                    <span className="text-[#B45309]">Connection Pending</span>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Connection Request</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Details & Governance Transparency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Info Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Mission & Overview */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B8790]">
                Mission Statement
              </h2>
              <p className="text-sm font-semibold text-[#25232A] mt-1.5 leading-relaxed">
                &ldquo;{ngo.mission}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-[#FAF5FA]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B8790]">
                Organizational Overview
              </h2>
              <p className="text-xs text-[#6B6870] mt-1.5 leading-relaxed">
                {ngo.description}
              </p>
            </div>
          </div>

          {/* Causes & Operating Footprint */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B8790] mb-2">
                Primary Causes &amp; Focus Areas
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {ngo.causes.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1 text-xs font-medium rounded-lg bg-[#F1E7F3] text-[#6D3A70] border border-[#E8E3E8]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#FAF5FA]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B8790] mb-2">
                Regional Operating Footprint
              </h2>
              <div className="flex flex-wrap gap-2">
                {ngo.locations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]"
                  >
                    <MapPin className="w-3 h-3 text-[#6D3A70]" />
                    <span>{loc}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Side Transparency & Governance Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Registration & Legal Transparency */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#25232A] pb-2 border-b border-[#FAF5FA]">
              <ShieldCheck className="w-4 h-4 text-[#6D3A70]" />
              <span>Governance &amp; Registration</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#8B8790] text-[11px] block">Registration Number</span>
                <span className="font-semibold text-[#25232A]">{ngo.registrationDetails.registrationNumber}</span>
              </div>
              <div>
                <span className="text-[#8B8790] text-[11px] block">Tax Exemption ID</span>
                <span className="font-semibold text-[#25232A]">{ngo.registrationDetails.taxId || 'Registered 501(c)(3)'}</span>
              </div>
              <div>
                <span className="text-[#8B8790] text-[11px] block">Country of Incorporation</span>
                <span className="font-semibold text-[#25232A]">{ngo.registrationDetails.countryOfRegistration}</span>
              </div>
              <div>
                <span className="text-[#8B8790] text-[11px] block">Verification Status</span>
                <span className="font-semibold text-[#15803D]">{ngo.verificationStatus}</span>
              </div>
            </div>
          </div>

          {/* Authorized Representative Contact */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#25232A] pb-2 border-b border-[#FAF5FA]">
              <UserCheck className="w-4 h-4 text-[#6D3A70]" />
              <span>Authorized Representative</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#8B8790] text-[11px] block">Representative Name</span>
                <span className="font-semibold text-[#25232A]">{ngo.authorizedRepresentative.fullName}</span>
                <span className="text-[11px] text-[#8B8790] block">{ngo.authorizedRepresentative.title}</span>
              </div>
              <div className="pt-2 border-t border-[#FAF5FA] space-y-1">
                <a
                  href={`mailto:${ngo.authorizedRepresentative.email}`}
                  className="text-[#6D3A70] hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{ngo.authorizedRepresentative.email}</span>
                </a>
                {ngo.contactInformation.phone && (
                  <div className="text-[#8B8790] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{ngo.contactInformation.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Connection Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E8E3E8] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#25232A]">
                  Send Connection Request to {ngo.ngoName}
                </h3>
                <p className="text-xs text-[#8B8790] mt-0.5">
                  This sends an introductory partnership request to the NGO authorized representative.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#8B8790] hover:text-[#25232A] text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#25232A]">
                Introductory Partnership Note
              </label>
              <textarea
                rows={4}
                value={introMessage}
                onChange={(e) => setIntroMessage(e.target.value)}
                placeholder="Introduce your company and share your CSR areas of interest..."
                className="w-full px-3 py-2 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              <span className="text-[11px] text-[#8B8790] block">
                The NGO will review this request with status recorded as <strong>PENDING</strong>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#6B6870] hover:bg-[#FAF5FA] rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendRequest}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
