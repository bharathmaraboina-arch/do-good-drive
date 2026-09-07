import React from 'react';
import Link from 'next/link';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] flex items-center justify-center shadow-xs">
        <Compass className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="max-w-md space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D3A70] block">
          404 &bull; Page Not Found
        </span>
        <h1 className="text-2xl font-bold text-[#25232A]">This pathway doesn&apos;t exist</h1>
        <p className="text-xs text-[#6B6870] leading-relaxed">
          The page or community drive you requested could not be located or may have been unpublished.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Marketplace Home</span>
        </Link>
        <Link
          href="/volunteer/opportunities"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#25232A] bg-white border border-[#E8E3E8] hover:bg-[#FAF5FA] rounded-lg shadow-xs transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Discover Drives</span>
        </Link>
      </div>
    </div>
  );
}
