import React from 'react';

export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4"
    >
      <div className="w-10 h-10 rounded-full border-3 border-[#F1E7F3] border-t-[#6D3A70] animate-spin" />
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-[#25232A]">Loading Do Good Drive...</p>
        <p className="text-xs text-[#6B6870]">Preparing marketplace data</p>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
