'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useCorporate } from '@/lib/corporate-context';
import { CAUSE_OPTIONS } from '@/lib/mock-data';
import {
  Search,
  Building2,
  Bookmark,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export default function CorporateNgoDiscoveryPage() {
  const { ngos, isShortlisted, toggleShortlistNgo, getConnectionRequest } = useCorporate();

  const [keyword, setKeyword] = useState('');
  const [selectedCause, setSelectedCause] = useState('All Causes');
  const [locationFilter, setLocationFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'ALL' | 'VERIFIED' | 'VERIFICATION_PENDING'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredNgos = useMemo(() => {
    return ngos.filter((ngo) => {
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const matchName = ngo.ngoName.toLowerCase().includes(q);
        const matchDesc = ngo.description.toLowerCase().includes(q);
        const matchMission = ngo.mission.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchMission) return false;
      }

      if (selectedCause !== 'All Causes' && !ngo.causes.some((c) => c.toLowerCase().includes(selectedCause.toLowerCase()))) {
        return false;
      }

      if (locationFilter.trim()) {
        const loc = locationFilter.toLowerCase();
        const matchLoc = ngo.locations.some((l) => l.toLowerCase().includes(loc));
        if (!matchLoc) return false;
      }

      if (verificationFilter !== 'ALL' && ngo.verificationStatus !== verificationFilter) {
        return false;
      }

      return true;
    });
  }, [ngos, keyword, selectedCause, locationFilter, verificationFilter]);

  const handleToggleShortlist = (ngoId: string, ngoName: string) => {
    const currentlyShortlisted = isShortlisted(ngoId);
    toggleShortlistNgo(ngoId);
    setToastMessage(
      currentlyShortlisted
        ? `Removed "${ngoName}" from shortlist.`
        : `Added "${ngoName}" to corporate shortlist.`
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCause('All Causes');
    setLocationFilter('');
    setVerificationFilter('ALL');
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
        title="Discover Non-Profit Partners"
        description="Explore registered grassroots organizations by cause area, geographic footprint, and official verification status to identify prospective CSR partnerships."
        badge={
          <Link
            href="/corporate/shortlist"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-[#6D3A70] text-xs font-semibold border border-[#E8E3E8] hover:bg-[#FAF5FA] transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>View Shortlist</span>
          </Link>
        }
      />

      {/* Discovery Search & Filter Panel */}
      <div className="bg-white p-5 rounded-xl border border-[#E8E3E8] shadow-xs mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-[#8B8790] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search non-profits by name, mission, or keywords..."
              className="w-full pl-9 pr-3 py-2 text-xs text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCause}
              onChange={(e) => setSelectedCause(e.target.value)}
              className="w-full px-3 py-2 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            >
              {CAUSE_OPTIONS.map((cause) => (
                <option key={cause} value={cause}>
                  {cause}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#FAF5FA]">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#8B8790] mb-1">
              Geographic Location / City
            </label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="e.g. Portland, Seattle, Chicago..."
              className="w-full px-2.5 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#8B8790] mb-1">
              Verification Status
            </label>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value as typeof verificationFilter)}
              className="w-full px-2.5 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="VERIFIED">Verified Organizations Only</option>
              <option value="VERIFICATION_PENDING">Pending Verification</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#8B8790] pt-2">
          <span>
            Showing <strong>{filteredNgos.length}</strong> matching non-profit organizations
          </span>
          {(keyword || selectedCause !== 'All Causes' || locationFilter || verificationFilter !== 'ALL') && (
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

      {filteredNgos.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No non-profit partners match your filters"
          description="Try broadening your search keywords or adjusting cause and location filters."
          actionLabel="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredNgos.map((ngo) => {
            const shortlisted = isShortlisted(ngo.profileId);
            const req = getConnectionRequest(ngo.profileId);

            return (
              <div
                key={ngo.profileId}
                className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top line: Verification status badge & Shortlist Button */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={ngo.verificationStatus.toLowerCase()} size="sm" />
                      <span className="text-[10px] text-[#8B8790]">
                        Est. {ngo.registrationDetails.yearEstablished}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleShortlist(ngo.profileId, ngo.ngoName)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        shortlisted
                          ? 'bg-[#F1E7F3] text-[#6D3A70] border-[#E8E3E8]'
                          : 'bg-white text-[#8B8790] border-[#E8E3E8] hover:text-[#25232A]'
                      }`}
                      title={shortlisted ? 'Remove from shortlist' : 'Add to corporate shortlist'}
                    >
                      <Bookmark className={`w-4 h-4 ${shortlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <Link href={`/corporate/ngos/${ngo.profileId}`} className="group">
                    <h3 className="text-base font-bold text-[#25232A] group-hover:text-[#6D3A70] transition-colors">
                      {ngo.ngoName}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#6B6870] line-clamp-2 mt-1.5 leading-relaxed">
                    {ngo.description}
                  </p>

                  {/* Causes */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {ngo.causes.map((c) => (
                      <span key={c} className="px-2 py-0.5 text-[10px] rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Locations */}
                  <div className="flex items-center gap-1.5 text-xs text-[#8B8790] mt-3 pt-3 border-t border-[#FAF5FA]">
                    <MapPin className="w-3.5 h-3.5 text-[#6D3A70] shrink-0" />
                    <span className="truncate">{ngo.locations.join(' &bull; ')}</span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-4 pt-3 border-t border-[#FAF5FA] flex items-center justify-between gap-2">
                  <div>
                    {req ? (
                      <StatusBadge
                        status={
                          req.status === 'ACCEPTED'
                            ? 'active'
                            : req.status === 'DECLINED'
                            ? 'rejected'
                            : 'in_review'
                        }
                        size="sm"
                      />
                    ) : (
                      <span className="text-[11px] text-[#8B8790]">Not connected</span>
                    )}
                  </div>

                  <Link
                    href={`/corporate/ngos/${ngo.profileId}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-[#6D3A70] bg-[#F1E7F3] border border-[#E8E3E8] rounded-lg hover:bg-[#ebdce9] transition-colors"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
