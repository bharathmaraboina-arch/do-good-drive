'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MailCheck, ArrowRight, RefreshCw, HeartHandshake } from 'lucide-react';

export default function VerifyEmailPage() {
  const [isResent, setIsResent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleResend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsResent(true);
    }, 1000);
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
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-xl border border-[#E8E3E8] shadow-xs text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF5FA] text-[#6D3A70] mx-auto flex items-center justify-center mb-5 border border-[#E8E3E8]">
            <MailCheck className="w-7 h-7 stroke-[1.75]" />
          </div>

          <h2 className="text-xl font-bold text-[#25232A] mb-2">
            Check your inbox
          </h2>

          <p className="text-xs text-[#6B6870] leading-relaxed mb-6">
            We have dispatched a verification link to your email. Please click the link to confirm your identity before publishing initiatives or applying.
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={isSending || isResent}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-[#6B6870] bg-[#FBFAF8] hover:bg-[#FAF5FA] border border-[#E8E3E8] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
              <span>{isResent ? 'Verification Email Resent' : 'Resend Verification Email'}</span>
            </button>

            <Link
              href="/choose-role"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
            >
              <span>Continue to Role Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-6 pt-5 border-t border-[#E8E3E8]">
            <Link href="/login" className="text-xs text-[#8B8790] hover:text-[#25232A] transition-colors">
              &larr; Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
