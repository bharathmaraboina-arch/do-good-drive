'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { opportunityFormSchema, OpportunityFormData } from '@/lib/schemas/opportunity';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useAuth } from '@/lib/auth-context';
import { useOnboarding } from '@/lib/onboarding-context';
import { useMarketplace } from '@/lib/marketplace-context';
import { CAUSE_OPTIONS } from '@/lib/mock-data';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
} from 'lucide-react';

export default function NewOpportunityPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const { verifications } = useOnboarding();
  const { createOpportunity } = useMarketplace();

  const currentNgoId = profile?.id === 'ngo-demo-1' ? 'ngo-1' : profile?.id || 'ngo-1';
  const verifRecord = verifications.find(
    (v) => v.id.includes(currentNgoId) || v.name.toLowerCase().includes('greencanopy')
  );
  const isVerified = verifRecord ? verifRecord.status === 'VERIFIED' : profile?.verified === true;

  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ text: string; isWarning?: boolean } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: {
      title: '',
      cause: 'Environment',
      description: '',
      responsibilities: ['Support on-site field team and distribute tools'],
      requiredSkills: ['Teamwork', 'Reliability'],
      preferredExperience: '',
      location: 'Community Park, Portland, OR',
      date: '2026-10-04',
      startTime: '09:00 AM',
      endTime: '01:00 PM',
      duration: '4 Hours',
      volunteerCapacity: 15,
      applicationDeadline: '2026-10-01',
      eligibilityRequirements: 'Ages 16+ or accompanied by an adult guardian.',
      volunteeringMode: 'ON_SITE',
      applicationQuestions: ['Do you have any dietary restrictions or physical limitations?'],
      visibility: 'PUBLIC',
      isPublished: isVerified,
    },
  });

  const responsibilities = watch('responsibilities') || [];
  const requiredSkills = watch('requiredSkills') || [];
  const applicationQuestions = watch('applicationQuestions') || [];

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim() && !responsibilities.includes(responsibilityInput.trim())) {
      setValue('responsibilities', [...responsibilities, responsibilityInput.trim()], { shouldValidate: true });
      setResponsibilityInput('');
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    setValue('responsibilities', responsibilities.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setValue('requiredSkills', [...requiredSkills, skillInput.trim()], { shouldValidate: true });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setValue('requiredSkills', requiredSkills.filter((s) => s !== skill), { shouldValidate: true });
  };

  const handleAddQuestion = () => {
    if (questionInput.trim() && !applicationQuestions.includes(questionInput.trim())) {
      setValue('applicationQuestions', [...applicationQuestions, questionInput.trim()], { shouldValidate: true });
      setQuestionInput('');
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setValue('applicationQuestions', applicationQuestions.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const onSubmit = (data: OpportunityFormData) => {
    const res = createOpportunity(data);
    if (!res.published && res.message) {
      setResultMessage({ text: res.message, isWarning: true });
    } else {
      setResultMessage({ text: 'Opportunity created successfully!', isWarning: false });
    }

    setTimeout(() => {
      router.push('/ngo/opportunities');
    }, 1800);
  };

  return (
    <AppShell>
      <Link
        href="/ngo/opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B8790] hover:text-[#25232A] mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Opportunities</span>
      </Link>

      <PageHeader
        title="Post a Volunteering Opportunity"
        description="Detail your initiative's schedule, required volunteer skills, capacity, and custom application questions."
        actions={
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#6D3A70] bg-[#FAF5FA] border border-[#E8E3E8] rounded-lg hover:bg-[#F1E7F3] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPreview ? 'Hide Preview' : 'Preview Opportunity'}</span>
          </button>
        }
      />

      {/* Verification Warning if NGO is not verified */}
      {!isVerified && (
        <div className="mb-6 p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs shadow-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
          <div>
            <strong>Organization Verification Pending:</strong> You can create and draft this drive now. However, <strong>only verified organizations can publish opportunities</strong> to the public volunteer marketplace. This drive will be saved as a Draft until verification is approved.
          </div>
        </div>
      )}

      {resultMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-medium flex items-center gap-2 shadow-xs ${
            resultMessage.isWarning
              ? 'bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]'
              : 'bg-[#DCFCE7] border border-[#15803D]/20 text-[#15803D]'
          }`}
        >
          {resultMessage.isWarning ? (
            <AlertCircle className="w-4 h-4 text-[#B45309] shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
          )}
          <span>{resultMessage.text}</span>
        </div>
      )}

      {/* Optional Live Preview Card */}
      {showPreview && (
        <div className="mb-8 p-5 rounded-xl border border-[#6D3A70] bg-[#FBFAF8] shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#6D3A70] tracking-wider">
              Volunteer Opportunity Preview
            </span>
            <StatusBadge status={watch('isPublished') && isVerified ? 'open' : 'in_review'} size="sm" />
          </div>
          <h2 className="text-lg font-bold text-[#25232A]">{watch('title') || 'Untitled Opportunity'}</h2>
          <p className="text-xs text-[#6B6870] mt-1 leading-relaxed">{watch('description') || 'No description provided yet.'}</p>
          <div className="flex items-center gap-3 text-xs text-[#8B8790] mt-3 flex-wrap">
            <span>📅 {watch('date')} ({watch('startTime')} - {watch('endTime')})</span>
            <span>📍 {watch('location')}</span>
            <span>⏱️ {watch('duration')}</span>
            <span>👥 {watch('volunteerCapacity')} Capacity</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Core Opportunity Information */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#E8E3E8] pb-2">
            1. Initiative Overview
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#25232A] mb-1">
              Opportunity Title <span className="text-[#B91C1C]">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Community Forest Trail Revegetation & Mulching Drive"
              className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
            {errors.title && <p className="mt-1 text-xs text-[#B91C1C]">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Primary Cause <span className="text-[#B91C1C]">*</span>
              </label>
              <select
                {...register('cause')}
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              >
                {CAUSE_OPTIONS.filter((c) => c !== 'All Causes').map((cause) => (
                  <option key={cause} value={cause}>
                    {cause}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Volunteering Mode <span className="text-[#B91C1C]">*</span>
              </label>
              <select
                {...register('volunteeringMode')}
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              >
                <option value="ON_SITE">On-Site (In Person)</option>
                <option value="REMOTE">Remote (Virtual)</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#25232A] mb-1">
              Detailed Description <span className="text-[#B91C1C]">*</span>
            </label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Detail the purpose of the initiative, why it matters, and what volunteers will accomplish..."
              className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
            {errors.description && <p className="mt-1 text-xs text-[#B91C1C]">{errors.description.message}</p>}
          </div>
        </div>

        {/* Responsibilities & Skills */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#E8E3E8] pb-2">
            2. Volunteer Roles &amp; Capabilities
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#25232A] mb-1">
              Volunteer Responsibilities <span className="text-[#B91C1C]">*</span>
            </label>
            <div className="space-y-1.5 mb-2">
              {responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] text-xs">
                  <span className="text-[#25232A]">{resp}</span>
                  <button type="button" onClick={() => handleRemoveResponsibility(idx)} className="text-[#8B8790] hover:text-[#B91C1C] cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddResponsibility();
                  }
                }}
                placeholder="Add a specific task or responsibility..."
                className="flex-1 px-3 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="px-3 py-1.5 text-xs font-medium text-[#6D3A70] border border-[#E8E3E8] bg-[#FAF5FA] hover:bg-[#F1E7F3] rounded-lg transition-colors cursor-pointer"
              >
                + Add Task
              </button>
            </div>
            {errors.responsibilities && <p className="mt-1 text-xs text-[#B91C1C]">{errors.responsibilities.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#25232A] mb-1">
              Required Skills <span className="text-[#B91C1C]">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {requiredSkills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]">
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-[#B91C1C] cursor-pointer">
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add required skill (e.g. CPR Certified, First Aid, Planting)..."
                className="flex-1 px-3 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 text-xs font-medium text-[#6D3A70] border border-[#E8E3E8] bg-[#FAF5FA] hover:bg-[#F1E7F3] rounded-lg transition-colors cursor-pointer"
              >
                + Add Skill
              </button>
            </div>
            {errors.requiredSkills && <p className="mt-1 text-xs text-[#B91C1C]">{errors.requiredSkills.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#25232A] mb-1">
              Preferred Experience (Optional)
            </label>
            <input
              type="text"
              {...register('preferredExperience')}
              placeholder="e.g. Previous trail maintenance or gardening experience helpful."
              className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
          </div>
        </div>

        {/* Schedule & Capacity */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#E8E3E8] pb-2">
            3. Logistics &amp; Capacity
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#25232A] mb-1">
              Location or Meeting Point <span className="text-[#B91C1C]">*</span>
            </label>
            <input
              type="text"
              {...register('location')}
              placeholder="e.g. Tryon Creek State Natural Area, 11321 SW Terwilliger Blvd, Portland, OR"
              className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
            {errors.location && <p className="mt-1 text-xs text-[#B91C1C]">{errors.location.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Service Date <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                type="text"
                {...register('date')}
                placeholder="2026-10-04"
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.date && <p className="mt-1 text-xs text-[#B91C1C]">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Start Time <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                type="text"
                {...register('startTime')}
                placeholder="09:00 AM"
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.startTime && <p className="mt-1 text-xs text-[#B91C1C]">{errors.startTime.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                End Time <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                type="text"
                {...register('endTime')}
                placeholder="01:00 PM"
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.endTime && <p className="mt-1 text-xs text-[#B91C1C]">{errors.endTime.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Duration <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                type="text"
                {...register('duration')}
                placeholder="4 Hours"
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.duration && <p className="mt-1 text-xs text-[#B91C1C]">{errors.duration.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Volunteer Capacity <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                type="number"
                {...register('volunteerCapacity', { valueAsNumber: true })}
                min={1}
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.volunteerCapacity && <p className="mt-1 text-xs text-[#B91C1C]">{errors.volunteerCapacity.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Application Deadline <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                type="text"
                {...register('applicationDeadline')}
                placeholder="2026-10-01"
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.applicationDeadline && <p className="mt-1 text-xs text-[#B91C1C]">{errors.applicationDeadline.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#25232A] mb-1">
              Eligibility &amp; Age Requirements (Optional)
            </label>
            <input
              type="text"
              {...register('eligibilityRequirements')}
              placeholder="e.g. Ages 16+ welcome. Minors must bring signed waiver."
              className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
          </div>
        </div>

        {/* Custom Application Questions */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#E8E3E8] pb-2">
            4. Application Questions (Optional)
          </h3>
          <p className="text-xs text-[#8B8790]">
            Volunteers will be asked to answer these questions when submitting their application.
          </p>

          <div className="space-y-2">
            {applicationQuestions.map((q, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] text-xs">
                <span className="text-[#25232A]">Q{idx + 1}: {q}</span>
                <button type="button" onClick={() => handleRemoveQuestion(idx)} className="text-[#8B8790] hover:text-[#B91C1C] cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddQuestion();
                }
              }}
              placeholder="e.g. Do you have access to personal transportation for remote field sites?"
              className="flex-1 px-3 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3 py-1.5 text-xs font-medium text-[#6D3A70] border border-[#E8E3E8] bg-[#FAF5FA] hover:bg-[#F1E7F3] rounded-lg transition-colors cursor-pointer"
            >
              + Add Question
            </button>
          </div>
        </div>

        {/* Publishing & Visibility Controls */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#25232A] cursor-pointer">
              <input
                type="checkbox"
                {...register('isPublished')}
                className="w-4 h-4 text-[#6D3A70] rounded border-[#E8E3E8] focus:ring-[#A85AAA]"
              />
              <span>Publish immediately to marketplace (Requires Verified NGO)</span>
            </label>
            <p className="text-[11px] text-[#8B8790] ml-6">
              If unchecked or if your NGO is pending verification, this will save as a Draft.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ngo/opportunities"
              className="px-4 py-2 text-xs font-medium text-[#6B6870] hover:text-[#25232A] rounded-lg hover:bg-[#FAF5FA] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Opportunity'}
            </button>
          </div>
        </div>
      </form>
    </AppShell>
  );
}
