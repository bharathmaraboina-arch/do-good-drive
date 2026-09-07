'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, PostFormData } from '@/lib/schemas/post';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { useFeed } from '@/lib/feed-context';
import { CAUSE_OPTIONS } from '@/lib/mock-data';
import { ArrowLeft, CheckCircle2, FileText, Sparkles } from 'lucide-react';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { getPostById, updatePost } = useFeed();
  const [isSuccess, setIsSuccess] = useState(false);

  const existingPost = getPostById(resolvedParams.id);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      type: 'POST',
      cause: 'Environment',
      body: '',
      imageUrl: '',
      impactMetric: '',
      visibility: 'PUBLIC',
      isPublished: true,
    },
  });

  useEffect(() => {
    if (existingPost) {
      reset({
        title: existingPost.title,
        type: existingPost.type,
        cause: existingPost.cause,
        body: existingPost.body,
        imageUrl: existingPost.imageUrl || '',
        impactMetric: existingPost.impactMetric || '',
        visibility: existingPost.visibility,
        isPublished: existingPost.isPublished,
      });
    }
  }, [existingPost, reset]);

  const currentType = watch('type');

  if (!existingPost) {
    return (
      <AppShell>
        <div className="max-w-3xl py-12 text-center">
          <h2 className="text-base font-bold text-[#25232A]">Post Not Found</h2>
          <p className="text-xs text-[#8B8790] mt-1 mb-4">
            The dispatch you are attempting to edit could not be located.
          </p>
          <Link
            href="/ngo/posts"
            className="text-xs font-semibold text-[#6D3A70] hover:underline"
          >
            &larr; Return to Manage Posts
          </Link>
        </div>
      </AppShell>
    );
  }

  const onSubmit = async (data: PostFormData) => {
    updatePost(existingPost.id, {
      title: data.title,
      type: data.type,
      cause: data.cause,
      body: data.body,
      imageUrl: data.imageUrl || undefined,
      impactMetric: data.impactMetric || undefined,
      visibility: data.visibility,
      isPublished: data.isPublished,
    });

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/ngo/posts');
    }, 1200);
  };

  return (
    <AppShell>
      <div className="max-w-3xl">
        <Link
          href="/ngo/posts"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6870] hover:text-[#25232A] mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Manage Posts</span>
        </Link>

        <PageHeader
          title="Edit Community Dispatch"
          description={`Update details for "${existingPost.title}".`}
        />

        {isSuccess ? (
          <div className="bg-white p-8 rounded-xl border border-[#E8E3E8] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#25232A]">Post Updated Successfully!</h2>
            <p className="text-xs text-[#8B8790] mt-1">
              Your modifications are now reflected across the community feed.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E3E8] shadow-xs space-y-5"
          >
            {/* Dispatch Type Selector */}
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-2">
                Dispatch Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setValue('type', 'POST')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    currentType === 'POST'
                      ? 'bg-[#F1E7F3] border-[#6D3A70] text-[#6D3A70]'
                      : 'bg-[#FBFAF8] border-[#E8E3E8] text-[#6B6870] hover:border-[#6D3A70]/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold">Standard Post</span>
                  </div>
                  <p className="text-[11px] text-[#8B8790]">
                    Logistical updates, announcements, volunteer calls.
                  </p>
                </div>

                <div
                  onClick={() => setValue('type', 'IMPACT_STORY')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    currentType === 'IMPACT_STORY'
                      ? 'bg-[#F1E7F3] border-[#6D3A70] text-[#6D3A70]'
                      : 'bg-[#FBFAF8] border-[#E8E3E8] text-[#6B6870] hover:border-[#6D3A70]/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold">Impact Story</span>
                  </div>
                  <p className="text-[11px] text-[#8B8790]">
                    Validated field outcomes with quantitative impact metrics.
                  </p>
                </div>
              </div>
            </div>

            {/* Post Title */}
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Headline / Title <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.title.message}</p>
              )}
            </div>

            {/* Cause & Visibility Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#25232A] mb-1">
                  Cause Sector <span className="text-[#B91C1C]">*</span>
                </label>
                <select
                  {...register('cause')}
                  className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                >
                  {CAUSE_OPTIONS.filter((c) => c !== 'All Causes').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#25232A] mb-1">
                  Target Audience / Visibility
                </label>
                <select
                  {...register('visibility')}
                  className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                >
                  <option value="PUBLIC">Public (All Marketplace Members)</option>
                  <option value="VOLUNTEER_ONLY">Volunteers Only</option>
                  <option value="CORPORATE_ONLY">Corporate CSR Partners Only</option>
                </select>
              </div>
            </div>

            {/* Impact Metric */}
            {currentType === 'IMPACT_STORY' && (
              <div>
                <label className="block text-xs font-medium text-[#25232A] mb-1">
                  Key Quantitative Impact Metric (Optional)
                </label>
                <input
                  type="text"
                  {...register('impactMetric')}
                  placeholder="e.g. 1,400 Native Shrubs Planted"
                  className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                />
              </div>
            )}

            {/* Body */}
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Post Narrative / Details <span className="text-[#B91C1C]">*</span>
              </label>
              <textarea
                rows={5}
                {...register('body')}
                className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.body && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.body.message}</p>
              )}
            </div>

            {/* Optional Image */}
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Image or Graphic URL (Optional)
              </label>
              <input
                type="text"
                {...register('imageUrl')}
                className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
            </div>

            {/* Publishing Controls */}
            <div className="pt-4 border-t border-[#FAF5FA] flex flex-col sm:flex-row items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs text-[#6B6870] cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isPublished')}
                  className="w-4 h-4 text-[#6D3A70] rounded border-[#E8E3E8] focus:ring-[#A85AAA]"
                />
                <span>Published to community feed</span>
              </label>

              <div className="flex items-center gap-3">
                <Link
                  href="/ngo/posts"
                  className="px-4 py-2 text-xs font-medium text-[#6B6870] hover:text-[#25232A] rounded-lg hover:bg-[#FAF5FA] transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Update Dispatch'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}
