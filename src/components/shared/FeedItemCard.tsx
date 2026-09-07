'use client';

import React from 'react';
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Award,
  Users,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import { UnifiedFeedItem, Opportunity } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { useFeed } from '@/lib/feed-context';
import { useAuth } from '@/lib/auth-context';

interface FeedItemCardProps {
  item: UnifiedFeedItem;
  onOpportunityApply?: (opp: Opportunity) => void;
  onOpportunityView?: (opp: Opportunity) => void;
  className?: string;
}

export function FeedItemCard({
  item,
  onOpportunityApply,
  onOpportunityView,
  className = '',
}: FeedItemCardProps) {
  const { isFollowingNgo, toggleFollowNgo, isNgoShortlisted, toggleShortlistNgo } = useFeed();
  const { role } = useAuth();

  const isFollowed = isFollowingNgo(item.ngoProfileId);
  const isShortlisted = isNgoShortlisted(item.ngoProfileId);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <article
      className={`bg-white rounded-xl border border-[#E8E3E8] shadow-xs hover:border-[#6D3A70]/30 hover:shadow-sm transition-all duration-200 p-5 sm:p-6 ${className}`}
    >
      {/* Feed Card Header */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F1E7F3] text-[#6D3A70] font-bold text-xs flex items-center justify-center border border-[#E8E3E8] shrink-0">
            {getInitials(item.ngoName)}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-[#25232A]">{item.ngoName}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              {isFollowed && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]">
                  Following
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#8B8790] mt-0.5">
              <span>{item.cause}</span>
              <span>&bull;</span>
              <span>{formatDate(item.publishedAt)}</span>
            </div>
          </div>
        </div>

        {/* Header Actions: Follow / Shortlist buttons */}
        <div className="flex items-center gap-1.5">
          {role === 'corporate' && (
            <button
              type="button"
              onClick={() => toggleShortlistNgo(item.ngoProfileId)}
              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                isShortlisted
                  ? 'bg-[#FEF3C7] text-[#B45309] border-[#B45309]/30'
                  : 'text-[#6B6870] hover:text-[#25232A] border-[#E8E3E8] hover:bg-[#FAF5FA]'
              }`}
              title={isShortlisted ? 'Shortlisted for CSR review' : 'Shortlist NGO'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current' : ''}`} />
            </button>
          )}

          <button
            type="button"
            onClick={() => toggleFollowNgo(item.ngoProfileId)}
            className={`px-3 py-1 text-xs rounded-xl border transition-colors cursor-pointer font-semibold ${
              isFollowed
                ? 'bg-[#FAF5FA] text-[#6D3A70] border-[#E8E3E8] hover:bg-[#F1E7F3]'
                : 'bg-[#6D3A70] text-white border-[#6D3A70] hover:bg-[#552C59]'
            }`}
          >
            {isFollowed ? 'Unfollow' : '+ Follow'}
          </button>
        </div>
      </div>

      {/* Content Variant: NGO IMPACT STORY */}
      {item.itemType === 'impact_story' && item.postData && (
        <div className="mt-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F1E7F3] text-[#6D3A70] border border-[#E8E3E8] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Impact Story</span>
          </div>

          <h3 className="text-base font-bold text-[#25232A] mb-2">{item.postData.title}</h3>

          {item.postData.impactMetric && (
            <div className="bg-[#FAF5FA] border border-[#E8E3E8] p-3 rounded-xl my-3 flex items-center gap-2 text-xs font-semibold text-[#6D3A70]">
              <Award className="w-4 h-4 shrink-0" />
              <span>Verified Metric: {item.postData.impactMetric}</span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-[#6B6870] leading-relaxed whitespace-pre-line">
            {item.postData.body}
          </p>
        </div>
      )}

      {/* Content Variant: REGULAR NGO POST */}
      {item.itemType === 'post' && item.postData && (
        <div className="mt-2">
          <h3 className="text-base font-bold text-[#25232A] mb-2">{item.postData.title}</h3>
          <p className="text-xs sm:text-sm text-[#6B6870] leading-relaxed whitespace-pre-line">
            {item.postData.body}
          </p>
          {item.postData.imageUrl && (
            <div className="mt-3 rounded-xl overflow-hidden border border-[#E8E3E8] max-h-72 bg-[#FAF5FA]">
              <img
                src={item.postData.imageUrl}
                alt={item.postData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* Content Variant: PUBLISHED OPPORTUNITY */}
      {item.itemType === 'opportunity' && item.opportunityData && (
        <div className="mt-2 bg-[#FBFAF8] border border-[#E8E3E8] p-4 rounded-xl">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D3A70]">
              Volunteer Initiative
            </span>
            <StatusBadge status={item.opportunityData.status || 'open'} size="sm" />
          </div>

          <h3 className="text-sm sm:text-base font-bold text-[#25232A] mb-1.5">
            {item.opportunityData.title}
          </h3>

          <p className="text-xs text-[#6B6870] line-clamp-2 mb-3 leading-relaxed">
            {item.opportunityData.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B6870] mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#6D3A70]" />
              {item.opportunityData.startDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#6D3A70]" />
              {item.opportunityData.commitmentHours}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#6D3A70]" />
              {item.opportunityData.location}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E8E3E8]">
            <span className="text-xs text-[#6B6870] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#6D3A70]" />
              <strong>{item.opportunityData.capacityFilled}</strong> /{' '}
              {item.opportunityData.capacityNeeded} Volunteers Filled
            </span>

            {onOpportunityApply && (
              <button
                type="button"
                onClick={() => onOpportunityApply(item.opportunityData!)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Express Interest
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Variant: COMMUNITY EVENT */}
      {item.itemType === 'event' && item.eventData && (
        <div className="mt-2 bg-[#FBFAF8] border border-[#E8E3E8] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#E8E3E8] flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-[#6D3A70] uppercase">SEP</span>
              <span className="text-sm font-extrabold text-[#25232A] leading-none">
                {new Date(item.eventData.eventDate).getDate() || 18}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D3A70]">
                Community Event
              </span>
              <h3 className="text-sm font-bold text-[#25232A] mt-0.5">{item.eventData.title}</h3>
              <p className="text-xs text-[#6B6870] mt-1">{item.eventData.description}</p>
              <div className="flex items-center gap-3 text-xs text-[#6B6870] mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#6D3A70]" />
                  {item.eventData.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#6D3A70]" />
                  {item.eventData.rsvpCount} Attending
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]">
              RSVP Open
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
