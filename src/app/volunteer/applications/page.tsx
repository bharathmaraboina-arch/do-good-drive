'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuth } from '@/lib/auth-context';
import { useMarketplace } from '@/lib/marketplace-context';
import { ApplicationStatus } from '@/lib/types';
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';

export default function VolunteerApplicationsPage() {
  const { profile } = useAuth();
  const { applications } = useMarketplace();
  const [filterStatus, setFilterStatus] = useState<'ALL' | ApplicationStatus>('ALL');

  const volId = profile?.id || 'vol-1';
  const myApplications = applications.filter((a) => a.volunteerProfileId === volId || a.volunteerProfileId === 'vol-1');

  const filteredApps = myApplications.filter((a) => {
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    return true;
  });

  return (
    <AppShell>
      <PageHeader
        title="My Volunteering Commitments &amp; Applications"
        description="Track the real-time review status of your community drive applications, scheduled commitments, and answers."
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF5FA] text-[#6D3A70] text-xs font-semibold border border-[#E8E3E8]">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>{myApplications.length} Total Applications</span>
          </span>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { id: 'ALL', label: `All (${myApplications.length})` },
          { id: 'PENDING', label: `Pending (${myApplications.filter((a) => a.status === 'PENDING').length})` },
          { id: 'ACCEPTED', label: `Accepted (${myApplications.filter((a) => a.status === 'ACCEPTED').length})` },
          { id: 'REJECTED', label: `Rejected (${myApplications.filter((a) => a.status === 'REJECTED').length})` },
        ].map((tab) => {
          const isActive = filterStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#FAF5FA] text-[#6D3A70] border-[#6D3A70] font-semibold'
                  : 'bg-white text-[#6B6870] border-[#E8E3E8] hover:bg-[#FAF5FA]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filteredApps.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No applications in this category"
          description="Explore active community initiatives to join a volunteering drive."
          actionLabel="Explore Opportunities"
          onAction={() => {
            window.location.href = '/volunteer/opportunities';
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-[#E8E3E8] p-5 sm:p-6 shadow-xs hover:border-[#6D3A70]/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E3E8] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8B8790] tracking-wider block">
                    {app.ngoName || 'Non-Profit Partner'}
                  </span>
                  <Link href={`/volunteer/opportunities/${app.opportunityId}`}>
                    <h3 className="text-base font-bold text-[#25232A] hover:text-[#6D3A70] transition-colors mt-0.5">
                      {app.opportunityTitle || 'Community Drive'}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#8B8790]">
                    Applied {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                  <StatusBadge
                    status={
                      app.status === 'ACCEPTED'
                        ? 'active'
                        : app.status === 'REJECTED'
                        ? 'rejected'
                        : 'in_review'
                    }
                    size="sm"
                  />
                </div>
              </div>

              {/* Status Explanation Box */}
              {app.status === 'PENDING' && (
                <div className="p-3 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                  <div>
                    <strong>Application Under Review:</strong> The NGO coordinator has received your shared profile and questions. You will be notified in-app once a decision is made.
                  </div>
                </div>
              )}

              {app.status === 'ACCEPTED' && (
                <div className="p-3 rounded-lg bg-[#DCFCE7] border border-[#15803D]/20 text-xs text-[#15803D] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                  <div>
                    <strong>Application Accepted!</strong> You are enrolled in this drive. Please arrive on time at the designated meeting point.
                  </div>
                </div>
              )}

              {app.status === 'REJECTED' && (
                <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#B91C1C]/20 text-xs text-[#B91C1C] flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
                  <div>
                    <strong>Application Closed:</strong> Capacity was filled or qualifications did not match this specific drive. We encourage you to explore other open opportunities.
                  </div>
                </div>
              )}

              {/* Submitted Answers */}
              {app.answers && app.answers.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#E8E3E8]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B8790] block">
                    Your Application Answers:
                  </span>
                  {app.answers.map((ans, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] text-xs">
                      <p className="font-semibold text-[#25232A] mb-0.5">Q: {ans.question}</p>
                      <p className="text-[#6B6870]">A: {ans.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer Links */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8E3E8]">
                <div className="flex items-center gap-4 text-[#8B8790]">
                  {app.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#6D3A70]" />
                      <span>{app.date}</span>
                    </div>
                  )}
                  {app.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#6D3A70]" />
                      <span className="truncate max-w-[200px]">{app.location}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/volunteer/opportunities/${app.opportunityId}`}
                  className="text-xs font-semibold text-[#6D3A70] hover:underline flex items-center gap-1"
                >
                  <span>Opportunity Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
