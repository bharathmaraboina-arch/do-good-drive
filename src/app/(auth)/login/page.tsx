'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/schemas/auth';
import { useAuth } from '@/lib/auth-context';
import { HeartHandshake, AlertCircle } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const { signIn, setDemoRole, isSupabaseActive } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const res = await signIn(data.email, data.password);
    if (res.error) {
      setServerError(res.error);
    } else {
      router.push(redirectPath !== '/' ? redirectPath : '/feed');
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-8 rounded-xl border border-[#E8E3E8] shadow-xs">
      {serverError && (
        <div className="mb-5 p-3 rounded-lg bg-[#FEE2E2] border border-[#B91C1C]/20 flex items-start gap-2.5 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#25232A] mb-1">
            Email Address
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="name@organization.org"
            className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-[#B91C1C]">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-[#25232A]">Password</label>
          </div>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-[#B91C1C]">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Quick Demo Access Bar */}
      <div className="mt-6 pt-5 border-t border-[#E8E3E8]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8B8790] text-center mb-3">
          Instant Demo Direct Access
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setDemoRole('volunteer')}
            className="px-2 py-1.5 text-xs text-[#6B6870] hover:text-[#6D3A70] bg-[#FAF5FA] hover:bg-[#F1E7F3] border border-[#E8E3E8] rounded-md font-medium text-center transition-colors cursor-pointer"
          >
            Volunteer
          </button>
          <button
            type="button"
            onClick={() => setDemoRole('ngo')}
            className="px-2 py-1.5 text-xs text-[#6B6870] hover:text-[#6D3A70] bg-[#FAF5FA] hover:bg-[#F1E7F3] border border-[#E8E3E8] rounded-md font-medium text-center transition-colors cursor-pointer"
          >
            NGO
          </button>
          <button
            type="button"
            onClick={() => setDemoRole('corporate')}
            className="px-2 py-1.5 text-xs text-[#6B6870] hover:text-[#6D3A70] bg-[#FAF5FA] hover:bg-[#F1E7F3] border border-[#E8E3E8] rounded-md font-medium text-center transition-colors cursor-pointer"
          >
            Corporate
          </button>
        </div>
        {!isSupabaseActive && (
          <p className="text-[10px] text-center text-[#8B8790] mt-2">
            Running in local preview mode. Click any role above to enter directly.
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FBFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-lg bg-[#6D3A70] text-white flex items-center justify-center shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#25232A]">
            Do Good Drive
          </span>
        </Link>
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#25232A]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-xs text-[#8B8790]">
          Or{' '}
          <Link href="/sign-up" className="font-medium text-[#6D3A70] hover:underline">
            create a new account
          </Link>{' '}
          to join the marketplace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="bg-white p-8 rounded-xl border border-[#E8E3E8] text-center text-xs text-[#8B8790]">Loading...</div>}>
          <LoginFormContent />
        </Suspense>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-[#8B8790] hover:text-[#25232A] inline-flex items-center gap-1 transition-colors"
          >
            &larr; Back to marketplace overview
          </Link>
        </div>
      </div>
    </div>
  );
}
