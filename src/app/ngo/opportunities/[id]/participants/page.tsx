'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useMarketplace } from '@/lib/marketplace-context';
import { AttendanceStatus, HoursVerificationStatus } from '@/lib/types';
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Save,
  Check,
} from 'lucide-react';

interface ParticipantsPageProps {
  params: Promise<{ id: string }>;
}

export default function OpportunityParticipantsPage({ params }: ParticipantsPageProps) {
  const resolvedParams = use(params);
  const {
    getOpportunityById,
    getApplicationsForOpportunity,
    getRecordsForOpportunity,
    recordAttendanceAndHours,
  } = useMarketplace();

  const opp = getOpportunityById(resolvedParams.id);
  const acceptedApps = getApplicationsForOpportunity(resolvedParams.id).filter(
    (a) => a.status === 'ACCEPTED'
  );
  const participantRecords = getRecordsForOpportunity(resolvedParams.id);

  // Form row local editing state
  const [formState, setFormState] = useState<
    Record<
      string,
      {
        attendanceStatus: AttendanceStatus;
        activityDate: string;
        hours: number;
        hoursStatus: HoursVerificationStatus;
        notes: string;
      }
    >
  >({});

  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!opp) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h2 className="text-base font-bold text-[#25232A]">Opportunity Not Found</h2>
          <Link href="/ngo/opportunities" className="text-xs font-semibold text-[#6D3A70] hover:underline mt-2 inline-block">
            &larr; Return to Opportunities
          </Link>
        </div>
      </AppShell>
    );
  }

  // Calculate summary stats
  const attendedCount = participantRecords.filter((r) => r.attendanceStatus === 'ATTENDED').length;
  const verifiedCount = participantRecords.filter((r) => r.hoursStatus === 'VERIFIED').length;
  const totalVerifiedHours = participantRecords
    .filter((r) => r.hoursStatus === 'VERIFIED')
    .reduce((sum, r) => sum + (Number(r.hours) || 0), 0);

  const getRowValues = (appId: string, defaultRec: typeof participantRecords[0]) => {
    if (formState[appId]) return formState[appId];
    return {
      attendanceStatus: defaultRec.attendanceStatus || 'UNRECORDED',
      activityDate: defaultRec.activityDate || opp.date || new Date().toISOString().split('T')[0],
      hours: defaultRec.hours !== undefined ? defaultRec.hours : 4.0,
      hoursStatus: defaultRec.hoursStatus || 'PENDING_VERIFICATION',
      notes: defaultRec.notes || '',
    };
  };

  const handleFieldChange = (
    appId: string,
    field: string,
    value: any,
    defaultRec: typeof participantRecords[0]
  ) => {
    const current = getRowValues(appId, defaultRec);
    setFormState({
      ...formState,
      [appId]: {
        ...current,
        [field]: value,
      },
    });
  };

  const handleSaveRow = (appId: string, volId: string, defaultRec: typeof participantRecords[0]) => {
    const current = getRowValues(appId, defaultRec);
    const res = recordAttendanceAndHours({
      applicationId: appId,
      opportunityId: opp.id,
      volunteerProfileId: volId,
      attendanceStatus: current.attendanceStatus,
      activityDate: current.activityDate,
      hours: Number(current.hours) || 0,
      hoursStatus: current.hoursStatus,
      notes: current.notes,
    });

    if (res.success) {
      setToastMessage({ text: 'Participant attendance and hours saved successfully.' });
    } else {
      setToastMessage({ text: res.message || 'Failed to save', isError: true });
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleQuickVerify = (recordId: string, appId: string, volId: string, defaultRec: typeof participantRecords[0]) => {
    const current = getRowValues(appId, defaultRec);
    // Ensure attendance is marked ATTENDED and record exists
    recordAttendanceAndHours({
      applicationId: appId,
      opportunityId: opp.id,
      volunteerProfileId: volId,
      attendanceStatus: 'ATTENDED',
      activityDate: current.activityDate,
      hours: Number(current.hours) || 4.0,
      hoursStatus: 'VERIFIED',
      notes: current.notes,
    });

    setFormState({
      ...formState,
      [appId]: {
        ...current,
        attendanceStatus: 'ATTENDED',
        hoursStatus: 'VERIFIED',
      },
    });

    setToastMessage({ text: 'Hours verified and officially credited to volunteer impact!' });
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Link
          href="/ngo/opportunities"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6870] hover:text-[#25232A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Opportunities</span>
        </Link>
        <span className="text-[#E8E3E8]">&bull;</span>
        <Link
          href={`/ngo/opportunities/${opp.id}/applications`}
          className="text-xs font-medium text-[#6D3A70] hover:underline"
        >
          Review Candidate Applications &rarr;
        </Link>
      </div>

      {toastMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in duration-200 ${
            toastMessage.isError
              ? 'bg-[#FEE2E2] border border-[#B91C1C]/20 text-[#B91C1C]'
              : 'bg-[#DCFCE7] border border-[#15803D]/20 text-[#15803D]'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.isError ? (
              <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="font-bold hover:opacity-75 cursor-pointer">
            &times;
          </button>
        </div>
      )}

      <PageHeader
        title={`Participant Roster & Completion: ${opp.title}`}
        description="Mark volunteer attendance, record activity hours, and verify contributions. Unverified hours do not count toward official volunteer impact totals."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F1E7F3] text-[#6D3A70] text-xs font-semibold border border-[#E8E3E8]">
            <Users className="w-3.5 h-3.5" />
            <span>{acceptedApps.length} Accepted Volunteers</span>
          </span>
        }
      />

      {/* Roster KPI Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Accepted Roster
          </span>
          <p className="text-2xl font-bold text-[#25232A] mt-1">{acceptedApps.length} Volunteers</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Confirmed Attended
          </span>
          <p className="text-2xl font-bold text-[#15803D] mt-1">{attendedCount} Present</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Verified Records
          </span>
          <p className="text-2xl font-bold text-[#6D3A70] mt-1">{verifiedCount} of {acceptedApps.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Official Impact Hours
          </span>
          <p className="text-2xl font-bold text-[#25232A] mt-1">{totalVerifiedHours.toFixed(1)} hrs</p>
        </div>
      </div>

      {acceptedApps.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No accepted participants yet"
          description="Candidates must be accepted in candidate review before their attendance and hours can be verified."
          actionLabel="Go to Candidate Review"
          onAction={() => {
            window.location.href = `/ngo/opportunities/${opp.id}/applications`;
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E3E8] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FAF5FA] border-b border-[#E8E3E8] flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A]">
                Volunteer Attendance &amp; Hours Certification
              </h3>
              <p className="text-[11px] text-[#8B8790] mt-0.5">
                Volunteers cannot self-declare attendance or hours. Official impact requires NGO verification.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#6D3A70]">
              Scheduled: {opp.duration || '4 Hours'}
            </span>
          </div>

          <div className="divide-y divide-[#E8E3E8]">
            {participantRecords.map((rec) => {
              const current = getRowValues(rec.applicationId, rec);
              const isVerified = current.hoursStatus === 'VERIFIED';
              const isAttended = current.attendanceStatus === 'ATTENDED';
              const isAbsent = current.attendanceStatus === 'ABSENT';

              return (
                <div key={rec.applicationId} className="p-5 hover:bg-[#FAF5FA] transition-colors space-y-4">
                  {/* Top Line: Volunteer Identity & Verification Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-xs flex items-center justify-center shrink-0">
                        {rec.volunteerFullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#25232A]">{rec.volunteerFullName}</h4>
                        <span className="text-[11px] text-[#8B8790]">
                          Candidate ID: {rec.volunteerProfileId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] border border-[#15803D]/20 px-2.5 py-1 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                          <span>Hours Verified ({current.hours} hrs)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309] bg-[#FEF3C7] border border-[#B45309]/20 px-2.5 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5 text-[#B45309]" />
                          <span>Pending Verification ({current.hours} hrs)</span>
                        </span>
                      )}

                      {isAttended && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D]">
                          Attended
                        </span>
                      )}
                      {isAbsent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEE2E2] text-[#B91C1C]">
                          Absent
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Form Controls Grid: Attendance, Date, Hours, Hours Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                    {/* Attendance Status Toggle (3 cols) */}
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold uppercase text-[#8B8790] mb-1">
                        Attendance Status
                      </label>
                      <div className="flex rounded-lg border border-[#E8E3E8] overflow-hidden p-0.5 bg-[#FAF5FA]">
                        <button
                          type="button"
                          onClick={() => handleFieldChange(rec.applicationId, 'attendanceStatus', 'ATTENDED', rec)}
                          className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                            current.attendanceStatus === 'ATTENDED'
                              ? 'bg-[#15803D] text-white shadow-xs'
                              : 'text-[#6B6870] hover:text-[#25232A]'
                          }`}
                        >
                          Attended
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange(rec.applicationId, 'attendanceStatus', 'ABSENT', rec)}
                          className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                            current.attendanceStatus === 'ABSENT'
                              ? 'bg-[#B91C1C] text-white shadow-xs'
                              : 'text-[#6B6870] hover:text-[#25232A]'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>

                    {/* Activity Date (3 cols) */}
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold uppercase text-[#8B8790] mb-1">
                        Activity Date
                      </label>
                      <input
                        type="date"
                        value={current.activityDate}
                        onChange={(e) => handleFieldChange(rec.applicationId, 'activityDate', e.target.value, rec)}
                        className="w-full px-2.5 py-1.5 text-xs text-[#25232A] bg-white border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                    </div>

                    {/* Hours (2 cols) */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-[#8B8790] mb-1">
                        Hours Logged
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={current.hours}
                        onChange={(e) => handleFieldChange(rec.applicationId, 'hours', parseFloat(e.target.value) || 0, rec)}
                        className="w-full px-2.5 py-1.5 text-xs text-[#25232A] bg-white border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                    </div>

                    {/* Hours Status Selector (2 cols) */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-[#8B8790] mb-1">
                        Hours Status
                      </label>
                      <select
                        value={current.hoursStatus}
                        onChange={(e) => handleFieldChange(rec.applicationId, 'hoursStatus', e.target.value, rec)}
                        className="w-full px-2.5 py-1.5 text-xs text-[#25232A] bg-white border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      >
                        <option value="PENDING_VERIFICATION">Pending Verification</option>
                        <option value="VERIFIED">Verified</option>
                      </select>
                    </div>

                    {/* Action Buttons (2 cols) */}
                    <div className="sm:col-span-2 flex items-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSaveRow(rec.applicationId, rec.volunteerProfileId, rec)}
                        className="flex-1 py-1.5 px-2 text-xs font-semibold text-[#25232A] bg-white border border-[#E8E3E8] hover:bg-[#FAF5FA] rounded-lg shadow-xs transition-colors cursor-pointer text-center"
                        title="Save row changes"
                      >
                        <Save className="w-3.5 h-3.5 inline mr-1" />
                        <span>Save</span>
                      </button>

                      {!isVerified && (
                        <button
                          type="button"
                          onClick={() => handleQuickVerify(rec.id, rec.applicationId, rec.volunteerProfileId, rec)}
                          className="py-1.5 px-2.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer text-center shrink-0"
                          title="Verify hours immediately"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notes input */}
                  <div>
                    <input
                      type="text"
                      value={current.notes}
                      onChange={(e) => handleFieldChange(rec.applicationId, 'notes', e.target.value, rec)}
                      placeholder="Optional coordinator feedback or notes for this participant..."
                      className="w-full px-2.5 py-1 text-xs text-[#6B6870] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AppShell>
  );
}
