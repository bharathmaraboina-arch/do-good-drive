'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useMarketplace } from '@/lib/marketplace-context';
import { VolunteeringMode } from '@/lib/types';
import { CAUSE_OPTIONS } from '@/lib/mock-data';
import {
  Compass,
  Search,
  Bookmark,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function VolunteerOpportunitiesSearchPage() {
  const { opportunities, isSaved, toggleSaveOpportunity, hasApplied } = useMarketplace();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCause, setSelectedCause] = useState('All Causes');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [modeFilter, setModeFilter] = useState<'ALL' | VolunteeringMode>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show only published opportunities to volunteers
  const publishedOpps = useMemo(() => {
    return opportunities.filter((o) => o.isPublished);
  }, [opportunities]);

  // Multi-criteria filter without any recommendation algorithm
  const filteredOpps = useMemo(() => {
    return publishedOpps.filter((opp) => {
      // Keyword filter (title or description)
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchKeyword =
          opp.title.toLowerCase().includes(q) ||
          opp.description.toLowerCase().includes(q) ||
          (opp.ngoName || opp.organizationName || '').toLowerCase().includes(q);
        if (!matchKeyword) return false;
      }

      // Cause filter
      if (selectedCause !== 'All Causes' && opp.cause !== selectedCause) {
        return false;
      }

      // Location filter
      if (locationFilter.trim()) {
        const loc = locationFilter.toLowerCase();
        if (!opp.location.toLowerCase().includes(loc)) return false;
      }

      // Skill filter
      if (skillFilter.trim()) {
        const skill = skillFilter.toLowerCase();
        const hasSkill = (opp.requiredSkills || opp.skillsRequired || []).some((s) => s.toLowerCase().includes(skill));
        if (!hasSkill) return false;
      }

      // Date filter
      if (dateFilter.trim()) {
        if (opp.date !== dateFilter) return false;
      }

      // Volunteering Mode filter
      if (modeFilter !== 'ALL' && opp.volunteeringMode !== modeFilter) {
        return false;
      }

      return true;
    });
  }, [publishedOpps, searchKeyword, selectedCause, locationFilter, skillFilter, dateFilter, modeFilter]);

  const handleToggleBookmark = (e: React.MouseEvent, oppId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const currentlySaved = isSaved(oppId);
    toggleSaveOpportunity(oppId);
    setToastMessage(
      currentlySaved
        ? 'Opportunity removed from saved drives.'
        : 'Opportunity saved to your bookmarks. Note: Saving does not create an application.'
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedCause('All Causes');
    setLocationFilter('');
    setSkillFilter('');
    setDateFilter('');
    setModeFilter('ALL');
  };

  return (
    <AppShell>
      {toastMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#FAF5FA] border border-[#E8E3E8] text-[#6D3A70] text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="font-bold hover:opacity-75 cursor-pointer">
            &times;
          </button>
        </div>
      )}

      <PageHeader
        title="Explore Volunteer Opportunities"
        description="Search active community initiatives by cause, required capabilities, date, and format. Strictly chronological and transparent without hidden ranking algorithms."
        badge={
          <Link
            href="/volunteer/saved"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-[#6D3A70] text-xs font-semibold border border-[#E8E3E8] hover:bg-[#FAF5FA] transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Saved Drives</span>
          </Link>
        }
      />

      {/* Comprehensive Filter Panel */}
      <div className="bg-white p-5 rounded-xl border border-[#E8E3E8] shadow-xs mb-8 space-y-4">
        {/* Search Input and Mode Selector Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-[#8B8790] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search drives by title, description, or non-profit..."
              className="w-full pl-9 pr-3 py-2 text-xs text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCause}
              onChange={(e) => setSelectedCause(e.target.value)}
              className="w-full px-3 py-2 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            >
              {CAUSE_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Location, Skill, Date, Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E8E3E8]">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#8B8790] mb-1">
              Location / City
            </label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="e.g. Portland or Remote"
              className="w-full px-2.5 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#8B8790] mb-1">
              Required Skill
            </label>
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="e.g. Planting, Python..."
              className="w-full px-2.5 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#8B8790] mb-1">
              Service Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#8B8790] mb-1">
              Volunteering Mode
            </label>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value as typeof modeFilter)}
              className="w-full px-2.5 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            >
              <option value="ALL">All Formats</option>
              <option value="ON_SITE">On-Site Only</option>
              <option value="REMOTE">Remote Only</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Clear */}
        <div className="flex items-center justify-between text-xs text-[#8B8790] pt-2">
          <span>
            Showing <strong>{filteredOpps.length}</strong> matching initiatives
          </span>
          {(searchKeyword || selectedCause !== 'All Causes' || locationFilter || skillFilter || dateFilter || modeFilter !== 'ALL') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#6D3A70] font-semibold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Opportunities List */}
      {filteredOpps.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No volunteering drives match your criteria"
          description="Try broadening your search keyword, adjusting location, or clearing specific filters."
          actionLabel="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOpps.map((opp) => {
            const saved = isSaved(opp.id);
            const applied = hasApplied(opp.id);
            const capacity = opp.volunteerCapacity || opp.capacityNeeded || 10;
            const percentFilled = Math.min(100, Math.round((opp.capacityFilled / capacity) * 100));

            return (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Cause, Mode, Save Button */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                        {opp.cause}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1E7F3] text-[#6D3A70]">
                        {opp.volunteeringMode}
                      </span>
                      {opp.ngoVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#15803D] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                          <span>Verified NGO</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleToggleBookmark(e, opp.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        saved
                          ? 'bg-[#FAF5FA] text-[#6D3A70] border-[#6D3A70]'
                          : 'bg-white text-[#8B8790] border-[#E8E3E8] hover:text-[#25232A]'
                      }`}
                      title={saved ? 'Remove from saved' : 'Save opportunity'}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <Link href={`/volunteer/opportunities/${opp.id}`} className="group">
                    <h3 className="text-base font-bold text-[#25232A] group-hover:text-[#6D3A70] transition-colors leading-snug">
                      {opp.title}
                    </h3>
                  </Link>

                  <p className="text-xs font-semibold text-[#6D3A70] mt-1">{opp.ngoName}</p>
                  <p className="text-xs text-[#6B6870] line-clamp-2 mt-2 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(opp.requiredSkills || opp.skillsRequired || []).map((s) => (
                      <span key={s} className="px-2 py-0.5 text-[10px] rounded bg-[#FBFAF8] border border-[#E8E3E8] text-[#6B6870]">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Schedule Details */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E8E3E8] text-xs text-[#8B8790]">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-[#6D3A70] shrink-0" />
                      <span className="truncate">{opp.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-[#6D3A70] shrink-0" />
                      <span className="truncate">{opp.duration}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#6D3A70] shrink-0" />
                      <span className="truncate">{opp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Capacity & Apply */}
                <div className="mt-5 pt-3 border-t border-[#E8E3E8] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#25232A]">
                      {opp.capacityFilled} / {capacity} Enrolled
                    </span>
                    <div className="w-24 h-1.5 bg-[#FAF5FA] rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#6D3A70]" style={{ width: `${percentFilled}%` }} />
                    </div>
                  </div>

                  {applied ? (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]">
                      Applied
                    </span>
                  ) : (
                    <Link
                      href={`/volunteer/opportunities/${opp.id}`}
                      className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
                    >
                      <span>View &amp; Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
