'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useAuth } from '@/lib/auth-context';
import { useOnboarding } from '@/lib/onboarding-context';
import { useMarketplace } from '@/lib/marketplace-context';
import {
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  FileCheck,
  Building2,
  HelpCircle,
} from 'lucide-react';

interface OpportunityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { profile } = useAuth();
  const { volunteerProfile } = useOnboarding();
  const {
    getOpportunityById,
    isSaved,
    toggleSaveOpportunity,
    hasApplied,
    checkProfileCompleteness,
    submitApplication,
  } = useMarketplace();

  const opp = getOpportunityById(resolvedParams.id);
  const saved = opp ? isSaved(opp.id) : false;
  const applied = opp ? hasApplied(opp.id) : false;

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyStep, setApplyStep] = useState<'INCOMPLETE_NOTICE' | 'DATA_DISCLOSURE' | 'QUESTIONS' | 'SUCCESS'>('DATA_DISCLOSURE');
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!opp) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h2 className="text-base font-bold text-[#25232A]">Opportunity Not Found</h2>
          <Link href="/volunteer/opportunities" className="text-xs font-semibold text-[#6D3A70] hover:underline mt-2 inline-block">
            &larr; Back to Opportunities
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleToggleBookmark = () => {
    toggleSaveOpportunity(opp.id);
    setToastMessage(
      saved
        ? 'Removed from saved opportunities.'
        : 'Saved to your bookmarks. Note: Saving does not create an application.'
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInitiateApply = () => {
    // 1. Check profile completeness
    const check = checkProfileCompleteness();
    if (!check.isComplete) {
      setMissingFields(check.missingFields);
      setApplyStep('INCOMPLETE_NOTICE');
      setIsApplyModalOpen(true);
      return;
    }

    // 2. Show Data Disclosure Review
    setApplyStep('DATA_DISCLOSURE');
    setIsApplyModalOpen(true);
  };

  const handleProceedToQuestionsOrSubmit = () => {
    if (opp.applicationQuestions && opp.applicationQuestions.length > 0) {
      setApplyStep('QUESTIONS');
    } else {
      executeSubmission();
    }
  };

  const executeSubmission = () => {
    const formattedAnswers = (opp.applicationQuestions || []).map((q) => ({
      question: q,
      answer: questionAnswers[q] || 'No response provided',
    }));

    const res = submitApplication(opp.id, formattedAnswers);
    if (res.success) {
      setApplyStep('SUCCESS');
      setTimeout(() => {
        setIsApplyModalOpen(false);
        router.push('/volunteer/applications');
      }, 1800);
    }
  };

  const capacity = opp.volunteerCapacity || opp.capacityNeeded || 10;
  const percentFilled = Math.min(100, Math.round((opp.capacityFilled / capacity) * 100));

  return (
    <AppShell>
      <Link
        href="/volunteer/opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B8790] hover:text-[#25232A] mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Explore Opportunities</span>
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

      {/* Main Grid: Details & Side Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Comprehensive Opportunity Dossier (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Headline & Badges */}
          <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                {opp.cause}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1E7F3] text-[#6D3A70]">
                {opp.volunteeringMode}
              </span>
              <StatusBadge status={opp.isPublished ? 'open' : 'in_review'} size="sm" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#25232A] leading-tight mb-2">
              {opp.title}
            </h1>

            {/* Organizing NGO Card Snippet */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FBFAF8] border border-[#E8E3E8] mt-4">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-[#25232A]">{opp.ngoName}</h3>
                  {opp.ngoVerified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-[#15803D] font-semibold bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                      <span>Verified NGO</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8B8790] line-clamp-1 mt-0.5">
                  {opp.ngoDescription || 'Grassroots non-profit community partner.'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#E8E3E8] pb-2">
              Opportunity Description &amp; Scope
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6870] leading-relaxed whitespace-pre-line">
              {opp.description}
            </p>
          </div>

          {/* Responsibilities */}
          {opp.responsibilities && opp.responsibilities.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#E8E3E8] pb-2">
                Volunteer Responsibilities
              </h2>
              <ul className="space-y-2">
                {opp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-xs text-[#6B6870] flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6D3A70] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills & Preferred Experience */}
          <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#E8E3E8] pb-2">
              Capabilities &amp; Qualifications
            </h2>

            <div>
              <span className="text-xs font-semibold text-[#25232A] block mb-2">Required Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {(opp.requiredSkills || opp.skillsRequired || []).map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs rounded-lg font-medium bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {opp.preferredExperience && (
              <div>
                <span className="text-xs font-semibold text-[#25232A] block mb-1">
                  Preferred Experience:
                </span>
                <p className="text-xs text-[#8B8790] leading-relaxed">{opp.preferredExperience}</p>
              </div>
            )}

            {opp.eligibilityRequirements && (
              <div>
                <span className="text-xs font-semibold text-[#25232A] block mb-1">
                  Eligibility &amp; Age Requirements:
                </span>
                <p className="text-xs text-[#8B8790] leading-relaxed">{opp.eligibilityRequirements}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Action Sidebar & Logistics Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Box */}
          <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-[#25232A]">
                  {opp.capacityFilled} of {capacity} Filled
                </span>
                <span className="text-[10px] text-[#8B8790]">{percentFilled}% Capacity</span>
              </div>
              <div className="w-full h-2 bg-[#FAF5FA] rounded-full overflow-hidden">
                <div className="h-full bg-[#6D3A70] rounded-full" style={{ width: `${percentFilled}%` }} />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {applied ? (
                <div className="p-3 rounded-lg bg-[#FAF5FA] border border-[#E8E3E8] text-center">
                  <span className="text-xs font-bold text-[#6D3A70] block">Application Submitted</span>
                  <p className="text-[11px] text-[#8B8790] mt-0.5">Status: Pending NGO Review</p>
                  <Link
                    href="/volunteer/applications"
                    className="text-[11px] font-semibold text-[#6D3A70] underline mt-1.5 inline-block"
                  >
                    View My Applications
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleInitiateApply}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer text-center"
                >
                  Apply to Volunteer
                </button>
              )}

              <button
                type="button"
                onClick={handleToggleBookmark}
                className={`w-full py-2 px-4 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  saved
                    ? 'bg-[#FAF5FA] text-[#6D3A70] border-[#6D3A70]'
                    : 'bg-white text-[#6B6870] border-[#E8E3E8] hover:bg-[#FAF5FA]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                <span>{saved ? 'Saved in My Drives' : 'Save Drive (Bookmark)'}</span>
              </button>
            </div>
            <p className="text-[10px] text-[#8B8790] text-center leading-relaxed">
              Saving keeps this initiative bookmarked and will never create an application.
            </p>
          </div>

          {/* Schedule & Meeting Details */}
          <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-3.5 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#E8E3E8] pb-2">
              Date &amp; Logistics
            </h3>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#6D3A70] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#25232A] block">Service Date:</strong>
                <span className="text-[#6B6870]">{opp.date}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#6D3A70] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#25232A] block">Hours &amp; Duration:</strong>
                <span className="text-[#6B6870]">
                  {opp.startTime} - {opp.endTime} ({opp.duration})
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#6D3A70] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#25232A] block">Location:</strong>
                <span className="text-[#6B6870]">{opp.location}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8E3E8] text-[11px] text-[#8B8790]">
              Application Deadline: <strong className="text-[#25232A]">{opp.applicationDeadline}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* MULTI-STEP APPLY MODAL */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-[#25232A]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E8E3E8] max-w-lg w-full p-6 shadow-xl space-y-5">
            {/* Step A: Profile Incomplete Notice */}
            {applyStep === 'INCOMPLETE_NOTICE' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[#B45309]">
                  <AlertCircle className="w-5 h-5 text-[#B45309] shrink-0" />
                  <h3 className="text-sm font-bold">Volunteer Profile Incomplete</h3>
                </div>

                <p className="text-xs text-[#6B6870] leading-relaxed">
                  Non-profits require a completed volunteer profile to review candidate readiness, availability, and skills. Please complete the following missing fields before applying:
                </p>

                <div className="p-3 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-xs space-y-1">
                  {missingFields.map((field) => (
                    <div key={field} className="flex items-center gap-1.5 text-[#92400E] font-medium">
                      <span>&bull;</span>
                      <span>{field}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E3E8]">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-3.5 py-2 text-xs text-[#6B6870] hover:text-[#25232A] rounded-lg hover:bg-[#FAF5FA] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Link
                    href="/onboarding/volunteer"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
                  >
                    Complete Profile Now &rarr;
                  </Link>
                </div>
              </div>
            )}

            {/* Step B: Data Disclosure Review Screen */}
            {applyStep === 'DATA_DISCLOSURE' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-5 h-5 text-[#6D3A70] shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-[#25232A]">Review Shared Information</h3>
                    <p className="text-[11px] text-[#8B8790]">
                      The following profile credentials will be securely shared with {opp.ngoName}.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FBFAF8] border border-[#E8E3E8] text-xs space-y-2 text-[#6B6870]">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8E3E8]">
                    <span className="font-bold text-[#25232A]">
                      {volunteerProfile?.fullName || profile?.fullName}
                    </span>
                    <span className="text-[11px] text-[#8B8790]">
                      {volunteerProfile?.city || profile?.location}
                    </span>
                  </div>

                  <p className="italic text-[#8B8790]">
                    &ldquo;{volunteerProfile?.shortBio || profile?.bio}&rdquo;
                  </p>

                  <div className="pt-1 text-[11px] space-y-1">
                    <div>
                      <strong className="text-[#25232A]">Causes:</strong> {(volunteerProfile?.causes || profile?.causes || []).join(', ')}
                    </div>
                    <div>
                      <strong className="text-[#25232A]">Skills:</strong> {(volunteerProfile?.skills || ['General Volunteering']).join(', ')}
                    </div>
                    <div>
                      <strong className="text-[#25232A]">Availability:</strong> {(volunteerProfile?.availableDays || ['Weekends']).join(', ')}
                    </div>
                    <div>
                      <strong className="text-[#25232A]">Languages:</strong> {(volunteerProfile?.languages || ['English']).join(', ')}
                    </div>
                    {volunteerProfile?.previousExperience && (
                      <div>
                        <strong className="text-[#25232A]">Experience:</strong> {volunteerProfile.previousExperience}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E3E8]">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-3.5 py-2 text-xs text-[#6B6870] hover:text-[#25232A] rounded-lg hover:bg-[#FAF5FA] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToQuestionsOrSubmit}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs cursor-pointer transition-colors"
                  >
                    {opp.applicationQuestions && opp.applicationQuestions.length > 0
                      ? 'Proceed to Questions &rarr;'
                      : 'Submit Application (Pending)'}
                  </button>
                </div>
              </div>
            )}

            {/* Step C: Custom Application Questions */}
            {applyStep === 'QUESTIONS' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#6D3A70] shrink-0" />
                  <h3 className="text-sm font-bold text-[#25232A]">Organization Questions</h3>
                </div>

                <p className="text-xs text-[#8B8790]">
                  Please provide brief responses to the organizer&apos;s candidate questions:
                </p>

                <div className="space-y-3">
                  {(opp.applicationQuestions || []).map((q, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="block text-xs font-semibold text-[#25232A]">
                        {idx + 1}. {q}
                      </label>
                      <textarea
                        rows={2}
                        value={questionAnswers[q] || ''}
                        onChange={(e) =>
                          setQuestionAnswers({ ...questionAnswers, [q]: e.target.value })
                        }
                        placeholder="Your answer..."
                        className="w-full px-3 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E3E8]">
                  <button
                    type="button"
                    onClick={() => setApplyStep('DATA_DISCLOSURE')}
                    className="px-3.5 py-2 text-xs text-[#6B6870] hover:text-[#25232A] rounded-lg hover:bg-[#FAF5FA] transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={executeSubmission}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs cursor-pointer transition-colors"
                  >
                    Submit as PENDING
                  </button>
                </div>
              </div>
            )}

            {/* Step D: Submission Confirmation */}
            {applyStep === 'SUCCESS' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#25232A]">Application Submitted as PENDING!</h3>
                <p className="text-xs text-[#8B8790] max-w-sm mx-auto leading-relaxed">
                  Your credentials and answers have been shared with {opp.ngoName}. You will receive an in-app notification once the coordinator reviews your application.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
