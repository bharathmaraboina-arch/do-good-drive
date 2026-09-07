-- Supabase SQL Migration: Profiles, Volunteer Profiles, NGO Profiles, and Corporate Profiles with RLS

-- 1. Base Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT CHECK (role IN ('VOLUNTEER', 'NGO', 'CORPORATE')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Volunteer Profiles Table
CREATE TABLE IF NOT EXISTS public.volunteer_profiles (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    short_bio TEXT NOT NULL,
    causes TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    available_days TEXT[] NOT NULL DEFAULT '{}',
    available_times TEXT[] NOT NULL DEFAULT '{}',
    frequency TEXT NOT NULL,
    volunteering_preference TEXT CHECK (volunteering_preference IN ('ON_SITE', 'REMOTE', 'HYBRID')) NOT NULL DEFAULT 'HYBRID',
    languages TEXT[] NOT NULL DEFAULT '{"English"}',
    previous_experience TEXT,
    company_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. NGO Profiles Table
CREATE TABLE IF NOT EXISTS public.ngo_profiles (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    ngo_name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT NOT NULL,
    mission TEXT NOT NULL,
    causes TEXT[] NOT NULL DEFAULT '{}',
    locations TEXT[] NOT NULL DEFAULT '{}',
    website TEXT,
    contact_information JSONB NOT NULL DEFAULT '{}'::jsonb,
    registration_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    authorized_representative JSONB NOT NULL DEFAULT '{}'::jsonb,
    verification_status TEXT CHECK (verification_status IN (
        'VERIFICATION_PENDING',
        'VERIFIED',
        'MORE_INFORMATION_REQUIRED',
        'REJECTED'
    )) NOT NULL DEFAULT 'VERIFICATION_PENDING',
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Corporate Profiles Table
CREATE TABLE IF NOT EXISTS public.corporate_profiles (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT NOT NULL,
    website TEXT,
    locations TEXT[] NOT NULL DEFAULT '{}',
    csr_focus_areas TEXT[] NOT NULL DEFAULT '{}',
    csr_contact JSONB NOT NULL DEFAULT '{}'::jsonb,
    authorized_administrator JSONB NOT NULL DEFAULT '{}'::jsonb,
    verification_status TEXT CHECK (verification_status IN (
        'VERIFICATION_PENDING',
        'VERIFIED',
        'MORE_INFORMATION_REQUIRED',
        'REJECTED'
    )) NOT NULL DEFAULT 'VERIFICATION_PENDING',
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_ngo_verification_status ON public.ngo_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_corporate_verification_status ON public.corporate_profiles(verification_status);

-- Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_profiles ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
-- Profiles: Users can read all public profiles, but only update their own
CREATE POLICY "Public read for profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Volunteer Profiles: Public read, own manage
CREATE POLICY "Public read for volunteer profiles" ON public.volunteer_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users manage own volunteer profile" ON public.volunteer_profiles
    FOR ALL USING (auth.uid() = profile_id);

-- NGO Profiles: Public read, own manage
CREATE POLICY "Public read for ngo profiles" ON public.ngo_profiles
    FOR SELECT USING (true);

CREATE POLICY "NGOs manage own profile" ON public.ngo_profiles
    FOR ALL USING (auth.uid() = profile_id);

-- Corporate Profiles: Public read, own manage
CREATE POLICY "Public read for corporate profiles" ON public.corporate_profiles
    FOR SELECT USING (true);

CREATE POLICY "Corporates manage own profile" ON public.corporate_profiles
    FOR ALL USING (auth.uid() = profile_id);
