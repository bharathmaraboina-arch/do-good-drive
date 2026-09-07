'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Opportunity,
  Application,
  ApplicationAnswer,
  ApplicationStatus,
  VolunteerProfileData,
  VolunteeringMode,
  ActivityCompletionRecord,
  AttendanceStatus,
  HoursVerificationStatus,
  VolunteerImpactSummary,
} from './types';
import { useAuth } from './auth-context';
import { useOnboarding } from './onboarding-context';
import { useFeed } from './feed-context';

export interface OpportunityFilterState {
  keyword: string;
  cause: string;
  location: string;
  skill: string;
  date: string;
  volunteeringMode: 'ALL' | VolunteeringMode;
}

interface MarketplaceContextType {
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  applications: Application[];

  // Opportunity CRUD
  createOpportunity: (data: Partial<Opportunity>) => { success: boolean; published: boolean; message?: string };
  updateOpportunity: (id: string, data: Partial<Opportunity>) => void;
  togglePublishOpportunity: (id: string) => { success: boolean; isPublished: boolean; message?: string };
  getOpportunityById: (id: string) => Opportunity | undefined;

  // Saved Opportunities (Bookmarks)
  toggleSaveOpportunity: (id: string) => void;
  isSaved: (id: string) => boolean;

  // Application Workflow
  checkProfileCompleteness: () => { isComplete: boolean; missingFields: string[] };
  submitApplication: (
    opportunityId: string,
    answers: { question: string; answer: string }[]
  ) => { success: boolean; message?: string; missingFields?: string[] };
  hasApplied: (opportunityId: string) => boolean;
  getApplicationForOpportunity: (opportunityId: string) => Application | undefined;

  // NGO Review
  getApplicationsForOpportunity: (opportunityId: string) => Application[];
  getApplicationsForNgo: (ngoProfileId: string) => Application[];
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationStatus,
    ngoPrivateNotes?: string
  ) => void;

  // Activity Completion & Hours Tracking (Official NGO-only verification)
  activityRecords: ActivityCompletionRecord[];
  recordAttendanceAndHours: (params: {
    applicationId: string;
    opportunityId: string;
    volunteerProfileId: string;
    attendanceStatus: AttendanceStatus;
    activityDate: string;
    hours: number;
    hoursStatus: HoursVerificationStatus;
    notes?: string;
  }) => { success: boolean; message?: string };
  verifyVolunteerHours: (recordId: string) => { success: boolean; message?: string };
  getRecordsForOpportunity: (opportunityId: string) => ActivityCompletionRecord[];
  getRecordsForNgo: (ngoProfileId: string) => ActivityCompletionRecord[];
  getImpactSummaryForVolunteer: (volunteerProfileId: string) => VolunteerImpactSummary;
}

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-market-1',
    ngoProfileId: 'ngo-1',
    ngoName: 'GreenCanopy Initiative',
    ngoLogoUrl: '',
    ngoVerified: true,
    ngoDescription: 'Dedicated to urban canopy restoration, native wetland revegetation, and public river corridor stewardship.',
    title: 'Urban Reforestation & Riparian Planting Drive',
    description: 'Join field botanists and community volunteers to plant 400 native Douglas fir saplings, willow stakes, and snowberry along the degraded Lower Willamette basin.',
    cause: 'Environment',
    responsibilities: [
      'Dig planting basins and prepare native saplings with organic mycorrhizal soil',
      'Install protective wire mesh browse guards to shield seedlings from wildlife',
      'Distribute wood chip mulch to retain summer moisture along riverbank corridors',
    ],
    requiredSkills: ['Physical Stamina', 'Teamwork', 'Outdoor Fieldwork'],
    preferredExperience: 'Prior experience with trail maintenance or gardening is welcomed but not required.',
    location: 'East Basin Check-in Station, Portland, OR',
    date: '2026-09-12',
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    duration: '4 Hours',
    volunteerCapacity: 25,
    capacityFilled: 18,
    applicationDeadline: '2026-09-10',
    eligibilityRequirements: 'Ages 16+. Minors must bring a signed guardian liability waiver. Sturdy boots and work gloves recommended.',
    volunteeringMode: 'ON_SITE',
    applicationQuestions: [
      'Do you have any physical restrictions or allergies to outdoor plants/bees?',
      'Have you participated in any conservation or tree planting efforts before?',
    ],
    visibility: 'PUBLIC',
    isPublished: true,
    publishedAt: '2026-08-25T10:00:00Z',
    createdAt: '2026-08-25T09:30:00Z',
    // Compatibility fields
    startDate: '2026-09-12',
    commitmentHours: '4 Hours',
    skillsRequired: ['Physical Stamina', 'Teamwork', 'Outdoor Fieldwork'],
    status: 'open',
    type: 'volunteering',
    isRemote: false,
    capacityNeeded: 25,
  },
  {
    id: 'opp-market-2',
    ngoProfileId: 'ngo-2',
    ngoName: 'CodeForward Foundation',
    ngoLogoUrl: '',
    ngoVerified: false, // Verification pending in our demo state
    ngoDescription: 'Empowering underrepresented secondary students with free computer hardware and structured STEM mentorship.',
    title: 'Remote Coding Mentor for Secondary Students',
    description: 'Mentor secondary students in introductory Python, Scratch game logic, and science fair presentations through weekly interactive digital workshops.',
    cause: 'Education',
    responsibilities: [
      'Guide small groups of 3-4 students through 60-minute algorithmic coding exercises',
      'Provide encouraging, constructive feedback on weekly student projects',
      'Facilitate digital breakout room problem-solving sessions',
    ],
    requiredSkills: ['Python Basics', 'Empathy & Mentoring', 'Clear Communication'],
    preferredExperience: 'Prior tutoring, teaching, or software development background is highly valued.',
    location: 'Virtual Classroom (Zoom / CodeForward Lab)',
    date: '2026-09-20',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    duration: '2 Hours / Week',
    volunteerCapacity: 12,
    capacityFilled: 8,
    applicationDeadline: '2026-09-18',
    eligibilityRequirements: 'Background check required upon acceptance. Must have reliable internet and webcam.',
    volunteeringMode: 'REMOTE',
    applicationQuestions: [
      'What experience do you have mentoring or teaching younger students?',
      'Are you comfortable debugging introductory Python code in real time?',
    ],
    visibility: 'PUBLIC',
    isPublished: true, // Note: seeded as published, but subsequent edits will check verification
    publishedAt: '2026-08-28T14:00:00Z',
    createdAt: '2026-08-28T12:00:00Z',
    // Compatibility fields
    startDate: '2026-09-20',
    commitmentHours: '2 Hours / Week',
    skillsRequired: ['Python Basics', 'Empathy & Mentoring'],
    status: 'open',
    type: 'mentorship',
    isRemote: true,
    capacityNeeded: 12,
  },
  {
    id: 'opp-market-3',
    ngoProfileId: 'ngo-1',
    ngoName: 'GreenCanopy Initiative',
    ngoLogoUrl: '',
    ngoVerified: true,
    ngoDescription: 'Dedicated to urban canopy restoration and native wetland revegetation.',
    title: 'Autumn Seed Harvesting & Native Nursery Prep',
    description: 'Help harvest wild native wildflower and grass seeds from protected meadows and package them for winter cold stratification in our community greenhouse.',
    cause: 'Environment',
    responsibilities: [
      'Identify and harvest mature seed pods from designated native species',
      'Clean, separate, and label harvested seeds using botanical seed-screens',
      'Prepare seed packets for school distribution and spring restoration plantings',
    ],
    requiredSkills: ['Attention to Detail', 'Fine Motor Skills'],
    preferredExperience: 'No experience needed; botanist orientation provided on arrival.',
    location: 'Tryon Creek Community Greenhouse, Lake Oswego, OR',
    date: '2026-09-26',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    duration: '4 Hours',
    volunteerCapacity: 15,
    capacityFilled: 5,
    applicationDeadline: '2026-09-24',
    eligibilityRequirements: 'All ages welcome. Great for families with children 10+ accompanied by an adult.',
    volunteeringMode: 'ON_SITE',
    applicationQuestions: [
      'Are you attending individually or with family members?',
    ],
    visibility: 'PUBLIC',
    isPublished: true,
    publishedAt: '2026-09-01T09:00:00Z',
    createdAt: '2026-09-01T08:00:00Z',
    startDate: '2026-09-26',
    commitmentHours: '4 Hours',
    skillsRequired: ['Attention to Detail'],
    status: 'open',
    type: 'volunteering',
    isRemote: false,
    capacityNeeded: 15,
  }
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-demo-1',
    opportunityId: 'opp-market-1',
    volunteerProfileId: 'vol-1',
    volunteerFullName: 'Sarah Jenkins',
    volunteerAvatarUrl: '',
    volunteerBio: 'Environmental educator passionate about native revegetation and volunteer trail building.',
    volunteerLocation: 'Seattle, WA, United States',
    volunteerCauses: ['Environment', 'Education'],
    volunteerSkills: ['Planting', 'Field Logistics', 'First Aid'],
    volunteerExperience: '3 years organizing community park cleanups and riverbank plantings.',
    volunteerAvailability: 'Weekends (Morning)',
    volunteerLanguages: ['English', 'Spanish'],
    status: 'ACCEPTED',
    answers: [
      {
        id: 'ans-1',
        applicationId: 'app-demo-1',
        question: 'Do you have any physical restrictions or allergies to outdoor plants/bees?',
        answer: 'No physical restrictions or allergies. Comfortable with heavy lifting and muddy terrain.',
      },
      {
        id: 'ans-2',
        applicationId: 'app-demo-1',
        question: 'Have you participated in any conservation or tree planting efforts before?',
        answer: 'Yes, planted 150 conifers with the Washington Trails Association last fall.',
      }
    ],
    ngoPrivateNotes: 'Experienced volunteer; assign as group co-leader for Basin 2.',
    appliedAt: '2026-08-29T11:20:00Z',
    updatedAt: '2026-08-30T14:10:00Z',
    opportunityTitle: 'Urban Reforestation & Riparian Planting Drive',
    ngoName: 'GreenCanopy Initiative',
    date: '2026-09-12',
    location: 'East Basin Check-in Station, Portland, OR',
  }
];

const INITIAL_ACTIVITY_RECORDS: ActivityCompletionRecord[] = [
  {
    id: 'act-demo-1',
    applicationId: 'app-demo-1',
    opportunityId: 'opp-market-1',
    opportunityTitle: 'Urban Reforestation & Riparian Planting Drive',
    ngoProfileId: 'ngo-1',
    ngoName: 'GreenCanopy Initiative',
    cause: 'Environment',
    volunteerProfileId: 'vol-1',
    volunteerFullName: 'Sarah Jenkins',
    volunteerAvatarUrl: '',
    attendanceStatus: 'ATTENDED',
    activityDate: '2026-09-12',
    hours: 4.0,
    hoursStatus: 'VERIFIED',
    verifiedAt: '2026-09-13T10:00:00Z',
    verifiedByNgoId: 'ngo-1',
    notes: 'Outstanding contribution. Co-led Basin 2 native planting line.',
    createdAt: '2026-09-12T14:00:00Z',
    updatedAt: '2026-09-13T10:00:00Z',
  },
  {
    id: 'act-demo-2',
    applicationId: 'app-demo-2',
    opportunityId: 'opp-market-3',
    opportunityTitle: 'Autumn Seed Harvesting & Native Nursery Prep',
    ngoProfileId: 'ngo-1',
    ngoName: 'GreenCanopy Initiative',
    cause: 'Environment',
    volunteerProfileId: 'vol-1',
    volunteerFullName: 'Sarah Jenkins',
    volunteerAvatarUrl: '',
    attendanceStatus: 'ATTENDED',
    activityDate: '2026-09-26',
    hours: 4.0,
    hoursStatus: 'PENDING_VERIFICATION',
    notes: 'Completed seed harvesting shift. Awaiting coordinator sign-off.',
    createdAt: '2026-09-26T15:00:00Z',
    updatedAt: '2026-09-26T15:00:00Z',
  },
];

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const { volunteerProfile, verifications } = useOnboarding();
  const { markNotificationAsRead } = useFeed();

  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(['opp-market-1']);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [activityRecords, setActivityRecords] = useState<ActivityCompletionRecord[]>(INITIAL_ACTIVITY_RECORDS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Safe client hydration
  useEffect(() => {
    try {
      const savedOpps = localStorage.getItem('dgd_market_opps');
      if (savedOpps) setOpportunities(JSON.parse(savedOpps));

      const savedIds = localStorage.getItem('dgd_saved_opp_ids');
      if (savedIds) setSavedOpportunityIds(JSON.parse(savedIds));

      const savedApps = localStorage.getItem('dgd_market_applications');
      if (savedApps) setApplications(JSON.parse(savedApps));

      const savedActs = localStorage.getItem('dgd_market_activities');
      if (savedActs) setActivityRecords(JSON.parse(savedActs));
    } catch (e) {
      console.error('Failed to load marketplace storage', e);
    }
    setIsHydrated(true);
  }, []);

  // Persist state
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('dgd_market_opps', JSON.stringify(opportunities));
      localStorage.setItem('dgd_saved_opp_ids', JSON.stringify(savedOpportunityIds));
      localStorage.setItem('dgd_market_applications', JSON.stringify(applications));
      localStorage.setItem('dgd_market_activities', JSON.stringify(activityRecords));
    }
  }, [opportunities, savedOpportunityIds, applications, activityRecords, isHydrated]);

  // Check if current NGO is verified
  const isNgoVerified = (ngoId: string): boolean => {
    const record = verifications.find((v) => v.id.includes(ngoId) || v.name.toLowerCase().includes('greencanopy'));
    if (record) return record.status === 'VERIFIED';
    // Fallback check profile
    return profile?.verified === true;
  };

  const createOpportunity = (data: Partial<Opportunity>) => {
    const currentNgoId = profile?.id === 'ngo-demo-1' ? 'ngo-1' : profile?.id || 'ngo-1';
    const verified = isNgoVerified(currentNgoId);

    // Rule: Only VERIFIED NGOs can publish opportunities
    let shouldPublish = data.isPublished ?? false;
    let message: string | undefined;

    if (shouldPublish && !verified) {
      shouldPublish = false;
      message = 'Your organization verification is pending. This drive has been saved as a Draft. Once your organization is verified by administrators, you can publish it.';
    }

    const newOpp: Opportunity = {
      id: 'opp-market-' + Date.now(),
      ngoProfileId: currentNgoId,
      ngoName: profile?.organizationName || profile?.fullName || 'GreenCanopy Initiative',
      ngoLogoUrl: profile?.avatarUrl,
      ngoVerified: verified,
      ngoDescription: profile?.bio || 'Grassroots non-profit organization.',
      title: data.title || 'Untitled Opportunity',
      description: data.description || '',
      cause: data.cause || 'Environment',
      responsibilities: data.responsibilities || [],
      requiredSkills: data.requiredSkills || [],
      preferredExperience: data.preferredExperience,
      location: data.location || 'Local Community Site',
      date: data.date || new Date().toISOString().split('T')[0],
      startTime: data.startTime || '09:00 AM',
      endTime: data.endTime || '01:00 PM',
      duration: data.duration || '4 Hours',
      volunteerCapacity: data.volunteerCapacity || 10,
      capacityFilled: 0,
      applicationDeadline: data.applicationDeadline || '2026-09-30',
      eligibilityRequirements: data.eligibilityRequirements,
      volunteeringMode: data.volunteeringMode || 'ON_SITE',
      applicationQuestions: data.applicationQuestions || [],
      visibility: data.visibility || 'PUBLIC',
      isPublished: shouldPublish,
      publishedAt: shouldPublish ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      // Compatibility
      startDate: data.date,
      commitmentHours: data.duration,
      skillsRequired: data.requiredSkills,
      status: 'open',
      type: 'volunteering',
      isRemote: data.volunteeringMode === 'REMOTE',
      capacityNeeded: data.volunteerCapacity || 10,
    };

    setOpportunities((prev) => [newOpp, ...prev]);
    return { success: true, published: shouldPublish, message };
  };

  const updateOpportunity = (id: string, data: Partial<Opportunity>) => {
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === id) {
          return {
            ...opp,
            ...data,
            startDate: data.date || opp.date,
            commitmentHours: data.duration || opp.duration,
            skillsRequired: data.requiredSkills || opp.requiredSkills,
          };
        }
        return opp;
      })
    );
  };

  const togglePublishOpportunity = (id: string) => {
    const target = opportunities.find((o) => o.id === id);
    if (!target) return { success: false, isPublished: false };

    const willPublish = !target.isPublished;
    if (willPublish && !isNgoVerified(target.ngoProfileId || 'ngo-1')) {
      return {
        success: false,
        isPublished: false,
        message: 'Only VERIFIED non-profit organizations can publish opportunities to the public marketplace. Please wait for administrator verification.',
      };
    }

    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === id
          ? {
              ...opp,
              isPublished: willPublish,
              publishedAt: willPublish ? new Date().toISOString() : opp.publishedAt,
            }
          : opp
      )
    );

    return {
      success: true,
      isPublished: willPublish,
      message: willPublish ? 'Opportunity published to marketplace.' : 'Opportunity unpublished.',
    };
  };

  const getOpportunityById = (id: string) => {
    return opportunities.find((o) => o.id === id);
  };

  // Saved Opportunities (Bookmarks - NEVER creates an application!)
  const toggleSaveOpportunity = (id: string) => {
    setSavedOpportunityIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isSaved = (id: string) => savedOpportunityIds.includes(id);

  // Application Workflow
  const checkProfileCompleteness = (): { isComplete: boolean; missingFields: string[] } => {
    const missing: string[] = [];
    const vol = volunteerProfile;

    if (!vol?.fullName && !profile?.fullName) missing.push('Full Name');
    if (!vol?.city && !vol?.location && !profile?.location) missing.push('Location (City/State)');
    if (!vol?.shortBio && !profile?.bio) missing.push('Short Bio');
    if (!vol?.causes || vol.causes.length === 0) missing.push('At least one Focus Cause');
    if (!vol?.skills || vol.skills.length === 0) missing.push('At least one Skill');
    if (!vol?.availableDays || vol.availableDays.length === 0) missing.push('Availability (Days of week)');
    if (!vol?.volunteeringPreference) missing.push('Volunteering Preference (Format)');
    if (!vol?.languages || vol.languages.length === 0) missing.push('Languages');

    return {
      isComplete: missing.length === 0,
      missingFields: missing,
    };
  };

  const hasApplied = (opportunityId: string) => {
    const volId = profile?.id || 'vol-1';
    return applications.some(
      (app) => app.opportunityId === opportunityId && app.volunteerProfileId === volId
    );
  };

  const getApplicationForOpportunity = (opportunityId: string) => {
    const volId = profile?.id || 'vol-1';
    return applications.find(
      (app) => app.opportunityId === opportunityId && app.volunteerProfileId === volId
    );
  };

  const submitApplication = (
    opportunityId: string,
    answers: { question: string; answer: string }[]
  ) => {
    const completeness = checkProfileCompleteness();
    if (!completeness.isComplete) {
      return {
        success: false,
        message: 'Your volunteer profile is incomplete.',
        missingFields: completeness.missingFields,
      };
    }

    const opp = getOpportunityById(opportunityId);
    if (!opp) return { success: false, message: 'Opportunity not found.' };

    const vol = volunteerProfile;
    const volId = profile?.id || 'vol-1';

    const appId = 'app-' + Date.now();
    const formattedAnswers: ApplicationAnswer[] = answers.map((a, idx) => ({
      id: `ans-${appId}-${idx}`,
      applicationId: appId,
      question: a.question,
      answer: a.answer,
    }));

    const newApp: Application = {
      id: appId,
      opportunityId,
      volunteerProfileId: volId,
      volunteerFullName: vol?.fullName || profile?.fullName || 'Sarah Jenkins',
      volunteerAvatarUrl: vol?.avatarUrl || profile?.avatarUrl,
      volunteerBio: vol?.shortBio || profile?.bio || 'Dedicated community volunteer.',
      volunteerLocation: vol ? `${vol.city}, ${vol.state}, ${vol.country}` : profile?.location || 'Seattle, WA',
      volunteerCauses: vol?.causes || profile?.causes || ['Environment'],
      volunteerSkills: vol?.skills || ['General Volunteering'],
      volunteerExperience: vol?.previousExperience || 'Active community participant.',
      volunteerAvailability: vol?.availableDays ? `${vol.availableDays.join(', ')} (${vol.availableTimes.join(', ')})` : 'Flexible',
      volunteerLanguages: vol?.languages || ['English'],
      status: 'PENDING',
      answers: formattedAnswers,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      opportunityTitle: opp.title,
      ngoName: opp.ngoName,
      date: opp.date,
      location: opp.location,
    };

    setApplications((prev) => [newApp, ...prev]);

    // Update capacity filled
    setOpportunities((prev) =>
      prev.map((o) => (o.id === opportunityId ? { ...o, capacityFilled: o.capacityFilled + 1 } : o))
    );

    return { success: true };
  };

  // NGO Application Review
  const getApplicationsForOpportunity = (opportunityId: string) => {
    return applications.filter((app) => app.opportunityId === opportunityId);
  };

  const getApplicationsForNgo = (ngoProfileId: string) => {
    const oppIds = opportunities.filter((o) => o.ngoProfileId === ngoProfileId).map((o) => o.id);
    return applications.filter((app) => oppIds.includes(app.opportunityId));
  };

  const updateApplicationStatus = (
    applicationId: string,
    status: ApplicationStatus,
    ngoPrivateNotes?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status,
              ngoPrivateNotes: ngoPrivateNotes !== undefined ? ngoPrivateNotes : app.ngoPrivateNotes,
              updatedAt: new Date().toISOString(),
            }
          : app
      )
    );

    // Trigger in-app notification to volunteer
    try {
      const existingNotifs = localStorage.getItem('dgd_notifications');
      const notifs = existingNotifs ? JSON.parse(existingNotifs) : [];
      const app = applications.find((a) => a.id === applicationId);

      const newNotif = {
        id: 'notif-' + Date.now(),
        recipientId: app?.volunteerProfileId || 'vol-1',
        type: 'APPLICATION_STATUS_CHANGED',
        title: `Application ${status === 'ACCEPTED' ? 'Accepted' : 'Updated'}`,
        message: `Your volunteering application for "${app?.opportunityTitle || 'initiative'}" has been marked as ${status}.`,
        linkUrl: '/volunteer/applications',
        read: false,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('dgd_notifications', JSON.stringify([newNotif, ...notifs]));
    } catch (e) {
      console.error('Failed to trigger notification for application status change', e);
    }
  };

  // Activity Completion & Verified Hours (NGO-only actions)
  const recordAttendanceAndHours = (params: {
    applicationId: string;
    opportunityId: string;
    volunteerProfileId: string;
    attendanceStatus: AttendanceStatus;
    activityDate: string;
    hours: number;
    hoursStatus: HoursVerificationStatus;
    notes?: string;
  }) => {
    // Rule: Volunteer must not be able to self-declare official attendance or verified hours
    if (profile?.role === 'volunteer') {
      return {
        success: false,
        message: 'Volunteers are not permitted to self-declare official attendance or hours.',
      };
    }

    const opp = getOpportunityById(params.opportunityId);
    const app = applications.find((a) => a.id === params.applicationId);
    const isVerified = params.hoursStatus === 'VERIFIED';

    setActivityRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.applicationId === params.applicationId);
      const recordUpdate: ActivityCompletionRecord = {
        id: existingIdx >= 0 ? prev[existingIdx].id : 'act-' + Date.now(),
        applicationId: params.applicationId,
        opportunityId: params.opportunityId,
        opportunityTitle: opp?.title || app?.opportunityTitle || 'Community Drive',
        ngoProfileId: opp?.ngoProfileId || 'ngo-1',
        ngoName: opp?.ngoName || 'GreenCanopy Initiative',
        cause: opp?.cause || 'Environment',
        volunteerProfileId: params.volunteerProfileId,
        volunteerFullName: app?.volunteerFullName || 'Volunteer',
        volunteerAvatarUrl: app?.volunteerAvatarUrl,
        attendanceStatus: params.attendanceStatus,
        activityDate: params.activityDate,
        hours: Number(params.hours) || 0,
        hoursStatus: params.hoursStatus,
        verifiedAt: isVerified ? new Date().toISOString() : undefined,
        verifiedByNgoId: isVerified ? profile?.id || 'ngo-1' : undefined,
        notes: params.notes,
        createdAt: existingIdx >= 0 ? prev[existingIdx].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = recordUpdate;
        return next;
      } else {
        return [recordUpdate, ...prev];
      }
    });

    if (isVerified) {
      try {
        const existingNotifs = localStorage.getItem('dgd_notifications');
        const notifs = existingNotifs ? JSON.parse(existingNotifs) : [];
        const newNotif = {
          id: 'notif-' + Date.now(),
          recipientId: params.volunteerProfileId,
          type: 'HOURS_VERIFIED',
          title: 'Volunteer Hours Verified',
          message: `Your ${params.hours} hours for "${opp?.title || 'drive'}" have been verified by ${opp?.ngoName || 'organizer'} and added to your official impact record.`,
          linkUrl: '/volunteer/impact',
          read: false,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('dgd_notifications', JSON.stringify([newNotif, ...notifs]));
      } catch (e) {
        console.error('Failed to notify volunteer of verified hours', e);
      }
    }

    return { success: true };
  };

  const verifyVolunteerHours = (recordId: string) => {
    // Rule: Volunteer must not be able to self-declare verified hours
    if (profile?.role === 'volunteer') {
      return {
        success: false,
        message: 'Volunteers cannot self-verify official hours.',
      };
    }

    let updatedRec: ActivityCompletionRecord | undefined;

    setActivityRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          updatedRec = {
            ...r,
            hoursStatus: 'VERIFIED',
            verifiedAt: new Date().toISOString(),
            verifiedByNgoId: profile?.id || 'ngo-1',
            updatedAt: new Date().toISOString(),
          };
          return updatedRec;
        }
        return r;
      })
    );

    if (updatedRec) {
      try {
        const existingNotifs = localStorage.getItem('dgd_notifications');
        const notifs = existingNotifs ? JSON.parse(existingNotifs) : [];
        const newNotif = {
          id: 'notif-' + Date.now(),
          recipientId: updatedRec.volunteerProfileId,
          type: 'HOURS_VERIFIED',
          title: 'Volunteer Hours Verified',
          message: `Your ${updatedRec.hours} hours for "${updatedRec.opportunityTitle}" have been verified by ${updatedRec.ngoName} and credited to your official impact record.`,
          linkUrl: '/volunteer/impact',
          read: false,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('dgd_notifications', JSON.stringify([newNotif, ...notifs]));
      } catch (e) {
        console.error('Failed to notify volunteer of verified hours', e);
      }
    }

    return { success: true, message: 'Hours verified and credited to volunteer official impact.' };
  };

  const getRecordsForOpportunity = (opportunityId: string) => {
    const acceptedApps = applications.filter(
      (a) => a.opportunityId === opportunityId && a.status === 'ACCEPTED'
    );
    const opp = getOpportunityById(opportunityId);

    return acceptedApps.map((app) => {
      const existing = activityRecords.find((r) => r.applicationId === app.id);
      if (existing) return existing;

      return {
        id: 'placeholder-' + app.id,
        applicationId: app.id,
        opportunityId: app.opportunityId,
        opportunityTitle: opp?.title || app.opportunityTitle || 'Volunteering Drive',
        ngoProfileId: opp?.ngoProfileId || 'ngo-1',
        ngoName: opp?.ngoName || 'GreenCanopy Initiative',
        cause: opp?.cause || 'Environment',
        volunteerProfileId: app.volunteerProfileId,
        volunteerFullName: app.volunteerFullName,
        volunteerAvatarUrl: app.volunteerAvatarUrl,
        attendanceStatus: 'UNRECORDED' as AttendanceStatus,
        activityDate: opp?.date || new Date().toISOString().split('T')[0],
        hours: parseFloat(opp?.duration?.replace(/[^0-9.]/g, '') || '4.0') || 4.0,
        hoursStatus: 'PENDING_VERIFICATION' as HoursVerificationStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const getRecordsForNgo = (ngoProfileId: string) => {
    const oppIds = opportunities.filter((o) => o.ngoProfileId === ngoProfileId).map((o) => o.id);
    return activityRecords.filter((r) => oppIds.includes(r.opportunityId));
  };

  const getImpactSummaryForVolunteer = (volunteerProfileId: string): VolunteerImpactSummary => {
    const records = activityRecords.filter(
      (r) => r.volunteerProfileId === volunteerProfileId || r.volunteerProfileId === 'vol-1'
    );

    // ONLY verified hours count towards official impact totals
    const verifiedRecords = records.filter(
      (r) => r.attendanceStatus === 'ATTENDED' && r.hoursStatus === 'VERIFIED'
    );

    // Pending records (logged but awaiting NGO verification)
    const pendingRecords = records.filter((r) => r.hoursStatus === 'PENDING_VERIFICATION');

    const totalVerifiedHours = verifiedRecords.reduce((acc, r) => acc + (Number(r.hours) || 0), 0);
    const activitiesCompletedCount = verifiedRecords.length;
    const ngosSupportedCount = new Set(verifiedRecords.map((r) => r.ngoProfileId || r.ngoName)).size;
    const causesSupported = Array.from(new Set(verifiedRecords.map((r) => r.cause)));

    return {
      totalVerifiedHours,
      activitiesCompletedCount,
      ngosSupportedCount,
      causesSupported,
      verifiedRecords,
      pendingRecords,
    };
  };

  return (
    <MarketplaceContext.Provider
      value={{
        opportunities,
        savedOpportunityIds,
        applications,
        activityRecords,
        createOpportunity,
        updateOpportunity,
        togglePublishOpportunity,
        getOpportunityById,
        toggleSaveOpportunity,
        isSaved,
        checkProfileCompleteness,
        submitApplication,
        hasApplied,
        getApplicationForOpportunity,
        getApplicationsForOpportunity,
        getApplicationsForNgo,
        updateApplicationStatus,
        recordAttendanceAndHours,
        verifyVolunteerHours,
        getRecordsForOpportunity,
        getRecordsForNgo,
        getImpactSummaryForVolunteer,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
