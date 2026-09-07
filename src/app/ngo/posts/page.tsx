'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuth } from '@/lib/auth-context';
import { useFeed } from '@/lib/feed-context';
import {
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  FileText,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export default function NgoPostsManagementPage() {
  const { profile } = useAuth();
  const { posts, deletePost, togglePublishPost } = useFeed();
  const [filterType, setFilterType] = useState<'all' | 'published' | 'drafts' | 'stories'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentNgoId = profile?.id === 'ngo-demo-1' ? 'ngo-1' : profile?.id || 'ngo-1';
  const myPosts = posts.filter((p) => p.ngoProfileId === currentNgoId);

  const filteredPosts = myPosts.filter((p) => {
    if (filterType === 'published') return p.isPublished;
    if (filterType === 'drafts') return !p.isPublished;
    if (filterType === 'stories') return p.type === 'IMPACT_STORY';
    return true;
  });

  const handleDelete = () => {
    if (deletingId) {
      deletePost(deletingId);
      setDeletingId(null);
      setToastMessage('Post removed successfully.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <AppShell>
      <Link
        href="/ngo/feed"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6870] hover:text-[#25232A] mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Community Feed</span>
      </Link>

      {toastMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#DCFCE7] border border-[#15803D]/20 text-[#15803D] text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[#15803D] hover:opacity-75 font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      <PageHeader
        title="Manage Dispatches &amp; Stories"
        description="Publish, update, or archive your organization's community updates and verified impact stories."
        actions={
          <Link
            href="/ngo/posts/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Post</span>
          </Link>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'all', label: `All Posts (${myPosts.length})` },
          { id: 'published', label: 'Published' },
          { id: 'drafts', label: 'Drafts' },
          { id: 'stories', label: 'Impact Stories' },
        ].map((tab) => {
          const isActive = filterType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as typeof filterType)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#F1E7F3] text-[#6D3A70] border-[#E8E3E8] font-semibold'
                  : 'bg-white text-[#6B6870] border-[#E8E3E8] hover:bg-[#FAF5FA]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No dispatches found in this category"
          description="Create a post or impact story to engage with volunteers and corporate sponsors."
          actionLabel="Create Post"
          onAction={() => {
            window.location.href = '/ngo/posts/new';
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E3E8] shadow-xs overflow-hidden">
          <div className="divide-y divide-[#FAF5FA]">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 sm:p-5 hover:bg-[#FAF5FA] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]">
                      {post.cause}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                        post.type === 'IMPACT_STORY'
                          ? 'bg-[#F1E7F3] text-[#6D3A70] border border-[#E8E3E8]'
                          : 'bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]'
                      }`}
                    >
                      {post.type === 'IMPACT_STORY' ? <Sparkles className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      {post.type === 'IMPACT_STORY' ? 'Impact Story' : 'Standard Post'}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        post.isPublished
                          ? 'bg-[#DCFCE7] text-[#15803D]'
                          : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}
                    >
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[10px] text-[#8B8790]">
                      Visibility: {post.visibility.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#25232A]">{post.title}</h3>
                  <p className="text-xs text-[#6B6870] line-clamp-2 mt-1 leading-relaxed">
                    {post.body}
                  </p>

                  {post.impactMetric && (
                    <span className="inline-block mt-2 text-[11px] font-medium text-[#6D3A70]">
                      ★ Metric: {post.impactMetric}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <button
                    type="button"
                    onClick={() => togglePublishPost(post.id)}
                    className="p-2 text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA] rounded-lg border border-[#E8E3E8] transition-colors cursor-pointer"
                    title={post.isPublished ? 'Unpublish post' : 'Publish post'}
                  >
                    {post.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  <Link
                    href={`/ngo/posts/${post.id}/edit`}
                    className="p-2 text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA] rounded-lg border border-[#E8E3E8] transition-colors"
                    title="Edit post"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeletingId(post.id)}
                    className="p-2 text-[#8B8790] hover:text-[#B91C1C] hover:bg-[#FEE2E2] rounded-lg border border-[#E8E3E8] transition-colors cursor-pointer"
                    title="Delete post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Community Post"
        message="Are you sure you want to delete this dispatch? It will be permanently removed from the community feed."
        confirmLabel="Delete Post"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </AppShell>
  );
}
