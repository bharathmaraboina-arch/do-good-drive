'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { grantSchema, GrantFormData } from '@/lib/schemas/opportunity';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { CAUSE_OPTIONS } from '@/lib/mock-data';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function CreateGrantPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GrantFormData>({
    resolver: zodResolver(grantSchema),
    defaultValues: {
      title: '',
      focusArea: 'Environment',
      budgetScope: '',
      deadline: '',
      description: '',
    },
  });

  const onSubmit = async (data: GrantFormData) => {
    setIsSuccess(true);
    setTimeout(() => {
      router.push('/corporate');
    }, 1500);
  };

  return (
    <AppShell>
      <div className="max-w-3xl">
        <Link
          href="/corporate"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6870] hover:text-[#25232A] mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Corporate CSR Hub</span>
        </Link>

        <PageHeader
          title="Publish CSR Grant / Initiative"
          description="Offer direct funding, pro-bono employee skill support, or equipment to certified grassroots non-profits."
        />

        {isSuccess ? (
          <div className="bg-white p-8 rounded-xl border border-[#E8E3E8] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#25232A]">CSR Grant Published Successfully!</h2>
            <p className="text-xs text-[#8B8790] mt-1">
              Your initiative is now available for certified non-profit partners to review and apply.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E3E8] shadow-xs space-y-5"
          >
            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Grant or Initiative Title <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. 2026 Community Clean Water Infrastructure Grant"
                className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#25232A] mb-1">
                  Primary Focus Area <span className="text-[#B91C1C]">*</span>
                </label>
                <select
                  {...register('focusArea')}
                  className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                >
                  {CAUSE_OPTIONS.filter((c) => c !== 'All Causes').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.focusArea && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.focusArea.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#25232A] mb-1">
                  Budget Scope or Resource Value <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  type="text"
                  {...register('budgetScope')}
                  placeholder="e.g. $35,000 Direct Grant or 100 Laptops"
                  className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
                />
                {errors.budgetScope && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.budgetScope.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Application Deadline <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                type="date"
                {...register('deadline')}
                className="w-full sm:w-64 px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.deadline && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.deadline.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Description &amp; Eligibility Criteria <span className="text-[#B91C1C]">*</span>
              </label>
              <textarea
                rows={4}
                {...register('description')}
                placeholder="Specify non-profit eligibility requirements, deliverables, and grant review timeline..."
                className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.description.message}</p>
              )}
            </div>

            <div className="pt-4 border-t border-[#FAF5FA] flex items-center justify-end gap-3">
              <Link
                href="/corporate"
                className="px-4 py-2 text-xs font-medium text-[#6B6870] hover:text-[#25232A] rounded-lg hover:bg-[#FAF5FA] transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish CSR Grant'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}
