export type UserRole = 'volunteer' | 'ngo' | 'corporate';
export type PrimaryRole = 'VOLUNTEER' | 'NGO' | 'CORPORATE';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'volunteer' | 'ngo' | 'corporate';
  organizationName?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  causes: string[];
  verified?: boolean;
  createdAt: string;
}

export type OpportunityType = 'volunteering' | 'mentorship' | 'skills_based' | 'csr_initiative';
export type OpportunityStatus = 'open' | 'in_review' | 'closed' | 'urgent';
export type VolunteeringMode = 'ON_SITE' | 'REMOTE' | 'HYBRID';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  cause: string;
  location: string;
  capacityFilled: number;

  // New Marketplace Fields
  ngoProfileId?: string;
  ngoName?: string;
  ngoLogoUrl?: string;
  ngoVerified?: boolean;
  ngoDescription?: string;
  responsibilities?: string[];
  requiredSkills?: string[];
  preferredExperience?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  volunteerCapacity?: number;
  applicationDeadline?: string;
  eligibilityRequirements?: string;
  volunteeringMode?: VolunteeringMode;
  applicationQuestions?: string[];
  visibility?: PostVisibility;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;

  // Legacy & Shared Card Fields
  organizationId?: string;
  organizationName?: string;
  organizationType?: 'ngo' | 'corporate';
  type?: OpportunityType;
  status?: OpportunityStatus;
  isRemote?: boolean;
  skillsRequired?: string[];
  startDate?: string;
  capacityNeeded?: number;
  commitmentHours?: string;
  featured?: boolean;
  corporateSponsor?: string;
}

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface ApplicationAnswer {
  id: string;
  applicationId: string;
  question: string;
  answer: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  volunteerProfileId: string;
  volunteerFullName: string;
  volunteerAvatarUrl?: string;
  volunteerBio: string;
  volunteerLocation: string;
  volunteerCauses: string[];
  volunteerSkills: string[];
  volunteerExperience?: string;
  volunteerAvailability: string;
  volunteerLanguages: string[];
  status: ApplicationStatus;
  answers: ApplicationAnswer[];
  ngoPrivateNotes?: string;
  appliedAt: string;
  updatedAt: string;
  opportunityTitle?: string;
  ngoName?: string;
  date?: string;
  location?: string;
}

export interface SavedOpportunity {
  id: string;
  volunteerProfileId: string;
  opportunityId: string;
  createdAt: string;
}

export type AttendanceStatus = 'ATTENDED' | 'ABSENT' | 'UNRECORDED';
export type HoursVerificationStatus = 'PENDING_VERIFICATION' | 'VERIFIED';

export interface ActivityCompletionRecord {
  id: string;
  applicationId: string;
  opportunityId: string;
  opportunityTitle: string;
  ngoProfileId: string;
  ngoName: string;
  cause: string;
  volunteerProfileId: string;
  volunteerFullName: string;
  volunteerAvatarUrl?: string;
  attendanceStatus: AttendanceStatus;
  activityDate: string;
  hours: number;
  hoursStatus: HoursVerificationStatus;
  verifiedAt?: string;
  verifiedByNgoId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerImpactSummary {
  totalVerifiedHours: number;
  activitiesCompletedCount: number;
  ngosSupportedCount: number;
  causesSupported: string[];
  verifiedRecords: ActivityCompletionRecord[];
  pendingRecords: ActivityCompletionRecord[];
}

export type ConnectionRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface CorporateConnectionRequest {
  id: string;
  corporateProfileId: string;
  corporateName: string;
  corporateLogoUrl?: string;
  corporateDescription?: string;
  corporateLocation: string;
  corporateCsrFocusAreas: string[];
  ngoProfileId: string;
  ngoName: string;
  status: ConnectionRequestStatus;
  initialMessage?: string;
  responseNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NgoDiscoveryFilters {
  keyword: string;
  cause: string;
  location: string;
  verificationStatus: 'ALL' | 'VERIFIED' | 'VERIFICATION_PENDING';
}

export interface CSRGrant {
  id: string;
  title: string;
  corporateName: string;
  description: string;
  budgetScope: string;
  focusArea: string;
  eligibleNgosCount?: number;
  deadline: string;
  status: 'active' | 'evaluating' | 'awarded';
}

export interface SearchFilterState {
  query: string;
  cause: string;
  locationType: 'all' | 'remote' | 'on_site';
  status: 'all' | 'open' | 'urgent';
}

/* =========================================================================
   Community Feed, NGO Posts, Events & In-App Notifications
   ========================================================================= */

export type PostType = 'POST' | 'IMPACT_STORY';
export type InteractivePostType = 'POST' | 'IMPACT_STORY' | 'DRIVE_UPDATE' | 'CSR_PLEDGE';
export type PostVisibility = 'PUBLIC' | 'VOLUNTEER_ONLY' | 'CORPORATE_ONLY';
export type ReactionType = 'LIKE' | 'CELEBRATE' | 'SUPPORT' | 'INSIGHTFUL';

export interface PostComment {
  id: string;
  postId: string;
  authorProfileId: string;
  authorRole: UserRole;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  createdAt: string;
}

export interface InteractivePost {
  id: string;
  authorProfileId: string;
  authorRole: UserRole;
  authorName: string;
  authorAvatarUrl?: string;
  authorTagline: string;
  type: InteractivePostType;
  title?: string;
  content: string;
  imageUrl?: string;
  cause?: string;
  reactions: Record<ReactionType, number>;
  userReaction?: ReactionType;
  comments: PostComment[];
  sharesCount: number;
  createdAt: string;
}

export interface Post {
  id: string;
  ngoProfileId: string;
  ngoName: string;
  type: PostType;
  title: string;
  body: string;
  imageUrl?: string;
  cause: string;
  visibility: PostVisibility;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  impactMetric?: string;
}

export interface CommunityEvent {
  id: string;
  ngoProfileId: string;
  ngoName: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  isRemote: boolean;
  capacity: number;
  rsvpCount: number;
  cause: string;
  isPublished: boolean;
  createdAt: string;
}

export type FeedItemType = 'post' | 'impact_story' | 'opportunity' | 'event';

export interface UnifiedFeedItem {
  id: string;
  itemType: FeedItemType;
  publishedAt: string;
  ngoProfileId: string;
  ngoName: string;
  cause: string;
  visibility: PostVisibility;
  postData?: Post;
  opportunityData?: Opportunity;
  eventData?: CommunityEvent;
}

export interface NgoFollow {
  id: string;
  followerProfileId: string;
  ngoProfileId: string;
  createdAt: string;
}

export type NotificationType =
  | 'NGO_OPPORTUNITY_PUBLISHED'
  | 'NGO_POST_PUBLISHED'
  | 'APPLICATION_STATUS_CHANGED'
  | 'CONNECTION_STATUS_CHANGED';

export interface NotificationItem {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  read: boolean;
  createdAt: string;
}

/* =========================================================================
   Profile Onboarding & Verification Schemas & Models
   ========================================================================= */

export type VerificationStatus =
  | 'VERIFICATION_PENDING'
  | 'VERIFIED'
  | 'MORE_INFORMATION_REQUIRED'
  | 'REJECTED';

export type VolunteeringPreference = 'ON_SITE' | 'REMOTE' | 'HYBRID';

export interface VolunteerProfileData {
  profileId?: string;
  fullName: string;
  avatarUrl?: string;
  location: string;
  city: string;
  state: string;
  country: string;
  shortBio: string;
  causes: string[];
  skills: string[];
  availableDays: string[];
  availableTimes: string[];
  frequency: string;
  volunteeringPreference: VolunteeringPreference;
  languages: string[];
  previousExperience?: string;
  companyName?: string;
  createdAt?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address?: string;
}

export interface RegistrationDetails {
  registrationNumber: string;
  taxId?: string;
  yearEstablished: string;
  countryOfRegistration: string;
}

export interface AuthorizedPerson {
  fullName: string;
  title: string;
  email: string;
  phone?: string;
}

export interface NgoProfileData {
  profileId: string;
  ngoName: string;
  logoUrl?: string;
  description: string;
  mission: string;
  causes: string[];
  locations: string[];
  website?: string;
  contactInformation: ContactInfo;
  registrationDetails: RegistrationDetails;
  authorizedRepresentative: AuthorizedPerson;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  createdAt: string;
}

export interface CorporateProfileData {
  profileId: string;
  companyName: string;
  logoUrl?: string;
  description: string;
  website?: string;
  locations: string[];
  csrFocusAreas: string[];
  csrContact: ContactInfo;
  authorizedAdministrator: AuthorizedPerson;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  createdAt: string;
}
