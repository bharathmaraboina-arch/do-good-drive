'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useMarketplace } from '@/lib/marketplace-context';
import {
  Bookmark,
  Calendar,
  MapPin,
  Trash2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function VolunteerSavedOpportunitiesPage() {
  const { opportunities, savedOpportunityIds, toggleSaveOpportunity, hasApplied } = useMarketplace();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const savedOpps = opportunities.filter((o) => savedOpportunityIds.includes(o.id));

  const handleRemove = (id: string, title: string) => {
    toggleSaveOpportunity(id);
    setToastMessage(`Removed "${title}" from saved drives.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <AppShell>
      <Link
        href="/volunteer/opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B8790] hover:text-[#25232A] mb-4 transition-colors"
      >
        <span>&larr; Back to Explore Opportunities</span>
      </Link>

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
        title="Saved Opportunities (Bookmarks)"
        description="Review your bookmarked volunteering initiatives. Saving an opportunity keeps it in your personal reading list and never creates an application."
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF5FA] text-[#6D3A70] text-xs font-semibold border border-[#E8E3E8]">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{savedOpps.length} Bookmarked</span>
          </span>
        }
      />

      {savedOpps.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved opportunities yet"
          description="Bookmark community drives you are interested in while exploring the marketplace. Saving never creates an application."
          actionLabel="Explore Opportunities"
          onAction={() => {
            window.location.href = '/volunteer/opportunities';
          }}
        />
      ) : (
        <div className="space-y-4">
          {savedOpps.map((opp) => {
            const applied = hasApplied(opp.id);
            const capacity = opp.volunteerCapacity || opp.capacityNeeded || 10;
            const percentFilled = Math.min(100, Math.round((opp.capacityFilled / capacity) * 100));

            return (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                      {opp.cause}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1E7F3] text-[#6D3A70]">
                      {opp.volunteeringMode}
                    </span>
                    {opp.ngoVerified && (
                      <span className="text-[10px] text-[#15803D] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded">
                        Verified NGO
                      </span>
                    )}
                  </div>

                  <Link href={`/volunteer/opportunities/${opp.id}`}>
                    <h3 className="text-base font-bold text-[#25232A] hover:text-[#6D3A70] transition-colors">
                      {opp.title}
                    </h3>
                  </Link>
                  <p className="text-xs font-semibold text-[#6D3A70] mt-0.5">{opp.ngoName}</p>
                  <p className="text-xs text-[#8B8790] line-clamp-2 mt-1 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#8B8790] mt-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#6D3A70]" />
                      <span>{opp.date} ({opp.duration})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#6D3A70]" />
                      <span className="truncate max-w-[200px]">{opp.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E8E3E8]">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#25232A] block">
                      {opp.capacityFilled} / {capacity} Enrolled
                    </span>
                    <div className="w-24 h-1.5 bg-[#FAF5FA] rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-[#6D3A70]" style={{ width: `${percentFilled}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemove(opp.id, opp.title)}
                      className="p-2 text-[#8B8790] hover:text-[#B91C1C] hover:bg-[#FEE2E2] rounded-lg border border-[#E8E3E8] transition-colors cursor-pointer"
                      title="Remove from bookmarks"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {applied ? (
                      <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]">
                        Applied
                      </span>
                    ) : (
                      <Link
                        href={`/volunteer/opportunities/${opp.id}`}
                        className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
