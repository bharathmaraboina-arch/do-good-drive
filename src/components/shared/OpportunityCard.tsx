'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Users, Award } from 'lucide-react';
import { Opportunity } from '@/lib/types';
import { StatusBadge } from './StatusBadge';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onApply?: (opp: Opportunity) => void;
  onView?: (opp: Opportunity) => void;
  className?: string;
}

export function OpportunityCard({
  opportunity,
  onApply,
  onView,
  className = '',
}: OpportunityCardProps) {
  const needed = opportunity.volunteerCapacity || opportunity.capacityNeeded || 10;
  const percentFilled = Math.min(
    100,
    Math.round((opportunity.capacityFilled / needed) * 100)
  );

  return (
    <div
      className={`bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs flex flex-col justify-between hover:border-[#6D3A70]/30 hover:shadow-sm transition-all duration-200 ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#F1E7F3] text-[#6D3A70] border border-[#E8E3E8]">
              {opportunity.cause}
            </span>
            {opportunity.isRemote && (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                Remote
              </span>
            )}
          </div>
          <StatusBadge status={opportunity.status || 'open'} size="sm" />
        </div>

        <h3 className="text-base font-bold text-[#25232A] mb-1.5 line-clamp-2 leading-snug">
          {opportunity.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-[#6B6870] mb-3 flex-wrap">
          <span className="font-semibold text-[#25232A]">{opportunity.organizationName}</span>
          {opportunity.corporateSponsor && (
            <span className="inline-flex items-center gap-1 text-[#6D3A70] bg-[#FAF5FA] px-1.5 py-0.5 rounded-md border border-[#E8E3E8] text-[11px] font-medium">
              <Award className="w-3 h-3 text-[#6D3A70]" /> Sponsored by {opportunity.corporateSponsor}
            </span>
          )}
        </div>

        <p className="text-xs text-[#6B6870] line-clamp-3 mb-4 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#6B6870] mb-4 bg-[#FBFAF8] p-3 rounded-xl border border-[#E8E3E8]">
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-[#6D3A70] shrink-0" />
            <span className="truncate">{opportunity.startDate}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-[#6D3A70] shrink-0" />
            <span className="truncate">{opportunity.commitmentHours || 'Flexible'}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#6D3A70] shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
        </div>

        {/* Skills needed */}
        {opportunity.skillsRequired && opportunity.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {opportunity.skillsRequired.map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Progress & Actions */}
      <div className="pt-3 border-t border-[#FAF5FA]">
        <div className="flex items-center justify-between text-xs text-[#6B6870] mb-1.5">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#6D3A70]" />
            <span>
              <strong className="text-[#25232A]">{opportunity.capacityFilled}</strong> of {opportunity.capacityNeeded} filled
            </span>
          </span>
          <span className="font-semibold text-[#25232A]">{percentFilled}%</span>
        </div>

        <div className="w-full h-1.5 bg-[#FAF5FA] rounded-full overflow-hidden mb-4 border border-[#E8E3E8]">
          <div
            className="h-full bg-[#6D3A70] rounded-full transition-all duration-300"
            style={{ width: `${percentFilled}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
          {onView && (
            <button
              type="button"
              onClick={() => onView(opportunity)}
              className="flex-1 px-3 py-2 text-xs font-semibold text-[#25232A] bg-white border border-[#E8E3E8] hover:bg-[#FAF5FA] rounded-xl transition-colors cursor-pointer text-center"
            >
              View Details
            </button>
          )}
          {onApply && (
            <button
              type="button"
              onClick={() => onApply(opportunity)}
              className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-xl shadow-xs transition-colors cursor-pointer text-center"
            >
              Express Interest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
