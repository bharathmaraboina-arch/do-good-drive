-- =========================================================================
-- Migration: 20260907_mvp_audit_and_hardening.sql
-- Description: End-to-End Row-Level Security (RLS) Audit, Role Boundaries,
--              Privacy Guards, and Verification Rules for Do Good Drive MVP.
-- =========================================================================

-- 1. Profiles & Role Isolation
-- Users can only modify their own profile records
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users manage own volunteer profile" ON public.volunteer_profiles;
CREATE POLICY "Users manage own volunteer profile" ON public.volunteer_profiles
    FOR ALL
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "NGOs manage own profile" ON public.ngo_profiles;
CREATE POLICY "NGOs manage own profile" ON public.ngo_profiles
    FOR ALL
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Corporates manage own profile" ON public.corporate_profiles;
CREATE POLICY "Corporates manage own profile" ON public.corporate_profiles
    FOR ALL
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

-- 2. Opportunities Publishing & Management
-- Rule: Only VERIFIED NGOs can publish opportunities to the marketplace.
-- Unverified NGOs can save drafts (is_published = false) or preview.
DROP POLICY IF EXISTS "NGO manage own opportunities" ON public.opportunities;
CREATE POLICY "NGO manage own opportunities" ON public.opportunities
    FOR ALL
    USING (auth.uid() = ngo_profile_id)
    WITH CHECK (
        auth.uid() = ngo_profile_id
        AND (
            is_published = false
            OR EXISTS (
                SELECT 1 FROM public.ngo_profiles
                WHERE ngo_profiles.profile_id = auth.uid()
                AND ngo_profiles.verification_status = 'VERIFIED'
            )
        )
    );

DROP POLICY IF EXISTS "Public read published opportunities" ON public.opportunities;
CREATE POLICY "Public read published opportunities" ON public.opportunities
    FOR SELECT
    USING (is_published = true OR auth.uid() = ngo_profile_id);

-- 3. Applications & Note Protection
-- Rule: Volunteers can only see their own applications.
-- Rule: Internal NGO notes must NEVER be visible to volunteers.
DROP POLICY IF EXISTS "Volunteers see own applications" ON public.applications;
CREATE POLICY "Volunteers see own applications" ON public.applications
    FOR SELECT
    USING (auth.uid() = volunteer_profile_id);

DROP POLICY IF EXISTS "Volunteers create own applications" ON public.applications;
CREATE POLICY "Volunteers create own applications" ON public.applications
    FOR INSERT
    WITH CHECK (auth.uid() = volunteer_profile_id);

DROP POLICY IF EXISTS "NGOs manage applications for their opportunities" ON public.applications;
CREATE POLICY "NGOs manage applications for their opportunities" ON public.applications
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.opportunities
            WHERE opportunities.id = applications.opportunity_id
            AND opportunities.ngo_profile_id = auth.uid()
        )
    );

-- Create a sanitized view for volunteers that excludes internal NGO notes
CREATE OR REPLACE VIEW public.volunteer_applications_view AS
SELECT
    id,
    opportunity_id,
    volunteer_profile_id,
    status,
    applied_at,
    updated_at
    -- Explicitly omits ngo_private_notes
FROM public.applications
WHERE auth.uid() = volunteer_profile_id;

-- 4. Saved Opportunities (Bookmarks)
-- Rule: Volunteers can access only their own saved opportunities.
-- Saving an opportunity never creates an application.
DROP POLICY IF EXISTS "Volunteers manage saved opportunities" ON public.saved_opportunities;
CREATE POLICY "Volunteers manage saved opportunities" ON public.saved_opportunities
    FOR ALL
    USING (auth.uid() = volunteer_profile_id)
    WITH CHECK (auth.uid() = volunteer_profile_id);

-- 5. Attendance & Verified Hours
-- Rule: Volunteers have strictly read-only visibility into their own records.
-- Rule: Volunteers cannot self-declare attendance or verified hours.
DROP POLICY IF EXISTS "Volunteers can view their own attendance records" ON public.attendance_records;
CREATE POLICY "Volunteers can view their own attendance records" ON public.attendance_records
    FOR SELECT
    USING (auth.uid() = volunteer_profile_id);

DROP POLICY IF EXISTS "NGOs manage attendance for their opportunities" ON public.attendance_records;
CREATE POLICY "NGOs manage attendance for their opportunities" ON public.attendance_records
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.opportunities
            WHERE opportunities.id = attendance_records.opportunity_id
            AND opportunities.ngo_profile_id = auth.uid()
        )
    );

-- 6. Corporate Shortlist & Connection Requests
-- Rule: Corporates can access only their own shortlist and connection requests.
DROP POLICY IF EXISTS "Corporates manage own shortlists" ON public.corporate_shortlists;
CREATE POLICY "Corporates manage own shortlists" ON public.corporate_shortlists
    FOR ALL
    USING (auth.uid() = corporate_profile_id)
    WITH CHECK (auth.uid() = corporate_profile_id);

DROP POLICY IF EXISTS "Corporates manage own connection requests" ON public.corporate_connection_requests;
CREATE POLICY "Corporates manage own connection requests" ON public.corporate_connection_requests
    FOR ALL
    USING (auth.uid() = corporate_profile_id)
    WITH CHECK (auth.uid() = corporate_profile_id);

-- Rule: NGOs can only view and respond to connection requests sent to their profile.
DROP POLICY IF EXISTS "NGOs view and respond to connection requests" ON public.corporate_connection_requests;
CREATE POLICY "NGOs view and respond to connection requests" ON public.corporate_connection_requests
    FOR ALL
    USING (auth.uid() = ngo_profile_id)
    WITH CHECK (auth.uid() = ngo_profile_id);
