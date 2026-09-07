'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProfileCard } from '@/components/shared/ProfileCard';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { MOCK_PROFILES, CAUSE_OPTIONS } from '@/lib/mock-data';
import { UserProfile } from '@/lib/types';
import { ArrowLeft, Search, CheckCircle2 } from 'lucide-react';

export default function NgoDirectoryPage() {
  const [query, setQuery] = useState('');
  const [selectedCause, setSelectedCause] = useState('All Causes');
  const [selectedNgo, setSelectedNgo] = useState<UserProfile | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectedNgos, setConnectedNgos] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const ngos = MOCK_PROFILES.filter((p) => p.role === 'ngo');

  const filteredNgos = ngos.filter((ngo) => {
    if (query) {
      const q = query.toLowerCase();
      const matchesName = ngo.fullName.toLowerCase().includes(q);
      const matchesBio = (ngo.bio || '').toLowerCase().includes(q);
      const matchesLocation = (ngo.location || '').toLowerCase().includes(q);
      if (!matchesName && !matchesBio && !matchesLocation) return false;
    }

    if (selectedCause !== 'All Causes') {
      if (!ngo.causes.includes(selectedCause)) return false;
    }

    return true;
  });

  const handleConnect = (ngo: UserProfile) => {
    setSelectedNgo(ngo);
    setIsConnectModalOpen(true);
  };

  const confirmConnection = () => {
    if (selectedNgo) {
      setConnectedNgos((prev) => [...prev, selectedNgo.id]);
      setIsConnectModalOpen(false);
      setToastMessage(`Partnership inquiry dispatched to ${selectedNgo.fullName}!`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <AppShell>
      <Link
        href="/corporate"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6870] hover:text-[#25232A] mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Corporate CSR Hub</span>
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
        title="Vetted NGO Partner Directory"
        description="Discover authenticated non-profit organizations across regional communities to direct CSR funding, employee pro-bono support, or equipment donations."
      />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8790]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by NGO name, mission keywords, or location..."
            className="w-full pl-9 pr-3 py-2 text-sm text-[#25232A] placeholder-[#8B8790] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={selectedCause}
            onChange={(e) => setSelectedCause(e.target.value)}
            className="w-full px-3 py-2 text-sm text-[#25232A] bg-[#FBFAF8] border border-[#E8E3E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A85AAA] focus:border-[#6D3A70]"
          >
            {CAUSE_OPTIONS.map((cause) => (
              <option key={cause} value={cause}>
                {cause}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Profile Cards Grid */}
      {filteredNgos.length === 0 ? (
        <EmptyState
          title="No non-profit partners found"
          description="Try modifying your search keywords or cause category filter."
          actionLabel="Reset Search"
          onAction={() => {
            setQuery('');
            setSelectedCause('All Causes');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNgos.map((ngo) => {
            const hasConnected = connectedNgos.includes(ngo.id);

            return (
              <ProfileCard
                key={ngo.id}
                profile={ngo}
                actionLabel={hasConnected ? 'Partnership Pending' : 'Initiate CSR Partnership'}
                onAction={hasConnected ? undefined : () => handleConnect(ngo)}
              />
            );
          })}
        </div>
      )}

      {selectedNgo && (
        <ConfirmDialog
          isOpen={isConnectModalOpen}
          title="Initiate CSR Partnership Inquiry"
          message={`Would you like to introduce your Corporate CSR division to ${selectedNgo.fullName}? An introductory briefing of your active CSR priorities will be shared with their leadership.`}
          confirmLabel="Send Partnership Introduction"
          cancelLabel="Cancel"
          onConfirm={confirmConnection}
          onCancel={() => setIsConnectModalOpen(false)}
        />
      )}
    </AppShell>
  );
}
