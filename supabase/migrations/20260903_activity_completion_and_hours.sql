-- Migration: 20260903_activity_completion_and_hours.sql
-- Description: Lightweight activity completion, attendance tracking, and verified volunteer hours

-- 1. Ensure Attendance Records Table Schema
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    volunteer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('ATTENDED', 'ABSENT', 'UNRECORDED')) NOT NULL DEFAULT 'UNRECORDED',
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    hours NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    hours_status TEXT CHECK (hours_status IN ('PENDING_VERIFICATION', 'VERIFIED')) NOT NULL DEFAULT 'PENDING_VERIFICATION',
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by_ngo_id UUID REFERENCES public.profiles(id),
    coordinator_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_application_attendance UNIQUE (application_id)
);

-- 2. Indexes for efficient lookup
CREATE INDEX IF NOT EXISTS idx_attendance_opp ON public.attendance_records(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_attendance_vol ON public.attendance_records(volunteer_profile_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_attendance_hours_status ON public.attendance_records(hours_status);

-- 3. Row-Level Security
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Volunteers can read their own attendance and verified hours (read-only, no self-declaration)
CREATE POLICY "Volunteers can view their own attendance records"
    ON public.attendance_records
    FOR SELECT
    USING (auth.uid() = volunteer_profile_id);

-- NGOs can manage attendance records for opportunities they organize
CREATE POLICY "NGOs manage attendance for their opportunities"
    ON public.attendance_records
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.opportunities
            WHERE opportunities.id = attendance_records.opportunity_id
            AND opportunities.ngo_profile_id = auth.uid()
        )
    );
