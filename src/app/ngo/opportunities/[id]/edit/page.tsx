'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { opportunityFormSchema, OpportunityFormData } from '@/lib/schemas/opportunity';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { useMarketplace } from '@/lib/marketplace-context';
import { CAUSE_OPTIONS } from '@/lib/mock-data';
import {
  ArrowLeft,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface EditOpportunityPageProps {
  params: Promise<{ id: string }>;
}

export default function EditOpportunityPage({ params }: EditOpportunityPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { getOpportunityById, updateOpportunity } = useMarketplace();

  const opp = getOpportunityById(resolvedParams.id);
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunityFormSchema),
  });

  useEffect(() => {
    if (opp) {
      reset({
        title: opp.title,
        cause: opp.cause,
        description: opp.description,
        responsibilities: opp.responsibilities || [],
        requiredSkills: opp.requiredSkills || [],
        preferredExperience: opp.preferredExperience || '',
        location: opp.location,
        date: opp.date,
        startTime: opp.startTime,
        endTime: opp.endTime,
        duration: opp.duration,
        volunteerCapacity: opp.volunteerCapacity,
        applicationDeadline: opp.applicationDeadline,
        eligibilityRequirements: opp.eligibilityRequirements || '',
        volunteeringMode: opp.volunteeringMode,
        applicationQuestions: opp.applicationQuestions || [],
        visibility: opp.visibility || 'PUBLIC',
        isPublished: opp.isPublished,
      });
    }
  }, [opp, reset]);

  const responsibilities = watch('responsibilities') || [];
  const requiredSkills = watch('requiredSkills') || [];
  const applicationQuestions = watch('applicationQuestions') || [];

  if (!opp) {
    return (
      <AppShell>
        <div className="py-12 text-center">
          <h2 className="text-base font-bold text-[#25232A]">Opportunity Not Found</h2>
          <p className="text-xs text-[#8B8790] mt-1 mb-4">
            The volunteering opportunity you requested could not be located.
          </p>
          <Link href="/ngo/opportunities" className="text-xs font-semibold text-[#6D3A70] hover:underline">
            &larr; Return to Opportunities
          </Link>
        </div>
      </AppShell>
    );
  }

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
    updateOpportunity(opp.id, data);
    setIsSuccess(true);
    setTimeout(() => {
      router.push('/ngo/opportunities');
    }, 1200);
  };

  return (
    <AppShell>
      <Link
        href="/ngo/opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6870] hover:text-[#25232A] mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Opportunities</span>
      </Link>

      <PageHeader
        title="Edit Volunteering Opportunity"
        description={`Modify parameters, dates, capacity, or questions for "${opp.title}".`}
      />

      {isSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-[#DCFCE7] border border-[#15803D]/20 text-[#15803D] text-xs font-medium flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
          <span>Opportunity updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#FAF5FA] pb-2">
            1. Initiative Overview
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#25232A] mb-1">
              Opportunity Title <span className="text-[#B91C1C]">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
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
              className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
            {errors.description && <p className="mt-1 text-xs text-[#B91C1C]">{errors.description.message}</p>}
          </div>
        </div>

        {/* Responsibilities & Skills */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#FAF5FA] pb-2">
            2. Volunteer Roles &amp; Capabilities
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#25232A] mb-1">
              Volunteer Responsibilities <span className="text-[#B91C1C]">*</span>
            </label>
            <div className="space-y-1.5 mb-2">
              {responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF5FA] border border-[#E8E3E8] text-xs">
                  <span className="text-[#25232A]">{resp}</span>
                  <button type="button" onClick={() => handleRemoveResponsibility(idx)} className="text-[#8B8790] hover:text-[#B91C1C] transition-colors">
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
                placeholder="Add responsibility..."
                className="flex-1 px-3 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="px-3 py-1.5 text-xs font-medium text-[#6D3A70] border border-[#E8E3E8] bg-[#F1E7F3] rounded-lg hover:bg-[#ebdce9] transition-colors cursor-pointer"
              >
                + Add Task
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#25232A] mb-1">
              Required Skills <span className="text-[#B91C1C]">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {requiredSkills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#F1E7F3] text-[#6D3A70] border border-[#E8E3E8]">
                  <span>{skill}</span>
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-[#B91C1C] transition-colors ml-1">
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
                placeholder="Add skill..."
                className="flex-1 px-3 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 text-xs font-medium text-[#6D3A70] border border-[#E8E3E8] bg-[#F1E7F3] rounded-lg hover:bg-[#ebdce9] transition-colors cursor-pointer"
              >
                + Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* Schedule & Capacity */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#FAF5FA] pb-2">
            3. Logistics &amp; Capacity
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#25232A] mb-1">
              Location or Meeting Point <span className="text-[#B91C1C]">*</span>
            </label>
            <input
              type="text"
              {...register('location')}
              className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">Service Date</label>
              <input
                type="text"
                {...register('date')}
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">Start Time</label>
              <input
                type="text"
                {...register('startTime')}
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">End Time</label>
              <input
                type="text"
                {...register('endTime')}
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">Duration</label>
              <input
                type="text"
                {...register('duration')}
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
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
                min={opp.capacityFilled}
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Application Deadline <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                type="text"
                {...register('applicationDeadline')}
                className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
            </div>
          </div>
        </div>

        {/* Custom Application Questions */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] border-b border-[#FAF5FA] pb-2">
            4. Application Questions
          </h3>

          <div className="space-y-2">
            {applicationQuestions.map((q, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF5FA] border border-[#E8E3E8] text-xs">
                <span className="text-[#25232A]">Q{idx + 1}: {q}</span>
                <button type="button" onClick={() => handleRemoveQuestion(idx)} className="text-[#8B8790] hover:text-[#B91C1C] transition-colors">
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
              placeholder="Add question..."
              className="flex-1 px-3 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
            />
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3 py-1.5 text-xs font-medium text-[#6D3A70] border border-[#E8E3E8] bg-[#F1E7F3] rounded-lg hover:bg-[#ebdce9] transition-colors cursor-pointer"
            >
              + Add Question
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E3E8] shadow-xs flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#25232A] cursor-pointer">
            <input
              type="checkbox"
              {...register('isPublished')}
              className="w-4 h-4 text-[#6D3A70] rounded border-[#E8E3E8] focus:ring-[#A85AAA]"
            />
            <span>Published to marketplace</span>
          </label>

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
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Update Opportunity'}
            </button>
          </div>
        </div>
      </form>
    </AppShell>
  );
}
