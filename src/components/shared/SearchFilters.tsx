'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { CAUSE_OPTIONS } from '@/lib/mock-data';
import { SearchFilterState } from '@/lib/types';

interface SearchFiltersProps {
  filters: SearchFilterState;
  onChange: (filters: SearchFilterState) => void;
  onReset: () => void;
  className?: string;
}

export function SearchFilters({
  filters,
  onChange,
  onReset,
  className = '',
}: SearchFiltersProps) {
  const isFiltered =
    Boolean(filters.query) ||
    filters.cause !== 'All Causes' ||
    filters.locationType !== 'all' ||
    filters.status !== 'all';

  return (
    <div
      className={`bg-white rounded-xl border border-[#E8E3E8] p-4 shadow-xs space-y-3 ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8790]" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search drives, causes, skills, or organizations..."
            className="w-full pl-9 pr-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70] transition-colors"
          />
        </div>

        {/* Cause dropdown */}
        <div className="w-full md:w-56">
          <select
            value={filters.cause}
            onChange={(e) => onChange({ ...filters, cause: e.target.value })}
            className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70] transition-colors cursor-pointer"
          >
            {CAUSE_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter pills & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E8E3E8]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-[#6B6870] mr-1">
            Mode:
          </span>
          {(['all', 'on_site', 'remote'] as const).map((loc) => {
            const labels = { all: 'All Formats', on_site: 'In-Person', remote: 'Remote' };
            const isSelected = filters.locationType === loc;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => onChange({ ...filters, locationType: loc })}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF5FA] text-[#6D3A70] border-[#E8E3E8] font-medium'
                    : 'bg-white text-[#6B6870] border-[#E8E3E8] hover:bg-[#FAF5FA]'
                }`}
              >
                {labels[loc]}
              </button>
            );
          })}

          <div className="h-4 w-px bg-[#E8E3E8] mx-1 hidden sm:block" />

          <span className="text-xs font-medium uppercase tracking-wider text-[#6B6870] mr-1 hidden sm:inline">
            Status:
          </span>
          {(['all', 'open', 'urgent'] as const).map((st) => {
            const labels = { all: 'All Drives', open: 'Open', urgent: 'Urgent Needs' };
            const isSelected = filters.status === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => onChange({ ...filters, status: st })}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF5FA] text-[#6D3A70] border-[#E8E3E8] font-medium'
                    : 'bg-white text-[#6B6870] border-[#E8E3E8] hover:bg-[#FAF5FA]'
                }`}
              >
                {labels[st]}
              </button>
            );
          })}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6D3A70] hover:text-[#552C59] px-2 py-1 rounded hover:bg-[#FAF5FA] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
