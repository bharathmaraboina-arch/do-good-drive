import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Award,
  MinusCircle,
} from 'lucide-react';

export type BadgeVariant =
  | 'open'
  | 'active'
  | 'in_review'
  | 'closed'
  | 'urgent'
  | 'verified'
  | 'evaluating'
  | 'awarded'
  | 'verification_pending'
  | 'more_information_required'
  | 'rejected';

interface StatusBadgeProps {
  status: BadgeVariant | string;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_') as BadgeVariant;

  const getStyles = () => {
    switch (normalized) {
      case 'open':
      case 'active':
        return 'bg-[#DCFCE7] text-[#15803D] border-[#15803D]/20';
      case 'verified':
      case 'awarded':
        return 'bg-[#DCFCE7] text-[#15803D] border-[#15803D]/20 font-semibold';
      case 'in_review':
      case 'evaluating':
      case 'verification_pending':
      case 'more_information_required':
        return 'bg-[#FEF3C7] text-[#B45309] border-[#B45309]/20';
      case 'urgent':
      case 'rejected':
        return 'bg-[#FEE2E2] text-[#B91C1C] border-[#B91C1C]/20 font-semibold';
      case 'closed':
      default:
        return 'bg-[#F3F4F6] text-[#6B6870] border-[#E8E3E8]';
    }
  };

  const getIcon = () => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
    switch (normalized) {
      case 'open':
      case 'active':
        return <CheckCircle2 className={`${iconSize} text-[#15803D] shrink-0`} aria-hidden="true" />;
      case 'verified':
        return <ShieldCheck className={`${iconSize} text-[#15803D] shrink-0`} aria-hidden="true" />;
      case 'awarded':
        return <Award className={`${iconSize} text-[#15803D] shrink-0`} aria-hidden="true" />;
      case 'in_review':
      case 'evaluating':
      case 'verification_pending':
        return <Clock className={`${iconSize} text-[#B45309] shrink-0`} aria-hidden="true" />;
      case 'urgent':
      case 'more_information_required':
        return <AlertTriangle className={`${iconSize} text-[#B45309] shrink-0`} aria-hidden="true" />;
      case 'rejected':
        return <XCircle className={`${iconSize} text-[#B91C1C] shrink-0`} aria-hidden="true" />;
      case 'closed':
      default:
        return <MinusCircle className={`${iconSize} text-[#6B6870] shrink-0`} aria-hidden="true" />;
    }
  };

  const formatLabel = (val: string) => {
    switch (val) {
      case 'in_review':
        return 'In Review';
      case 'open':
        return 'Open';
      case 'active':
        return 'Active';
      case 'urgent':
        return 'Urgent Need';
      case 'verified':
        return 'Verified';
      case 'evaluating':
        return 'Under Evaluation';
      case 'awarded':
        return 'Awarded';
      case 'verification_pending':
        return 'Verification Pending';
      case 'more_information_required':
        return 'Info Required';
      case 'rejected':
        return 'Rejected';
      case 'closed':
        return 'Closed';
      default:
        return val.charAt(0).toUpperCase() + val.slice(1).replace(/_/g, ' ');
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  const label = formatLabel(normalized);

  return (
    <span
      role="status"
      aria-label={`Status: ${label}`}
      className={`inline-flex items-center gap-1.5 rounded-md border tracking-wide font-medium select-none ${sizeClasses} ${getStyles()} ${className}`}
    >
      {getIcon()}
      <span>{label}</span>
    </span>
  );
}
