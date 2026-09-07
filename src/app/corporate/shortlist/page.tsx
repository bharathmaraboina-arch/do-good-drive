'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useCorporate } from '@/lib/corporate-context';
import {
  Bookmark,
  MapPin,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

export default function CorporateShortlistPage() {
  const {
    ngos,
    shortlistedNgoIds,
    toggleShortlistNgo,
    getConnectionRequest,
    sendConnectionRequest,
  } = useCorporate();

  const shortlistedNgos = ngos.filter((n) => shortlistedNgoIds.includes(n.profileId));

  const [activeModalNgoId, setActiveModalNgoId] = useState<string | null>(null);
  const [introMessage, setIntroMessage] = useState(
    'We are interested in exploring a CSR partnership with your organization.'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRemoveShortlist = (ngoId: string, ngoName: string) => {
    toggleShortlistNgo(ngoId);
    setToastMessage(`Removed ${ngoName} from shortlist.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendRequest = (ngoId: string, ngoName: string) => {
    const res = sendConnectionRequest({
      ngoProfileId: ngoId,
      initialMessage: introMessage,
    });

    if (res.success) {
      setActiveModalNgoId(null);
      setToastMessage(`Connection request sent to ${ngoName} with status PENDING.`);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell>
      {toastMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#6D3A70] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="font-bold hover:opacity-75 cursor-pointer">
            &times;
          </button>
        </div>
      )}

      <PageHeader
        title="Shortlisted Non-Profit Partners"
        description="Review bookmarked organizations, monitor partnership connection statuses, and initiate collaboration requests."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F1E7F3] text-[#6D3A70] text-xs font-semibold border border-[#E8E3E8]">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{shortlistedNgos.length} Organizations Shortlisted</span>
          </span>
        }
      />

      {shortlistedNgos.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Your shortlist is currently empty"
          description="Browse the non-profit directory and bookmark organizations that align with your corporate CSR focus areas."
          actionLabel="Discover NGOs"
          onAction={() => {
            window.location.href = '/corporate/ngos';
          }}
        />
      ) : (
        <div className="space-y-4">
          {shortlistedNgos.map((ngo) => {
            const req = getConnectionRequest(ngo.profileId);

            return (
              <div
                key={ngo.profileId}
                className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="max-w-xl space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={ngo.verificationStatus.toLowerCase()} size="sm" />
                    <span className="text-xs text-[#8B8790] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#6D3A70]" />
                      <span>{ngo.locations[0]}</span>
                    </span>
                  </div>

                  <Link href={`/corporate/ngos/${ngo.profileId}`} className="group">
                    <h3 className="text-base font-bold text-[#25232A] group-hover:text-[#6D3A70] transition-colors">
                      {ngo.ngoName}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#6B6870] line-clamp-2 leading-relaxed">
                    {ngo.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {ngo.causes.map((c) => (
                      <span key={c} className="px-2 py-0.5 text-[10px] rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#FAF5FA]">
                  <div className="text-right">
                    {req ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        {req.status === 'ACCEPTED' ? (
                          <span className="inline-flex items-center gap-1 text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#15803D]/20">
                            <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                            <span>Connected</span>
                          </span>
                        ) : req.status === 'DECLINED' ? (
                          <span className="inline-flex items-center gap-1 text-[#B91C1C] bg-[#FEE2E2] px-2 py-0.5 rounded border border-[#B91C1C]/20">
                            <XCircle className="w-3 h-3 text-[#B91C1C]" />
                            <span>Declined</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#B45309]/20">
                            <Clock className="w-3 h-3 text-[#B45309]" />
                            <span>Pending Request</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#8B8790] block">
                        Not requested yet
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/corporate/ngos/${ngo.profileId}`}
                      className="px-3 py-1.5 text-xs font-medium text-[#6B6870] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg hover:bg-[#FAF5FA] transition-colors"
                    >
                      View Profile
                    </Link>

                    {!req ? (
                      <button
                        type="button"
                        onClick={() => setActiveModalNgoId(ngo.profileId)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Connect
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleRemoveShortlist(ngo.profileId, ngo.ngoName)}
                      className="p-1.5 text-[#8B8790] hover:text-[#B91C1C] rounded-lg border border-[#E8E3E8] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Connection Modal */}
                {activeModalNgoId === ngo.profileId && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-[#E8E3E8] space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-[#25232A]">
                          Connect with {ngo.ngoName}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setActiveModalNgoId(null)}
                          className="text-[#8B8790] hover:text-[#25232A] font-bold text-lg cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase text-[#8B8790]">
                          Introductory Note
                        </label>
                        <textarea
                          rows={3}
                          value={introMessage}
                          onChange={(e) => setIntroMessage(e.target.value)}
                          className="w-full p-2 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveModalNgoId(null)}
                          className="px-3 py-1.5 text-xs text-[#6B6870] hover:text-[#25232A] cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendRequest(ngo.profileId, ngo.ngoName)}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg cursor-pointer transition-colors"
                        >
                          Send Request (Pending)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
