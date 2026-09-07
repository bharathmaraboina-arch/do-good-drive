-- Migration: 20260903_corporate_mvp.sql
-- Description: Corporate MVP tables: shortlists and corporate-NGO connection requests

-- 1. Corporate Shortlists Table
CREATE TABLE IF NOT EXISTS public.corporate_shortlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corporate_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ngo_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_corporate_ngo_shortlist UNIQUE (corporate_profile_id, ngo_profile_id)
);

-- 2. Corporate Connection Requests Table
CREATE TABLE IF NOT EXISTS public.corporate_connection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corporate_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ngo_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED')) NOT NULL DEFAULT 'PENDING',
    initial_message TEXT,
    response_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_corporate_ngo_request UNIQUE (corporate_profile_id, ngo_profile_id)
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shortlist_corp ON public.corporate_shortlists(corporate_profile_id);
CREATE INDEX IF NOT EXISTS idx_shortlist_ngo ON public.corporate_shortlists(ngo_profile_id);
CREATE INDEX IF NOT EXISTS idx_conn_corp ON public.corporate_connection_requests(corporate_profile_id);
CREATE INDEX IF NOT EXISTS idx_conn_ngo ON public.corporate_connection_requests(ngo_profile_id);
CREATE INDEX IF NOT EXISTS idx_conn_status ON public.corporate_connection_requests(status);

-- 4. Enable Row-Level Security
ALTER TABLE public.corporate_shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_connection_requests ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Corporates manage their own shortlists
CREATE POLICY "Corporates manage own shortlists"
    ON public.corporate_shortlists
    FOR ALL
    USING (auth.uid() = corporate_profile_id);

-- Corporates can view and send their own connection requests
CREATE POLICY "Corporates manage own connection requests"
    ON public.corporate_connection_requests
    FOR ALL
    USING (auth.uid() = corporate_profile_id);

-- NGOs can view and update connection requests sent to them
CREATE POLICY "NGOs view and respond to connection requests"
    ON public.corporate_connection_requests
    FOR ALL
    USING (auth.uid() = ngo_profile_id);
