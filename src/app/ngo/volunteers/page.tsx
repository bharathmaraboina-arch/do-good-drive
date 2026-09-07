'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuth } from '@/lib/auth-context';
import { useMarketplace } from '@/lib/marketplace-context';
import { HoursVerificationStatus, AttendanceStatus, VolunteerCertificate } from '@/lib/types';
import CertificateModal from '@/components/certificates/CertificateModal';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  ExternalLink,
  Award,
} from 'lucide-react';

export default function NgoVolunteersManagementPage() {
  const { profile } = useAuth();
  const {
    opportunities,
    activityRecords,
    verifyVolunteerHours,
    recordAttendanceAndHours,
    generateCertificateForRecord,
    getCertificateForRecord,
    getCertificateById,
  } = useMarketplace();

  const currentNgoId = profile?.id === 'ngo-demo-1' ? 'ngo-1' : profile?.id || 'ngo-1';

  // Filter records belonging to opportunities hosted by this NGO
  const myOppIds = opportunities.filter((o) => o.ngoProfileId === currentNgoId).map((o) => o.id);
  const myRecords = activityRecords.filter((r) => myOppIds.includes(r.opportunityId));

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHoursStatus, setFilterHoursStatus] = useState<'ALL' | HoursVerificationStatus>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<VolunteerCertificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Summary Metrics
  const uniqueVolunteersCount = new Set(myRecords.map((r) => r.volunteerProfileId)).size;
  const verifiedRecords = myRecords.filter((r) => r.hoursStatus === 'VERIFIED');
  const pendingRecords = myRecords.filter((r) => r.hoursStatus === 'PENDING_VERIFICATION');

  const totalVerifiedHours = verifiedRecords.reduce((sum, r) => sum + (Number(r.hours) || 0), 0);
  const totalPendingHours = pendingRecords.reduce((sum, r) => sum + (Number(r.hours) || 0), 0);

  const filteredRecords = myRecords.filter((r) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = r.volunteerFullName.toLowerCase().includes(q);
      const matchTitle = r.opportunityTitle.toLowerCase().includes(q);
      if (!matchName && !matchTitle) return false;
    }

    if (filterHoursStatus !== 'ALL' && r.hoursStatus !== filterHoursStatus) {
      return false;
    }

    return true;
  });

  const handleVerifyHours = (recordId: string) => {
    const res = verifyVolunteerHours(recordId);
    if (res.success) {
      setToastMessage('Volunteer hours verified successfully and credited to official impact totals.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleToggleAttendance = (rec: typeof myRecords[0]) => {
    const nextStatus: AttendanceStatus = rec.attendanceStatus === 'ATTENDED' ? 'ABSENT' : 'ATTENDED';
    recordAttendanceAndHours({
      applicationId: rec.applicationId,
      opportunityId: rec.opportunityId,
      volunteerProfileId: rec.volunteerProfileId,
      attendanceStatus: nextStatus,
      activityDate: rec.activityDate,
      hours: rec.hours,
      hoursStatus: rec.hoursStatus,
      notes: rec.notes,
    });
    setToastMessage(`Attendance updated to ${nextStatus}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateCertificate = (recordId: string) => {
    const res = generateCertificateForRecord(recordId);
    if (res.success && res.certificate) {
      setSelectedCertificate(res.certificate);
      setIsCertModalOpen(true);
      setToastMessage(`Official certificate generated for ${res.certificate.volunteerFullName}! Push notification sent.`);
    } else {
      setToastMessage(res.message || 'Could not generate certificate.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleViewCertificate = (recordId: string, certId?: string) => {
    const cert = (certId ? getCertificateById(certId) : null) || getCertificateForRecord(recordId);
    if (cert) {
      setSelectedCertificate(cert);
      setIsCertModalOpen(true);
    } else {
      setToastMessage('Certificate not found.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <AppShell>
      {toastMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#DCFCE7] border border-[#15803D]/20 text-[#15803D] text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in duration-200">
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
        title="Volunteer Attendance &amp; Hours Central"
        description="Verify service hours and certify community attendance for accepted volunteers. Volunteers cannot self-declare hours; official impact totals require NGO certification."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F1E7F3] text-[#6D3A70] text-xs font-semibold border border-[#E8E3E8]">
            <Users className="w-3.5 h-3.5" />
            <span>{uniqueVolunteersCount} Mobilized Volunteers</span>
          </span>
        }
      />

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Volunteers Mobilized
          </span>
          <p className="text-2xl font-bold text-[#25232A] mt-1">{uniqueVolunteersCount} Individuals</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Total Verified Hours
          </span>
          <p className="text-2xl font-bold text-[#15803D] mt-1">{totalVerifiedHours.toFixed(1)} hrs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Awaiting Verification
          </span>
          <p className="text-2xl font-bold text-[#B45309] mt-1">{totalPendingHours.toFixed(1)} hrs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Certifications Completed
          </span>
          <p className="text-2xl font-bold text-[#25232A] mt-1">{verifiedRecords.length} Activities</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8B8790] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by volunteer name or opportunity title..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'ALL', label: `All (${myRecords.length})` },
            { id: 'PENDING_VERIFICATION', label: `Pending (${pendingRecords.length})` },
            { id: 'VERIFIED', label: `Verified (${verifiedRecords.length})` },
          ].map((tab) => {
            const isActive = filterHoursStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterHoursStatus(tab.id as typeof filterHoursStatus)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#F1E7F3] text-[#6D3A70] border-[#E8E3E8] font-semibold'
                    : 'bg-white text-[#6B6870] border-[#E8E3E8] hover:bg-[#FAF5FA]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No volunteer completion records found"
          description="Participant records are automatically generated when candidates are accepted into your volunteering drives."
          actionLabel="View Opportunities"
          onAction={() => {
            window.location.href = '/ngo/opportunities';
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((rec) => {
            const isVerified = rec.hoursStatus === 'VERIFIED';
            const isAttended = rec.attendanceStatus === 'ATTENDED';

            return (
              <div
                key={rec.id}
                className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="max-w-xl space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                      {rec.cause}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(rec)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        isAttended
                          ? 'bg-[#DCFCE7] text-[#15803D] hover:bg-[#bbf7d0]'
                          : 'bg-[#FEE2E2] text-[#B91C1C] hover:bg-[#fecaca]'
                      }`}
                      title="Click to toggle attendance status"
                    >
                      {rec.attendanceStatus}
                    </button>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#15803D] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                        <span>Verified Official Hours</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#B45309] font-semibold bg-[#FEF3C7] px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3 text-[#B45309]" />
                        <span>Pending NGO Sign-off</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-xs flex items-center justify-center shrink-0">
                      {rec.volunteerFullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#25232A]">{rec.volunteerFullName}</h4>
                      <Link
                        href={`/ngo/opportunities/${rec.opportunityId}/participants`}
                        className="text-xs text-[#6D3A70] hover:underline font-medium flex items-center gap-1"
                      >
                        <span>{rec.opportunityTitle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {rec.notes && (
                    <p className="text-xs text-[#6B6870] italic bg-[#FBFAF8] p-2 rounded border border-[#E8E3E8]">
                      &ldquo;{rec.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#FAF5FA]">
                  <div className="text-right">
                    <span className="text-base font-bold text-[#25232A] block">
                      {rec.hours} Hours
                    </span>
                    <span className="text-[11px] text-[#8B8790] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#6D3A70]" />
                      <span>{rec.activityDate}</span>
                    </span>
                  </div>

                    <div className="flex items-center gap-2">
                    <Link
                      href={`/ngo/opportunities/${rec.opportunityId}/participants`}
                      className="px-3 py-1.5 text-xs font-medium text-[#6B6870] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg hover:bg-[#FAF5FA] transition-colors"
                    >
                      Open Roster
                    </Link>

                    {!isVerified ? (
                      <button
                        type="button"
                        onClick={() => handleVerifyHours(rec.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Verify Hours
                      </button>
                    ) : isAttended && (
                      rec.certificateIssued || getCertificateForRecord(rec.id) ? (
                        <button
                          type="button"
                          onClick={() => handleViewCertificate(rec.id, rec.certificateId)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#6D3A70] bg-[#F1E7F3] hover:bg-[#E8D9EB] rounded-lg transition-colors cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>View Certificate</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleGenerateCertificate(rec.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Generate Certificate</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Preview Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificate={selectedCertificate}
      />
    </AppShell>
  );
}
