import React, { useEffect, useState } from 'react';
import { Loader2, Clock } from 'lucide-react';

interface SkeletonCardProps {
  onCancel?: () => void;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ onCancel }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[720px] mx-auto mt-6 glass-card rounded-2xl sm:rounded-3xl border border-[#1B2742] p-4 sm:p-6 shadow-[0_12px_45px_rgba(0,0,0,0.5)] animate-fadeIn">
      {/* 16:9 Skeleton Media Preview Box */}
      <div className="relative aspect-video w-full rounded-2xl bg-[#070B16] border border-[#1B2742] overflow-hidden mb-5 flex items-center justify-center">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />

        {/* Centered loader with glow */}
        <div className="relative flex flex-col items-center gap-3 z-10">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#0E1526]/80 border border-[#1B2742] text-[#00C2FF] shadow-lg">
            <Loader2 className="w-7 h-7 animate-spin text-[#00C2FF]" />
          </div>
          <div className="text-center px-4">
            <h4 className="text-sm sm:text-base font-bold text-[#E8EEFF]">
              Fetching your video...
            </h4>
            <p className="text-xs text-[#8A97B8] mt-1 max-w-xs">
              The first request may take up to a minute
            </p>
          </div>
        </div>

        {/* Skeleton duration badge */}
        <div className="absolute bottom-3 right-3 h-6 w-16 rounded-lg bg-[#0E1526] border border-[#1B2742]/80 flex items-center justify-center gap-1 text-[11px] text-[#8A97B8] font-mono">
          <Clock className="w-3 h-3 text-[#00C2FF]" />
          <span>{seconds}s</span>
        </div>
      </div>

      {/* Skeleton Title (2 lines) */}
      <div className="space-y-2 mb-5">
        <div className="h-5 w-3/4 bg-[#1B2742]/70 rounded-lg animate-pulse" />
        <div className="h-4 w-1/2 bg-[#1B2742]/50 rounded-lg animate-pulse" />
      </div>

      {/* Skeleton Meta (Uploader & Duration) */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-24 bg-[#1B2742]/60 rounded-full animate-pulse" />
        <div className="h-6 w-20 bg-[#1B2742]/40 rounded-full animate-pulse" />
      </div>

      {/* Skeleton Download Options (3 rows) */}
      <div className="space-y-3 pt-2 border-t border-[#1B2742]/80">
        <div className="h-4 w-32 bg-[#1B2742]/50 rounded mb-3 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 rounded-2xl bg-[#070B16] border border-[#1B2742]/70 flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B2742]/60 animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 bg-[#1B2742]/70 rounded animate-pulse" />
                <div className="h-3 w-16 bg-[#1B2742]/40 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-10 w-24 rounded-xl bg-[#1B2742]/60 animate-pulse" />
          </div>
        ))}
      </div>

      {onCancel && (
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[#8A97B8] hover:text-[#F43F5E] transition-colors underline underline-offset-4 decoration-[#1B2742] hover:decoration-[#F43F5E] cursor-pointer py-1"
          >
            Cancel request
          </button>
        </div>
      )}
    </div>
  );
};
