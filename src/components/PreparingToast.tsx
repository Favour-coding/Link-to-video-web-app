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

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          return 98; // Hold until server response initiates
        }
        return prev + (isPlaylist ? 1 : 2);
      });
    }, isPlaylist ? 250 : 120);

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
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg animate-slideUp"
    >
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#3B82F6]/50 shadow-[0_12px_45px_rgba(0,0,0,0.6)] text-[#E8EEFF]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-[#070B16] border border-[#1B2742] text-[#00C2FF] shrink-0 shadow-inner">
              {progress < 98 ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              )}
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#E8EEFF] leading-snug">
                {message || (isPlaylist
                  ? 'Preparing your playlist. This can take several minutes, please keep this page open.'
                  : 'Preparing your file. Please keep this page open.')}
              </h4>
              <p className="text-xs text-[#8A97B8] mt-1 flex items-center gap-1.5 truncate">
                {isPlaylist ? (
                  <>
                    <Archive className="w-3.5 h-3.5 text-[#00C2FF] shrink-0" />
                    <span>Bundling video streams into ZIP archive...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-3.5 h-3.5 text-[#7A3CFF] shrink-0" />
                    <span>{formatLabel ? `Encoding ${formatLabel}` : 'Extracting & converting media stream'}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center p-1.5 rounded-xl text-[#8A97B8] hover:text-[#E8EEFF] hover:bg-[#1B2742] transition-colors shrink-0 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated brand gradient progress bar */}
        <div className="w-full bg-[#070B16] rounded-full h-1.5 mt-3.5 overflow-hidden border border-[#1B2742]/50">
          <div
            className="brand-gradient-bg h-1.5 transition-all duration-200 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
};
