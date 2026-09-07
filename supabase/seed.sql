-- =========================================================================
-- Do Good Drive Marketplace - MVP Seed Data
-- Personas:
--   1. Volunteer: Sarah Jenkins (sarah.jenkins@example.com)
--   2. NGO (Verified): GreenCanopy Initiative (contact@greencanopy.org)
--   3. NGO (Pending Verification): CodeForward Foundation (director@codeforward.org)
--   4. Corporate: EcoTech Partners (csr@ecotechpartners.com)
-- =========================================================================

-- 1. Profiles
INSERT INTO public.profiles (id, full_name, email, role, avatar_url, created_at)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'Sarah Jenkins', 'sarah.jenkins@example.com', 'VOLUNTEER', NULL, now()),
    ('b2222222-2222-2222-2222-222222222222', 'GreenCanopy Initiative', 'contact@greencanopy.org', 'NGO', NULL, now()),
    ('c3333333-3333-3333-3333-333333333333', 'CodeForward Foundation', 'director@codeforward.org', 'NGO', NULL, now()),
    ('d4444444-4444-4444-4444-444444444444', 'EcoTech Partners', 'csr@ecotechpartners.com', 'CORPORATE', NULL, now())
ON CONFLICT (id) DO NOTHING;

-- 2. Volunteer Profile
INSERT INTO public.volunteer_profiles (
    profile_id, location, city, state, country, short_bio,
    causes, skills, available_days, available_times, frequency,
    volunteering_preference, languages, previous_experience, company_name
) VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'Seattle, WA, United States', 'Seattle', 'WA', 'United States',
    'Environmental researcher and community park steward passionate about urban re-wilding and native ecology.',
    ARRAY['Environment', 'Education'],
    ARRAY['Planting', 'Field Logistics', 'First Aid'],
    ARRAY['Saturday', 'Sunday'],
    ARRAY['Morning', 'Afternoon'],
    'Bi-weekly',
    'ON_SITE',
    ARRAY['English', 'Spanish'],
    '3 years volunteering with Pacific Northwest trail alliances and wetland restoration groups.',
    'Cascadia BioAnalytics'
) ON CONFLICT (profile_id) DO NOTHING;

-- 3. NGO Profiles
INSERT INTO public.ngo_profiles (
    profile_id, ngo_name, logo_url, description, mission,
    causes, locations, website, contact_information, registration_details,
    authorized_representative, verification_status
) VALUES
(
    'b2222222-2222-2222-2222-222222222222',
    'GreenCanopy Initiative', NULL,
    'Dedicated to urban canopy restoration, native wetland revegetation, and public river corridor stewardship through community conservation.',
    'To expand equitable urban canopy cover and restore degraded freshwater ecosystems across the Pacific Northwest.',
    ARRAY['Environment', 'Conservation', 'Climate Action'],
    ARRAY['Portland, OR', 'Seattle, WA', 'United States'],
    'https://greencanopy.org',
    '{"email": "contact@greencanopy.org", "phone": "+1 (503) 555-0144", "address": "1040 SW 2nd Ave, Portland, OR 97204"}'::jsonb,
    '{"registrationNumber": "US-OR-501C3-89421", "yearEstablished": "2018", "countryOfRegistration": "United States"}'::jsonb,
    '{"fullName": "David Martinez", "title": "Executive Director", "email": "david@greencanopy.org"}'::jsonb,
    'VERIFIED'
),
(
    'c3333333-3333-3333-3333-333333333333',
    'CodeForward Foundation', NULL,
    'Technology education initiative empowering underrepresented secondary students with free coding hardware and structured STEM mentorship.',
    'To eliminate the digital divide for underserved youth through open curriculum, hardware access, and 1-on-1 developer mentorship.',
    ARRAY['Education', 'Youth Empowerment', 'Technology'],
    ARRAY['San Francisco, CA', 'Oakland, CA', 'Virtual / Global'],
    'https://codeforward.org',
    '{"email": "connect@codeforward.org", "phone": "+1 (415) 555-0182", "address": "450 Mission St, San Francisco, CA 94105"}'::jsonb,
    '{"registrationNumber": "US-CA-501C3-11029", "yearEstablished": "2021", "countryOfRegistration": "United States"}'::jsonb,
    '{"fullName": "Elena Rostova", "title": "Founder & Program Head", "email": "elena@codeforward.org"}'::jsonb,
    'VERIFICATION_PENDING'
)
ON CONFLICT (profile_id) DO NOTHING;

-- 4. Corporate Profile
INSERT INTO public.corporate_profiles (
    profile_id, company_name, logo_url, description, website,
    locations, csr_focus_areas, csr_contact, authorized_administrator, verification_status
) VALUES (
    'd4444444-4444-4444-4444-444444444444',
    'EcoTech Partners', NULL,
    'Enterprise clean energy software provider committed to carbon-neutral operations and community sustainability partnerships.',
    'https://ecotechpartners.com',
    ARRAY['Portland, OR, United States'],
    ARRAY['Environment', 'Sustainability', 'STEM Education'],
    '{"email": "csr@ecotechpartners.com", "phone": "+1 (503) 555-0810", "address": "820 SW Morrison St, Portland, OR"}'::jsonb,
    '{"fullName": "Rachel Thorne", "title": "Head of Corporate Social Responsibility", "email": "rachel@ecotechpartners.com"}'::jsonb,
    'VERIFIED'
) ON CONFLICT (profile_id) DO NOTHING;

-- 5. Opportunities
INSERT INTO public.opportunities (
    id, ngo_profile_id, ngo_name, title, description, cause,
    responsibilities, required_skills, preferred_experience,
    location, date, start_time, end_time, duration,
    volunteer_capacity, capacity_filled, application_deadline,
    eligibility_requirements, volunteering_mode, application_questions,
    visibility, is_published, published_at
) VALUES
(
    'e5555555-5555-5555-5555-555555555555',
    'b2222222-2222-2222-2222-222222222222',
    'GreenCanopy Initiative',
    'Urban Reforestation & Riparian Planting Drive',
    'Help re-establish indigenous willow, alder, and dogwood saplings along 1.5 miles of degraded riparian wetlands to stabilize riverbanks and cool critical salmon spawning waters.',
    'Environment',
    ARRAY['Plant native saplings and install protective mulch rings', 'Transport planting tools and soil amendments across work zones', 'Install biodegradable stake guards around tender shoots'],
    ARRAY['Planting', 'Field Logistics', 'First Aid'],
    'Previous experience with outdoor conservation or gardening preferred, but field instruction provided.',
    'East Basin Check-in Station, Portland, OR',
    '2026-09-12', '09:00 AM', '01:00 PM', '4 Hours',
    25, 1, '2026-09-10',
    'Must be comfortable standing on uneven riverbank terrain and lifting up to 25 lbs.',
    'ON_SITE',
    ARRAY['Do you have any physical restrictions or allergies to outdoor plants/bees?', 'Have you participated in conservation planting efforts before?'],
    'PUBLIC', true, now()
),
(
    'f6666666-6666-6666-6666-666666666666',
    'b2222222-2222-2222-2222-222222222222',
    'GreenCanopy Initiative',
    'Autumn Seed Harvesting & Native Nursery Prep',
    'Join our nursery team to harvest native conifer cones and wildflower seed pods for propagation in the Spring conservation planting series.',
    'Environment',
    ARRAY['Hand-pick mature seed pods and cones from designated wild stands', 'Clean and separate seed husk chaff in the nursery drying shed', 'Catalog seed lots by geographic elevation band'],
    ARRAY['Attention to Detail', 'Botanical Identification', 'Seed Sorting'],
    'Prior seed handling or gardening background welcome.',
    'Canopy Native Nursery & Seed Bank, Troutdale, OR',
    '2026-09-26', '10:00 AM', '02:00 PM', '4 Hours',
    15, 0, '2026-09-24',
    'Indoor/outdoor hybrid shed work. Protective eyewear provided.',
    'ON_SITE',
    ARRAY['Are you comfortable performing fine motor seed sorting for extended periods?'],
    'PUBLIC', true, now()
),
(
    '11111111-2222-3333-4444-555555555555',
    'c3333333-3333-3333-3333-333333333333',
    'CodeForward Foundation',
    'Youth Robotics & Coding Mentorship Workshop',
    'Empower middle-school students from underfunded districts through weekly hands-on programming labs using Scratch and micro:bit hardware kits.',
    'Education',
    ARRAY['Assist students with logic puzzles and basic loop structures', 'Guide student pairs through robotic sensor wire connections', 'Provide positive encouragement and problem-solving coaching'],
    ARRAY['Basic Python / Scratch', 'Patience', 'Youth Mentoring'],
    'Enthusiasm for sharing STEM concepts with beginners.',
    'Civic STEM Lab, 450 Mission St, San Francisco, CA',
    '2026-10-03', '01:00 PM', '04:00 PM', '3 Hours',
    12, 0, '2026-10-01',
    'Background check clearance required for working with secondary school youth.',
    'HYBRID',
    ARRAY['Do you have prior experience facilitating or tutoring youth programs?'],
    'PUBLIC', false, NULL -- Draft state (unverified NGO cannot publish)
)
ON CONFLICT (id) DO NOTHING;

-- 6. Application (Sarah Jenkins -> Urban Reforestation Drive)
INSERT INTO public.applications (
    id, opportunity_id, volunteer_profile_id, status, ngo_private_notes, applied_at, updated_at
) VALUES (
    'a7777777-7777-7777-7777-777777777777',
    'e5555555-5555-5555-5555-555555555555',
    'a1111111-1111-1111-1111-111111111111',
    'ACCEPTED',
    'Experienced volunteer with native planting background. Assign as co-lead for Basin 2 planting line.',
    now() - interval '5 days',
    now() - interval '3 days'
) ON CONFLICT (id) DO NOTHING;

-- 7. Verified Activity Completion & Hours Record
INSERT INTO public.attendance_records (
    id, application_id, opportunity_id, volunteer_profile_id,
    status, activity_date, hours, hours_status, verified_at,
    verified_by_ngo_id, coordinator_notes, created_at, updated_at
) VALUES (
    'b8888888-8888-8888-8888-888888888888',
    'a7777777-7777-7777-7777-777777777777',
    'e5555555-5555-5555-5555-555555555555',
    'a1111111-1111-1111-1111-111111111111',
    'ATTENDED',
    '2026-09-12',
    4.00,
    'VERIFIED',
    now() - interval '1 day',
    'b2222222-2222-2222-2222-222222222222',
    'Excellent contribution. Co-led Basin 2 planting team.',
    now() - interval '2 days',
    now() - interval '1 day'
) ON CONFLICT (id) DO NOTHING;

-- 8. Corporate Connection Request (EcoTech Partners -> GreenCanopy Initiative)
INSERT INTO public.corporate_connection_requests (
    id, corporate_profile_id, ngo_profile_id, status, initial_message, created_at, updated_at
) VALUES (
    'c9999999-9999-9999-9999-999999999999',
    'd4444444-4444-4444-4444-444444444444',
    'b2222222-2222-2222-2222-222222222222',
    'PENDING',
    'EcoTech Partners would like to explore sponsoring native saplings and participating in upcoming lower Willamette planting drives.',
    now() - interval '2 days',
    now() - interval '2 days'
) ON CONFLICT (id) DO NOTHING;

-- 9. Saved Opportunity
INSERT INTO public.saved_opportunities (
    id, volunteer_profile_id, opportunity_id, created_at
) VALUES (
    'd0000000-0000-0000-0000-000000000000',
    'a1111111-1111-1111-1111-111111111111',
    'f6666666-6666-6666-6666-666666666666',
    now() - interval '3 days'
) ON CONFLICT (id) DO NOTHING;
