import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, X, Archive, Film } from 'lucide-react';

interface PreparingToastProps {
  isVisible: boolean;
  message: string;
  onDismiss: () => void;
  isPlaylist?: boolean;
  formatLabel?: string;
}

export const PreparingToast: React.FC<PreparingToastProps> = ({
  isVisible,
  message,
  onDismiss,
  isPlaylist = false,
  formatLabel,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      return;
    }

    // Auto-progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          return 98; // Hold until server response initiates
        }
        return prev + (isPlaylist ? 1 : 2);
      });
    }, isPlaylist ? 250 : 120);

    // Auto dismiss after 10s for single file or 15s for playlist
    const timer = setTimeout(() => {
      onDismiss();
    }, isPlaylist ? 15000 : 9000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isVisible, isPlaylist, onDismiss]);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Download status notification"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg animate-slideUp"
    >
      <div className="bg-[#0b1329]/95 backdrop-blur-xl border border-cyan-400/60 rounded-2xl p-4 shadow-[0_12px_45px_rgba(6,182,212,0.4)] text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-400 shrink-0 shadow-inner">
              {progress < 98 ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white leading-snug">
                {message || (isPlaylist
                  ? 'Preparing your playlist. This can take several minutes, please keep this page open.'
                  : 'Preparing your file. Please keep this page open.')}
              </h4>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 truncate">
                {isPlaylist ? (
                  <>
                    <Archive className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>Bundling video streams into ZIP archive...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{formatLabel ? `Encoding ${formatLabel}` : 'Extracting & converting media stream'}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated progress bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 h-1.5 transition-all duration-200 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
};
