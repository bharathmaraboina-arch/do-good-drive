'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useOnboarding, VerificationRecord } from '@/lib/onboarding-context';
import { VerificationStatus } from '@/lib/types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building2,
  Users,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function AdminVerificationsPage() {
  const { verifications, updateVerificationStatus } = useOnboarding();
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | VerificationStatus>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'ngo' | 'corporate'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [actionConfirm, setActionConfirm] = useState<{
    record: VerificationRecord;
    newStatus: VerificationStatus;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredRecords = verifications.filter((v) => {
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && v.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.representativeName.toLowerCase().includes(q) ||
        v.contactEmail.toLowerCase().includes(q) ||
        v.locations.some((l) => l.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleApplyStatusChange = () => {
    if (actionConfirm) {
      updateVerificationStatus(actionConfirm.record.id, actionConfirm.newStatus, noteInput.trim() || undefined);
      if (selectedRecord?.id === actionConfirm.record.id) {
        setSelectedRecord((prev) =>
          prev ? { ...prev, status: actionConfirm.newStatus, notes: noteInput.trim() || prev.notes } : null
        );
      }
      setToastMessage(
        `Updated ${actionConfirm.record.name} to ${actionConfirm.newStatus.replace(/_/g, ' ')}`
      );
      setActionConfirm(null);
      setNoteInput('');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const pendingCount = verifications.filter((v) => v.status === 'VERIFICATION_PENDING').length;

  return (
    <AppShell>
      {toastMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#DCFCE7] border border-[#15803D]/20 text-[#15803D] text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[#15803D] hover:opacity-75 font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      <PageHeader
        title="Admin Verification Portal"
        description="Internal portal for auditing non-profit and corporate registrations, validating legal credentials, and granting marketplace trust badges."
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF5FA] text-[#6B6870] text-xs font-semibold border border-[#E8E3E8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6D3A70]" />
            <span>Internal Administrator Only</span>
          </span>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Pending Review
          </span>
          <p className="text-2xl font-bold text-[#B45309] mt-1">{pendingCount}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Verified Organizations
          </span>
          <p className="text-2xl font-bold text-[#15803D] mt-1">
            {verifications.filter((v) => v.status === 'VERIFIED').length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            More Info Required
          </span>
          <p className="text-2xl font-bold text-[#B45309] mt-1">
            {verifications.filter((v) => v.status === 'MORE_INFORMATION_REQUIRED').length}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Rejected
          </span>
          <p className="text-2xl font-bold text-[#B91C1C] mt-1">
            {verifications.filter((v) => v.status === 'REJECTED').length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8B8790] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            <span className="text-[11px] text-[#8B8790] font-medium mr-1">Type:</span>
            {[
              { id: 'ALL', label: 'All Types' },
              { id: 'ngo', label: 'NGOs' },
              { id: 'corporate', label: 'Corporates' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id as typeof typeFilter)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors cursor-pointer ${
                  typeFilter === tab.id
                    ? 'bg-[#F1E7F3] text-[#6D3A70] border-[#E8E3E8] font-bold'
                    : 'bg-white text-[#6B6870] border-[#E8E3E8] hover:bg-[#FAF5FA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#FAF5FA]">
          <span className="text-[11px] text-[#8B8790] font-medium mr-1">Status:</span>
          {[
            { id: 'ALL', label: `All (${verifications.length})` },
            { id: 'VERIFICATION_PENDING', label: `Pending (${pendingCount})` },
            { id: 'VERIFIED', label: 'Verified' },
            { id: 'MORE_INFORMATION_REQUIRED', label: 'More Info' },
            { id: 'REJECTED', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`px-3 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#6D3A70] text-white font-semibold'
                  : 'bg-[#FBFAF8] text-[#6B6870] border border-[#E8E3E8] hover:border-[#6D3A70]/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Submissions Table & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Submissions List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredRecords.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No organizations match this filter"
              description="Clear filters or search query to see other submitted records."
              actionLabel="Reset Filters"
              onAction={() => {
                setStatusFilter('ALL');
                setTypeFilter('ALL');
                setSearchQuery('');
              }}
            />
          ) : (
            filteredRecords.map((rec) => {
              const isSelected = selectedRecord?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-[#6D3A70] ring-2 ring-[#6D3A70]/20 shadow-xs'
                      : 'border-[#E8E3E8] hover:border-[#6D3A70]/30 hover:bg-[#FAF5FA]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]">
                        {rec.type === 'ngo' ? <Users className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#25232A]">{rec.name}</h3>
                        <p className="text-[10px] text-[#8B8790]">
                          {rec.type.toUpperCase()} &bull; Submitted {rec.submissionDate}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={rec.status.toLowerCase()} size="sm" />
                  </div>

                  <p className="text-xs text-[#6B6870] line-clamp-2 mb-2 leading-relaxed">
                    {rec.mission || rec.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#8B8790] pt-2 border-t border-[#FAF5FA]">
                    <span>{rec.locations.join(', ')}</span>
                    <span className="text-[#6D3A70] font-medium">Click to audit &rarr;</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Inspection & Action Panel (5 cols) */}
        <div className="lg:col-span-5">
          {selectedRecord ? (
            <div className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs sticky top-20 space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-[#FAF5FA] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8B8790] tracking-wider block">
                    Organization Audit Record
                  </span>
                  <h3 className="text-sm font-bold text-[#25232A] mt-0.5">{selectedRecord.name}</h3>
                  <p className="text-[11px] text-[#8B8790]">{selectedRecord.locations.join(', ')}</p>
                </div>
                <StatusBadge status={selectedRecord.status.toLowerCase()} size="sm" />
              </div>

              {/* Status Action Buttons */}
              <div>
                <span className="text-[11px] font-bold text-[#25232A] uppercase tracking-wider block mb-2">
                  Update Verification Status:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionConfirm({ record: selectedRecord, newStatus: 'VERIFIED' })}
                    className="p-2 rounded-lg text-xs font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#15803D]/20 hover:bg-[#bbf7d0] transition-colors flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActionConfirm({
                        record: selectedRecord,
                        newStatus: 'MORE_INFORMATION_REQUIRED',
                      })
                    }
                    className="p-2 rounded-lg text-xs font-semibold bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/20 hover:bg-[#fde68a] transition-colors flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>More Info</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionConfirm({ record: selectedRecord, newStatus: 'REJECTED' })}
                    className="p-2 rounded-lg text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C] border border-[#B91C1C]/20 hover:bg-[#fecaca] transition-colors flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              {/* Notes Display */}
              {selectedRecord.notes && (
                <div className="p-3 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8]">
                  <span className="text-[10px] font-bold text-[#8B8790] uppercase tracking-wider block mb-1">
                    Audit Notes
                  </span>
                  <p className="text-xs text-[#25232A] leading-relaxed">{selectedRecord.notes}</p>
                </div>
              )}

              {/* Registration & Representative Dossier */}
              <div className="space-y-2.5 text-xs text-[#6B6870]">
                <div>
                  <strong className="text-[#25232A] block">Mission / Focus:</strong>
                  <p className="text-[11px] text-[#8B8790] mt-0.5 leading-relaxed">
                    {selectedRecord.mission || selectedRecord.description}
                  </p>
                </div>

                {selectedRecord.registrationNumber && (
                  <div>
                    <strong className="text-[#25232A]">Registration / Tax ID:</strong>
                    <span className="text-[#8B8790] ml-1">{selectedRecord.registrationNumber}</span>
                  </div>
                )}

                <div>
                  <strong className="text-[#25232A]">Authorized Representative:</strong>
                  <p className="text-[11px] text-[#8B8790] mt-0.5">
                    {selectedRecord.representativeName} &bull; {selectedRecord.representativeTitle}
                    <br />
                    <span className="text-[#6D3A70]">{selectedRecord.representativeEmail}</span>
                  </p>
                </div>

                <div>
                  <strong className="text-[#25232A]">Official Contact:</strong>
                  <p className="text-[11px] text-[#8B8790] mt-0.5">
                    {selectedRecord.contactEmail} &bull; {selectedRecord.contactPhone}
                  </p>
                </div>

                {selectedRecord.website && (
                  <div>
                    <a
                      href={selectedRecord.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#6D3A70] font-semibold hover:underline"
                    >
                      <span>Visit Official Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E8E3E8] p-8 text-center shadow-xs">
              <ShieldCheck className="w-8 h-8 text-[#8B8790] mx-auto mb-2" />
              <h4 className="text-xs font-bold text-[#25232A]">Select an Organization</h4>
              <p className="text-[11px] text-[#8B8790] mt-1">
                Choose an organization from the list to inspect registration credentials and update verification status.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation & Note Dialog */}
      {actionConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-6 max-w-md w-full shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-[#25232A]">
              Confirm Status: {actionConfirm.newStatus.replace(/_/g, ' ')}
            </h3>
            <p className="text-xs text-[#8B8790] leading-relaxed">
              Are you sure you want to mark <strong>{actionConfirm.record.name}</strong> as{' '}
              <strong>{actionConfirm.newStatus}</strong>?
            </p>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Optional Audit / Feedback Note
              </label>
              <textarea
                rows={3}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder={
                  actionConfirm.newStatus === 'MORE_INFORMATION_REQUIRED'
                    ? 'Specify missing documents or questions...'
                    : actionConfirm.newStatus === 'REJECTED'
                    ? 'State reason for rejection...'
                    : 'Notes on verified registration databases...'
                }
                className="w-full px-3 py-2 text-xs text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#FAF5FA]">
              <button
                type="button"
                onClick={() => {
                  setActionConfirm(null);
                  setNoteInput('');
                }}
                className="px-3 py-1.5 text-xs text-[#6B6870] hover:text-[#25232A] rounded-lg hover:bg-[#FAF5FA] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyStatusChange}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
