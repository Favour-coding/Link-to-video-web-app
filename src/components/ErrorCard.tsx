import React from 'react';
import { AlertTriangle, Lock, ServerCrash, Clock, WifiOff, RotateCcw, XCircle, ArrowLeft } from 'lucide-react';
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
        return <Lock className="w-6 h-6 text-[#F5B544]" />;
      case 'server_busy':
        return <ServerCrash className="w-6 h-6 text-[#F5B544]" />;
      case 'too_many_requests':
        return <Clock className="w-6 h-6 text-[#7A3CFF]" />;
      case 'network':
        return <WifiOff className="w-6 h-6 text-[#F43F5E]" />;
      case 'invalid_url':
        return <XCircle className="w-6 h-6 text-[#F43F5E]" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-[#F43F5E]" />;
    }
  };

  const getBorderColor = () => {
    switch (error.type) {
      case 'not_found':
      case 'server_busy':
        return 'border-[#F5B544]/40';
      case 'too_many_requests':
        return 'border-[#7A3CFF]/40';
      default:
        return 'border-[#F43F5E]/40';
    }
  };

  return (
    <div
      className={`w-full max-w-[720px] mx-auto mt-6 glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 border ${getBorderColor()} shadow-[0_12px_45px_rgba(0,0,0,0.5)] animate-fadeIn`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-[#070B16] border border-[#1B2742] shrink-0">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="font-bold text-base sm:text-lg text-[#E8EEFF]">
              {error.title}
            </h3>
            {error.statusCode && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#070B16] border border-[#1B2742] text-[#8A97B8]">
                HTTP {error.statusCode}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#8A97B8] leading-relaxed mb-5">
            {error.message}
          </p>

          {/* Action buttons: Try again & Change link */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onRetry}
              className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 rounded-xl brand-gradient-bg text-white text-xs sm:text-sm font-bold shadow-[0_4px_15px_rgba(122,60,255,0.3)] hover:shadow-[0_4px_20px_rgba(0,194,255,0.4)] active:scale-95 hover-lift cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try again</span>
            </button>

            <button
              type="button"
              onClick={onClear}
              className="min-h-[44px] flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#070B16] hover:bg-[#1B2742] border border-[#1B2742] text-[#8A97B8] hover:text-[#E8EEFF] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#00C2FF]" />
              <span>Change link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
