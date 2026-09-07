import React from 'react';
import { MapPin, Globe, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { StatusBadge } from './StatusBadge';

interface ProfileCardProps {
  profile: UserProfile;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function ProfileCard({
  profile,
  actionLabel = 'View Profile',
  onAction,
  className = '',
}: ProfileCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const roleLabel = {
    ngo: 'Non-Profit Organization',
    corporate: 'Corporate Partner',
    volunteer: 'Community Volunteer',
  }[profile.role];

  return (
    <div
      className={`bg-white rounded-xl border border-[#E8E3E8] p-5 shadow-xs flex flex-col justify-between hover:border-[#6D3A70]/30 hover:shadow-sm transition-all duration-200 ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F1E7F3] text-[#6D3A70] font-bold text-sm flex items-center justify-center border border-[#E8E3E8] shrink-0">
              {getInitials(profile.fullName)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-bold text-[#25232A]">{profile.fullName}</h4>
                {profile.verified && (
                  <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                )}
              </div>
              <p className="text-xs text-[#6B6870] font-medium">{roleLabel}</p>
            </div>
          </div>

          <StatusBadge status={profile.role === 'volunteer' ? 'active' : 'verified'} size="sm" />
        </div>

        {profile.bio && (
          <p className="text-xs text-[#6B6870] line-clamp-3 mb-3.5 leading-relaxed">
            {profile.bio}
          </p>
        )}

        <div className="space-y-1.5 mb-4 text-xs text-[#6B6870]">
          {profile.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#6D3A70] shrink-0" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#6D3A70] shrink-0" />
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="text-[#6D3A70] hover:underline truncate"
              >
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {profile.causes && profile.causes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {profile.causes.slice(0, 3).map((cause) => (
              <span
                key={cause}
                className="px-2 py-0.5 text-xs rounded-md bg-[#FAF5FA] text-[#6B6870] border border-[#E8E3E8]"
              >
                {cause}
              </span>
            ))}
            {profile.causes.length > 3 && (
              <span className="px-1.5 py-0.5 text-xs text-[#8B8790]">
                +{profile.causes.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[#FAF5FA] flex items-center justify-end">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-semibold text-[#6D3A70] hover:text-[#552C59] px-3 py-1.5 rounded-lg hover:bg-[#FAF5FA] transition-colors cursor-pointer"
          >
            {actionLabel} &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
