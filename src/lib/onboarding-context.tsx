'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  VolunteerProfileData,
  NgoProfileData,
  CorporateProfileData,
  VerificationStatus,
} from './types';
import { useAuth } from './auth-context';

export interface VerificationRecord {
  id: string;
  type: 'ngo' | 'corporate';
  name: string;
  logoUrl?: string;
  submissionDate: string;
  causesOrFocus: string[];
  locations: string[];
  website?: string;
  contactEmail: string;
  contactPhone: string;
  registrationNumber?: string;
  taxId?: string;
  representativeName: string;
  representativeTitle: string;
  representativeEmail: string;
  status: VerificationStatus;
  notes?: string;
  description: string;
  mission?: string;
}

interface OnboardingContextType {
  volunteerProfile: VolunteerProfileData | null;
  ngoProfile: NgoProfileData | null;
  corporateProfile: CorporateProfileData | null;
  verifications: VerificationRecord[];

  saveVolunteerProfile: (data: VolunteerProfileData) => void;
  submitNgoOnboarding: (data: NgoProfileData) => void;
  submitCorporateOnboarding: (data: CorporateProfileData) => void;

  updateVerificationStatus: (
    id: string,
    status: VerificationStatus,
    notes?: string
  ) => void;
}

const INITIAL_VERIFICATIONS: VerificationRecord[] = [
  {
    id: 'verif-ngo-1',
    type: 'ngo',
    name: 'GreenCanopy Initiative',
    submissionDate: '2026-08-28',
    causesOrFocus: ['Environment', 'Conservation', 'Climate Action'],
    locations: ['Portland, OR', 'Seattle, WA'],
    website: 'https://greencanopy.example.org',
    contactEmail: 'contact@greencanopy.org',
    contactPhone: '+1 (503) 555-0142',
    registrationNumber: '501(c)(3) #84-9923841',
    taxId: 'US-849923841',
    representativeName: 'Marcus Vance',
    representativeTitle: 'Executive Director',
    representativeEmail: 'marcus@greencanopy.org',
    status: 'VERIFIED',
    notes: 'Verified via IRS 501(c)(3) registry and state non-profit records.',
    description: 'Regional urban forestry and wetland revegetation organization active since 2018.',
    mission: 'To restore native biodiversity across metropolitan river corridors.',
  },
  {
    id: 'verif-ngo-2',
    type: 'ngo',
    name: 'CodeForward Foundation',
    submissionDate: '2026-09-01',
    causesOrFocus: ['Education', 'Digital Inclusion', 'Youth Empowerment'],
    locations: ['Chicago, IL'],
    website: 'https://codeforward.example.org',
    contactEmail: 'team@codeforward.org',
    contactPhone: '+1 (312) 555-8392',
    registrationNumber: '501(c)(3) #36-4829104',
    representativeName: 'Eleanor Vance',
    representativeTitle: 'Programs Director',
    representativeEmail: 'eleanor@codeforward.org',
    status: 'VERIFICATION_PENDING',
    notes: 'Awaiting secondary state documentation review.',
    description: 'Dedicated to offering free computing hardware and STEM mentorship to Title 1 schools.',
    mission: 'Empower underrepresented youth through direct coding mentorship.',
  },
  {
    id: 'verif-corp-1',
    type: 'corporate',
    name: 'Apex Capital Advisors',
    submissionDate: '2026-08-30',
    causesOrFocus: ['Governance & Capacity', 'Education', 'Community Reinvestment'],
    locations: ['New York, NY', 'Boston, MA'],
    website: 'https://apexcapital.example.com/csr',
    contactEmail: 'csr@apexcapital.example.com',
    contactPhone: '+1 (212) 555-9000',
    registrationNumber: 'SEC #0001849204',
    representativeName: 'Elena Rostova',
    representativeTitle: 'VP of Social Responsibility',
    representativeEmail: 'elena.rostova@apexcapital.example.com',
    status: 'VERIFIED',
    notes: 'Enterprise verified with corporate secretary confirmation.',
    description: 'Directs pro-bono financial controls audits and employee volunteer matching grants.',
  },
  {
    id: 'verif-corp-2',
    type: 'corporate',
    name: 'TerraPower Utilities',
    submissionDate: '2026-09-02',
    causesOrFocus: ['Environment & Clean Energy', 'Climate Resilience'],
    locations: ['Denver, CO'],
    website: 'https://terrapower.example.com/impact',
    contactEmail: 'impact@terrapower.example.com',
    contactPhone: '+1 (303) 555-4921',
    registrationNumber: 'CO-CORP #2014-9923',
    representativeName: 'David Chen',
    representativeTitle: 'Director of Community Affairs',
    representativeEmail: 'david.chen@terrapower.example.com',
    status: 'VERIFICATION_PENDING',
    description: 'Regional clean energy utility funding community solar microgrids.',
  }
];

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { saveProfile } = useAuth();

  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfileData | null>(null);
  const [ngoProfile, setNgoProfile] = useState<NgoProfileData | null>(null);
  const [corporateProfile, setCorporateProfile] = useState<CorporateProfileData | null>(null);
  const [verifications, setVerifications] = useState<VerificationRecord[]>(INITIAL_VERIFICATIONS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Safe client hydration
  useEffect(() => {
    try {
      const savedVol = localStorage.getItem('dgd_volunteer_profile');
      if (savedVol) setVolunteerProfile(JSON.parse(savedVol));

      const savedNgo = localStorage.getItem('dgd_ngo_profile');
      if (savedNgo) setNgoProfile(JSON.parse(savedNgo));

      const savedCorp = localStorage.getItem('dgd_corporate_profile');
      if (savedCorp) setCorporateProfile(JSON.parse(savedCorp));

      const savedVerifs = localStorage.getItem('dgd_admin_verifications');
      if (savedVerifs) setVerifications(JSON.parse(savedVerifs));
    } catch (e) {
      console.error('Failed to load onboarding storage', e);
    }
    setIsHydrated(true);
  }, []);

  // Save changes
  useEffect(() => {
    if (isHydrated) {
      if (volunteerProfile) localStorage.setItem('dgd_volunteer_profile', JSON.stringify(volunteerProfile));
      if (ngoProfile) localStorage.setItem('dgd_ngo_profile', JSON.stringify(ngoProfile));
      if (corporateProfile) localStorage.setItem('dgd_corporate_profile', JSON.stringify(corporateProfile));
      localStorage.setItem('dgd_admin_verifications', JSON.stringify(verifications));
    }
  }, [volunteerProfile, ngoProfile, corporateProfile, verifications, isHydrated]);

  const saveVolunteerProfile = (data: VolunteerProfileData) => {
    setVolunteerProfile(data);
    saveProfile({
      fullName: data.fullName,
      location: `${data.city}, ${data.state}`,
      bio: data.shortBio,
      causes: data.causes,
      role: 'volunteer',
      verified: true,
    });
  };

  const submitNgoOnboarding = (data: NgoProfileData) => {
    setNgoProfile(data);
    saveProfile({
      fullName: data.ngoName,
      organizationName: data.ngoName,
      location: data.locations[0] || 'United States',
      bio: data.mission,
      causes: data.causes,
      role: 'ngo',
      verified: false, // Verification is pending initially
    });

    // Add to admin verifications list
    const newRecord: VerificationRecord = {
      id: 'verif-' + Date.now(),
      type: 'ngo',
      name: data.ngoName,
      logoUrl: data.logoUrl,
      submissionDate: new Date().toISOString().split('T')[0],
      causesOrFocus: data.causes,
      locations: data.locations,
      website: data.website,
      contactEmail: data.contactInformation.email,
      contactPhone: data.contactInformation.phone,
      registrationNumber: data.registrationDetails.registrationNumber,
      taxId: data.registrationDetails.taxId,
      representativeName: data.authorizedRepresentative.fullName,
      representativeTitle: data.authorizedRepresentative.title,
      representativeEmail: data.authorizedRepresentative.email,
      status: 'VERIFICATION_PENDING',
      description: data.description,
      mission: data.mission,
    };

    setVerifications((prev) => [newRecord, ...prev]);
  };

  const submitCorporateOnboarding = (data: CorporateProfileData) => {
    setCorporateProfile(data);
    saveProfile({
      fullName: data.companyName,
      organizationName: data.companyName,
      location: data.locations[0] || 'United States',
      bio: data.description,
      causes: data.csrFocusAreas,
      role: 'corporate',
      verified: false, // Verification pending initially
    });

    const newRecord: VerificationRecord = {
      id: 'verif-' + Date.now(),
      type: 'corporate',
      name: data.companyName,
      logoUrl: data.logoUrl,
      submissionDate: new Date().toISOString().split('T')[0],
      causesOrFocus: data.csrFocusAreas,
      locations: data.locations,
      website: data.website,
      contactEmail: data.csrContact.email,
      contactPhone: data.csrContact.phone,
      representativeName: data.authorizedAdministrator.fullName,
      representativeTitle: data.authorizedAdministrator.title,
      representativeEmail: data.authorizedAdministrator.email,
      status: 'VERIFICATION_PENDING',
      description: data.description,
    };

    setVerifications((prev) => [newRecord, ...prev]);
  };

  const updateVerificationStatus = (
    id: string,
    status: VerificationStatus,
    notes?: string
  ) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status, notes: notes || v.notes } : v))
    );
  };

  return (
    <OnboardingContext.Provider
      value={{
        volunteerProfile,
        ngoProfile,
        corporateProfile,
        verifications,
        saveVolunteerProfile,
        submitNgoOnboarding,
        submitCorporateOnboarding,
        updateVerificationStatus,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
