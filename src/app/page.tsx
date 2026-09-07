'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartHandshake, Users, Building2, HandHeart, ArrowRight, ShieldCheck, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { MOCK_OPPORTUNITIES } from '@/lib/mock-data';
import { OpportunityCard } from '@/components/shared/OpportunityCard';

export default function LandingPage() {
  const router = useRouter();
  const featuredDrives = MOCK_OPPORTUNITIES.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FBFAF8] flex flex-col selection:bg-[#F1E7F3] selection:text-[#6D3A70]">
      {/* Top Public Header */}
      <header className="sticky top-0 z-40 bg-[#FBFAF8]/90 backdrop-blur-md border-b border-[#E8E3E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6D3A70] text-white flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#25232A] leading-none">
                Do Good Drive
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#8B8790] font-medium mt-0.5">
                Marketplace
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#6B6870]">
            <Link href="#roles" className="hover:text-[#25232A] transition-colors">
              Role Tracks
            </Link>
            <Link href="#drives" className="hover:text-[#25232A] transition-colors">
              Active Drives
            </Link>
            <Link href="#principles" className="hover:text-[#25232A] transition-colors">
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-[#6B6870] hover:text-[#25232A] px-3 py-1.5 rounded-lg hover:bg-[#FAF5FA] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/choose-role"
              className="text-xs font-medium text-white bg-[#6D3A70] hover:bg-[#552C59] px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-[#E8E3E8] bg-radial from-[#FAF5FA]/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FAF5FA] border border-[#E8E3E8] text-[#6D3A70] text-xs font-medium mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
              <span>A purposeful marketplace for authentic social impact</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#25232A] leading-[1.15]">
              Connecting Volunteers, Grassroots NGOs, and Corporates.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#6B6870] leading-relaxed max-w-2xl">
              Do Good Drive is a structured discovery and collaboration platform. We enable non-profits to publish concrete volunteer needs, give community members direct opportunities to serve, and help corporate CSR initiatives fund and support real community drives—free of social media vanity metrics and algorithmic clutter.
            </p>

            {/* Role-Specific Calls To Action */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/volunteer"
                className="group p-4 rounded-xl bg-white border border-[#E8E3E8] hover:border-[#6D3A70] hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center mb-3 group-hover:bg-[#F1E7F3] transition-colors">
                    <HandHeart className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#25232A]">I am a Volunteer</h3>
                  <p className="text-xs text-[#8B8790] mt-1 leading-normal">
                    Explore vetted local and remote community drives matching your skills.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center text-xs font-medium text-[#6D3A70] group-hover:translate-x-0.5 transition-transform">
                  Explore Drives &rarr;
                </span>
              </Link>

              <Link
                href="/ngo"
                className="group p-4 rounded-xl bg-white border border-[#E8E3E8] hover:border-[#6D3A70] hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center mb-3 group-hover:bg-[#F1E7F3] transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#25232A]">I am an NGO</h3>
                  <p className="text-xs text-[#8B8790] mt-1 leading-normal">
                    List upcoming initiatives, coordinate volunteer capacity, and connect with CSR programs.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center text-xs font-medium text-[#6D3A70] group-hover:translate-x-0.5 transition-transform">
                  Post Initiatives &rarr;
                </span>
              </Link>

              <Link
                href="/corporate"
                className="group p-4 rounded-xl bg-white border border-[#E8E3E8] hover:border-[#6D3A70] hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center mb-3 group-hover:bg-[#F1E7F3] transition-colors">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#25232A]">I am a Corporate</h3>
                  <p className="text-xs text-[#8B8790] mt-1 leading-normal">
                    Deploy CSR funding, launch employee volunteer programs, and sponsor grassroots missions.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center text-xs font-medium text-[#6D3A70] group-hover:translate-x-0.5 transition-transform">
                  Direct CSR Grants &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role Tracks Detail Section */}
      <section id="roles" className="py-16 sm:py-20 border-b border-[#E8E3E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6D3A70]">
              Purpose-Driven Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#25232A] mt-2">
              Three Distinct Tracks. One Shared Mission.
            </h2>
            <p className="text-sm text-[#6B6870] mt-3 leading-relaxed">
              Every participant enters with a tailored workflow designed for transparent civic partnership rather than superficial networking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Track 1: Volunteer */}
            <div className="p-6 rounded-xl bg-white border border-[#E8E3E8] shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center mb-4">
                <HandHeart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#25232A]">Volunteers</h3>
              <p className="text-xs text-[#6B6870] mt-2 leading-relaxed">
                Direct engagement without algorithmic feeds or unwanted connection requests.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[#8B8790]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Discover drives filtered by cause, schedule, and format (remote/in-person).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Offer specific technical, educational, or physical volunteer skills.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Track confirmed hours and active service commitments.</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-[#E8E3E8]">
                <Link
                  href="/volunteer"
                  className="text-xs font-semibold text-[#6D3A70] hover:text-[#552C59] flex items-center gap-1"
                >
                  Volunteer Dashboard &rarr;
                </Link>
              </div>
            </div>

            {/* Track 2: NGO */}
            <div className="p-6 rounded-xl bg-white border border-[#E8E3E8] shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#25232A]">Non-Profits & NGOs</h3>
              <p className="text-xs text-[#6B6870] mt-2 leading-relaxed">
                Operations-first initiative coordination without fundraising middle-men.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[#8B8790]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Define concrete drives with clear volunteer quotas and logistics.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Review volunteer applications with transparent skill alignment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Access corporate CSR grant opportunities and equipment donations.</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-[#E8E3E8]">
                <Link
                  href="/ngo"
                  className="text-xs font-semibold text-[#6D3A70] hover:text-[#552C59] flex items-center gap-1"
                >
                  NGO Workspace &rarr;
                </Link>
              </div>
            </div>

            {/* Track 3: Corporate */}
            <div className="p-6 rounded-xl bg-white border border-[#E8E3E8] shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#25232A]">Corporates & CSR</h3>
              <p className="text-xs text-[#6B6870] mt-2 leading-relaxed">
                Structured social responsibility deployment with verified grassroots accountability.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[#8B8790]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Publish targeted CSR grants and project-based financial assistance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Deploy employee skill cohorts for pro-bono governance and tech aid.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Browse vetted, regional non-profits with verified mission histories.</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-[#E8E3E8]">
                <Link
                  href="/corporate"
                  className="text-xs font-semibold text-[#6D3A70] hover:text-[#552C59] flex items-center gap-1"
                >
                  Corporate Portal &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Drives Preview Section */}
      <section id="drives" className="py-16 sm:py-20 border-b border-[#E8E3E8] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6D3A70]">
                Active Initiatives
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#25232A] mt-1.5">
                Current Community Drives Seeking Volunteers
              </h2>
              <p className="text-xs sm:text-sm text-[#8B8790] mt-1">
                Real initiatives organized by verified non-profit partners with transparent quotas.
              </p>
            </div>
            <Link
              href="/volunteer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D3A70] hover:text-[#552C59]"
            >
              <span>View All Drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDrives.map((drive) => (
              <OpportunityCard
                key={drive.id}
                opportunity={drive}
                onView={() => router.push('/volunteer')}
                onApply={() => router.push('/volunteer')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Core Principles & Accountability Section */}
      <section id="principles" className="py-16 sm:py-20 border-b border-[#E8E3E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#25232A]">
              Built for Genuine Impact, Not Endless Scrolling
            </h2>
            <p className="text-sm text-[#6B6870] mt-3 leading-relaxed">
              We made intentional product decisions to keep the marketplace focused strictly on civic delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-5 rounded-xl bg-white border border-[#E8E3E8]">
              <div className="w-8 h-8 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#25232A]">No Vanity Algorithms</h3>
              <p className="text-xs text-[#8B8790] mt-1.5 leading-relaxed">
                There are no viral feeds, follower competitions, or algorithmic timelines. Visibility is determined by verified initiative relevance and urgency.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#E8E3E8]">
              <div className="w-8 h-8 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              </div>
              <h3 className="text-sm font-semibold text-[#25232A]">Verified Partner Profiles</h3>
              <p className="text-xs text-[#8B8790] mt-1.5 leading-relaxed">
                Non-profits and corporate sponsors provide transparent registration credentials to ensure trust for volunteer safety and CSR accountability.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#E8E3E8]">
              <div className="w-8 h-8 rounded-lg bg-[#FAF5FA] text-[#6D3A70] flex items-center justify-center mb-3">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#25232A]">Concrete Commitments</h3>
              <p className="text-xs text-[#8B8790] mt-1.5 leading-relaxed">
                Every drive specifies dates, locations, skill prerequisites, and volunteer caps so community members know exactly what is expected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#FBFAF8] border-t border-[#E8E3E8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E8E3E8]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#6D3A70] text-white flex items-center justify-center">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-bold text-[#25232A]">Do Good Drive Marketplace</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#8B8790]">
              <Link href="/volunteer" className="hover:text-[#25232A] transition-colors">
                Volunteer Area
              </Link>
              <Link href="/ngo" className="hover:text-[#25232A] transition-colors">
                NGO Area
              </Link>
              <Link href="/corporate" className="hover:text-[#25232A] transition-colors">
                Corporate CSR
              </Link>
              <Link href="/choose-role" className="hover:text-[#25232A] transition-colors">
                Join Marketplace
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B8790]">
            <p>&copy; {new Date().getFullYear()} Do Good Drive Marketplace. All rights reserved.</p>
            <p>Connecting civic volunteers, certified non-profits, and corporate CSR programs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
