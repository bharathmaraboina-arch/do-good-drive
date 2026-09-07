'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div
      role="alert"
      className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-5"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] border border-[#B91C1C]/20 text-[#B91C1C] flex items-center justify-center shadow-xs">
        <AlertCircle className="w-7 h-7" aria-hidden="true" />
      </div>

      <div className="max-w-md space-y-2">
        <h1 className="text-xl font-bold text-[#25232A]">Something went wrong</h1>
        <p className="text-xs text-[#6B6870] leading-relaxed">
          An unexpected error occurred while loading this section. You can retry the request or return to the marketplace home.
        </p>
        {error.digest && (
          <span className="inline-block text-[10px] text-[#8B8790] bg-[#FAF5FA] px-2 py-0.5 rounded font-mono border border-[#E8E3E8]">
            Error ID: {error.digest}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#25232A] bg-white border border-[#E8E3E8] hover:bg-[#FAF5FA] rounded-lg shadow-xs transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
