-- Supabase SQL Migration: Community Feed, NGO Follows, Events, and In-App Notifications

-- 1. NGO Follows table
CREATE TABLE IF NOT EXISTS public.ngo_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_profile_id TEXT NOT NULL,
    ngo_profile_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(follower_profile_id, ngo_profile_id)
);

CREATE INDEX IF NOT EXISTS idx_ngo_follows_follower ON public.ngo_follows(follower_profile_id);
CREATE INDEX IF NOT EXISTS idx_ngo_follows_ngo ON public.ngo_follows(ngo_profile_id);

-- 2. Posts & Impact Stories table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ngo_profile_id TEXT NOT NULL,
    ngo_name TEXT NOT NULL,
    type TEXT CHECK (type IN ('POST', 'IMPACT_STORY')) NOT NULL DEFAULT 'POST',
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    image_url TEXT,
    cause TEXT NOT NULL DEFAULT 'General Community',
    visibility TEXT CHECK (visibility IN ('PUBLIC', 'VOLUNTEER_ONLY', 'CORPORATE_ONLY')) NOT NULL DEFAULT 'PUBLIC',
    is_published BOOLEAN DEFAULT true NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_ngo ON public.posts(ngo_profile_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(published_at DESC) WHERE is_published = true;

-- 3. Community Events table (ready for event module)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ngo_profile_id TEXT NOT NULL,
    ngo_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    is_remote BOOLEAN DEFAULT false NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 50,
    rsvp_count INTEGER NOT NULL DEFAULT 0,
    cause TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date ASC);

-- 4. In-App Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id TEXT NOT NULL,
    type TEXT CHECK (type IN (
        'NGO_OPPORTUNITY_PUBLISHED',
        'NGO_POST_PUBLISHED',
        'APPLICATION_STATUS_CHANGED',
        'CONNECTION_STATUS_CHANGED'
    )) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ngo_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Public read for published posts" ON public.posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "NGOs can manage their own posts" ON public.posts
    FOR ALL USING (auth.uid()::text = ngo_profile_id);

CREATE POLICY "Users can manage their follows" ON public.ngo_follows
    FOR ALL USING (auth.uid()::text = follower_profile_id);

CREATE POLICY "Public read for published events" ON public.events
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users read their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid()::text = recipient_id);
