'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NgoProfileData,
  CorporateConnectionRequest,
  ConnectionRequestStatus,
  NgoDiscoveryFilters,
} from './types';
import { useAuth } from './auth-context';
import { useOnboarding } from './onboarding-context';

export interface CorporateContextType {
  ngos: NgoProfileData[];
  shortlistedNgoIds: string[];
  connectionRequests: CorporateConnectionRequest[];

  // NGO discovery & profile
  getNgoById: (id: string) => NgoProfileData | undefined;

  // Shortlisting
  toggleShortlistNgo: (ngoId: string) => void;
  isShortlisted: (ngoId: string) => boolean;

  // Connection Requests (Corporate & NGO workflow)
  sendConnectionRequest: (params: {
    ngoProfileId: string;
    initialMessage?: string;
  }) => { success: boolean; message?: string };
  hasSentRequest: (ngoProfileId: string) => boolean;
  getConnectionRequest: (ngoProfileId: string) => CorporateConnectionRequest | undefined;
  getRequestsForNgo: (ngoProfileId: string) => CorporateConnectionRequest[];
  getRequestsForCorporate: (corporateProfileId: string) => CorporateConnectionRequest[];
  respondToConnectionRequest: (
    requestId: string,
    status: 'ACCEPTED' | 'DECLINED',
    responseNotes?: string
  ) => void;
}

const INITIAL_NGOS: NgoProfileData[] = [
  {
    profileId: 'ngo-1',
    ngoName: 'GreenCanopy Initiative',
    logoUrl: '',
    description: 'Dedicated to urban canopy restoration, native wetland revegetation, and public river corridor stewardship through volunteer-led community conservation.',
    mission: 'To expand equitable urban canopy cover and restore degraded freshwater ecosystems across the Pacific Northwest.',
    causes: ['Environment', 'Conservation', 'Climate Action'],
    locations: ['Portland, OR', 'Seattle, WA', 'United States'],
    website: 'https://greencanopy.org',
    contactInformation: {
      email: 'partnerships@greencanopy.org',
      phone: '+1 (503) 555-0144',
      address: '1040 SW 2nd Ave, Portland, OR 97204',
    },
    registrationDetails: {
      registrationNumber: 'US-OR-501C3-89421',
      taxId: 'XX-XXXX129',
      yearEstablished: '2018',
      countryOfRegistration: 'United States',
    },
    authorizedRepresentative: {
      fullName: 'David Martinez',
      title: 'Executive Director',
      email: 'david@greencanopy.org',
      phone: '+1 (503) 555-0145',
    },
    verificationStatus: 'VERIFIED',
    createdAt: '2026-08-10T10:00:00Z',
  },
  {
    profileId: 'ngo-2',
    ngoName: 'CodeForward Foundation',
    logoUrl: '',
    description: 'Technology education initiative empowering underrepresented secondary students with free computer hardware and structured STEM mentorship.',
    mission: 'To eliminate the digital divide for underserved youth through open curriculum, hardware access, and 1-on-1 developer mentorship.',
    causes: ['Education', 'Youth Empowerment', 'Technology'],
    locations: ['San Francisco, CA', 'Oakland, CA', 'Virtual / Global'],
    website: 'https://codeforward.org',
    contactInformation: {
      email: 'connect@codeforward.org',
      phone: '+1 (415) 555-0182',
      address: '450 Mission St, San Francisco, CA 94105',
    },
    registrationDetails: {
      registrationNumber: 'US-CA-501C3-11029',
      taxId: 'XX-XXXX482',
      yearEstablished: '2021',
      countryOfRegistration: 'United States',
    },
    authorizedRepresentative: {
      fullName: 'Elena Rostova',
      title: 'Founder & Program Head',
      email: 'elena@codeforward.org',
    },
    verificationStatus: 'VERIFICATION_PENDING',
    createdAt: '2026-08-18T14:30:00Z',
  },
  {
    profileId: 'ngo-3',
    ngoName: 'TableOfHope Network',
    logoUrl: '',
    description: 'Regional hunger relief network rescuing fresh surplus produce and nutritious perishables from commercial grocers and distributing emergency pantry hampers.',
    mission: 'To ensure no family in our metropolitan area goes hungry by bridging wholesale surplus food with dignified community distribution.',
    causes: ['Hunger Relief', 'Food Security', 'Community Well-being'],
    locations: ['Chicago, IL', 'Rockford, IL', 'United States'],
    website: 'https://tableofhope.org',
    contactInformation: {
      email: 'support@tableofhope.org',
      phone: '+1 (312) 555-0199',
      address: '2200 S Western Ave, Chicago, IL 60608',
    },
    registrationDetails: {
      registrationNumber: 'US-IL-501C3-44820',
      taxId: 'XX-XXXX991',
      yearEstablished: '2015',
      countryOfRegistration: 'United States',
    },
    authorizedRepresentative: {
      fullName: 'Marcus Vance',
      title: 'Director of Logistics & Operations',
      email: 'marcus@tableofhope.org',
    },
    verificationStatus: 'VERIFIED',
    createdAt: '2026-08-01T09:00:00Z',
  }
];

const INITIAL_CONNECTION_REQUESTS: CorporateConnectionRequest[] = [
  {
    id: 'req-demo-1',
    corporateProfileId: 'corp-1',
    corporateName: 'EcoTech Partners',
    corporateLogoUrl: '',
    corporateDescription: 'Enterprise software provider dedicated to carbon-neutral operations and community environmental stewardship.',
    corporateLocation: 'Portland, OR, United States',
    corporateCsrFocusAreas: ['Environment', 'Climate Action', 'Urban Sustainability'],
    ngoProfileId: 'ngo-1',
    ngoName: 'GreenCanopy Initiative',
    status: 'PENDING',
    initialMessage: 'EcoTech Partners would like to explore sponsoring native tree saplings and participating in upcoming Lower Willamette planting drives.',
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-02T11:00:00Z',
  }
];

const CorporateContext = createContext<CorporateContextType | undefined>(undefined);

export function CorporateProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const { corporateProfile, verifications } = useOnboarding();

  const [ngos, setNgos] = useState<NgoProfileData[]>(INITIAL_NGOS);
  const [shortlistedNgoIds, setShortlistedNgoIds] = useState<string[]>(['ngo-1']);
  const [connectionRequests, setConnectionRequests] = useState<CorporateConnectionRequest[]>(
    INITIAL_CONNECTION_REQUESTS
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Safe client hydration
  useEffect(() => {
    try {
      const savedShortlist = localStorage.getItem('dgd_corporate_shortlist');
      if (savedShortlist) setShortlistedNgoIds(JSON.parse(savedShortlist));

      const savedRequests = localStorage.getItem('dgd_corporate_requests');
      if (savedRequests) setConnectionRequests(JSON.parse(savedRequests));

      const savedNgos = localStorage.getItem('dgd_corporate_ngos');
      if (savedNgos) setNgos(JSON.parse(savedNgos));
    } catch (e) {
      console.error('Failed to hydrate corporate storage', e);
    }
    setIsHydrated(true);
  }, []);

  // Persist state
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('dgd_corporate_shortlist', JSON.stringify(shortlistedNgoIds));
      localStorage.setItem('dgd_corporate_requests', JSON.stringify(connectionRequests));
      localStorage.setItem('dgd_corporate_ngos', JSON.stringify(ngos));
    }
  }, [shortlistedNgoIds, connectionRequests, ngos, isHydrated]);

  // Keep verification status synchronized with admin verifications portal
  useEffect(() => {
    setNgos((prev) =>
      prev.map((ngo) => {
        const verif = verifications.find(
          (v) => v.id.includes(ngo.profileId) || v.name.toLowerCase() === ngo.ngoName.toLowerCase()
        );
        if (verif) {
          return { ...ngo, verificationStatus: verif.status };
        }
        return ngo;
      })
    );
  }, [verifications]);

  const getNgoById = (id: string) => {
    return ngos.find((n) => n.profileId === id);
  };

  // Shortlisting
  const toggleShortlistNgo = (ngoId: string) => {
    setShortlistedNgoIds((prev) => {
      if (prev.includes(ngoId)) {
        return prev.filter((id) => id !== ngoId);
      } else {
        return [...prev, ngoId];
      }
    });
  };

  const isShortlisted = (ngoId: string) => shortlistedNgoIds.includes(ngoId);

  // Connection Requests
  const hasSentRequest = (ngoProfileId: string) => {
    const currentCorpId = profile?.id || 'corp-1';
    return connectionRequests.some(
      (r) => r.ngoProfileId === ngoProfileId && r.corporateProfileId === currentCorpId
    );
  };

  const getConnectionRequest = (ngoProfileId: string) => {
    const currentCorpId = profile?.id || 'corp-1';
    return connectionRequests.find(
      (r) => r.ngoProfileId === ngoProfileId && r.corporateProfileId === currentCorpId
    );
  };

  const sendConnectionRequest = (params: {
    ngoProfileId: string;
    initialMessage?: string;
  }) => {
    const currentCorpId = profile?.id || 'corp-1';
    const targetNgo = getNgoById(params.ngoProfileId);
    if (!targetNgo) return { success: false, message: 'NGO not found' };

    if (hasSentRequest(params.ngoProfileId)) {
      return { success: false, message: 'A connection request has already been sent to this organization.' };
    }

    const newReq: CorporateConnectionRequest = {
      id: 'req-' + Date.now(),
      corporateProfileId: currentCorpId,
      corporateName: corporateProfile?.companyName || profile?.organizationName || 'EcoTech Partners',
      corporateLogoUrl: corporateProfile?.logoUrl || profile?.avatarUrl,
      corporateDescription:
        corporateProfile?.description || profile?.bio || 'Enterprise social responsibility program.',
      corporateLocation:
        corporateProfile?.locations?.[0] || profile?.location || 'Portland, OR, United States',
      corporateCsrFocusAreas: corporateProfile?.csrFocusAreas || ['Environment', 'Education'],
      ngoProfileId: params.ngoProfileId,
      ngoName: targetNgo.ngoName,
      status: 'PENDING',
      initialMessage: params.initialMessage || 'We are interested in exploring partnership opportunities.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setConnectionRequests((prev) => [newReq, ...prev]);

    // Dispatch in-app notification to NGO
    try {
      const existingNotifs = localStorage.getItem('dgd_notifications');
      const notifs = existingNotifs ? JSON.parse(existingNotifs) : [];
      const newNotif = {
        id: 'notif-' + Date.now(),
        recipientId: params.ngoProfileId,
        type: 'CORPORATE_CONNECTION_REQUEST',
        title: 'New Corporate Connection Request',
        message: `${newReq.corporateName} sent a connection request to partner with your organization.`,
        linkUrl: '/ngo/corporate-partners',
        read: false,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('dgd_notifications', JSON.stringify([newNotif, ...notifs]));
    } catch (e) {
      console.error('Failed to notify NGO of connection request', e);
    }

    return { success: true };
  };

  const getRequestsForNgo = (ngoProfileId: string) => {
    return connectionRequests.filter((r) => r.ngoProfileId === ngoProfileId);
  };

  const getRequestsForCorporate = (corporateProfileId: string) => {
    return connectionRequests.filter((r) => r.corporateProfileId === corporateProfileId);
  };

  const respondToConnectionRequest = (
    requestId: string,
    status: 'ACCEPTED' | 'DECLINED',
    responseNotes?: string
  ) => {
    let updatedReq: CorporateConnectionRequest | undefined;

    setConnectionRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          updatedReq = {
            ...r,
            status,
            responseNotes: responseNotes !== undefined ? responseNotes : r.responseNotes,
            updatedAt: new Date().toISOString(),
          };
          return updatedReq;
        }
        return r;
      })
    );

    // Notify Corporate of decision
    if (updatedReq) {
      try {
        const existingNotifs = localStorage.getItem('dgd_notifications');
        const notifs = existingNotifs ? JSON.parse(existingNotifs) : [];
        const newNotif = {
          id: 'notif-' + Date.now(),
          recipientId: updatedReq.corporateProfileId,
          type: 'CONNECTION_REQUEST_RESPONSE',
          title: `Connection Request ${status === 'ACCEPTED' ? 'Accepted' : 'Updated'}`,
          message: `${updatedReq.ngoName} has ${status.toLowerCase()} your connection request.`,
          linkUrl: '/corporate/shortlist',
          read: false,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('dgd_notifications', JSON.stringify([newNotif, ...notifs]));
      } catch (e) {
        console.error('Failed to notify corporate user', e);
      }
    }
  };

  return (
    <CorporateContext.Provider
      value={{
        ngos,
        shortlistedNgoIds,
        connectionRequests,
        getNgoById,
        toggleShortlistNgo,
        isShortlisted,
        sendConnectionRequest,
        hasSentRequest,
        getConnectionRequest,
        getRequestsForNgo,
        getRequestsForCorporate,
        respondToConnectionRequest,
      }}
    >
      {children}
    </CorporateContext.Provider>
  );
}

export function useCorporate() {
  const context = useContext(CorporateContext);
  if (!context) {
    throw new Error('useCorporate must be used within a CorporateProvider');
  }
  return context;
}
