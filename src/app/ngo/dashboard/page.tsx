'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useAuth } from '@/lib/auth-context';
import { useOnboarding } from '@/lib/onboarding-context';
import { useMarketplace } from '@/lib/marketplace-context';
import {
  HandHeart,
  Users,
  PlusCircle,
  Clock,
  ArrowRight,
  FileText,
} from 'lucide-react';

export default function NgoDashboardPage() {
  const { profile } = useAuth();
  const { verifications } = useOnboarding();
  const { opportunities, getApplicationsForNgo } = useMarketplace();

  const currentNgoId = profile?.id === 'ngo-demo-1' ? 'ngo-1' : profile?.id || 'ngo-1';
  const myOpportunities = opportunities.filter((o) => o.ngoProfileId === currentNgoId);
  const myApplications = getApplicationsForNgo(currentNgoId);

  const pendingApps = myApplications.filter((a) => a.status === 'PENDING');
  const acceptedApps = myApplications.filter((a) => a.status === 'ACCEPTED');

  const verifRecord = verifications.find(
    (v) => v.id.includes(currentNgoId) || v.name.toLowerCase().includes('greencanopy')
  );
  const isVerified = verifRecord ? verifRecord.status === 'VERIFIED' : profile?.verified === true;
  const currentVerificationStatus = verifRecord ? verifRecord.status : isVerified ? 'VERIFIED' : 'VERIFICATION_PENDING';

  return (
    <AppShell>
      {/* Verification Status Banner if Pending */}
      {currentVerificationStatus !== 'VERIFIED' && (
        <div className="mb-6 p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-[#92400E]">Organization Verification in Progress</h4>
                <StatusBadge status="verification_pending" size="sm" />
              </div>
              <p className="text-xs text-[#B45309] mt-0.5 leading-relaxed">
                You can draft, preview, and edit volunteer drives. Once administrators complete verification of your credentials, your drives can be published to the public marketplace.
              </p>
            </div>
          </div>
          <Link
            href="/ngo/opportunities/new"
            className="px-3 py-1.5 text-xs font-semibold text-[#92400E] bg-[#FEF3C7] hover:bg-[#FDE68A] rounded-lg border border-[#FDE68A] shrink-0 text-center transition-colors"
          >
            Draft a Drive &rarr;
          </Link>
        </div>
      )}

      <PageHeader
        title="NGO Operations Hub"
        description="Oversee your community volunteer drives, review candidate applications, and track volunteer capacity."
        badge={
          <StatusBadge
            status={currentVerificationStatus.toLowerCase()}
            size="sm"
          />
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/ngo/opportunities"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6B6870] hover:text-[#25232A] bg-white border border-[#E8E3E8] rounded-lg shadow-xs hover:bg-[#FAF5FA] transition-colors"
            >
              <HandHeart className="w-3.5 h-3.5 text-[#6D3A70]" />
              <span>All Opportunities</span>
            </Link>
            <Link
              href="/ngo/opportunities/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Opportunity</span>
            </Link>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Published Drives
          </span>
          <p className="text-2xl font-bold text-[#25232A] mt-1">
            {myOpportunities.filter((o) => o.isPublished).length} Active
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Pending Applications
          </span>
          <p className="text-2xl font-bold text-[#B45309] mt-1">{pendingApps.length} To Review</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Accepted Volunteers
          </span>
          <p className="text-2xl font-bold text-[#15803D] mt-1">{acceptedApps.length} Enrolled</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Verification Status
          </span>
          <div className="mt-2">
            <StatusBadge status={currentVerificationStatus.toLowerCase()} size="sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column: Active Drives List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#25232A]">
              Your Opportunities ({myOpportunities.length})
            </h2>
            <Link
              href="/ngo/opportunities"
              className="text-xs font-semibold text-[#6D3A70] hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myOpportunities.map((opp) => {
              const oppApps = myApplications.filter((a) => a.opportunityId === opp.id);
              const pendingCount = oppApps.filter((a) => a.status === 'PENDING').length;

              return (
                <div
                  key={opp.id}
                  className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                          {opp.cause}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1E7F3] text-[#6D3A70]">
                          {opp.volunteeringMode}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            opp.isPublished
                              ? 'bg-[#DCFCE7] text-[#15803D]'
                              : 'bg-[#FEF3C7] text-[#92400E]'
                          }`}
                        >
                          {opp.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#25232A]">{opp.title}</h3>
                      <p className="text-xs text-[#8B8790] line-clamp-1 mt-0.5">{opp.location}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#25232A] block">
                        {opp.capacityFilled} / {opp.volunteerCapacity}
                      </span>
                      <span className="text-[10px] text-[#8B8790]">Volunteers Filled</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E8E3E8] text-xs">
                    <span className="text-[#8B8790]">
                      Service Date: <strong className="text-[#25232A]">{opp.date}</strong> ({opp.startTime})
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/ngo/opportunities/${opp.id}/applications`}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          pendingCount > 0
                            ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] hover:bg-[#FEF3C7]/80'
                            : 'bg-[#FBFAF8] text-[#6B6870] border-[#E8E3E8] hover:bg-[#FAF5FA]'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{oppApps.length} Applicants ({pendingCount} pending)</span>
                      </Link>

                      <Link
                        href={`/ngo/opportunities/${opp.id}/edit`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#6D3A70] bg-[#FAF5FA] border border-[#E8E3E8] hover:bg-[#F1E7F3] transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] mb-3 pb-2 border-b border-[#E8E3E8]">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/ngo/opportunities/new"
                className="w-full p-2.5 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] hover:border-[#6D3A70] text-left flex items-center justify-between transition-all"
              >
                <div>
                  <span className="text-xs font-bold text-[#25232A] block">Post New Opportunity</span>
                  <span className="text-[10px] text-[#8B8790]">Publish or draft a volunteer drive</span>
                </div>
                <PlusCircle className="w-4 h-4 text-[#6D3A70]" />
              </Link>

              <Link
                href="/ngo/posts"
                className="w-full p-2.5 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] hover:border-[#6D3A70] text-left flex items-center justify-between transition-all"
              >
                <div>
                  <span className="text-xs font-bold text-[#25232A] block">Community Dispatches</span>
                  <span className="text-[10px] text-[#8B8790]">Broadcast updates &amp; impact stories</span>
                </div>
                <FileText className="w-4 h-4 text-[#6D3A70]" />
              </Link>
            </div>
          </div>

          {/* Pending Applications Callout */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A]">
                Awaiting Candidate Review
              </h3>
              <span className="text-xs font-bold text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A] px-2 py-0.5 rounded">
                {pendingApps.length}
              </span>
            </div>

            {pendingApps.length === 0 ? (
              <p className="text-xs text-[#8B8790] py-2">
                All submitted volunteer applications have been reviewed.
              </p>
            ) : (
              <div className="space-y-2 mt-3">
                {pendingApps.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-2.5 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#25232A]">{app.volunteerFullName}</span>
                      <StatusBadge status="pending" size="sm" />
                    </div>
                    <p className="text-[10px] text-[#8B8790] truncate mt-0.5">
                      Applied for: {app.opportunityTitle}
                    </p>
                    <div className="mt-2 text-right">
                      <Link
                        href={`/ngo/opportunities/${app.opportunityId}/applications`}
                        className="text-[11px] font-semibold text-[#6D3A70] hover:underline"
                      >
                        Review Application &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
