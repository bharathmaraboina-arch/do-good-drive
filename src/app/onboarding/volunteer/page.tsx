'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  volunteerOnboardingSchema,
  VolunteerOnboardingFormData,
} from '@/lib/schemas/onboarding';
import { useOnboarding } from '@/lib/onboarding-context';
import { StepProgress, StepItem } from '@/components/shared/StepProgress';
import { CAUSE_OPTIONS } from '@/lib/mock-data';
import {
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';

const VOLUNTEER_STEPS: StepItem[] = [
  { number: 1, title: 'Identity & Location', description: 'Photo, name, city & bio' },
  { number: 2, title: 'Causes & Skills', description: 'Areas of impact and talents' },
  { number: 3, title: 'Availability', description: 'Days, times & formats' },
  { number: 4, title: 'Background', description: 'Languages & experience' },
  { number: 5, title: 'Review & Confirm', description: 'Finalize your profile' },
];

const POPULAR_SKILLS = [
  'Event Logistics',
  'Teaching & Mentorship',
  'Tree Planting & Conservation',
  'Safe Food Handling',
  'Software / Web Development',
  'Graphic Design',
  'First Aid / CPR',
  'Public Speaking',
  'Translation & Interpretation',
  'Accounting & Bookkeeping',
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = ['Morning (8am - 12pm)', 'Afternoon (12pm - 5pm)', 'Evening (5pm - 9pm)', 'Flexible'];

export default function VolunteerOnboardingPage() {
  const router = useRouter();
  const { volunteerProfile, saveVolunteerProfile } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customLangInput, setCustomLangInput] = useState('');
  const [isSubmittingSuccess, setIsSubmittingSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<VolunteerOnboardingFormData>({
    resolver: zodResolver(volunteerOnboardingSchema),
    defaultValues: {
      fullName: volunteerProfile?.fullName || 'Sarah Jenkins',
      avatarUrl: volunteerProfile?.avatarUrl || '',
      city: volunteerProfile?.city || 'Seattle',
      state: volunteerProfile?.state || 'WA',
      country: volunteerProfile?.country || 'United States',
      shortBio:
        volunteerProfile?.shortBio ||
        'Environmental educator and community organizer passionate about urban sustainability and student mentoring.',
      causes: volunteerProfile?.causes || ['Environment', 'Education'],
      skills: volunteerProfile?.skills || ['Tree Planting & Conservation', 'Event Logistics'],
      availableDays: volunteerProfile?.availableDays || ['Saturday', 'Sunday'],
      availableTimes: volunteerProfile?.availableTimes || ['Morning (8am - 12pm)'],
      frequency: volunteerProfile?.frequency || 'Weekly',
      volunteeringPreference: volunteerProfile?.volunteeringPreference || 'HYBRID',
      languages: volunteerProfile?.languages || ['English', 'Spanish'],
      previousExperience: volunteerProfile?.previousExperience || '3 years organizing community park cleanups and riverbank plantings.',
      companyName: volunteerProfile?.companyName || '',
    },
  });

  const selectedCauses = watch('causes') || [];
  const selectedSkills = watch('skills') || [];
  const selectedDays = watch('availableDays') || [];
  const selectedTimes = watch('availableTimes') || [];
  const selectedLanguages = watch('languages') || [];
  const selectedPreference = watch('volunteeringPreference');

  // Toggle helper
  const toggleItem = (list: string[], item: string, field: 'causes' | 'skills' | 'availableDays' | 'availableTimes' | 'languages') => {
    let next: string[];
    if (list.includes(item)) {
      next = list.filter((i) => i !== item);
    } else {
      next = [...list, item];
    }
    if (next.length === 0 && (field === 'causes' || field === 'skills' || field === 'availableDays' || field === 'availableTimes' || field === 'languages')) {
      next = [item];
    }
    setValue(field, next, { shouldValidate: true });
  };

  const handleAddCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setValue('skills', [...selectedSkills, customSkillInput.trim()], { shouldValidate: true });
      setCustomSkillInput('');
    }
  };

  const handleAddCustomLanguage = () => {
    if (customLangInput.trim() && !selectedLanguages.includes(customLangInput.trim())) {
      setValue('languages', [...selectedLanguages, customLangInput.trim()], { shouldValidate: true });
      setCustomLangInput('');
    }
  };

  const validateStep = async (step: number) => {
    switch (step) {
      case 1:
        return await trigger(['fullName', 'city', 'state', 'country', 'shortBio']);
      case 2:
        return await trigger(['causes', 'skills']);
      case 3:
        return await trigger(['availableDays', 'availableTimes', 'frequency', 'volunteeringPreference']);
      case 4:
        return await trigger(['languages']);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, VOLUNTEER_STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: VolunteerOnboardingFormData) => {
    saveVolunteerProfile({
      ...data,
      location: `${data.city}, ${data.state}, ${data.country}`,
    });

    setIsSubmittingSuccess(true);
    setTimeout(() => {
      router.push('/volunteer/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF8] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#6D3A70] text-white flex items-center justify-center shadow-xs group-hover:bg-[#552C59] transition-colors">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#25232A]">
              Do Good Drive Marketplace
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#25232A]">
            Volunteer Profile Onboarding
          </h1>
          <p className="text-xs sm:text-sm text-[#8B8790] mt-1">
            Complete your profile to unlock matched community drives, skills alignment, and verified impact logging.
          </p>
        </div>

        {/* Step Progress Stepper */}
        <StepProgress steps={VOLUNTEER_STEPS} currentStep={currentStep} />

        {isSubmittingSuccess ? (
          <div className="bg-white p-8 rounded-xl border border-[#E8E3E8] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#25232A]">Volunteer Profile Completed!</h2>
            <p className="text-xs text-[#8B8790] mt-1">
              Redirecting you to your personalized Community Home Feed...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-[#E8E3E8] shadow-xs p-6 sm:p-8">
            {/* STEP 1: IDENTITY & LOCATION */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Personal Information &amp; Bio</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    How non-profits and volunteer coordinators will recognize you.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Full Name <span className="text-[#B91C1C]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-[#B91C1C]">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Profile Photo / Avatar URL (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('avatarUrl')}
                    placeholder="https://example.org/avatar.jpg"
                    className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#25232A] mb-1">
                      City <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="e.g. Seattle"
                      className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    />
                    {errors.city && <p className="mt-1 text-xs text-[#B91C1C]">{errors.city.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#25232A] mb-1">
                      State / Province <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('state')}
                      placeholder="e.g. WA"
                      className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    />
                    {errors.state && <p className="mt-1 text-xs text-[#B91C1C]">{errors.state.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#25232A] mb-1">
                      Country <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('country')}
                      placeholder="e.g. United States"
                      className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    />
                    {errors.country && <p className="mt-1 text-xs text-[#B91C1C]">{errors.country.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Short Bio &amp; Volunteering Motivation <span className="text-[#B91C1C]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    {...register('shortBio')}
                    placeholder="Briefly introduce your background and what inspires you to volunteer..."
                    className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                  {errors.shortBio && <p className="mt-1 text-xs text-[#B91C1C]">{errors.shortBio.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 2: CAUSES & SKILLS */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Causes &amp; Skills</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Select your focus causes and volunteer capabilities.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-2">
                    Primary Causes of Interest <span className="text-[#B91C1C]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CAUSE_OPTIONS.filter((c) => c !== 'All Causes').map((cause) => {
                      const isSelected = selectedCauses.includes(cause);
                      return (
                        <button
                          key={cause}
                          type="button"
                          onClick={() => toggleItem(selectedCauses, cause, 'causes')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAF5FA] text-[#6D3A70] border-[#6D3A70] font-semibold'
                              : 'bg-[#FBFAF8] text-[#6B6870] border-[#E8E3E8] hover:border-[#6D3A70]/40'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {cause}
                        </button>
                      );
                    })}
                  </div>
                  {errors.causes && <p className="mt-1.5 text-xs text-[#B91C1C]">{errors.causes.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-2">
                    Volunteer Skills &amp; Capabilities <span className="text-[#B91C1C]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {POPULAR_SKILLS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleItem(selectedSkills, skill, 'skills')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAF5FA] text-[#6D3A70] border-[#6D3A70] font-semibold'
                              : 'bg-[#FBFAF8] text-[#6B6870] border-[#E8E3E8] hover:border-[#6D3A70]/40'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {skill}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomSkill();
                        }
                      }}
                      placeholder="Add custom skill (e.g. Wilderness First Aid)..."
                      className="flex-1 px-3 py-1.5 text-xs text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSkill}
                      className="px-3 py-1.5 text-xs font-medium text-[#6D3A70] border border-[#E8E3E8] bg-[#FAF5FA] hover:bg-[#F1E7F3] rounded-lg transition-colors cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                  {errors.skills && <p className="mt-1.5 text-xs text-[#B91C1C]">{errors.skills.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 3: AVAILABILITY & PREFERENCES */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Availability &amp; Schedule</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Help non-profits schedule shifts that respect your calendar.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-2">
                    Available Days of the Week <span className="text-[#B91C1C]">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleItem(selectedDays, day, 'availableDays')}
                          className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAF5FA] text-[#6D3A70] border-[#6D3A70] font-bold'
                              : 'bg-[#FBFAF8] text-[#6B6870] border-[#E8E3E8] hover:border-[#6D3A70]/40'
                          }`}
                        >
                          {isSelected ? '✓ ' : ''}
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  {errors.availableDays && <p className="mt-1 text-xs text-[#B91C1C]">{errors.availableDays.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-2">
                    Preferred Times of Day <span className="text-[#B91C1C]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TIME_SLOTS.map((time) => {
                      const isSelected = selectedTimes.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => toggleItem(selectedTimes, time, 'availableTimes')}
                          className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAF5FA] text-[#6D3A70] border-[#6D3A70] font-bold'
                              : 'bg-[#FBFAF8] text-[#6B6870] border-[#E8E3E8] hover:border-[#6D3A70]/40'
                          }`}
                        >
                          {isSelected ? '✓ ' : ''}
                          {time}
                        </button>
                      );
                    })}
                  </div>
                  {errors.availableTimes && <p className="mt-1 text-xs text-[#B91C1C]">{errors.availableTimes.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#25232A] mb-1">
                      Frequency Preference <span className="text-[#B91C1C]">*</span>
                    </label>
                    <select
                      {...register('frequency')}
                      className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    >
                      <option value="Weekly">Weekly (Regular Shifts)</option>
                      <option value="Bi-weekly">Bi-weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Occasional">Occasional / Single Events</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#25232A] mb-1">
                      Location Format Preference <span className="text-[#B91C1C]">*</span>
                    </label>
                    <select
                      {...register('volunteeringPreference')}
                      className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    >
                      <option value="HYBRID">Hybrid (Both In-Person &amp; Remote)</option>
                      <option value="ON_SITE">On-Site Only</option>
                      <option value="REMOTE">Remote / Digital Only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: BACKGROUND & EXPERIENCE */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Languages &amp; Background</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Additional context to help match bilingual and skill-specific initiatives.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-2">
                    Languages Spoken <span className="text-[#B91C1C]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Hindi', 'American Sign Language'].map((lang) => {
                      const isSelected = selectedLanguages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleItem(selectedLanguages, lang, 'languages')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAF5FA] text-[#6D3A70] border-[#6D3A70] font-semibold'
                              : 'bg-[#FBFAF8] text-[#6B6870] border-[#E8E3E8] hover:border-[#6D3A70]/40'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {lang}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customLangInput}
                      onChange={(e) => setCustomLangInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomLanguage();
                        }
                      }}
                      placeholder="Add another language..."
                      className="flex-1 px-3 py-1.5 text-xs text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomLanguage}
                      className="px-3 py-1.5 text-xs font-medium text-[#6D3A70] border border-[#E8E3E8] bg-[#FAF5FA] hover:bg-[#F1E7F3] rounded-lg transition-colors cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                  {errors.languages && <p className="mt-1 text-xs text-[#B91C1C]">{errors.languages.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Previous Volunteering Experience (Optional)
                  </label>
                  <textarea
                    rows={3}
                    {...register('previousExperience')}
                    placeholder="e.g. Previous non-profit roles, certifications, or projects..."
                    className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Employer or Company Name (Optional)
                  </label>
                  <p className="text-[11px] text-[#8B8790] mb-1.5">
                    If your employer offers corporate volunteer grant matching or volunteer time off (VTO).
                  </p>
                  <input
                    type="text"
                    {...register('companyName')}
                    placeholder="e.g. Apex Capital Advisors"
                    className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & CONFIRM */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Review Profile Summary</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Please verify your information before publishing your volunteer profile.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FBFAF8] border border-[#E8E3E8] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#25232A]">{watch('fullName')}</h3>
                      <p className="text-xs text-[#8B8790]">
                        {watch('city')}, {watch('state')}, {watch('country')}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6D3A70] text-xs font-medium border border-[#E8E3E8]">
                      Preference: {selectedPreference}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B6870] leading-relaxed italic">
                    &ldquo;{watch('shortBio')}&rdquo;
                  </p>

                  <div className="pt-2 border-t border-[#E8E3E8]">
                    <span className="text-xs font-semibold text-[#25232A] block mb-1.5">Causes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCauses.map((c) => (
                        <span key={c} className="px-2 py-0.5 text-xs rounded bg-white border border-[#E8E3E8] text-[#6B6870]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8E3E8]">
                    <span className="text-xs font-semibold text-[#25232A] block mb-1.5">Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSkills.map((s) => (
                        <span key={s} className="px-2 py-0.5 text-xs rounded bg-white border border-[#E8E3E8] text-[#6B6870]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8E3E8] text-xs text-[#8B8790] grid grid-cols-2 gap-2">
                    <div>
                      <strong className="text-[#25232A]">Available:</strong> {selectedDays.join(', ')}
                    </div>
                    <div>
                      <strong className="text-[#25232A]">Times:</strong> {selectedTimes.join(', ')}
                    </div>
                    <div>
                      <strong className="text-[#25232A]">Languages:</strong> {selectedLanguages.join(', ')}
                    </div>
                    <div>
                      <strong className="text-[#25232A]">Frequency:</strong> {watch('frequency')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Nav Controls */}
            <div className="mt-8 pt-5 border-t border-[#E8E3E8] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#6B6870] hover:text-[#25232A] rounded-lg hover:bg-[#FAF5FA] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <Link
                  href="/choose-role"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8B8790] hover:text-[#25232A] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Role</span>
                </Link>
              )}

              {currentStep < VOLUNTEER_STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <span>Finalize &amp; Go to Community Feed</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
