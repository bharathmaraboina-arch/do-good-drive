'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from '@/lib/schemas/auth';
import { useAuth } from '@/lib/auth-context';
import { HeartHandshake, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isSupabaseActive } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setServerError(null);
    const res = await signUp(data.email, data.password, data.fullName);
    if (res.error) {
      setServerError(res.error);
    } else {
      if (isSupabaseActive) {
        router.push('/verify-email');
      } else {
        router.push('/choose-role');
      }
    }
  };

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
          Create your account
        </h2>
        <p className="mt-2 text-center text-xs text-[#8B8790]">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#6D3A70] hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
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
                Full Name or Contact Person
              </label>
              <input
                type="text"
                {...register('fullName')}
                placeholder="Eleanor Vance"
                className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="eleanor@example.org"
                className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25232A] mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="Repeat password"
                className="w-full px-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account & Continue'}
            </button>
          </form>

          <p className="text-[11px] text-[#8B8790] text-center mt-4 leading-relaxed">
            By creating an account, you agree to uphold transparent community principles.
          </p>
        </div>
      </div>
    </div>
  );
}
