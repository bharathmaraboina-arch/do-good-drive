-- =========================================================================
-- Migration: 20260907_interactive_community_feed.sql
-- Description: Multi-role community posts, emoji reactions, comments, and shares
--              for Volunteers, NGOs, and Corporates.
-- =========================================================================

-- 1. Community Posts Table (all roles can create posts)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_role TEXT CHECK (author_role IN ('VOLUNTEER', 'NGO', 'CORPORATE')) NOT NULL,
    author_name TEXT NOT NULL,
    author_avatar_url TEXT,
    author_tagline TEXT,
    type TEXT CHECK (type IN ('POST', 'IMPACT_STORY', 'DRIVE_UPDATE', 'CSR_PLEDGE')) NOT NULL DEFAULT 'POST',
    title TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    cause TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Post Reactions Table (Like, Celebrate, Support, Insightful)
CREATE TABLE IF NOT EXISTS public.post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reaction_type TEXT CHECK (reaction_type IN ('LIKE', 'CELEBRATE', 'SUPPORT', 'INSIGHTFUL')) NOT NULL DEFAULT 'LIKE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_post_user_reaction UNIQUE (post_id, profile_id)
);

-- 3. Post Comments Table
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    author_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_role TEXT CHECK (author_role IN ('VOLUNTEER', 'NGO', 'CORPORATE')) NOT NULL,
    author_name TEXT NOT NULL,
    author_avatar_url TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Post Shares Table
CREATE TABLE IF NOT EXISTS public.post_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    sharer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    share_thoughts TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.community_posts(author_profile_id);
CREATE INDEX IF NOT EXISTS idx_posts_role ON public.community_posts(author_role);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reactions_post ON public.post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_shares_post ON public.post_shares(post_id);

-- Enable Row-Level Security
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can read posts, reactions, comments, and shares
CREATE POLICY "Public read community posts" ON public.community_posts
    FOR SELECT USING (true);

CREATE POLICY "Public read reactions" ON public.post_reactions
    FOR SELECT USING (true);

CREATE POLICY "Public read comments" ON public.post_comments
    FOR SELECT USING (true);

CREATE POLICY "Public read shares" ON public.post_shares
    FOR SELECT USING (true);

-- Authenticated users of any role can create posts and manage their own posts
CREATE POLICY "Users create posts" ON public.community_posts
    FOR INSERT WITH CHECK (auth.uid() = author_profile_id);

CREATE POLICY "Users manage own posts" ON public.community_posts
    FOR ALL USING (auth.uid() = author_profile_id);

-- Authenticated users manage own reactions
CREATE POLICY "Users manage reactions" ON public.post_reactions
    FOR ALL USING (auth.uid() = profile_id);

-- Authenticated users create and manage own comments
CREATE POLICY "Users create comments" ON public.post_comments
    FOR INSERT WITH CHECK (auth.uid() = author_profile_id);

CREATE POLICY "Users manage own comments" ON public.post_comments
    FOR ALL USING (auth.uid() = author_profile_id);

-- Authenticated users record shares
CREATE POLICY "Users create shares" ON public.post_shares
    FOR INSERT WITH CHECK (auth.uid() = sharer_profile_id);
