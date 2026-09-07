'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useAuth } from '@/lib/auth-context';
import { useOnboarding } from '@/lib/onboarding-context';
import { useCorporate } from '@/lib/corporate-context';
import {
  Building2,
  Bookmark,
  ArrowRight,
  ExternalLink,
  Search,
  Send,
} from 'lucide-react';

export default function CorporateDashboardPage() {
  const { profile } = useAuth();
  const { corporateProfile, verifications } = useOnboarding();
  const { ngos, shortlistedNgoIds, connectionRequests } = useCorporate();

  const currentCorpId = profile?.id || 'corp-1';
  const myRequests = connectionRequests.filter((r) => r.corporateProfileId === currentCorpId);
  const acceptedRequests = myRequests.filter((r) => r.status === 'ACCEPTED');

  const shortlistedNgos = ngos.filter((n) => shortlistedNgoIds.includes(n.profileId));

  const verifRecord = verifications.find(
    (v) => v.id.includes(currentCorpId) || v.name.toLowerCase().includes('ecotech')
  );
  const currentVerificationStatus = verifRecord ? verifRecord.status : profile?.verified ? 'VERIFIED' : 'VERIFICATION_PENDING';

  return (
    <AppShell>
      {/* Corporate Profile Readiness Banner */}
      <div className="mb-6 p-4 rounded-xl bg-white border border-[#E8E3E8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#F1E7F3] border border-[#E8E3E8] text-[#6D3A70] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#25232A]">
                {corporateProfile?.companyName || profile?.organizationName || 'EcoTech Partners'}
              </h3>
              <StatusBadge status={currentVerificationStatus.toLowerCase()} size="sm" />
            </div>
            <p className="text-xs text-[#6B6870] mt-0.5">
              CSR Focus: {(corporateProfile?.csrFocusAreas || ['Environment', 'Sustainability']).join(', ')} &bull; {corporateProfile?.locations?.[0] || 'Portland, OR'}
            </p>
          </div>
        </div>

        <Link
          href="/onboarding/corporate"
          className="px-3 py-1.5 text-xs font-semibold text-[#6D3A70] bg-[#F1E7F3] border border-[#E8E3E8] rounded-lg hover:bg-[#ebdce9] transition-colors shrink-0 text-center"
        >
          Update Corporate Profile &rarr;
        </Link>
      </div>

      <PageHeader
        title="Corporate Social Responsibility Hub"
        description="Discover grassroots non-profits, maintain a shortlist of prospective partners, and initiate connection requests for social impact."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/corporate/shortlist"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6B6870] bg-white border border-[#E8E3E8] rounded-lg shadow-xs hover:bg-[#FAF5FA] transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current text-[#6D3A70]" />
              <span>Shortlist ({shortlistedNgoIds.length})</span>
            </Link>
            <Link
              href="/corporate/ngos"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Discover NGOs</span>
            </Link>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Shortlisted NGOs
          </span>
          <p className="text-2xl font-bold text-[#25232A] mt-1">{shortlistedNgoIds.length} Organizations</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Connections Initiated
          </span>
          <p className="text-2xl font-bold text-[#6D3A70] mt-1">{myRequests.length} Requests</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Accepted Partnerships
          </span>
          <p className="text-2xl font-bold text-[#15803D] mt-1">{acceptedRequests.length} Connected</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3E8] shadow-xs">
          <span className="text-[11px] text-[#8B8790] uppercase tracking-wider font-bold block">
            Discoverable NGOs
          </span>
          <p className="text-2xl font-bold text-[#25232A] mt-1">{ngos.length} Partners</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column: Connection Requests Tracker (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#25232A]">
              Connection Requests ({myRequests.length})
            </h2>
            <Link
              href="/corporate/ngos"
              className="text-xs font-semibold text-[#6D3A70] hover:underline flex items-center gap-1"
            >
              <span>Explore Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myRequests.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E8E3E8] p-8 text-center shadow-xs">
              <Send className="w-8 h-8 text-[#8B8790] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-[#25232A]">No connection requests sent yet</h4>
              <p className="text-xs text-[#6B6870] mt-1 max-w-sm mx-auto">
                Explore registered non-profit organizations and send an introductory connection request to initiate collaboration.
              </p>
              <Link
                href="/corporate/ngos"
                className="mt-4 inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-[#6D3A70] hover:bg-[#552C59] rounded-lg shadow-xs"
              >
                <span>Discover NGOs Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs hover:border-[#6D3A70]/30 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/corporate/ngos/${req.ngoProfileId}`}
                          className="text-sm font-bold text-[#25232A] hover:text-[#6D3A70] transition-colors"
                        >
                          {req.ngoName}
                        </Link>
                      </div>
                      <span className="text-[11px] text-[#8B8790]">
                        Requested on {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <StatusBadge
                      status={
                        req.status === 'ACCEPTED'
                          ? 'active'
                          : req.status === 'DECLINED'
                          ? 'rejected'
                          : 'in_review'
                      }
                      size="sm"
                    />
                  </div>

                  {req.initialMessage && (
                    <p className="text-xs text-[#6B6870] bg-[#FBFAF8] p-2.5 rounded-lg border border-[#E8E3E8] italic leading-relaxed">
                      &ldquo;{req.initialMessage}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8E3E8]">
                    <span className="text-[#8B8790]">
                      Status: <strong className="text-[#25232A]">{req.status}</strong>
                    </span>
                    <Link
                      href={`/corporate/ngos/${req.ngoProfileId}`}
                      className="text-[#6D3A70] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View NGO Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Column: Shortlist Preview & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E3E8] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A]">
                Shortlisted NGOs ({shortlistedNgos.length})
              </h3>
              <Link
                href="/corporate/shortlist"
                className="text-xs font-semibold text-[#6D3A70] hover:underline"
              >
                Manage All
              </Link>
            </div>

            {shortlistedNgos.length === 0 ? (
              <p className="text-xs text-[#8B8790] py-3">
                No NGOs shortlisted yet. Bookmark non-profit organizations from the discovery directory.
              </p>
            ) : (
              <div className="space-y-2.5">
                {shortlistedNgos.slice(0, 3).map((ngo) => (
                  <div
                    key={ngo.profileId}
                    className="p-3 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] flex items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#25232A]">{ngo.ngoName}</h4>
                      <p className="text-[10px] text-[#8B8790]">{ngo.locations[0]}</p>
                    </div>

                    <Link
                      href={`/corporate/ngos/${ngo.profileId}`}
                      className="text-[11px] font-semibold text-[#6D3A70] hover:underline shrink-0"
                    >
                      Profile &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CSR Partner Actions */}
          <div className="bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#25232A] pb-2 border-b border-[#E8E3E8]">
              CSR Partner Actions
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/corporate/ngos"
                className="w-full p-2.5 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] hover:border-[#6D3A70] flex items-center justify-between text-[#25232A] font-medium hover:text-[#6D3A70] transition-all"
              >
                <div>
                  <span className="block font-bold">Discover NGO Directory</span>
                  <span className="text-[10px] text-[#8B8790]">Browse causes, regions &amp; verified partners</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#6D3A70]" />
              </Link>
              <Link
                href="/corporate/shortlist"
                className="w-full p-2.5 rounded-lg bg-[#FBFAF8] border border-[#E8E3E8] hover:border-[#6D3A70] flex items-center justify-between text-[#25232A] font-medium hover:text-[#6D3A70] transition-all"
              >
                <div>
                  <span className="block font-bold">Manage Shortlisted NGOs</span>
                  <span className="text-[10px] text-[#8B8790]">Review prospective partners &amp; connect</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#6D3A70]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
