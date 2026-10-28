import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Maximize2, AlertCircle, RefreshCw } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  // Lock page scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Reset error and attempt autoplay when opened; pause & reset when closed
  useEffect(() => {
    if (isOpen) {
      setHasError(false);
      const timer = setTimeout(() => {
        if (videoRef.current) {
          try {
            videoRef.current.currentTime = 0;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Autoplay may be restricted by browser policy; user can tap play on controls
              });
            }
          } catch {
            // Ignore playback error
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        } catch {
          // Ignore
        }
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch {
        // Ignore
      }
    }
    onClose();
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.requestFullscreen) {
        video.requestFullscreen().catch(() => {});
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      } else if ((video as any).webkitEnterFullscreen) {
        // iOS Safari fullscreen
        (video as any).webkitEnterFullscreen();
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen();
      }
    } catch {
      // Ignore
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="FavouraFetch Tutorial Video"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="relative w-full max-w-sm flex flex-col items-center">
        {/* Top Header Row with Title and Close (X) Button */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <div className="text-sm font-semibold text-[#E8EEFF] tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00C2FF] animate-pulse" />
            <span>FavouraFetch Tutorial</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close tutorial"
            className="w-9 h-9 rounded-full bg-[#0E1526]/90 border border-[#1B2742] hover:border-[#7A3CFF] text-[#8A97B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer hover-lift shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Box / Error State
            Requirements:
            - Portrait (368x496)
            - aspect-ratio: 368 / 496
            - width: min(100%, 360px)
            - max-height: 80vh
            - centered
            - object-fit: contain
            - rounded corners
            - black background
        */}
        <div
          className="relative w-full overflow-hidden rounded-2xl bg-black border border-[#1B2742] shadow-[0_8px_32px_rgba(0,0,0,0.7)] flex items-center justify-center"
          style={{
            aspectRatio: '368 / 496',
            width: 'min(100%, 360px)',
            maxHeight: '80vh',
          }}
        >
          {hasError ? (
            <div className="p-6 flex flex-col items-center justify-center text-center w-full h-full bg-[#0B1020]/95">
              <div className="w-12 h-12 rounded-2xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 flex items-center justify-center text-[#FF4D4D] mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#E8EEFF] mb-2">
                Tutorial video is unavailable right now
              </h4>
              <p className="text-xs text-[#8A97B8] max-w-[240px] mb-5 leading-relaxed">
                Please follow the simple 3-step guide on the page or check back shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setHasError(false);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E1526] border border-[#1B2742] hover:border-[#00C2FF] text-xs font-semibold text-[#E8EEFF] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span>Try again</span>
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              src="/tutorial.mp4"
              controls
              playsInline
              preload="metadata"
              autoPlay
              poster="/assets/aistudio/file_000000004f648246954afcb807bd6425_206e7c64.png"
              onError={() => setHasError(true)}
              className="w-full h-full object-contain rounded-2xl bg-black block"
              style={{
                aspectRatio: '368 / 496',
                width: 'min(100%, 360px)',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* "Open fullscreen" button under the player */}
        {!hasError && (
          <div className="w-full flex justify-center mt-3">
            <button
              type="button"
              onClick={handleFullscreen}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#0E1526]/90 border border-[#1B2742] hover:border-[#00C2FF] text-xs font-medium text-[#8A97B8] hover:text-[#E8EEFF] flex items-center gap-2 transition-all cursor-pointer hover-lift shadow-md"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#00C2FF]" />
              <span>Open fullscreen</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
