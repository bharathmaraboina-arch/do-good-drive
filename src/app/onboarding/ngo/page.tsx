'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ngoOnboardingSchema, NgoOnboardingFormData } from '@/lib/schemas/onboarding';
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

const NGO_STEPS: StepItem[] = [
  { number: 1, title: 'Identity & Mission', description: 'Name, mission, and overview' },
  { number: 2, title: 'Scope & Locations', description: 'Focus causes and operating regions' },
  { number: 3, title: 'Governance & Reg.', description: 'Registration and representative' },
  { number: 4, title: 'Review & Submit', description: 'Submit for verification' },
];

export default function NgoOnboardingPage() {
  const router = useRouter();
  const { ngoProfile, submitNgoOnboarding } = useOnboarding();
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
  } = useForm<NgoOnboardingFormData>({
    resolver: zodResolver(ngoOnboardingSchema),
    defaultValues: {
      ngoName: ngoProfile?.ngoName || 'Cascadia Watershed Trust',
      logoUrl: ngoProfile?.logoUrl || '',
      mission:
        ngoProfile?.mission ||
        'To protect, restore, and steward vital salmon streams and native wetlands across the Pacific Northwest.',
      description:
        ngoProfile?.description ||
        'Grassroots watershed restoration initiative engaging over 500 annual volunteers in riparian planting and water quality testing.',
      causes: ngoProfile?.causes || ['Environment', 'Conservation'],
      locations: ngoProfile?.locations || ['Portland, OR', 'Eugene, OR'],
      website: ngoProfile?.website || 'https://cascadiawatershed.example.org',
      contactEmail: ngoProfile?.contactInformation.email || 'info@cascadiawatershed.org',
      contactPhone: ngoProfile?.contactInformation.phone || '+1 (503) 555-8291',
      address: ngoProfile?.contactInformation.address || '412 SE River St, Portland, OR 97214',
      registrationNumber: ngoProfile?.registrationDetails.registrationNumber || '501(c)(3) #93-1829401',
      taxId: ngoProfile?.registrationDetails.taxId || 'EIN 93-1829401',
      yearEstablished: ngoProfile?.registrationDetails.yearEstablished || '2019',
      countryOfRegistration: ngoProfile?.registrationDetails.countryOfRegistration || 'United States',
      repFullName: ngoProfile?.authorizedRepresentative.fullName || 'Evelyn Reed',
      repTitle: ngoProfile?.authorizedRepresentative.title || 'Executive Director',
      repEmail: ngoProfile?.authorizedRepresentative.email || 'evelyn@cascadiawatershed.org',
      repPhone: ngoProfile?.authorizedRepresentative.phone || '+1 (503) 555-8290',
    },
  });

  const selectedCauses = watch('causes') || [];
  const selectedLocations = watch('locations') || [];

  const toggleCause = (cause: string) => {
    let next: string[];
    if (selectedCauses.includes(cause)) {
      next = selectedCauses.filter((c) => c !== cause);
    } else {
      next = [...selectedCauses, cause];
    }
    if (next.length === 0) next = [cause];
    setValue('causes', next, { shouldValidate: true });
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
        return await trigger(['ngoName', 'mission', 'description']);
      case 2:
        return await trigger(['causes', 'locations']);
      case 3:
        return await trigger([
          'contactEmail',
          'contactPhone',
          'registrationNumber',
          'yearEstablished',
          'countryOfRegistration',
          'repFullName',
          'repTitle',
          'repEmail',
        ]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, NGO_STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: NgoOnboardingFormData) => {
    submitNgoOnboarding({
      profileId: 'ngo-' + Date.now(),
      ngoName: data.ngoName,
      logoUrl: data.logoUrl || undefined,
      description: data.description,
      mission: data.mission,
      causes: data.causes,
      locations: data.locations,
      website: data.website || undefined,
      contactInformation: {
        email: data.contactEmail,
        phone: data.contactPhone,
        address: data.address,
      },
      registrationDetails: {
        registrationNumber: data.registrationNumber,
        taxId: data.taxId,
        yearEstablished: data.yearEstablished,
        countryOfRegistration: data.countryOfRegistration,
      },
      authorizedRepresentative: {
        fullName: data.repFullName,
        title: data.repTitle,
        email: data.repEmail,
        phone: data.repPhone,
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
            Non-Profit Organization Onboarding
          </h1>
          <p className="text-xs sm:text-sm text-[#8B8790] mt-1">
            Register your non-profit organization to post community drives and unlock corporate CSR grants.
          </p>
        </div>

        {/* Step Progress Stepper */}
        <StepProgress steps={NGO_STEPS} currentStep={currentStep} />

        {isSubmittingSuccess ? (
          <div className="bg-white p-8 rounded-xl border border-[#E8E3E8] shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#25232A]">Organization Submitted for Verification!</h2>
            <div className="inline-block">
              <StatusBadge status="verification_pending" />
            </div>
            <p className="text-xs text-[#8B8790] max-w-md mx-auto leading-relaxed">
              Your profile has been registered with status <strong>VERIFICATION_PENDING</strong>. You can now post drives, broadcast updates, and prepare campaigns while an administrator reviews your credentials.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-[#E8E3E8] shadow-xs p-6 sm:p-8">
            {/* STEP 1: IDENTITY & MISSION */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Organization Identity &amp; Mission</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Official organization profile displayed to volunteers and corporate partners.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Official Non-Profit / NGO Name <span className="text-[#B91C1C]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('ngoName')}
                    placeholder="e.g. Cascadia Watershed Trust"
                    className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                  {errors.ngoName && <p className="mt-1 text-xs text-[#B91C1C]">{errors.ngoName.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Organization Logo URL (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('logoUrl')}
                    placeholder="https://example.org/logo.png"
                    className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Core Mission Statement <span className="text-[#B91C1C]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    {...register('mission')}
                    placeholder="Summarize your core mission in 1-2 concise sentences..."
                    className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                  {errors.mission && <p className="mt-1 text-xs text-[#B91C1C]">{errors.mission.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Detailed Overview &amp; Programs <span className="text-[#B91C1C]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    {...register('description')}
                    placeholder="Describe your active initiatives, community reach, and key milestones..."
                    className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                  {errors.description && <p className="mt-1 text-xs text-[#B91C1C]">{errors.description.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 2: SCOPE & LOCATIONS */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Causes &amp; Operating Regions</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Define where you operate and what issue areas you address.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-2">
                    Primary Cause Areas <span className="text-[#B91C1C]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CAUSE_OPTIONS.filter((c) => c !== 'All Causes').map((cause) => {
                      const isSelected = selectedCauses.includes(cause);
                      return (
                        <button
                          key={cause}
                          type="button"
                          onClick={() => toggleCause(cause)}
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
                    Operating Cities / Regions <span className="text-[#B91C1C]">*</span>
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
                      placeholder="Add operating city (e.g. Portland, OR)..."
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

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Official Website URL (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('website')}
                    placeholder="https://your-organization.org"
                    className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: GOVERNANCE & REGISTRATION */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Governance &amp; Verification Details</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Official records used by administrators to verify legitimacy.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#25232A] mb-1">
                      Official Contact Email <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('contactEmail')}
                      placeholder="info@yourngo.org"
                      className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    />
                    {errors.contactEmail && <p className="mt-1 text-xs text-[#B91C1C]">{errors.contactEmail.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#25232A] mb-1">
                      Contact Phone Number <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('contactPhone')}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                    />
                    {errors.contactPhone && <p className="mt-1 text-xs text-[#B91C1C]">{errors.contactPhone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#25232A] mb-1">
                    Registered Headquarters Address (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    placeholder="123 Main St, Suite 400, City, State, Zip"
                    className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E8E3E8]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] mb-3">
                    Registration Credentials
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#25232A] mb-1">
                        Registration / Non-Profit ID <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('registrationNumber')}
                        placeholder="e.g. 501(c)(3) #93-1829401"
                        className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                      {errors.registrationNumber && <p className="mt-1 text-xs text-[#B91C1C]">{errors.registrationNumber.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#25232A] mb-1">
                        Tax ID / EIN (Optional)
                      </label>
                      <input
                        type="text"
                        {...register('taxId')}
                        placeholder="e.g. EIN 93-1829401"
                        className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#25232A] mb-1">
                        Year Established <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('yearEstablished')}
                        placeholder="e.g. 2019"
                        className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                      {errors.yearEstablished && <p className="mt-1 text-xs text-[#B91C1C]">{errors.yearEstablished.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#25232A] mb-1">
                        Country of Legal Registration <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('countryOfRegistration')}
                        placeholder="e.g. United States"
                        className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                      {errors.countryOfRegistration && <p className="mt-1 text-xs text-[#B91C1C]">{errors.countryOfRegistration.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E3E8]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] mb-3">
                    Authorized Representative
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#25232A] mb-1">
                        Representative Full Name <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('repFullName')}
                        placeholder="e.g. Evelyn Reed"
                        className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                      {errors.repFullName && <p className="mt-1 text-xs text-[#B91C1C]">{errors.repFullName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#25232A] mb-1">
                        Executive Title <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('repTitle')}
                        placeholder="e.g. Executive Director"
                        className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                      {errors.repTitle && <p className="mt-1 text-xs text-[#B91C1C]">{errors.repTitle.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#25232A] mb-1">
                        Official Work Email <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('repEmail')}
                        placeholder="evelyn@yourngo.org"
                        className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                      {errors.repEmail && <p className="mt-1 text-xs text-[#B91C1C]">{errors.repEmail.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#25232A] mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="text"
                        {...register('repPhone')}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & SUBMIT */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-[#E8E3E8] pb-3">
                  <h2 className="text-base font-bold text-[#25232A]">Review &amp; Initial Verification Status</h2>
                  <p className="text-xs text-[#8B8790] mt-0.5">
                    Upon submission, your profile will be placed in <strong>VERIFICATION_PENDING</strong> status.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#92400E]">Verification Protocol</h4>
                    <p className="text-[11px] text-[#B45309] mt-0.5 leading-relaxed">
                      Initial submission status is <strong>VERIFICATION_PENDING</strong>. You can post drives and browse corporate partners immediately, but full verified trust badges will appear once verified by an administrator.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FBFAF8] border border-[#E8E3E8] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#25232A]">{watch('ngoName')}</h3>
                      <p className="text-xs text-[#8B8790]">{selectedLocations.join(', ')}</p>
                    </div>
                    <StatusBadge status="verification_pending" size="sm" />
                  </div>

                  <p className="text-xs text-[#6B6870] leading-relaxed italic">
                    &ldquo;{watch('mission')}&rdquo;
                  </p>

                  <div className="pt-2 border-t border-[#E8E3E8] text-xs text-[#8B8790] grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div><strong className="text-[#25232A]">Causes:</strong> {selectedCauses.join(', ')}</div>
                    <div><strong className="text-[#25232A]">Website:</strong> {watch('website') || 'Not specified'}</div>
                    <div><strong className="text-[#25232A]">Reg. ID:</strong> {watch('registrationNumber')}</div>
                    <div><strong className="text-[#25232A]">Year Est.:</strong> {watch('yearEstablished')}</div>
                    <div><strong className="text-[#25232A]">Representative:</strong> {watch('repFullName')} ({watch('repTitle')})</div>
                    <div><strong className="text-[#25232A]">Contact:</strong> {watch('contactEmail')}</div>
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

              {currentStep < NGO_STEPS.length ? (
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
                  <span>Submit Profile for Verification</span>
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
