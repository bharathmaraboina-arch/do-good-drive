'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  HandHeart,
  Sparkles,
  CheckCircle2,
  Building2,
  Award,
} from 'lucide-react';
import { useFeed } from '@/lib/feed-context';
import { NotificationType } from '@/lib/types';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } =
    useFeed();

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'NGO_OPPORTUNITY_PUBLISHED':
        return <HandHeart className="w-3.5 h-3.5 text-[#6D3A70]" />;
      case 'NGO_POST_PUBLISHED':
        return <Sparkles className="w-3.5 h-3.5 text-[#6D3A70]" />;
      case 'APPLICATION_STATUS_CHANGED':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />;
      case 'CONNECTION_STATUS_CHANGED':
        return <Building2 className="w-3.5 h-3.5 text-[#6D3A70]" />;
      case 'CERTIFICATE_GENERATED':
        return <Award className="w-3.5 h-3.5 text-[#6D3A70]" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-[#6B6870]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#6B6870] hover:text-[#25232A] rounded-lg hover:bg-[#FAF5FA] transition-colors"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4 stroke-[2]" />
        {mounted && unreadNotificationsCount > 0 && (
          <span
            suppressHydrationWarning
            className="absolute top-1 right-1 w-4 h-4 bg-[#6D3A70] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
          >
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-[#E8E3E8] shadow-xl z-50 animate-in fade-in-0 duration-150 overflow-hidden">
          {/* Header */}
          <div className="p-3.5 border-b border-[#E8E3E8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#25232A]">In-App Notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#FAF5FA] text-[#6D3A70] border border-[#E8E3E8]">
                  {unreadNotificationsCount} new
                </span>
              )}
            </div>
            {unreadNotificationsCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6D3A70] hover:text-[#552C59] cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#E8E3E8]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6B6870]">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <Link
                  key={notif.id}
                  href={notif.linkUrl || '#'}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    setIsOpen(false);
                  }}
                  className={`block p-3.5 hover:bg-[#FAF5FA] transition-colors ${
                    !notif.read ? 'bg-[#FAF5FA]/60' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-white border border-[#E8E3E8] flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-[#25232A] truncate">{notif.title}</p>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6D3A70] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#6B6870] mt-0.5 leading-snug line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
