'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Smartphone,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Users,
} from 'lucide-react';
import Link from 'next/link';

interface QrAttendanceDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityTitle?: string;
}

interface SimulatedCheckIn {
  id: string;
  name: string;
  timestamp: string;
  location: string;
  avatar: string;
}

export default function QrAttendanceDemoModal({
  isOpen,
  onClose,
  opportunityTitle = 'Urban Reforestation & Riparian Planting Drive',
}: QrAttendanceDemoModalProps) {
  const [checkIns, setCheckIns] = useState<SimulatedCheckIn[]>([
    {
      id: 'chk-1',
      name: 'Sarah Jenkins',
      timestamp: '09:02 AM',
      location: 'East Basin Station (GPS ±3m)',
      avatar: 'S',
    },
    {
      id: 'chk-2',
      name: 'Marcus Vance',
      timestamp: '09:05 AM',
      location: 'East Basin Station (GPS ±4m)',
      avatar: 'M',
    },
  ]);

  const [countdown, setCountdown] = useState(15);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 15));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const mockVolunteers = [
    { name: 'Elena Rostova', avatar: 'E' },
    { name: 'Devon Miller', avatar: 'D' },
    { name: 'Amina Patel', avatar: 'A' },
    { name: 'Liam Tanaka', avatar: 'L' },
  ];

  const handleSimulateScan = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const nextVolunteer = mockVolunteers[checkIns.length % mockVolunteers.length];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const newCheckIn: SimulatedCheckIn = {
        id: 'chk-' + Date.now(),
        name: nextVolunteer.name,
        timestamp: timeStr,
        location: 'East Basin Station (GPS ±2.5m)',
        avatar: nextVolunteer.avatar,
      };

      setCheckIns((prev) => [newCheckIn, ...prev]);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8E3E8] overflow-hidden my-6">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF5FA] border-b border-[#E8E3E8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6D3A70] text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#25232A]">
                  ImpactOS QR Attendance Kiosk
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]/30">
                  ⚡ Pro Feature Demo
                </span>
              </div>
              <p className="text-[11px] text-[#6B6870]">
                Live dynamic QR roll call for: <span className="font-semibold text-[#6D3A70]">{opportunityTitle}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8B8790] hover:text-[#25232A] rounded-lg hover:bg-[#F1E7F3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left Column: Live QR Code Display */}
            <div className="bg-[#FBFAF8] border-2 border-dashed border-[#6D3A70]/30 rounded-xl p-5 text-center flex flex-col items-center justify-center space-y-3 shadow-inner">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
                Live Dynamic Kiosk Active
              </span>

              {/* Stylized QR Graphic */}
              <div className="relative p-3 bg-white rounded-xl shadow-md border border-[#E8E3E8]">
                <svg
                  className="w-44 h-44 text-[#6D3A70]"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Corner Position Boxes */}
                  <rect x="5" y="5" width="28" height="28" fill="#6D3A70" rx="4" />
                  <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="13" width="12" height="12" fill="#6D3A70" rx="1" />

                  <rect x="67" y="5" width="28" height="28" fill="#6D3A70" rx="4" />
                  <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="75" y="13" width="12" height="12" fill="#6D3A70" rx="1" />

                  <rect x="5" y="67" width="28" height="28" fill="#6D3A70" rx="4" />
                  <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="75" width="12" height="12" fill="#6D3A70" rx="1" />

                  {/* Random Pattern Pixels */}
                  <rect x="38" y="8" width="6" height="6" fill="#6D3A70" />
                  <rect x="48" y="15" width="6" height="6" fill="#6D3A70" />
                  <rect x="56" y="8" width="6" height="6" fill="#6D3A70" />
                  <rect x="38" y="24" width="6" height="6" fill="#6D3A70" />

                  <rect x="8" y="38" width="6" height="6" fill="#6D3A70" />
                  <rect x="18" y="46" width="6" height="6" fill="#6D3A70" />
                  <rect x="26" y="38" width="6" height="6" fill="#6D3A70" />

                  <rect x="38" y="38" width="24" height="24" fill="#6D3A70" rx="2" />
                  <circle cx="50" cy="50" r="6" fill="white" />
                  <circle cx="50" cy="50" r="3" fill="#6D3A70" />

                  <rect x="68" y="38" width="6" height="6" fill="#6D3A70" />
                  <rect x="78" y="46" width="6" height="6" fill="#6D3A70" />
                  <rect x="88" y="38" width="6" height="6" fill="#6D3A70" />

                  <rect x="38" y="68" width="6" height="6" fill="#6D3A70" />
                  <rect x="48" y="78" width="6" height="6" fill="#6D3A70" />
                  <rect x="56" y="88" width="6" height="6" fill="#6D3A70" />
                  <rect x="78" y="78" width="8" height="8" fill="#6D3A70" />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-[#6D3A70] flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-[#6D3A70]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#6B6870]">
                <RefreshCw className="w-3 h-3 text-[#6D3A70] animate-spin" style={{ animationDuration: '3s' }} />
                <span>Anti-fraud token updates in {countdown}s</span>
              </div>
            </div>

            {/* Right Column: Live Check-in Feed + Simulator Action */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#25232A] uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#6D3A70]" />
                  Live Attendance Feed ({checkIns.length})
                </span>
                <span className="text-[11px] text-[#15803D] font-bold">100% Geofence Verified</span>
              </div>

              {/* Stream List */}
              <div className="bg-[#FAF5FA] rounded-xl p-3 border border-[#E8E3E8] space-y-2 max-h-48 overflow-y-auto">
                {checkIns.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-white border border-[#E8E3E8] flex items-center justify-between gap-2 shadow-2xs animate-fadeIn"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#F1E7F3] text-[#6D3A70] font-bold text-xs flex items-center justify-center shrink-0">
                        {item.avatar}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#25232A]">{item.name}</h4>
                        <span className="text-[10px] text-[#8B8790] flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-[#6D3A70]" /> {item.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-[#6B6870] block">{item.timestamp}</span>
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#15803D]">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Checked-in
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulation Trigger Button */}
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={isSimulating}
                className="w-full py-2.5 px-4 bg-[#6D3A70] hover:bg-[#552C59] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Smartphone className="w-4 h-4" />
                <span>{isSimulating ? 'Simulating Mobile Scan...' : 'Simulate Volunteer Phone Scan'}</span>
              </button>
            </div>
          </div>

          {/* Value Prop Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF5FA] via-[#F1E7F3]/40 to-[#FAF5FA] border border-[#E8E3E8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-[#25232A] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                Zero manual roll calls or lost hours
              </h4>
              <p className="text-[11px] text-[#6B6870]">
                Volunteers scan your tablet or paper kiosk. Hours are verified instantly and automatically update volunteer impact portfolios.
              </p>
            </div>

            <Link
              href="/solutions/pro"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#6D3A70] hover:text-[#552C59] bg-white border border-[#E8E3E8] hover:border-[#6D3A70] rounded-lg shadow-2xs transition-all shrink-0"
            >
              <span>Explore Pro Pricing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-[#E8E3E8] flex items-center justify-between">
          <span className="text-[11px] text-[#8B8790]">
            Included in <strong>ImpactOS Pro for Non-Profits</strong> &amp; <strong>Enterprise CSR</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#6B6870] hover:text-[#25232A]"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
