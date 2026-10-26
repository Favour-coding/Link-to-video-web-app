import React from 'react';
import { AlertTriangle, Lock, ServerCrash, Clock, WifiOff, RotateCcw, XCircle } from 'lucide-react';
import { ErrorState } from '../types.ts';

interface ErrorCardProps {
  error: ErrorState;
  onRetry: () => void;
  onClear: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ error, onRetry, onClear }) => {
  const getIcon = () => {
    switch (error.type) {
      case 'not_found':
        return <Lock className="w-7 h-7 text-amber-400" />;
      case 'server_busy':
        return <ServerCrash className="w-7 h-7 text-amber-400" />;
      case 'too_many_requests':
        return <Clock className="w-7 h-7 text-purple-400" />;
      case 'network':
        return <WifiOff className="w-7 h-7 text-rose-400" />;
      case 'invalid_url':
        return <XCircle className="w-7 h-7 text-rose-400" />;
      default:
        return <AlertTriangle className="w-7 h-7 text-rose-400" />;
    }
  };

  const getBorderColor = () => {
    switch (error.type) {
      case 'not_found':
      case 'server_busy':
        return 'border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]';
      case 'too_many_requests':
        return 'border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]';
      default:
        return 'border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)]';
    }
  };

  return (
    <div
      className={`w-full max-w-lg mx-auto mt-6 bg-[#0c1429]/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border ${getBorderColor()} animate-fadeIn`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-[#070d1d] border border-slate-800 shrink-0">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-base sm:text-lg text-white">
              {error.title}
            </h3>
            {error.statusCode && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                HTTP {error.statusCode}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {error.message}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {error.canRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClear}
              className="px-3 py-2 rounded-xl bg-[#070d1d] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Try another link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
