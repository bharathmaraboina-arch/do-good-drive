'use client';

import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#25232A]/40 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog box */}
      <div className="relative w-full max-w-md bg-white rounded-xl border border-[#E8E3E8] shadow-xl p-6 z-10 animate-in fade-in-0 zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#6B6870] hover:text-[#25232A] p-1 rounded-md hover:bg-[#FAF5FA] transition-colors"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close dialog</span>
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-[#FEE2E2] text-[#B91C1C]'
                : 'bg-[#F1E7F3] text-[#6D3A70]'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#25232A]">{title}</h3>
            <p className="mt-1.5 text-sm text-[#6B6870] leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-[#6B6870] hover:text-[#25232A] hover:bg-[#FAF5FA] rounded-lg transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-xs transition-colors cursor-pointer ${
              isDestructive
                ? 'bg-[#B91C1C] hover:bg-[#991B1B] disabled:bg-[#B91C1C]/50'
                : 'bg-[#6D3A70] hover:bg-[#552C59] disabled:bg-[#6D3A70]/50'
            }`}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
