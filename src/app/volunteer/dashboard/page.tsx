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
  CalendarCheck,
  Compass,
  Bookmark,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
} from 'lucide-react';

export default function VolunteerDashboardPage() {
  const { profile } = useAuth();
  const { volunteerProfile } = useOnboarding();
  const {
    opportunities,
    applications,
    savedOpportunityIds,
    getImpactSummaryForVolunteer,
  } = useMarketplace();

  const volId = profile?.id || 'vol-1';
  const myApplications = applications.filter(
    (a) => a.volunteerProfileId === volId || a.volunteerProfileId === 'vol-1'
  );
  const pendingApps = myApplications.filter((a) => a.status === 'PENDING');

  const savedOpps = opportunities.filter((o) => savedOpportunityIds.includes(o.id));
  const openOpportunities = opportunities.filter((o) => o.isPublished);

  const impactSummary = getImpactSummaryForVolunteer(volId);

  return (
    <AppShell>
      {/* Profile Readiness & Welcome Banner */}
      <div className="mb-6 p-5 rounded-xl bg-white border border-[#E8E3E8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-full bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-base flex items-center justify-center shrink-0">
            {(volunteerProfile?.fullName || profile?.fullName || 'Sarah Jenkins').charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-[#25232A]">
                Welcome back, {volunteerProfile?.fullName || profile?.fullName || 'Sarah'}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#15803D]/20">
                <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                <span>Profile Ready</span>
              </span>
            </div>
            <p className="text-xs text-[#8B8790] mt-0.5">
              {volunteerProfile?.city || 'Seattle'}, {volunteerProfile?.state || 'WA'} &bull; Focus Causes:{' '}
              {(volunteerProfile?.causes || ['Environment', 'Education']).join(', ')}
            </p>
          </div>
        </div>

        <Link
          href="/onboarding/volunteer"
          className="px-3.5 py-1.5 text-xs font-semibold text-[#6D3A70] bg-[#FAF5FA] border border-[#E8E3E8] rounded-lg hover:bg-[#F1E7F3] transition-colors shrink-0 text-center"
        >
          Edit Volunteer Profile &rarr;
        </Link>
      </div>

      <PageHeader
        title="Volunteer Operations Hub"
        description="Monitor your active volunteering commitments, review saved drives, and track your official NGO-certified impact hours."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/volunteer/saved"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6B6870] bg-white border border-[#E8E3E8] rounded-lg shadow-xs hover:bg-[#FAF5FA] transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#6D3A70]" />
              <span>Saved ({savedOpportunityIds.length})</span>
            </Link>
            <Link
              href="/volunteer/opportunities"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discover Drives</span>
            </Link>
          </div>
        }
      />

      {/* KPI Metric Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <Link
          href="/volunteer/impact"
          className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs hover:border-[#6D3A70] transition-colors group block"
        >
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Verified Impact Hours
          </span>
          <p className="text-2xl font-bold text-[#6D3A70] mt-1 group-hover:underline">
            {impactSummary.totalVerifiedHours.toFixed(1)} hrs
          </p>
          <span className="text-[10px] text-[#15803D] font-medium block mt-0.5">
            &check; 100% NGO-certified
          </span>
        </Link>

        <Link
          href="/volunteer/applications"
          className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs hover:border-[#6D3A70] transition-colors group block"
        >
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Active Applications
          </span>
          <p className="text-2xl font-bold text-[#25232A] mt-1 group-hover:underline">
            {myApplications.length} Total
          </p>
          <span className="text-[10px] text-[#B45309] font-medium block mt-0.5">
            {pendingApps.length} awaiting NGO review
          </span>
        </Link>

        <Link
          href="/volunteer/saved"
          className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs hover:border-[#6D3A70] transition-colors group block"
        >
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Saved Opportunities
          </span>
          <p className="text-2xl font-bold text-[#25232A] mt-1 group-hover:underline">
            {savedOpportunityIds.length} Drives
          </p>
          <span className="text-[10px] text-[#8B8790] font-medium block mt-0.5">
            Bookmarked for later
          </span>
        </Link>

        <Link
          href="/volunteer/impact"
          className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs hover:border-[#6D3A70] transition-colors group block"
        >
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Completed Activities
          </span>
          <p className="text-2xl font-bold text-[#15803D] mt-1 group-hover:underline">
            {impactSummary.activitiesCompletedCount} Attended
          </p>
          <span className="text-[10px] text-[#8B8790] font-medium block mt-0.5">
            Across {impactSummary.ngosSupportedCount} partner NGOs
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column: Active Applications Tracker (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#25232A]">
              My Applications &amp; Commitments ({myApplications.length})
            </h3>
            <Link
              href="/volunteer/applications"
              className="text-xs font-semibold text-[#6D3A70] hover:underline flex items-center gap-1"
            >
              <span>View All Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myApplications.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E8E3E8] p-8 text-center shadow-xs">
              <CalendarCheck className="w-8 h-8 text-[#8B8790] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-[#25232A]">No volunteering applications yet</h4>
              <p className="text-xs text-[#8B8790] mt-1 max-w-sm mx-auto">
                Explore open opportunities to connect with local grassroots non-profits and schedule your service commitment.
              </p>
              <Link
                href="/volunteer/opportunities"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs"
              >
                <span>Browse Drives</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/40 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8B8790] tracking-wider block">
                        {app.ngoName || 'Non-Profit Partner'}
                      </span>
                      <Link
                        href={`/volunteer/opportunities/${app.opportunityId}`}
                        className="text-sm font-bold text-[#25232A] hover:text-[#6D3A70] transition-colors"
                      >
                        {app.opportunityTitle || 'Community Volunteering Drive'}
                      </Link>
                    </div>

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

                  <div className="flex items-center gap-4 text-xs text-[#8B8790] pt-1">
                    {app.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#6D3A70]" />
                        <span>{app.date}</span>
                      </span>
                    )}
                    {app.location && (
                      <span className="flex items-center gap-1 truncate max-w-[250px]">
                        <MapPin className="w-3.5 h-3.5 text-[#6D3A70]" />
                        <span className="truncate">{app.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Open Opportunities Spotlight */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#25232A]">
                Featured Open Opportunities
              </h3>
              <Link
                href="/volunteer/opportunities"
                className="text-xs font-semibold text-[#6D3A70] hover:underline flex items-center gap-1"
              >
                <span>See All Drives</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {openOpportunities.slice(0, 2).map((opp) => (
                <div
                  key={opp.id}
                  className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#6D3A70] tracking-wider block">
                      {opp.cause} &bull; {opp.volunteeringMode}
                    </span>
                    <Link
                      href={`/volunteer/opportunities/${opp.id}`}
                      className="text-sm font-bold text-[#25232A] hover:text-[#6D3A70] transition-colors"
                    >
                      {opp.title}
                    </Link>
                    <p className="text-xs text-[#8B8790] line-clamp-1">{opp.description}</p>
                  </div>

                  <Link
                    href={`/volunteer/opportunities/${opp.id}`}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#6D3A70] bg-[#FAF5FA] border border-[#E8E3E8] rounded-lg hover:bg-[#F1E7F3] transition-colors shrink-0 text-center"
                  >
                    View &amp; Apply
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Column: Saved Drives & Quick Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E3E8] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A]">
                Saved Drives ({savedOpps.length})
              </h3>
              <Link
                href="/volunteer/saved"
                className="text-xs font-semibold text-[#6D3A70] hover:underline"
              >
                View All
              </Link>
            </div>

            {savedOpps.length === 0 ? (
              <p className="text-xs text-[#8B8790] py-3">
                No drives saved. Bookmark opportunities to review and apply when ready.
              </p>
            ) : (
              <div className="space-y-2.5">
                {savedOpps.slice(0, 3).map((opp) => (
                  <div
                    key={opp.id}
                    className="p-3 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] space-y-1"
                  >
                    <Link
                      href={`/volunteer/opportunities/${opp.id}`}
                      className="text-xs font-bold text-[#25232A] hover:text-[#6D3A70] line-clamp-1 block"
                    >
                      {opp.title}
                    </Link>
                    <span className="text-[10px] text-[#8B8790] block">
                      {opp.date || 'Flexible Date'} &bull; {opp.duration || '4 Hours'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] pb-2 border-b border-[#E8E3E8]">
              Hub Shortcuts
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/volunteer/impact"
                className="w-full p-2.5 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] hover:border-[#6D3A70] flex items-center justify-between text-[#25232A] font-medium hover:text-[#6D3A70] transition-all"
              >
                <div>
                  <span className="block font-bold">Verified Impact Record</span>
                  <span className="text-[10px] text-[#8B8790]">Official certificate &amp; hours summary</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#6D3A70]" />
              </Link>
              <Link
                href="/volunteer/applications"
                className="w-full p-2.5 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] hover:border-[#6D3A70] flex items-center justify-between text-[#25232A] font-medium hover:text-[#6D3A70] transition-all"
              >
                <div>
                  <span className="block font-bold">Active Applications</span>
                  <span className="text-[10px] text-[#8B8790]">Track statuses &amp; upcoming dates</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#6D3A70]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
