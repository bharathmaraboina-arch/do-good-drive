'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuth } from '@/lib/auth-context';
import { useCorporate } from '@/lib/corporate-context';
import { ConnectionRequestStatus } from '@/lib/types';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
} from 'lucide-react';

export default function NgoCorporatePartnersPage() {
  const { profile } = useAuth();
  const { getRequestsForNgo, respondToConnectionRequest } = useCorporate();

  const currentNgoId = profile?.id === 'ngo-demo-1' ? 'ngo-1' : profile?.id || 'ngo-1';
  const incomingRequests = getRequestsForNgo(currentNgoId);

  const [filterStatus, setFilterStatus] = useState<'ALL' | ConnectionRequestStatus>('ALL');
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const pendingCount = incomingRequests.filter((r) => r.status === 'PENDING').length;
  const acceptedCount = incomingRequests.filter((r) => r.status === 'ACCEPTED').length;
  const declinedCount = incomingRequests.filter((r) => r.status === 'DECLINED').length;

  const filteredRequests = incomingRequests.filter((r) => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    return true;
  });

  const handleDecision = (requestId: string, status: 'ACCEPTED' | 'DECLINED', corpName: string) => {
    respondToConnectionRequest(requestId, status);
    setToastMessage({
      text: `Connection request from "${corpName}" has been ${status === 'ACCEPTED' ? 'accepted' : 'declined'}.`,
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell>
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/ngo/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6870] hover:text-[#25232A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Operations Hub</span>
        </Link>
      </div>

      {toastMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in duration-200 ${
            toastMessage.isError
              ? 'bg-[#FEE2E2] border border-[#B91C1C]/20 text-[#B91C1C]'
              : 'bg-[#DCFCE7] border border-[#15803D]/20 text-[#15803D]'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="font-bold hover:opacity-75 cursor-pointer">
            &times;
          </button>
        </div>
      )}

      <PageHeader
        title="Corporate Connection Requests"
        description="Review incoming collaboration inquiries from verified enterprise partners. Accept or decline requests to formalize non-profit partnerships."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F1E7F3] text-[#6D3A70] text-xs font-semibold border border-[#E8E3E8]">
            <Building2 className="w-3.5 h-3.5" />
            <span>{incomingRequests.length} Total Requests</span>
          </span>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Pending Inquiries
          </span>
          <p className="text-2xl font-bold text-[#B45309] mt-1">{pendingCount} Awaiting Review</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Accepted Corporate Partners
          </span>
          <p className="text-2xl font-bold text-[#15803D] mt-1">{acceptedCount} Active Partners</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Declined Requests
          </span>
          <p className="text-2xl font-bold text-[#6B6870] mt-1">{declinedCount} Inquiries</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { id: 'ALL', label: `All Inquiries (${incomingRequests.length})` },
          { id: 'PENDING', label: `Pending Review (${pendingCount})` },
          { id: 'ACCEPTED', label: `Accepted (${acceptedCount})` },
          { id: 'DECLINED', label: `Declined (${declinedCount})` },
        ].map((tab) => {
          const isActive = filterStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#F1E7F3] text-[#6D3A70] border-[#E8E3E8] font-semibold'
                  : 'bg-white text-[#6B6870] border-[#E8E3E8] hover:bg-[#FAF5FA]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No connection requests in this view"
          description="Inquiries from corporate CSR administrators will appear here as companies discover your organization."
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'PENDING';
            const isAccepted = req.status === 'ACCEPTED';
            const isDeclined = req.status === 'DECLINED';

            return (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/30 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-sm flex items-center justify-center shrink-0">
                      {req.corporateName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#25232A]">{req.corporateName}</h3>
                      <p className="text-xs text-[#8B8790] flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#6D3A70]" />
                          {req.corporateLocation}
                        </span>
                        <span>&bull;</span>
                        <span>Received {new Date(req.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] border border-[#15803D]/20 px-2.5 py-1 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                        <span>Accepted Partner</span>
                      </span>
                    ) : isDeclined ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B91C1C] bg-[#FEE2E2] border border-[#B91C1C]/20 px-2.5 py-1 rounded-md">
                        <XCircle className="w-3.5 h-3.5 text-[#B91C1C]" />
                        <span>Declined</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309] bg-[#FEF3C7] border border-[#B45309]/20 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-[#B45309]" />
                        <span>Pending Decision</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Company CSR Focus Areas */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-semibold text-[#8B8790]">CSR Focus:</span>
                  {req.corporateCsrFocusAreas.map((f) => (
                    <span key={f} className="px-2 py-0.5 text-[10px] rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                      {f}
                    </span>
                  ))}
                </div>

                {/* Introductory Message */}
                {req.initialMessage && (
                  <div className="bg-[#FBFAF8] p-3 rounded-lg border border-[#E8E3E8] text-xs text-[#6B6870] leading-relaxed">
                    <span className="font-bold text-[#25232A] block mb-0.5">Corporate Message:</span>
                    &ldquo;{req.initialMessage}&rdquo;
                  </div>
                )}

                {/* Decision Action Buttons */}
                {isPending && (
                  <div className="pt-3 border-t border-[#FAF5FA] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecision(req.id, 'DECLINED', req.corporateName)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] border border-[#B91C1C]/20 rounded-lg transition-colors cursor-pointer"
                    >
                      Decline Request
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(req.id, 'ACCEPTED', req.corporateName)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Accept Connection Request
                    </button>
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
