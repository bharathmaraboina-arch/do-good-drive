'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useAuth } from '@/lib/auth-context';
import { useOnboarding } from '@/lib/onboarding-context';
import { useFeed } from '@/lib/feed-context';
import { useMarketplace } from '@/lib/marketplace-context';
import { useCorporate } from '@/lib/corporate-context';
import { ReactionType, InteractivePostType } from '@/lib/types';
import { CAUSE_OPTIONS } from '@/lib/mock-data';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  Sparkles,
  Image as ImageIcon,
  Heart,
  Lightbulb,
  Award,
  Calendar,
  MapPin,
  Building2,
  Users,
  Compass,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function LinkedInCommunityFeedPage() {
  const { profile, role } = useAuth();
  const { volunteerProfile, corporateProfile } = useOnboarding();
  const {
    interactivePosts,
    createInteractivePost,
    toggleReaction,
    addComment,
    sharePost,
  } = useFeed();
  const {
    opportunities,
    applications,
    savedOpportunityIds,
    getImpactSummaryForVolunteer,
  } = useMarketplace();
  const { ngos, shortlistedNgoIds } = useCorporate();

  // Composer State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postCause, setPostCause] = useState('Environment');
  const [postType, setPostType] = useState<InteractivePostType>('POST');
  const [activeTab, setActiveTab] = useState<'ALL' | 'VOLUNTEER' | 'NGO' | 'CORPORATE'>('ALL');

  // Comment & Reaction Local State
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    'post-vol-1': true,
  });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentRole = role || 'volunteer';
  const currentUserName =
    profile?.fullName ||
    (currentRole === 'corporate' ? corporateProfile?.companyName || 'EcoTech Partners' : 'Sarah Jenkins');
  const currentUserInitial = currentUserName.charAt(0);

  const volId = profile?.id || 'vol-1';
  const impactSummary = getImpactSummaryForVolunteer(volId);
  const openOpportunities = opportunities.filter((o) => o.isPublished);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return interactivePosts.filter((post) => {
      if (activeTab === 'VOLUNTEER') return post.authorRole === 'volunteer';
      if (activeTab === 'NGO') return post.authorRole === 'ngo';
      if (activeTab === 'CORPORATE') return post.authorRole === 'corporate';
      return true;
    });
  }, [interactivePosts, activeTab]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    createInteractivePost({
      content: postContent,
      cause: postCause,
      type: postType,
    });

    setPostContent('');
    setIsComposerOpen(false);
    setToastMessage('Post published successfully to the community feed!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleReaction = (postId: string, reaction: ReactionType) => {
    toggleReaction(postId, reaction);
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    addComment(postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setToastMessage('Comment posted to thread.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = (postId: string) => {
    sharePost(postId);
    setToastMessage('Post shared with your professional network!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getRoleBadge = (authorRole: string) => {
    switch (authorRole) {
      case 'ngo':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]">
            <Building2 className="w-3 h-3" />
            <span>NGO Partner</span>
          </span>
        );
      case 'corporate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]">
            <Award className="w-3 h-3" />
            <span>Corporate CSR</span>
          </span>
        );
      case 'volunteer':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]">
            <Users className="w-3 h-3" />
            <span>Volunteer</span>
          </span>
        );
    }
  };

  return (
    <AppShell hideSidebar={true}>
      <div className="max-w-[1180px] w-full mx-auto px-4 sm:px-6 py-5">
        {toastMessage && (
          <div className="mb-5 p-4 rounded-xl bg-[#FAF5FA] border border-[#E8E3E8] text-[#6D3A70] text-xs font-medium flex items-center justify-between shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button type="button" onClick={() => setToastMessage(null)} className="font-bold hover:opacity-75">
              &times;
            </button>
          </div>
        )}

        {/* 3-Column Professional Network Layout (Left 240px | Center 560-640px | Right 300px) */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_minmax(560px,640px)_300px] justify-center gap-5 items-start">
          {/* LEFT COLUMN: 240px Profile & Marketplace Shortcuts */}
          <aside className="hidden md:block md:col-start-1 md:row-start-1 w-[240px] shrink-0 space-y-4">
          <div className="bg-white rounded-xl border border-[#E8E3E8] shadow-xs overflow-hidden">
            {/* Header Banner - Calm subtle plum tint */}
            <div className="h-16 bg-[#FAF5FA] border-b border-[#E8E3E8]" />

            <div className="p-4 pt-0 text-center relative">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-white text-[#6D3A70] font-bold text-lg flex items-center justify-center mx-auto -mt-7 shadow-xs">
                <span className="w-full h-full rounded-full bg-[#F1E7F3] border border-[#E8E3E8] flex items-center justify-center">
                  {currentUserInitial}
                </span>
              </div>

              <h2 className="text-sm font-bold text-[#25232A] mt-2">{currentUserName}</h2>
              <div className="mt-1 flex justify-center">{getRoleBadge(currentRole)}</div>

              <p className="text-[11px] text-[#6B6870] mt-2 leading-relaxed line-clamp-2">
                {currentRole === 'volunteer'
                  ? volunteerProfile?.shortBio || 'Environmental researcher & community park steward passionate about native ecology.'
                  : currentRole === 'ngo'
                  ? 'Dedicated to urban canopy restoration and public river corridor stewardship.'
                  : 'Enterprise clean energy software provider committed to carbon-neutral operations.'}
              </p>

              {/* Role-Specific Metric Teasers */}
              <div className="mt-4 pt-3 border-t border-[#E8E3E8] space-y-2 text-left text-xs">
                {currentRole === 'volunteer' && (
                  <>
                    <Link
                      href="/volunteer/impact"
                      className="flex items-center justify-between text-[#6B6870] hover:text-[#6D3A70] transition-colors py-0.5"
                    >
                      <span>Verified Impact Hours</span>
                      <strong className="text-[#6D3A70]">
                        {impactSummary.totalVerifiedHours.toFixed(1)} hrs
                      </strong>
                    </Link>
                    <Link
                      href="/volunteer/applications"
                      className="flex items-center justify-between text-[#6B6870] hover:text-[#6D3A70] transition-colors py-0.5"
                    >
                      <span>Active Applications</span>
                      <strong className="text-[#25232A]">{applications.length}</strong>
                    </Link>
                    <Link
                      href="/volunteer/saved"
                      className="flex items-center justify-between text-[#6B6870] hover:text-[#6D3A70] transition-colors py-0.5"
                    >
                      <span>Saved Drives</span>
                      <strong className="text-[#25232A]">{savedOpportunityIds.length}</strong>
                    </Link>
                  </>
                )}

                {currentRole === 'ngo' && (
                  <>
                    <Link
                      href="/ngo/opportunities"
                      className="flex items-center justify-between text-[#6B6870] hover:text-[#6D3A70] transition-colors py-0.5"
                    >
                      <span>Published Drives</span>
                      <strong className="text-[#6D3A70]">{openOpportunities.length}</strong>
                    </Link>
                    <Link
                      href="/ngo/volunteers"
                      className="flex items-center justify-between text-[#6B6870] hover:text-[#6D3A70] transition-colors py-0.5"
                    >
                      <span>Volunteers Mobilized</span>
                      <strong className="text-[#25232A]">25 Active</strong>
                    </Link>
                    <Link
                      href="/ngo/corporate-partners"
                      className="flex items-center justify-between text-[#6B6870] hover:text-[#6D3A70] transition-colors py-0.5"
                    >
                      <span>Corporate Inquiries</span>
                      <strong className="text-[#B45309]">1 Pending</strong>
                    </Link>
                  </>
                )}

                {currentRole === 'corporate' && (
                  <>
                    <Link
                      href="/corporate/shortlist"
                      className="flex items-center justify-between text-[#6B6870] hover:text-[#6D3A70] transition-colors py-0.5"
                    >
                      <span>Shortlisted NGOs</span>
                      <strong className="text-[#6D3A70]">{shortlistedNgoIds.length}</strong>
                    </Link>
                    <Link
                      href="/corporate/dashboard"
                      className="flex items-center justify-between text-[#6B6870] hover:text-[#6D3A70] transition-colors py-0.5"
                    >
                      <span>Connection Requests</span>
                      <strong className="text-[#25232A]">1 Sent</strong>
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 bg-[#FAF5FA] border-t border-[#E8E3E8] text-center">
              <Link
                href={
                  currentRole === 'volunteer'
                    ? '/onboarding/volunteer'
                    : currentRole === 'ngo'
                    ? '/onboarding/ngo'
                    : '/onboarding/corporate'
                }
                className="text-xs font-semibold text-[#6D3A70] hover:underline"
              >
                View / Edit Profile &rarr;
              </Link>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-4 shadow-xs space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B8790] block">
              Marketplace Hubs
            </span>
            <Link
              href="/volunteer/opportunities"
              className="flex items-center gap-2 text-[#6B6870] hover:text-[#6D3A70] py-1 font-medium"
            >
              <Compass className="w-4 h-4 text-[#6D3A70]" />
              <span>Discover Community Drives</span>
            </Link>
            <Link
              href="/corporate/ngos"
              className="flex items-center gap-2 text-[#6B6870] hover:text-[#6D3A70] py-1 font-medium"
            >
              <Building2 className="w-4 h-4 text-[#6D3A70]" />
              <span>Explore Non-Profit Directory</span>
            </Link>
          </div>
        </aside>

        {/* CENTER COLUMN: 560-640px Visually Dominant Feed Stream */}
        <main className="col-span-1 md:col-start-2 md:row-start-1 lg:col-start-2 lg:row-start-1 w-full max-w-[640px] space-y-4 min-w-0">
          {/* Post Composer Card ("Start a post") */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-xs flex items-center justify-center shrink-0">
                {currentUserInitial}
              </div>
              <button
                type="button"
                onClick={() => setIsComposerOpen(true)}
                className="flex-1 text-left px-4 py-2.5 rounded-full border border-[#E8E3E8] bg-[#FBFAF8] hover:bg-[#FAF5FA] text-xs font-medium text-[#6B6870] transition-colors cursor-pointer"
              >
                Start a post to share an update, impact story, or CSR pledge...
              </button>
            </div>

            {/* Composer Shortcut Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8E3E8] text-xs text-[#6B6870]">
              <button
                type="button"
                onClick={() => {
                  setPostType('POST');
                  setIsComposerOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#FAF5FA] hover:text-[#6D3A70] transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#6D3A70]" />
                <span>Share Update</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPostType('IMPACT_STORY');
                  setIsComposerOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#FAF5FA] hover:text-[#6D3A70] transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-[#6D3A70]" />
                <span>Impact Story</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPostType('CSR_PLEDGE');
                  setIsComposerOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#FAF5FA] hover:text-[#6D3A70] transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#6D3A70]" />
                <span>CSR / Partnership</span>
              </button>
            </div>
          </div>

          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'All Community Posts' },
              { id: 'VOLUNTEER', label: 'Volunteer Voices' },
              { id: 'NGO', label: 'NGO Milestones' },
              { id: 'CORPORATE', label: 'Corporate CSR' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#6D3A70] text-white border-[#6D3A70] font-semibold shadow-xs'
                      : 'bg-white text-[#6B6870] border-[#E8E3E8] hover:bg-[#FAF5FA]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Feed Stream Cards */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const commentsOpen = expandedComments[post.id] || false;
              const userLiked = post.userReaction === 'LIKE';
              const totalReactions =
                (post.reactions.LIKE || 0) +
                (post.reactions.CELEBRATE || 0) +
                (post.reactions.SUPPORT || 0) +
                (post.reactions.INSIGHTFUL || 0);

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-xl border border-[#E8E3E8] shadow-xs hover:border-[#6D3A70]/30 transition-all p-5 space-y-3.5"
                >
                  {/* Post Header: Author info, Role Badge, Tagline, Timestamp */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-xs flex items-center justify-center shrink-0">
                        {post.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-[#25232A]">{post.authorName}</h4>
                          {getRoleBadge(post.authorRole)}
                        </div>
                        <p className="text-[11px] text-[#6B6870] line-clamp-1">{post.authorTagline}</p>
                        <span className="text-[10px] text-[#8B8790]">
                          {new Date(post.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {post.cause && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]">
                        {post.cause}
                      </span>
                    )}
                  </div>

                  {/* Post Content */}
                  <p className="text-xs sm:text-sm text-[#25232A] leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Reaction Summary Counts Bar */}
                  <div className="flex items-center justify-between text-[11px] text-[#6B6870] pt-2 border-t border-[#E8E3E8]">
                    <div className="flex items-center gap-1.5">
                      <span className="flex -space-x-1 items-center">
                        <span className="w-4 h-4 rounded-full bg-[#F1E7F3] flex items-center justify-center text-[10px]">
                          👍
                        </span>
                        <span className="w-4 h-4 rounded-full bg-[#FAF5FA] flex items-center justify-center text-[10px]">
                          👏
                        </span>
                        <span className="w-4 h-4 rounded-full bg-[#F1E7F3] flex items-center justify-center text-[10px]">
                          💜
                        </span>
                      </span>
                      <span>{totalReactions} Reactions</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleComments(post.id)}
                        className="hover:underline cursor-pointer"
                      >
                        {post.comments.length} Comments
                      </button>
                      <span>&bull;</span>
                      <span>{post.sharesCount} Shares</span>
                    </div>
                  </div>

                  {/* Action Bar: Like / React, Comment, Share */}
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-[#E8E3E8] text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => handleToggleReaction(post.id, 'LIKE')}
                      className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        userLiked
                          ? 'text-[#6D3A70] bg-[#F1E7F3]'
                          : 'text-[#6B6870] hover:bg-[#FAF5FA]'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${userLiked ? 'fill-current' : ''}`} />
                      <span>{userLiked ? 'Liked' : 'Like'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleComments(post.id)}
                      className="py-2 rounded-lg flex items-center justify-center gap-1.5 text-[#6B6870] hover:bg-[#FAF5FA] transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#8B8790]" />
                      <span>Comment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare(post.id)}
                      className="py-2 rounded-lg flex items-center justify-center gap-1.5 text-[#6B6870] hover:bg-[#FAF5FA] transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-[#8B8790]" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Inline Comment Thread */}
                  {commentsOpen && (
                    <div className="pt-3 border-t border-[#E8E3E8] space-y-3">
                      {/* Add Comment Field */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-xs flex items-center justify-center shrink-0">
                          {currentUserInitial}
                        </div>
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          placeholder="Add a comment to this post..."
                          className="flex-1 px-3 py-1.5 text-xs text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-full focus:outline-none focus:ring-1 focus:ring-[#A85AAA]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="p-1.5 rounded-full text-white bg-[#6D3A70] hover:bg-[#552C59] transition-colors shrink-0 cursor-pointer"
                          title="Send comment"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Comments List */}
                      {post.comments.length > 0 && (
                        <div className="space-y-2 pt-1">
                          {post.comments.map((c) => (
                            <div
                              key={c.id}
                              className="p-2.5 rounded-xl bg-[#FBFAF8] border border-[#E8E3E8] flex items-start gap-2.5 text-xs"
                            >
                              <div className="w-7 h-7 rounded-full bg-[#F1E7F3] text-[#6D3A70] font-bold text-[10px] flex items-center justify-center shrink-0">
                                {c.authorName.charAt(0)}
                              </div>
                              <div className="flex-1 space-y-0.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-[#25232A]">{c.authorName}</span>
                                    {getRoleBadge(c.authorRole)}
                                  </div>
                                  <span className="text-[10px] text-[#8B8790]">
                                    {new Date(c.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <p className="text-[#6B6870] leading-relaxed">{c.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </main>

        {/* =========================================================================
            RIGHT COLUMN: 300px Utility & Contextual Panels
            ========================================================================= */}
        <aside className="col-span-1 md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-start-1 w-full lg:w-[300px] shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-0 lg:space-y-4">
          {/* Urgent Volunteering Drives */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E3E8] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A]">
                Urgent Community Drives
              </h3>
              <Link
                href="/volunteer/opportunities"
                className="text-xs font-semibold text-[#6D3A70] hover:underline"
              >
                All &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {openOpportunities.slice(0, 2).map((opp) => (
                <div
                  key={opp.id}
                  className="p-3 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] space-y-1.5"
                >
                  <span className="text-[10px] font-bold uppercase text-[#6D3A70]">
                    {opp.cause} &bull; {opp.date}
                  </span>
                  <Link
                    href={`/volunteer/opportunities/${opp.id}`}
                    className="text-xs font-bold text-[#25232A] hover:text-[#6D3A70] line-clamp-1 block"
                  >
                    {opp.title}
                  </Link>
                  <p className="text-[11px] text-[#6B6870] line-clamp-2">{opp.description}</p>
                  <div className="pt-1">
                    <Link
                      href={`/volunteer/opportunities/${opp.id}`}
                      className="text-[11px] font-semibold text-[#6D3A70] hover:underline flex items-center gap-1"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified NGO Spotlight */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E3E8] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A]">
                Verified NGO Partners
              </h3>
              <Link
                href="/corporate/ngos"
                className="text-xs font-semibold text-[#6D3A70] hover:underline"
              >
                Directory
              </Link>
            </div>

            <div className="space-y-2.5">
              {ngos.slice(0, 3).map((ngo) => (
                <div
                  key={ngo.profileId}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-[#FAF5FA] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#F1E7F3] text-[#6D3A70] font-bold text-xs flex items-center justify-center shrink-0 border border-[#E8E3E8]">
                      {ngo.ngoName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#25232A]">{ngo.ngoName}</h4>
                      <span className="text-[10px] text-[#6B6870]">{ngo.locations[0]}</span>
                    </div>
                  </div>

                  <Link
                    href={`/corporate/ngos/${ngo.profileId}`}
                    className="text-[10px] font-semibold text-[#6D3A70] hover:underline shrink-0"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>

      {/* Post Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#25232A]/40 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E8E3E8] space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] font-bold text-sm flex items-center justify-center">
                  {currentUserInitial}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#25232A]">{currentUserName}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {getRoleBadge(currentRole)}
                    <span className="text-[10px] text-[#6B6870]">&bull; Sharing Publicly</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="text-[#8B8790] hover:text-[#25232A] text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                rows={5}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What community update, volunteering experience, or partnership would you like to share?"
                className="w-full p-3 text-xs sm:text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A85AAA]"
                autoFocus
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#6B6870] mb-1">
                    Cause Focus
                  </label>
                  <select
                    value={postCause}
                    onChange={(e) => setPostCause(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs text-[#25232A] bg-white border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA]"
                  >
                    {CAUSE_OPTIONS.filter((c) => c !== 'All Causes').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#6B6870] mb-1">
                    Post Type
                  </label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as InteractivePostType)}
                    className="w-full px-2.5 py-1.5 text-xs text-[#25232A] bg-white border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA]"
                  >
                    <option value="POST">General Update</option>
                    <option value="IMPACT_STORY">Impact Story</option>
                    <option value="DRIVE_UPDATE">Volunteering Drive Update</option>
                    <option value="CSR_PLEDGE">Corporate CSR Pledge</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E3E8]">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B6870] hover:text-[#25232A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!postContent.trim()}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] disabled:opacity-50 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
