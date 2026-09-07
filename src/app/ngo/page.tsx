'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useAuth } from '@/lib/auth-context';
import { MOCK_OPPORTUNITIES } from '@/lib/mock-data';
import { Opportunity } from '@/lib/types';
import {
  Users,
  PlusCircle,
  Calendar,
  MapPin,
  Clock,
  Building2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export default function NgoPage() {
  const { profile } = useAuth();
  const [drives, setDrives] = useState<Opportunity[]>(MOCK_OPPORTUNITIES.slice(0, 4));
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalVolunteersNeeded = drives.reduce(
    (acc, curr) => acc + (curr.volunteerCapacity || curr.capacityNeeded || 10),
    0
  );
  const totalVolunteersFilled = drives.reduce((acc, curr) => acc + curr.capacityFilled, 0);

  const handleDeleteDrive = () => {
    if (deletingId) {
      setDrives((prev) => prev.filter((d) => d.id !== deletingId));
      setDeletingId(null);
      setToastMessage('Initiative removed from marketplace.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <AppShell>
      {toastMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#DCFCE7] border border-[#15803D]/20 text-[#15803D] text-xs font-medium flex items-center justify-between shadow-xs">
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
        title="NGO Operations Workspace"
        description={`Manage active volunteer drives and review community enrollment for ${
          profile?.organizationName || 'your organization'
        }.`}
        badge={<StatusBadge status="verified" size="sm" />}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/ngo/corporate-partners"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6B6870] hover:text-[#25232A] bg-white border border-[#E8E3E8] rounded-lg shadow-xs hover:bg-[#FAF5FA] transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-[#6D3A70]" />
              <span>Explore CSR Grants</span>
            </Link>
            <Link
              href="/ngo/opportunities/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Drive</span>
            </Link>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <p className="text-xs text-[#8B8790] font-medium">Active Public Drives</p>
          <p className="text-2xl font-bold text-[#25232A] mt-1">{drives.length}</p>
          <span className="text-[11px] text-[#6D3A70] font-medium mt-1 inline-block">
            Published &amp; visible to volunteers
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <p className="text-xs text-[#8B8790] font-medium">Volunteers Enrolled</p>
          <p className="text-2xl font-bold text-[#25232A] mt-1">
            {totalVolunteersFilled} / {totalVolunteersNeeded}
          </p>
          <div className="w-full h-1.5 bg-[#FAF5FA] rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-[#6D3A70] rounded-full"
              style={{
                width: `${Math.round((totalVolunteersFilled / totalVolunteersNeeded) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <p className="text-xs text-[#8B8790] font-medium">Corporate Sponsorships</p>
          <p className="text-2xl font-bold text-[#25232A] mt-1">2 Active</p>
          <span className="text-[11px] text-[#6D3A70] font-medium mt-1 inline-block">
            Co-sponsored by Apex Capital &amp; EcoTech
          </span>
        </div>
      </div>

      {/* Active Drives Table / List */}
      <div className="bg-white rounded-xl border border-[#E8E3E8] shadow-xs overflow-hidden mb-10">
        <div className="p-4 sm:p-5 border-b border-[#E8E3E8] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#25232A]">Active Community Drives</h2>
            <p className="text-xs text-[#8B8790]">
              Monitor enrollment progress and manage initiative requirements.
            </p>
          </div>
          <Link
            href="/ngo/opportunities/new"
            className="text-xs font-semibold text-[#6D3A70] hover:text-[#552C59] flex items-center gap-1"
          >
            + Post Drive
          </Link>
        </div>

        <div className="divide-y divide-[#E8E3E8]">
          {drives.map((drive) => {
            const needed = drive.volunteerCapacity || drive.capacityNeeded || 10;
            const percent = Math.min(
              100,
              Math.round((drive.capacityFilled / needed) * 100)
            );

            return (
              <div
                key={drive.id}
                className="p-4 sm:p-5 hover:bg-[#FBFAF8] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                      {drive.cause}
                    </span>
                    <StatusBadge status={drive.status || 'open'} size="sm" />
                    {drive.isRemote && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1E7F3] text-[#6D3A70] font-medium">
                        Remote
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-[#25232A]">{drive.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#8B8790] mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#6D3A70]" />
                      {drive.startDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#6D3A70]" />
                      {drive.commitmentHours}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#6D3A70]" />
                      {drive.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:shrink-0">
                  <div className="w-36 text-right">
                    <div className="flex items-center justify-end gap-1 text-xs font-semibold text-[#25232A] mb-1">
                      <Users className="w-3.5 h-3.5 text-[#6D3A70]" />
                      <span>
                        {drive.capacityFilled} / {drive.capacityNeeded} Filled
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#FAF5FA] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6D3A70] rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeletingId(drive.id)}
                    className="p-1.5 text-[#8B8790] hover:text-[#B91C1C] hover:bg-[#FEE2E2] rounded-md transition-colors cursor-pointer"
                    title="Remove Drive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Remove Initiative"
        message="Are you sure you want to remove this initiative from the marketplace? Registered volunteers will be notified."
        confirmLabel="Remove Drive"
        isDestructive={true}
        onConfirm={handleDeleteDrive}
        onCancel={() => setDeletingId(null)}
      />
    </AppShell>
  );
}
