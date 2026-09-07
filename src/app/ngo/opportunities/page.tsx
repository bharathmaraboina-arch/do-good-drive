'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuth } from '@/lib/auth-context';
import { useMarketplace } from '@/lib/marketplace-context';
import {
  HandHeart,
  PlusCircle,
  Users,
  Edit2,
  Eye,
  EyeOff,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

export default function NgoOpportunitiesPage() {
  const { profile } = useAuth();
  const { opportunities, togglePublishOpportunity, getApplicationsForOpportunity } = useMarketplace();
  const [filterType, setFilterType] = useState<'all' | 'published' | 'drafts'>('all');
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const currentNgoId = profile?.id === 'ngo-demo-1' ? 'ngo-1' : profile?.id || 'ngo-1';
  const myOpps = opportunities.filter((o) => o.ngoProfileId === currentNgoId);

  const filteredOpps = myOpps.filter((o) => {
    if (filterType === 'published') return o.isPublished;
    if (filterType === 'drafts') return !o.isPublished;
    return true;
  });

  const handleTogglePublish = (id: string) => {
    const res = togglePublishOpportunity(id);
    if (!res.success) {
      setToastMessage({ text: res.message || 'Action failed', isError: true });
    } else {
      setToastMessage({ text: res.message || 'Status updated successfully', isError: false });
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <AppShell>
      <Link
        href="/ngo/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B8790] hover:text-[#25232A] mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Operations Hub</span>
      </Link>

      {toastMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs ${
            toastMessage.isError
              ? 'bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]'
              : 'bg-[#DCFCE7] border border-[#15803D]/20 text-[#15803D]'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.isError ? (
              <AlertCircle className="w-4 h-4 text-[#B45309] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="font-bold hover:opacity-75 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      <PageHeader
        title="Manage Volunteering Opportunities"
        description="Create, preview, publish, edit, and unpublish your organization's community drives. Only verified organizations can publish to the public marketplace."
        actions={
          <Link
            href="/ngo/opportunities/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post New Opportunity</span>
          </Link>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { id: 'all', label: `All Drives (${myOpps.length})` },
          { id: 'published', label: `Published (${myOpps.filter((o) => o.isPublished).length})` },
          { id: 'drafts', label: `Drafts (${myOpps.filter((o) => !o.isPublished).length})` },
        ].map((tab) => {
          const isActive = filterType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as typeof filterType)}
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

      {filteredOpps.length === 0 ? (
        <EmptyState
          icon={HandHeart}
          title="No opportunities found"
          description="Create a new community volunteering drive to recruit skilled volunteers."
          actionLabel="Create Opportunity"
          onAction={() => {
            window.location.href = '/ngo/opportunities/new';
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredOpps.map((opp) => {
            const oppApps = getApplicationsForOpportunity(opp.id);
            const pendingCount = oppApps.filter((a) => a.status === 'PENDING').length;
            const capacity = opp.volunteerCapacity || opp.capacityNeeded || 10;
            const percentFilled = Math.min(100, Math.round((opp.capacityFilled / capacity) * 100));

            return (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/40 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                      <span className="text-[10px] text-[#8B8790]">
                        Deadline: {opp.applicationDeadline}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#25232A]">{opp.title}</h3>
                    <p className="text-xs text-[#6B6870] line-clamp-2 mt-1 leading-relaxed">
                      {opp.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#8B8790] mt-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#6D3A70]" />
                        <span>{opp.date} ({opp.startTime} - {opp.endTime})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#6D3A70]" />
                        <span className="truncate max-w-[200px]">{opp.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#6D3A70]" />
                        <span>{opp.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Capacity Right Box */}
                  <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#E8E3E8]">
                    <div className="sm:text-right w-full sm:w-auto">
                      <div className="flex items-center justify-between sm:justify-end gap-2 mb-1">
                        <span className="text-xs font-bold text-[#25232A]">
                          {opp.capacityFilled} / {capacity} Enrolled
                        </span>
                        <span className="text-[10px] text-[#8B8790]">({percentFilled}%)</span>
                      </div>
                      <div className="w-full sm:w-36 h-1.5 bg-[#FAF5FA] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#6D3A70] rounded-full"
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>

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
                        <span>{oppApps.length} Applicants {pendingCount > 0 && `(${pendingCount} pending)`}</span>
                      </Link>

                      <Link
                        href={`/ngo/opportunities/${opp.id}/participants`}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#6D3A70] bg-[#FAF5FA] border border-[#E8E3E8] hover:bg-[#F1E7F3] transition-colors"
                        title="Manage participant attendance and verify volunteer hours"
                      >
                        Attendance
                      </Link>

                      <Link
                        href={`/ngo/opportunities/${opp.id}/edit`}
                        className="p-1.5 text-[#6B6870] hover:text-[#25232A] rounded-lg border border-[#E8E3E8] hover:bg-[#FAF5FA] transition-colors"
                        title="Edit Opportunity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleTogglePublish(opp.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          opp.isPublished
                            ? 'text-[#6D3A70] bg-[#FAF5FA] border-[#6D3A70] hover:bg-[#F1E7F3]'
                            : 'text-[#8B8790] border-[#E8E3E8] hover:bg-[#FAF5FA]'
                        }`}
                        title={opp.isPublished ? 'Unpublish from marketplace' : 'Publish to marketplace'}
                      >
                        {opp.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
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
