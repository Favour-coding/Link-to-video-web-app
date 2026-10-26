import React, { useEffect, useState } from 'react';
import { Loader2, Server, Clock } from 'lucide-react';

interface LoadingCardProps {
  onCancel?: () => void;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ onCancel }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto mt-6 bg-[#0c1429]/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-center animate-fadeIn">
      {/* Animated Spinner Icon */}
      <div className="relative inline-flex items-center justify-center mb-5">
        <div className="absolute -inset-2 rounded-full bg-cyan-500/20 blur-md animate-pulse"></div>
        <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 border-r-cyan-400 animate-spin flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      </div>

      {/* Main Required Text */}
      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
        Fetching your video...
      </h3>

      {/* Specific Text requested in prompt */}
      <p className="text-sm text-cyan-200/90 max-w-sm mx-auto mb-4 leading-relaxed font-medium">
        The first request may take up to a minute
      </p>

      {/* Dynamic helpful stages based on seconds elapsed */}
      <div className="max-w-xs mx-auto bg-[#070d1d] border border-cyan-500/20 rounded-xl p-3 mb-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Elapsed: {secondsElapsed}s</span>
          </span>
          <span className="text-cyan-400">Timeout: 60s</span>
        </div>

        {/* Progress indicator */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (secondsElapsed / 60) * 100)}%` }}
          />
        </div>

        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Server className="w-3 h-3 text-cyan-400" />
          {secondsElapsed < 12 ? (
            <span>Connecting to backend service...</span>
          ) : secondsElapsed < 35 ? (
            <span>Waking up cloud server instance...</span>
          ) : (
            <span>Extracting media streams and qualities...</span>
          )}
        </div>
      </div>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-rose-300 transition-colors underline underline-offset-4 decoration-slate-600 hover:decoration-rose-400 cursor-pointer"
        >
          Cancel request
        </button>
      )}
    </div>
  );
};
