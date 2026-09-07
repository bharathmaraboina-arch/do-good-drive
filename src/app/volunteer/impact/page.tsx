'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuth } from '@/lib/auth-context';
import { useMarketplace } from '@/lib/marketplace-context';
import {
  Clock,
  CheckCircle2,
  Building2,
  Heart,
  Calendar,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function VolunteerImpactPage() {
  const { profile } = useAuth();
  const { getImpactSummaryForVolunteer } = useMarketplace();

  const volId = profile?.id || 'vol-1';
  const summary = getImpactSummaryForVolunteer(volId);

  const {
    totalVerifiedHours,
    activitiesCompletedCount,
    ngosSupportedCount,
    causesSupported,
    verifiedRecords,
    pendingRecords,
  } = summary;

  const totalPendingHours = pendingRecords.reduce((sum, r) => sum + (Number(r.hours) || 0), 0);

  return (
    <AppShell>
      <PageHeader
        title="Official Volunteer Impact Record"
        description="Your verified community contributions. To protect the credibility of social impact records, hours must be certified by the host non-profit organization."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FAF5FA] text-[#6D3A70] text-xs font-semibold border border-[#E8E3E8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
            <span>NGO-Certified Record</span>
          </span>
        }
      />

      {/* Official Verified Contribution Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Total Verified Hours
          </span>
          <p className="text-3xl font-bold text-[#6D3A70] mt-1.5">
            {totalVerifiedHours.toFixed(1)} <span className="text-sm font-semibold text-[#8B8790]">hrs</span>
          </p>
          <span className="text-[11px] text-[#15803D] font-medium block mt-1">
            &check; 100% NGO-certified
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Activities Completed
          </span>
          <p className="text-3xl font-bold text-[#25232A] mt-1.5">
            {activitiesCompletedCount} <span className="text-sm font-semibold text-[#8B8790]">drives</span>
          </p>
          <span className="text-[11px] text-[#8B8790] block mt-1">
            Confirmed attendance
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            NGOs Supported
          </span>
          <p className="text-3xl font-bold text-[#25232A] mt-1.5">
            {ngosSupportedCount} <span className="text-sm font-semibold text-[#8B8790]">partners</span>
          </p>
          <span className="text-[11px] text-[#8B8790] block mt-1">
            Non-profit partners
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Causes Supported
          </span>
          <p className="text-3xl font-bold text-[#25232A] mt-1.5">
            {causesSupported.length} <span className="text-sm font-semibold text-[#8B8790]">areas</span>
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {causesSupported.length > 0 ? (
              causesSupported.map((c) => (
                <span key={c} className="text-[10px] text-[#6D3A70] font-semibold bg-[#FAF5FA] border border-[#E8E3E8] px-1.5 py-0.5 rounded">
                  {c}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-[#8B8790]">None yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Pending Verification Notice & Itemized Callout */}
      {pendingRecords.length > 0 && (
        <div className="mb-8 p-5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#92400E]">
                {totalPendingHours.toFixed(1)} Hours Awaiting NGO Verification ({pendingRecords.length} Activities)
              </h4>
              <p className="text-xs text-[#B45309] mt-0.5 leading-relaxed">
                These activity hours have been logged following your participation, but have not yet been certified by the organizing NGO coordinator. <strong>Unverified hours do not count toward official impact totals</strong> until certified.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#FDE68A]">
            {pendingRecords.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-lg bg-white/70 border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-bold text-[#25232A]">{p.opportunityTitle}</span>
                  <div className="text-[11px] text-[#8B8790] flex items-center gap-2 mt-0.5">
                    <span>Host: {p.ngoName}</span>
                    <span>&bull;</span>
                    <span>Date: {p.activityDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#92400E]">{p.hours} hrs logged</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                    Pending Sign-off
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Contribution Dossier */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#25232A]">
              Verified Activities ({verifiedRecords.length})
            </h2>
            <p className="text-xs text-[#8B8790] mt-0.5">
              Certified service records verified by non-profit organization administrators.
            </p>
          </div>

          <Link
            href="/volunteer/opportunities"
            className="text-xs font-semibold text-[#6D3A70] hover:underline flex items-center gap-1"
          >
            <span>Explore More Drives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {verifiedRecords.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No verified activities yet"
            description="Official impact hours appear here once a non-profit coordinator verifies your attendance following an accepted drive. Unverified hours do not count toward official impact totals."
            actionLabel="Discover Volunteer Drives"
            onAction={() => {
              window.location.href = '/volunteer/opportunities';
            }}
          />
        ) : (
          <div className="space-y-3">
            {verifiedRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="max-w-xl space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                      {rec.cause}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#15803D] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                      <span>Verified Contribution</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#25232A]">{rec.opportunityTitle}</h3>

                  <div className="flex items-center gap-4 text-xs text-[#8B8790] flex-wrap">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#6D3A70]" />
                      <span className="font-semibold text-[#25232A]">{rec.ngoName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#6D3A70]" />
                      <span>Service Date: {rec.activityDate}</span>
                    </div>
                  </div>

                  {rec.notes && (
                    <p className="text-xs text-[#6B6870] italic bg-[#FBFAF8] p-2.5 rounded-lg border border-[#E8E3E8] mt-2 leading-relaxed">
                      &ldquo;{rec.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#E8E3E8]">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#6D3A70] block">
                      {rec.hours.toFixed(1)} <span className="text-xs font-semibold text-[#8B8790]">hrs</span>
                    </span>
                    <span className="text-[10px] text-[#8B8790] block">
                      Verified {rec.verifiedAt ? new Date(rec.verifiedAt).toLocaleDateString() : 'Official'}
                    </span>
                  </div>

                  <Link
                    href={`/volunteer/opportunities/${rec.opportunityId}`}
                    className="inline-flex items-center gap-1 text-xs text-[#6D3A70] hover:underline font-medium"
                  >
                    <span>View Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
