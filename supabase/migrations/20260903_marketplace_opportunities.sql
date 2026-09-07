-- Supabase SQL Migration: Core Volunteer-NGO Opportunity Marketplace

-- 1. Opportunities Table
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ngo_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ngo_name TEXT NOT NULL,
    ngo_logo_url TEXT,
    ngo_verified BOOLEAN DEFAULT false,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cause TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    preferred_experience TEXT,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    volunteer_capacity INTEGER NOT NULL DEFAULT 10,
    capacity_filled INTEGER NOT NULL DEFAULT 0,
    application_deadline TEXT NOT NULL,
    eligibility_requirements TEXT,
    volunteering_mode TEXT CHECK (volunteering_mode IN ('ON_SITE', 'REMOTE', 'HYBRID')) NOT NULL DEFAULT 'ON_SITE',
    application_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    visibility TEXT CHECK (visibility IN ('PUBLIC', 'VOLUNTEER_ONLY', 'CORPORATE_ONLY')) NOT NULL DEFAULT 'PUBLIC',
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Saved Opportunities Table
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_saved_volunteer_opportunity UNIQUE (volunteer_profile_id, opportunity_id)
);

-- 3. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    volunteer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')) NOT NULL DEFAULT 'PENDING',
    ngo_private_notes TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_volunteer_opportunity_application UNIQUE (opportunity_id, volunteer_profile_id)
);

-- 4. Application Answers Table
CREATE TABLE IF NOT EXISTS public.application_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('ATTENDED', 'NO_SHOW', 'EXCUSED')) NOT NULL DEFAULT 'ATTENDED',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Volunteer Hours Table
CREATE TABLE IF NOT EXISTS public.volunteer_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    hours_logged NUMERIC(6, 2) NOT NULL,
    verified_by_ngo_id UUID NOT NULL REFERENCES public.profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_opportunities_cause ON public.opportunities(cause);
CREATE INDEX IF NOT EXISTS idx_opportunities_mode ON public.opportunities(volunteering_mode);
CREATE INDEX IF NOT EXISTS idx_opportunities_ngo ON public.opportunities(ngo_profile_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_published ON public.opportunities(is_published);
CREATE INDEX IF NOT EXISTS idx_applications_opp ON public.applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_vol ON public.applications(volunteer_profile_id);
CREATE INDEX IF NOT EXISTS idx_saved_opp_vol ON public.saved_opportunities(volunteer_profile_id);

-- Enable Row-Level Security
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_hours ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Public read published opportunities" ON public.opportunities
    FOR SELECT USING (is_published = true OR auth.uid() = ngo_profile_id);

CREATE POLICY "NGO manage own opportunities" ON public.opportunities
    FOR ALL USING (auth.uid() = ngo_profile_id);

CREATE POLICY "Volunteers manage saved opportunities" ON public.saved_opportunities
    FOR ALL USING (auth.uid() = volunteer_profile_id);

CREATE POLICY "Volunteers see own applications" ON public.applications
    FOR SELECT USING (auth.uid() = volunteer_profile_id);

CREATE POLICY "NGOs manage applications for their opportunities" ON public.applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.opportunities
            WHERE opportunities.id = applications.opportunity_id
            AND opportunities.ngo_profile_id = auth.uid()
        )
    );
