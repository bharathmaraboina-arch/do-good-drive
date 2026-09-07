'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Post,
  CommunityEvent,
  Opportunity,
  UnifiedFeedItem,
  NotificationItem,
  UserRole,
  InteractivePost,
  PostComment,
  ReactionType,
  PostType,
  InteractivePostType,
} from './types';
import {
  MOCK_POSTS,
  MOCK_EVENTS,
  MOCK_OPPORTUNITIES,
  MOCK_NOTIFICATIONS,
  INITIAL_FOLLOWS,
  INITIAL_SHORTLIST,
} from './mock-data';
import { useAuth } from './auth-context';

interface FeedContextType {
  posts: Post[];
  events: CommunityEvent[];
  opportunities: Opportunity[];
  followedNgoIds: string[];
  shortlistedNgoIds: string[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;

  toggleFollowNgo: (ngoId: string) => void;
  isFollowingNgo: (ngoId: string) => boolean;
  getNgoFollowerCount: (ngoId: string) => number;

  toggleShortlistNgo: (ngoId: string) => void;
  isNgoShortlisted: (ngoId: string) => boolean;

  createPost: (data: Omit<Post, 'id' | 'createdAt' | 'publishedAt'>) => Post;
  updatePost: (id: string, data: Partial<Post>) => void;
  deletePost: (id: string) => void;
  togglePublishPost: (id: string) => void;
  getPostById: (id: string) => Post | undefined;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt'>) => NotificationItem;

  getUnifiedFeed: (activeRole: UserRole | null) => UnifiedFeedItem[];

  // LinkedIn-style Interactive Social Feed
  interactivePosts: InteractivePost[];
  createInteractivePost: (params: {
    content: string;
    cause?: string;
    type?: InteractivePostType;
    imageUrl?: string;
  }) => { success: boolean; message?: string };
  toggleReaction: (postId: string, reactionType: ReactionType) => void;
  addComment: (postId: string, content: string) => void;
  sharePost: (postId: string, thoughts?: string) => void;
}

const INITIAL_INTERACTIVE_POSTS: InteractivePost[] = [
  {
    id: 'post-vol-1',
    authorProfileId: 'vol-1',
    authorRole: 'volunteer',
    authorName: 'Sarah Jenkins',
    authorAvatarUrl: '',
    authorTagline: 'Environmental Researcher & Park Steward',
    type: 'POST',
    cause: 'Environment',
    content: 'Spent this morning with GreenCanopy planting native willow and dogwood saplings along the Columbia River riparian corridor! Truly inspiring to work alongside fellow community volunteers. If you care about native ecology, check out their upcoming seed harvesting drives.',
    reactions: { LIKE: 24, CELEBRATE: 18, SUPPORT: 12, INSIGHTFUL: 5 },
    comments: [
      {
        id: 'c-1',
        postId: 'post-vol-1',
        authorProfileId: 'ngo-1',
        authorRole: 'ngo',
        authorName: 'GreenCanopy Initiative',
        content: 'Thank you for leading Basin 2, Sarah! Your tree planting speed set the team record today.',
        createdAt: '2026-09-06T14:30:00Z',
      },
    ],
    sharesCount: 7,
    createdAt: '2026-09-06T12:00:00Z',
  },
  {
    id: 'post-ngo-1',
    authorProfileId: 'ngo-1',
    authorRole: 'ngo',
    authorName: 'GreenCanopy Initiative',
    authorAvatarUrl: '',
    authorTagline: 'Restoring Native Canopies & Freshwater Ecosystems',
    type: 'IMPACT_STORY',
    cause: 'Environment',
    content: 'Milestone reached! Thanks to our dedicated volunteer cohort, we have officially crossed 1,500 native saplings planted across the lower Willamette basin this season. Every tree helps shade the river, lower water temperatures, and protect salmon spawning beds.',
    reactions: { LIKE: 45, CELEBRATE: 32, SUPPORT: 28, INSIGHTFUL: 14 },
    comments: [
      {
        id: 'c-2',
        postId: 'post-ngo-1',
        authorProfileId: 'corp-1',
        authorRole: 'corporate',
        authorName: 'EcoTech Partners',
        content: 'Incredible achievement! EcoTech Partners is proud to sponsor upcoming nursery expansion efforts.',
        createdAt: '2026-09-05T16:00:00Z',
      },
    ],
    sharesCount: 15,
    createdAt: '2026-09-05T10:00:00Z',
  },
  {
    id: 'post-corp-1',
    authorProfileId: 'corp-1',
    authorRole: 'corporate',
    authorName: 'EcoTech Partners',
    authorAvatarUrl: '',
    authorTagline: 'Clean Energy Software & Corporate Sustainability',
    type: 'CSR_PLEDGE',
    cause: 'Climate Action',
    content: 'Excited to announce our 2026 Corporate Social Responsibility initiative: EcoTech Partners is granting 16 paid volunteer hours per employee to support grassroots climate and ecological restoration drives. We are actively connecting with local non-profits through Do Good Drive!',
    reactions: { LIKE: 58, CELEBRATE: 41, SUPPORT: 19, INSIGHTFUL: 26 },
    comments: [
      {
        id: 'c-3',
        postId: 'post-corp-1',
        authorProfileId: 'ngo-2',
        authorRole: 'ngo',
        authorName: 'CodeForward Foundation',
        content: 'Inspiring commitment to social good! We would love to collaborate on STEM hardware workshops.',
        createdAt: '2026-09-04T18:20:00Z',
      },
    ],
    sharesCount: 22,
    createdAt: '2026-09-04T15:00:00Z',
  },
];

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();

  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [events] = useState<CommunityEvent[]>(MOCK_EVENTS);
  const [opportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [followedNgoIds, setFollowedNgoIds] = useState<string[]>(INITIAL_FOLLOWS);
  const [shortlistedNgoIds, setShortlistedNgoIds] = useState<string[]>(INITIAL_SHORTLIST);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [interactivePosts, setInteractivePosts] = useState<InteractivePost[]>(INITIAL_INTERACTIVE_POSTS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate client-side persisted state after mount to eliminate SSR hydration mismatches
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem('dgd_posts');
      if (savedPosts) setPosts(JSON.parse(savedPosts));

      const savedFollows = localStorage.getItem('dgd_followed_ngos');
      if (savedFollows) setFollowedNgoIds(JSON.parse(savedFollows));

      const savedShortlist = localStorage.getItem('dgd_shortlisted_ngos');
      if (savedShortlist) setShortlistedNgoIds(JSON.parse(savedShortlist));

      const savedNotifs = localStorage.getItem('dgd_notifications');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedInteractive = localStorage.getItem('dgd_interactive_posts');
      if (savedInteractive) setInteractivePosts(JSON.parse(savedInteractive));
    } catch (e) {
      console.error('Failed to load persisted feed state', e);
    }
    setIsHydrated(true);
  }, []);

  // Persist state changes only AFTER hydration
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('dgd_posts', JSON.stringify(posts));
      localStorage.setItem('dgd_interactive_posts', JSON.stringify(interactivePosts));
    }
  }, [posts, interactivePosts, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('dgd_followed_ngos', JSON.stringify(followedNgoIds));
    }
  }, [followedNgoIds, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('dgd_shortlisted_ngos', JSON.stringify(shortlistedNgoIds));
    }
  }, [shortlistedNgoIds, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('dgd_notifications', JSON.stringify(notifications));
    }
  }, [notifications, isHydrated]);

  // Follow actions
  const toggleFollowNgo = (ngoId: string) => {
    setFollowedNgoIds((prev) => {
      if (prev.includes(ngoId)) {
        return prev.filter((id) => id !== ngoId);
      } else {
        return [...prev, ngoId];
      }
    });
  };

  const isFollowingNgo = (ngoId: string) => followedNgoIds.includes(ngoId);

  const getNgoFollowerCount = (ngoId: string) => {
    const baseCount = ngoId === 'ngo-1' ? 342 : ngoId === 'ngo-2' ? 289 : 175;
    return isFollowingNgo(ngoId) ? baseCount + 1 : baseCount;
  };

  // Shortlist actions (Corporate)
  const toggleShortlistNgo = (ngoId: string) => {
    setShortlistedNgoIds((prev) => {
      if (prev.includes(ngoId)) {
        return prev.filter((id) => id !== ngoId);
      } else {
        return [...prev, ngoId];
      }
    });
  };

  const isNgoShortlisted = (ngoId: string) => shortlistedNgoIds.includes(ngoId);

  // Post management (NGO)
  const createPost = (data: Omit<Post, 'id' | 'createdAt' | 'publishedAt'>): Post => {
    const now = new Date().toISOString();
    const newPost: Post = {
      ...data,
      id: 'post-' + Date.now(),
      createdAt: now,
      publishedAt: now,
    };
    setPosts((prev) => [newPost, ...prev]);

    // Dispatch notification
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      recipientId: profile?.id || 'all',
      type: 'NGO_POST_PUBLISHED',
      title: `New Update from ${newPost.ngoName}`,
      message: `${newPost.ngoName} published: "${newPost.title}".`,
      linkUrl: profile?.role === 'ngo' ? '/ngo/posts' : '/volunteer/dashboard',
      read: false,
      createdAt: now,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newPost;
  };

  const updatePost = (id: string, data: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePublishPost = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  const getPostById = (id: string) => posts.find((p) => p.id === id);

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'createdAt'>): NotificationItem => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return newNotif;
  };

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Unified Feed Derivation
  const getUnifiedFeed = (activeRole: UserRole | null): UnifiedFeedItem[] => {
    const feedItems: UnifiedFeedItem[] = [];

    // 1. Map published Posts & Impact Stories
    posts
      .filter((p) => p.isPublished)
      .filter((p) => {
        if (p.visibility === 'PUBLIC') return true;
        if (activeRole === 'volunteer' && p.visibility === 'VOLUNTEER_ONLY') return true;
        if (activeRole === 'corporate' && p.visibility === 'CORPORATE_ONLY') return true;
        if (activeRole === 'ngo') return true;
        return false;
      })
      .forEach((p) => {
        feedItems.push({
          id: p.id,
          itemType: p.type === 'IMPACT_STORY' ? 'impact_story' : 'post',
          publishedAt: p.publishedAt,
          ngoProfileId: p.ngoProfileId,
          ngoName: p.ngoName,
          cause: p.cause,
          visibility: p.visibility,
          postData: p,
        });
      });

    // 2. Map published Opportunities
    opportunities.forEach((opp) => {
      feedItems.push({
        id: `feed-opp-${opp.id}`,
        itemType: 'opportunity',
        publishedAt: '2026-09-01T08:00:00Z', // Consistent date for ordering
        ngoProfileId: opp.ngoProfileId || opp.organizationId || 'ngo-1',
        ngoName: opp.ngoName || opp.organizationName || 'Non-Profit Partner',
        cause: opp.cause,
        visibility: 'PUBLIC',
        opportunityData: opp,
      });
    });

    // 3. Map published Events
    events
      .filter((evt) => evt.isPublished)
      .forEach((evt) => {
        feedItems.push({
          id: `feed-evt-${evt.id}`,
          itemType: 'event',
          publishedAt: evt.createdAt,
          ngoProfileId: evt.ngoProfileId,
          ngoName: evt.ngoName,
          cause: evt.cause,
          visibility: 'PUBLIC',
          eventData: evt,
        });
      });

    // Rule: Chronological ordering, followed NGOs first, then other verified NGOs
    const followedItems = feedItems.filter((item) =>
      followedNgoIds.includes(item.ngoProfileId)
    );
    const otherItems = feedItems.filter(
      (item) => !followedNgoIds.includes(item.ngoProfileId)
    );

    followedItems.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    otherItems.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return [...followedItems, ...otherItems];
  };

  // LinkedIn-style Interactive Social Feed Actions
  const createInteractivePost = (params: {
    content: string;
    cause?: string;
    type?: InteractivePostType;
    imageUrl?: string;
  }) => {
    const role = profile?.role || 'volunteer';
    const authorName = profile?.fullName || profile?.organizationName || 'Sarah Jenkins';
    let authorTagline = 'Community Volunteer';
    if (role === 'ngo') {
      authorTagline = 'Non-Profit Organization & Drive Organizer';
    } else if (role === 'corporate') {
      authorTagline = 'Corporate CSR & Sustainability Program';
    }

    const newPost: InteractivePost = {
      id: 'post-' + Date.now(),
      authorProfileId: profile?.id || 'vol-1',
      authorRole: role,
      authorName,
      authorAvatarUrl: profile?.avatarUrl,
      authorTagline,
      type: params.type || 'POST',
      content: params.content,
      cause: params.cause || 'General Impact',
      imageUrl: params.imageUrl,
      reactions: { LIKE: 0, CELEBRATE: 0, SUPPORT: 0, INSIGHTFUL: 0 },
      comments: [],
      sharesCount: 0,
      createdAt: new Date().toISOString(),
    };

    setInteractivePosts((prev) => [newPost, ...prev]);
    return { success: true };
  };

  const toggleReaction = (postId: string, reactionType: ReactionType) => {
    setInteractivePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const currentReaction = post.userReaction;
          const reactions = { ...post.reactions };

          if (currentReaction === reactionType) {
            // Toggle off
            reactions[reactionType] = Math.max(0, (reactions[reactionType] || 1) - 1);
            return { ...post, reactions, userReaction: undefined };
          } else {
            // Remove previous reaction if any
            if (currentReaction) {
              reactions[currentReaction] = Math.max(0, (reactions[currentReaction] || 1) - 1);
            }
            // Add new reaction
            reactions[reactionType] = (reactions[reactionType] || 0) + 1;
            return { ...post, reactions, userReaction: reactionType };
          }
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, content: string) => {
    const role = profile?.role || 'volunteer';
    const authorName = profile?.fullName || profile?.organizationName || 'Sarah Jenkins';

    const newComment: PostComment = {
      id: 'comment-' + Date.now(),
      postId,
      authorProfileId: profile?.id || 'vol-1',
      authorRole: role,
      authorName,
      authorAvatarUrl: profile?.avatarUrl,
      content,
      createdAt: new Date().toISOString(),
    };

    setInteractivePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  const sharePost = (postId: string, thoughts?: string) => {
    setInteractivePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            sharesCount: post.sharesCount + 1,
          };
        }
        return post;
      })
    );
  };

  return (
    <FeedContext.Provider
      value={{
        posts,
        events,
        opportunities,
        followedNgoIds,
        shortlistedNgoIds,
        notifications,
        unreadNotificationsCount,
        toggleFollowNgo,
        isFollowingNgo,
        getNgoFollowerCount,
        toggleShortlistNgo,
        isNgoShortlisted,
        createPost,
        updatePost,
        deletePost,
        togglePublishPost,
        getPostById,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        getUnifiedFeed,
        interactivePosts,
        createInteractivePost,
        toggleReaction,
        addComment,
        sharePost,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
}
