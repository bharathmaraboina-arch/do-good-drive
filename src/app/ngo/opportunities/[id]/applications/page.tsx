'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useMarketplace } from '@/lib/marketplace-context';
import { Application, ApplicationStatus } from '@/lib/types';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Users,
  Lock,
} from 'lucide-react';

interface ApplicationsPageProps {
  params: Promise<{ id: string }>;
}

export default function NgoApplicationsReviewPage({ params }: ApplicationsPageProps) {
  const resolvedParams = use(params);
  const { getOpportunityById, getApplicationsForOpportunity, updateApplicationStatus } = useMarketplace();

  const opp = getOpportunityById(resolvedParams.id);
  const applications = getApplicationsForOpportunity(resolvedParams.id);

  const [selectedApp, setSelectedApp] = useState<Application | null>(applications[0] || null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | ApplicationStatus>('ALL');
  const [notesState, setNotesState] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredApps = applications.filter((a) => {
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    return true;
  });

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    const currentNote = notesState[appId] !== undefined ? notesState[appId] : selectedApp?.ngoPrivateNotes;
    updateApplicationStatus(appId, newStatus, currentNote);

    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status: newStatus, ngoPrivateNotes: currentNote } : null));
    }

    setToastMessage(`Volunteer candidate marked as ${newStatus}. In-app notification sent.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveNote = (appId: string) => {
    const note = notesState[appId];
    if (note !== undefined) {
      const app = applications.find((a) => a.id === appId);
      if (app) {
        updateApplicationStatus(appId, app.status, note);
        setToastMessage('Private NGO coordinator notes saved.');
        setTimeout(() => setToastMessage(null), 3000);
      }
    }
  };

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

  return (
    <AppShell>
      <Link
        href="/ngo/opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6870] hover:text-[#25232A] mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Opportunities</span>
      </Link>

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
        title={`Candidate Applications: ${opp.title}`}
        description={`Review profile credentials, availability, and answers for candidate volunteers. Total Capacity: ${opp.capacityFilled} / ${(opp.volunteerCapacity || 10)} Enrolled.`}
        badge={<StatusBadge status={opp.isPublished ? 'open' : 'in_review'} size="sm" />}
        actions={
          <Link
            href={`/ngo/opportunities/${opp.id}/participants`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#6D3A70] bg-[#F1E7F3] border border-[#E8E3E8] rounded-lg hover:bg-[#ebdce9] transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Attendance &amp; Hours &rarr;</span>
          </Link>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'ALL', label: `All Candidates (${applications.length})` },
          { id: 'PENDING', label: `Pending Review (${applications.filter((a) => a.status === 'PENDING').length})` },
          { id: 'ACCEPTED', label: `Accepted (${applications.filter((a) => a.status === 'ACCEPTED').length})` },
          { id: 'REJECTED', label: `Rejected (${applications.filter((a) => a.status === 'REJECTED').length})` },
        ].map((tab) => {
          const isActive = filterStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
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

      {applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No volunteer applications yet"
          description="Candidates will appear here as volunteers discover your opportunity and apply."
          actionLabel="View Opportunity Details"
          onAction={() => {
            window.location.href = `/volunteer/opportunities/${opp.id}`;
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Applicants List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {filteredApps.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-[#6D3A70] ring-2 ring-[#6D3A70]/20 shadow-xs'
                      : 'border-[#E8E3E8] hover:border-[#6D3A70]/30 hover:bg-[#FAF5FA]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-xs flex items-center justify-center shrink-0">
                        {app.volunteerFullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#25232A]">{app.volunteerFullName}</h4>
                        <p className="text-[10px] text-[#8B8790]">{app.volunteerLocation}</p>
                      </div>
                    </div>

                    <StatusBadge
                      status={
                        app.status === 'ACCEPTED'
                          ? 'active'
                          : app.status === 'REJECTED'
                          ? 'rejected'
                          : 'in_review'
                      }
                      size="sm"
                    />
                  </div>

                  <p className="text-xs text-[#6B6870] line-clamp-2 italic mb-2">
                    &ldquo;{app.volunteerBio}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#FAF5FA] text-[10px] text-[#8B8790]">
                    <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                    <span className="font-semibold text-[#6D3A70]">Inspect Dossier &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dossier & Review Panel (7 cols) */}
          <div className="lg:col-span-7">
            {selectedApp ? (
              <div className="bg-white rounded-xl border border-[#E8E3E8] p-6 shadow-xs space-y-5 sticky top-20">
                {/* Dossier Header */}
                <div className="flex items-start justify-between gap-3 border-b border-[#FAF5FA] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-sm flex items-center justify-center">
                      {selectedApp.volunteerFullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#25232A]">{selectedApp.volunteerFullName}</h3>
                      <p className="text-xs text-[#8B8790]">{selectedApp.volunteerLocation}</p>
                    </div>
                  </div>

                  <StatusBadge
                    status={
                      selectedApp.status === 'ACCEPTED'
                        ? 'active'
                        : selectedApp.status === 'REJECTED'
                        ? 'rejected'
                        : 'in_review'
                    }
                  />
                </div>

                {/* Candidate Action Buttons (ACCEPTED vs REJECTED) */}
                <div>
                  <span className="text-[11px] font-bold text-[#25232A] uppercase tracking-wider block mb-2">
                    Application Decision:
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedApp.id, 'ACCEPTED')}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        selectedApp.status === 'ACCEPTED'
                          ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                          : 'bg-[#DCFCE7] text-[#15803D] border-[#15803D]/20 hover:bg-[#bbf7d0]'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{selectedApp.status === 'ACCEPTED' ? 'Accepted Candidate' : 'Accept Volunteer'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedApp.id, 'REJECTED')}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        selectedApp.status === 'REJECTED'
                          ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-xs'
                          : 'bg-[#FEE2E2] text-[#B91C1C] border-[#B91C1C]/20 hover:bg-[#fecaca]'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{selectedApp.status === 'REJECTED' ? 'Application Rejected' : 'Reject Application'}</span>
                    </button>
                  </div>
                </div>

                {/* Bio & Shared Profile Information */}
                <div className="space-y-3 text-xs">
                  <div>
                    <strong className="text-[#25232A] block mb-1">Personal Bio:</strong>
                    <p className="text-[#6B6870] bg-[#FBFAF8] p-3 rounded-lg border border-[#E8E3E8] italic leading-relaxed">
                      &ldquo;{selectedApp.volunteerBio}&rdquo;
                    </p>
                  </div>

                  <div>
                    <strong className="text-[#25232A] block mb-1">Causes &amp; Focus:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApp.volunteerCauses.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong className="text-[#25232A] block mb-1">Skills &amp; Capabilities:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApp.volunteerSkills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-[#F1E7F3] text-[#6D3A70] font-medium border border-[#E8E3E8]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#FAF5FA] text-[#8B8790]">
                    <div>
                      <strong className="text-[#25232A] block">Availability:</strong>
                      <span>{selectedApp.volunteerAvailability}</span>
                    </div>
                    <div>
                      <strong className="text-[#25232A] block">Languages:</strong>
                      <span>{selectedApp.volunteerLanguages.join(', ')}</span>
                    </div>
                  </div>

                  {selectedApp.volunteerExperience && (
                    <div className="pt-2 border-t border-[#FAF5FA]">
                      <strong className="text-[#25232A] block mb-0.5">Relevant Volunteering History:</strong>
                      <p className="text-[#6B6870]">{selectedApp.volunteerExperience}</p>
                    </div>
                  )}
                </div>

                {/* Candidate Answers to Custom Questions */}
                {selectedApp.answers && selectedApp.answers.length > 0 && (
                  <div className="pt-3 border-t border-[#FAF5FA] space-y-2">
                    <strong className="text-xs text-[#25232A] uppercase tracking-wider block">
                      Application Questions &amp; Answers:
                    </strong>
                    {selectedApp.answers.map((ans, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] text-xs">
                        <p className="font-semibold text-[#25232A] mb-1">Q: {ans.question}</p>
                        <p className="text-[#6B6870]">A: {ans.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Private NGO Notes */}
                <div className="pt-3 border-t border-[#FAF5FA]">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#6D3A70]" />
                    <span className="text-xs font-bold text-[#25232A]">Internal NGO Coordinator Notes</span>
                    <span className="text-[10px] text-[#8B8790]">(Never visible to the volunteer)</span>
                  </div>
                  <textarea
                    rows={3}
                    value={
                      notesState[selectedApp.id] !== undefined
                        ? notesState[selectedApp.id]
                        : selectedApp.ngoPrivateNotes || ''
                    }
                    onChange={(e) =>
                      setNotesState({ ...notesState, [selectedApp.id]: e.target.value })
                    }
                    placeholder="Private coordinator notes (e.g. assigned tasks, arrival instructions, team group)..."
                    className="w-full px-3 py-2 text-xs text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleSaveNote(selectedApp.id)}
                      className="px-3 py-1.5 text-xs font-medium text-[#6D3A70] bg-[#F1E7F3] border border-[#E8E3E8] rounded-lg hover:bg-[#ebdce9] cursor-pointer transition-colors"
                    >
                      Save Private Note
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E8E3E8] p-8 text-center shadow-xs">
                <Users className="w-8 h-8 text-[#8B8790] mx-auto mb-2" />
                <h4 className="text-xs font-bold text-[#25232A]">Select an Applicant</h4>
                <p className="text-[11px] text-[#8B8790] mt-1">
                  Choose an applicant from the list on the left to review their dossier and take an admission action.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
