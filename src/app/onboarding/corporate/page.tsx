'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  corporateOnboardingSchema,
  CorporateOnboardingFormData,
} from '@/lib/schemas/onboarding';
import { useOnboarding } from '@/lib/onboarding-context';
import { StepProgress, StepItem } from '@/components/shared/StepProgress';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CAUSE_OPTIONS } from '@/lib/mock-data';
import {
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const CORPORATE_STEPS: StepItem[] = [
  { number: 1, title: 'Enterprise Identity', description: 'Company overview & mission' },
  { number: 2, title: 'Locations & CSR Focus', description: 'Focus causes and operating hubs' },
  { number: 3, title: 'CSR Administration', description: 'Contact & authorized administrator' },
  { number: 4, title: 'Review & Submit', description: 'Submit for verification' },
];

export default function CorporateOnboardingPage() {
  const router = useRouter();
  const { corporateProfile, submitCorporateOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [locationInput, setLocationInput] = useState('');
  const [isSubmittingSuccess, setIsSubmittingSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CorporateOnboardingFormData>({
    resolver: zodResolver(corporateOnboardingSchema),
    defaultValues: {
      companyName: corporateProfile?.companyName || 'Meridian Health & Technology',
      logoUrl: corporateProfile?.logoUrl || '',
      description:
        corporateProfile?.description ||
        'Enterprise healthcare software provider dedicated to accelerating public health equity and clean community air initiatives.',
      website: corporateProfile?.website || 'https://meridianhealth.example.com',
      locations: corporateProfile?.locations || ['Denver, CO', 'Austin, TX'],
      csrFocusAreas: corporateProfile?.csrFocusAreas || ['Healthcare & Mental Wellbeing', 'Environment'],
      csrEmail: corporateProfile?.csrContact.email || 'csr@meridianhealth.example.com',
      csrPhone: corporateProfile?.csrContact.phone || '+1 (303) 555-9100',
      adminFullName: corporateProfile?.authorizedAdministrator.fullName || 'Jordan Miller',
      adminTitle: corporateProfile?.authorizedAdministrator.title || 'Director of Social Impact',
      adminEmail: corporateProfile?.authorizedAdministrator.email || 'jordan.miller@meridianhealth.example.com',
    },
  });

  const selectedFocusAreas = watch('csrFocusAreas') || [];
  const selectedLocations = watch('locations') || [];

  const toggleFocusArea = (cause: string) => {
    let next: string[];
    if (selectedFocusAreas.includes(cause)) {
      next = selectedFocusAreas.filter((c) => c !== cause);
    } else {
      next = [...selectedFocusAreas, cause];
    }
    if (next.length === 0) next = [cause];
    setValue('csrFocusAreas', next, { shouldValidate: true });
  };

  const handleAddLocation = () => {
    if (locationInput.trim() && !selectedLocations.includes(locationInput.trim())) {
      setValue('locations', [...selectedLocations, locationInput.trim()], { shouldValidate: true });
      setLocationInput('');
    }
  };

  const handleRemoveLocation = (loc: string) => {
    if (selectedLocations.length > 1) {
      setValue('locations', selectedLocations.filter((l) => l !== loc), { shouldValidate: true });
    }
  };

  const validateStep = async (step: number) => {
    switch (step) {
      case 1:
        return await trigger(['companyName', 'description']);
      case 2:
        return await trigger(['locations', 'csrFocusAreas']);
      case 3:
        return await trigger(['csrEmail', 'csrPhone', 'adminFullName', 'adminTitle', 'adminEmail']);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, CORPORATE_STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: CorporateOnboardingFormData) => {
    submitCorporateOnboarding({
      profileId: 'corp-' + Date.now(),
      companyName: data.companyName,
      logoUrl: data.logoUrl || undefined,
      description: data.description,
      website: data.website || undefined,
      locations: data.locations,
      csrFocusAreas: data.csrFocusAreas,
      csrContact: {
        email: data.csrEmail,
        phone: data.csrPhone,
      },
      authorizedAdministrator: {
        fullName: data.adminFullName,
        title: data.adminTitle,
        email: data.adminEmail,
      },
      verificationStatus: 'VERIFICATION_PENDING',
      createdAt: new Date().toISOString(),
    });

    setIsSubmittingSuccess(true);
    setTimeout(() => {
      router.push('/feed');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF8] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
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
            Corporate CSR Partner Onboarding
          </h1>
          <p className="text-xs sm:text-sm text-[#8B8790] mt-1">
            Register your enterprise to sponsor community initiatives, deploy employee volunteer cohorts, and fund vetted non-profit grants.
          </p>
        </div>

        {/* Step Progress Stepper */}
        <StepProgress steps={CORPORATE_STEPS} currentStep={currentStep} />

        {isSubmittingSuccess ? (
          <div className="bg-white p-8 rounded-xl border border-[#E8E3E8] shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#25232A]">Corporate Profile Submitted for Review!</h2>
            <div className="inline-block">
              <StatusBadge status="verification_pending" />
            </div>
            <p className="text-xs text-[#8B8790] max-w-md mx-auto leading-relaxed">
              Your organization has been registered with initial status <strong>VERIFICATION_PENDING</strong>. You can now explore vetted non-profits, create grant opportunities, and review impact stories.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-[#E8E3E8] shadow-xs p-6 sm:p-8">
            {/* STEP 1: ENTERPRISE IDENTITY */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Enterprise Profile &amp; CSR Overview</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Official company profile visible across the marketplace.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Company / Organization Name <span className="text-[#B91C1C]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('companyName')}
                    placeholder="e.g. Meridian Health & Technology"
                    className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                  {errors.companyName && <p className="mt-1 text-xs text-[#B91C1C]">{errors.companyName.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Company Logo URL (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('logoUrl')}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Official Corporate Website (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('website')}
                    placeholder="https://yourcompany.com"
                    className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Company &amp; CSR Overview <span className="text-[#B91C1C]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    {...register('description')}
                    placeholder="Describe your corporate social responsibility strategy, employee engagement goals, and grant priorities..."
                    className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                  {errors.description && <p className="mt-1 text-xs text-[#B91C1C]">{errors.description.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 2: LOCATIONS & CSR FOCUS */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Operating Locations &amp; CSR Focus Areas</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Match with non-profits operating in your target geographic hubs and issue sectors.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-2">
                    Primary CSR Focus Causes <span className="text-[#B91C1C]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CAUSE_OPTIONS.filter((c) => c !== 'All Causes').map((cause) => {
                      const isSelected = selectedFocusAreas.includes(cause);
                      return (
                        <button
                          key={cause}
                          type="button"
                          onClick={() => toggleFocusArea(cause)}
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
                  {errors.csrFocusAreas && <p className="mt-1 text-xs text-[#B91C1C]">{errors.csrFocusAreas.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-2">
                    Key Office Locations / Employee Hubs <span className="text-[#B91C1C]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedLocations.map((loc) => (
                      <span
                        key={loc}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]"
                      >
                        <span>{loc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(loc)}
                          className="hover:text-[#B91C1C]"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLocation();
                        }
                      }}
                      placeholder="Add office city (e.g. Denver, CO)..."
                      className="flex-1 px-3 py-1.5 text-xs text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    />
                    <button
                      type="button"
                      onClick={handleAddLocation}
                      className="px-3 py-1.5 text-xs font-medium text-[#6D3A70] border border-[#E8E3E8] bg-[#FAF5FA] hover:bg-[#F1E7F3] rounded-lg transition-colors cursor-pointer"
                    >
                      + Add Location
                    </button>
                  </div>
                  {errors.locations && <p className="mt-1 text-xs text-[#B91C1C]">{errors.locations.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 3: ADMINISTRATION & CONTACTS */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">CSR Administration &amp; Authorized Personnel</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Contact details for program coordinators and compliance review.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#25232A] mb-1">
                      CSR Department Email <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('csrEmail')}
                      placeholder="csr@yourcompany.com"
                      className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    />
                    {errors.csrEmail && <p className="mt-1 text-xs text-[#B91C1C]">{errors.csrEmail.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#25232A] mb-1">
                      CSR Contact Phone <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('csrPhone')}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    />
                    {errors.csrPhone && <p className="mt-1 text-xs text-[#B91C1C]">{errors.csrPhone.message}</p>}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E3E8]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] mb-3">
                    Authorized Administrator Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#25232A] mb-1">
                        Administrator Full Name <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('adminFullName')}
                        placeholder="e.g. Jordan Miller"
                        className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                      {errors.adminFullName && <p className="mt-1 text-xs text-rose-700">{errors.adminFullName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#25232A] mb-1">
                        Corporate Executive Title <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('adminTitle')}
                        placeholder="e.g. VP of Social Responsibility"
                        className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                      {errors.adminTitle && <p className="mt-1 text-xs text-rose-700">{errors.adminTitle.message}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[#25232A] mb-1">
                        Administrator Corporate Email <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('adminEmail')}
                        placeholder="jordan.miller@yourcompany.com"
                        className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                      {errors.adminEmail && <p className="mt-1 text-xs text-rose-700">{errors.adminEmail.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & SUBMIT */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Review Corporate Submission</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Initial status will be set to <strong>VERIFICATION_PENDING</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#92400E]">Enterprise Verification Notice</h4>
                    <p className="text-[11px] text-[#B45309] mt-0.5 leading-relaxed">
                      Initial submission status is <strong>VERIFICATION_PENDING</strong>. You can browse the community feed, shortlist NGOs, and draft CSR grants immediately while administrators confirm your corporate credentials.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FBFAF8] border border-[#E8E3E8] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#25232A]">{watch('companyName')}</h3>
                      <p className="text-xs text-[#8B8790]">{selectedLocations.join(', ')}</p>
                    </div>
                    <StatusBadge status="verification_pending" size="sm" />
                  </div>

                  <p className="text-xs text-[#6B6870] leading-relaxed italic">
                    &ldquo;{watch('description')}&rdquo;
                  </p>

                  <div className="pt-2 border-t border-[#E8E3E8] text-xs text-[#8B8790] grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div><strong className="text-[#25232A]">Focus Areas:</strong> {selectedFocusAreas.join(', ')}</div>
                    <div><strong className="text-[#25232A]">Website:</strong> {watch('website') || 'Not specified'}</div>
                    <div><strong className="text-[#25232A]">CSR Email:</strong> {watch('csrEmail')}</div>
                    <div><strong className="text-[#25232A]">Administrator:</strong> {watch('adminFullName')} ({watch('adminTitle')})</div>
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

              {currentStep < CORPORATE_STEPS.length ? (
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
                  <span>Submit Corporate Profile</span>
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
