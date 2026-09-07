'use client';

import React, { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchFilters } from '@/components/shared/SearchFilters';
import { OpportunityCard } from '@/components/shared/OpportunityCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useAuth } from '@/lib/auth-context';
import { MOCK_OPPORTUNITIES } from '@/lib/mock-data';
import { Opportunity, SearchFilterState } from '@/lib/types';
import { CalendarCheck, Clock, CheckCircle2, Sparkles } from 'lucide-react';

const INITIAL_FILTERS: SearchFilterState = {
  query: '',
  cause: 'All Causes',
  locationType: 'all',
  status: 'all',
};

export default function VolunteerPage() {
  const { profile } = useAuth();
  const [filters, setFilters] = useState<SearchFilterState>(INITIAL_FILTERS);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [appliedDrives, setAppliedDrives] = useState<string[]>(['opp-2']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter logic
  const filteredOpportunities = useMemo(() => {
    return MOCK_OPPORTUNITIES.filter((opp) => {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesOrg = (opp.organizationName || opp.ngoName || '').toLowerCase().includes(q);
        const matchesDesc = opp.description.toLowerCase().includes(q);
        const matchesSkills = (opp.skillsRequired || opp.requiredSkills || []).some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesOrg && !matchesDesc && !matchesSkills) {
          return false;
        }
      }

      if (filters.cause !== 'All Causes' && opp.cause !== filters.cause) {
        return false;
      }

      if (filters.locationType === 'remote' && !opp.isRemote) return false;
      if (filters.locationType === 'on_site' && opp.isRemote) return false;

      if (filters.status === 'open' && opp.status !== 'open') return false;
      if (filters.status === 'urgent' && opp.status !== 'urgent') return false;

      return true;
    });
  }, [filters]);

  const handleApplyClick = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setIsConfirmOpen(true);
  };

  const handleConfirmApplication = () => {
    if (selectedOpportunity) {
      setAppliedDrives((prev) => [...prev, selectedOpportunity.id]);
      setIsConfirmOpen(false);
      setToastMessage(`Your interest in "${selectedOpportunity.title}" has been registered!`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const myCommitments = MOCK_OPPORTUNITIES.filter((opp) => appliedDrives.includes(opp.id));

  return (
    <AppShell>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#DCFCE7] border border-[#15803D]/20 text-[#15803D] text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[#15803D] hover:text-[#15803D]/80 font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      <PageHeader
        title="Volunteer Space"
        description="Discover vetted community drives matching your skills and schedule. Express interest with direct non-profit coordinators."
        badge={<StatusBadge status="verified" size="sm" />}
      />

      {/* Volunteer Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#8B8790] font-medium">Active Commitments</p>
              <p className="text-lg font-bold text-[#25232A]">{myCommitments.length} Drives</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#8B8790] font-medium">Impact Hours Logged</p>
              <p className="text-lg font-bold text-[#25232A]">24 Hours</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[#8B8790] font-medium">Causes Supported</p>
              <p className="text-lg font-bold text-[#25232A]">
                {profile?.causes?.length || 3} Focus Areas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <SearchFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(INITIAL_FILTERS)}
        />
      </div>

      {/* Drives Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#25232A]">
            Available Community Drives ({filteredOpportunities.length})
          </h2>
          <span className="text-xs text-[#8B8790]">
            Vetted non-profit initiatives requiring volunteers
          </span>
        </div>

        {filteredOpportunities.length === 0 ? (
          <EmptyState
            title="No matching drives found"
            description="Try loosening your search keywords or switching cause categories to see more opportunities."
            actionLabel="Reset Search Filters"
            onAction={() => setFilters(INITIAL_FILTERS)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOpportunities.map((opp) => {
              const hasApplied = appliedDrives.includes(opp.id);
              return (
                <div key={opp.id} className="relative">
                  <OpportunityCard
                    opportunity={opp}
                    onApply={hasApplied ? undefined : () => handleApplyClick(opp)}
                    onView={() => handleApplyClick(opp)}
                  />
                  {hasApplied && (
                    <div className="absolute top-4 right-4 pointer-events-none">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#15803D]/20">
                        Enrolled
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Commitments Section */}
      <section id="commitments" className="pt-8 border-t border-[#E8E3E8] mb-12 scroll-mt-20">
        <div className="mb-4">
          <h2 className="text-base font-bold text-[#25232A]">My Active Commitments</h2>
          <p className="text-xs text-[#8B8790]">Drives you have enrolled in and committed time toward.</p>
        </div>

        {myCommitments.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] text-center">
            <p className="text-xs text-[#8B8790]">You have not enrolled in any drives yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCommitments.map((opp) => (
              <div
                key={opp.id}
                className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#6D3A70]">
                    {opp.cause}
                  </span>
                  <h3 className="text-sm font-semibold text-[#25232A] mt-0.5">{opp.title}</h3>
                  <p className="text-xs text-[#8B8790] mt-1">
                    {opp.organizationName} &bull; {opp.startDate}
                  </p>
                </div>
                <StatusBadge status="active" size="sm" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Volunteer Profile Overview */}
      <section id="profile" className="pt-8 border-t border-[#E8E3E8] scroll-mt-20">
        <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF5FA] border border-[#E8E3E8] text-[#6D3A70] font-bold text-base flex items-center justify-center">
                {profile?.fullName?.charAt(0) || 'V'}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#25232A]">{profile?.fullName || 'Volunteer Member'}</h3>
                <p className="text-xs text-[#8B8790]">{profile?.location || 'Location Not Specified'}</p>
              </div>
            </div>
            <StatusBadge status="verified" size="sm" />
          </div>

          <p className="text-xs text-[#6B6870] leading-relaxed mb-4">
            {profile?.bio || 'Passionate volunteer dedicated to supporting community initiatives.'}
          </p>

          <div>
            <span className="text-xs font-semibold text-[#25232A] block mb-2">My Focus Causes:</span>
            <div className="flex flex-wrap gap-1.5">
              {(profile?.causes || ['Environment', 'Education', 'Hunger Relief']).map((cause) => (
                <span
                  key={cause}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]"
                >
                  {cause}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Dialog */}
      {selectedOpportunity && (
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Confirm Volunteering Commitment"
          message={`Are you sure you want to register for "${selectedOpportunity.title}" organized by ${selectedOpportunity.organizationName}? Your contact details will be shared with the organizer for logistics.`}
          confirmLabel="Confirm Registration"
          cancelLabel="Review Later"
          onConfirm={handleConfirmApplication}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </AppShell>
  );
}
