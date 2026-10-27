import React, { useRef, useState } from 'react';
import { Link2, ClipboardPaste, X, ArrowRight, HelpCircle, AlertCircle } from 'lucide-react';

interface InputBarProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: () => void;
  onScrollToHowItWorks: () => void;
  isLoading: boolean;
  placeholder?: string;
  validationError?: string | null;
  onClearValidationError?: () => void;
  mismatchSiteError?: {
    message: string;
    onGoHome: () => void;
  } | null;
}

export const InputBar: React.FC<InputBarProps> = ({
  url,
  setUrl,
  onSubmit,
  onScrollToHowItWorks,
  isLoading,
  placeholder = 'Paste a video link',
  validationError,
  onClearValidationError,
  mismatchSiteError,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        setPasteNotice('Clipboard API not supported. Please paste manually.');
        setTimeout(() => setPasteNotice(null), 3000);
        inputRef.current?.focus();
        return;
      }
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setUrl(text.trim());
        onClearValidationError?.();
        setPasteNotice('Pasted from clipboard!');
        setTimeout(() => setPasteNotice(null), 2000);
      } else {
        setPasteNotice('Clipboard is empty.');
        setTimeout(() => setPasteNotice(null), 2500);
      }
    } catch {
      setPasteNotice('Unable to read clipboard. Please paste manually.');
      setTimeout(() => setPasteNotice(null), 3000);
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setUrl('');
    onClearValidationError?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div id="video-input-section" className="w-full max-w-2xl mx-auto scroll-mt-28">
      {/* Glassy command bar */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-[#1B2742] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        {/* Pill container holding link icon, input, and Paste button with soft purple-to-cyan glow on focus-within */}
        <div className="relative group/pill">
          {/* Ambient soft glow on focus-within */}
          <div
            className={`absolute -inset-[1px] rounded-xl sm:rounded-2xl transition-opacity duration-300 pointer-events-none ${
              validationError
                ? 'bg-[#F43F5E]/40 opacity-100 blur-sm'
                : 'bg-gradient-to-r from-[#7A3CFF] via-[#3B82F6] to-[#00C2FF] opacity-0 group-focus-within/pill:opacity-100 blur-[3px]'
            }`}
          />

          {/* The pill wrapper */}
          <div
            className={`relative flex items-center bg-[#070B16] rounded-xl sm:rounded-2xl transition-all duration-200 ${
              validationError
                ? 'border border-[#F43F5E]'
                : 'border border-[#1B2742] group-focus-within/pill:border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.3)]'
            }`}
          >
            {/* Link Icon */}
            <div className="pl-3.5 sm:pl-4 pr-1 text-[#8A97B8] flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5 text-[#00C2FF]" />
            </div>

            {/* Text Input - zero outline, zero border, zero box-shadow, transparent bg, text size >= 16px */}
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (validationError) onClearValidationError?.();
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={placeholder}
              className="w-full py-3.5 sm:py-4 px-2 bg-transparent text-[#E8EEFF] placeholder-[#8A97B8]/70 text-base font-normal border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none disabled:opacity-50 min-h-[44px]"
              autoComplete="off"
              spellCheck="false"
              style={{
                outline: 'none',
                boxShadow: 'none',
                border: 'none',
                WebkitAppearance: 'none',
              }}
            />

            {/* Action buttons inside the bar: Clear & Paste */}
            <div className="flex items-center gap-1.5 pr-2 sm:pr-3 shrink-0">
              {url && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  title="Clear input"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 rounded-xl text-[#8A97B8] hover:text-[#E8EEFF] hover:bg-[#1B2742] transition-colors cursor-pointer"
                  aria-label="Clear link input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                title="Paste from clipboard"
                className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E1526] hover:bg-[#1B2742] text-[#E8EEFF] border border-[#1B2742] text-xs font-semibold tracking-wide transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span>Paste</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inline Feedback or Paste Notice */}
        {pasteNotice && (
          <p className="mt-2 px-1 text-xs text-[#00C2FF] flex items-center gap-1.5">
            <span>ℹ️</span>
            <span>{pasteNotice}</span>
          </p>
        )}

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-2.5 flex items-start gap-2 text-xs text-[#F43F5E] bg-[#F43F5E]/10 border border-[#F43F5E]/30 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#F43F5E]" />
            <div className="leading-tight">{validationError}</div>
          </div>
        )}

        {/* Mismatch Site Error Message with Home button */}
        {mismatchSiteError && (
          <div className="mt-2.5 p-3.5 rounded-xl bg-[#0E1526] border border-[#00C2FF]/30 text-xs text-[#E8EEFF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn shadow-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#00C2FF] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{mismatchSiteError.message}</span>
            </div>
            <button
              type="button"
              onClick={mismatchSiteError.onGoHome}
              className="shrink-0 min-h-[36px] px-3.5 py-1.5 rounded-xl brand-gradient-bg text-white text-xs font-semibold cursor-pointer active:scale-95 shadow-sm"
            >
              Go to Home page
            </button>
          </div>
        )}

        {/* Buttons below input bar */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          {/* "Get Video" Button: Filled brand gradient, min height 44px */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="flex-1 min-h-[48px] py-3 px-6 rounded-xl sm:rounded-2xl font-bold text-base text-white brand-gradient-bg shadow-[0_4px_25px_rgba(122,60,255,0.4)] hover:shadow-[0_4px_30px_rgba(0,194,255,0.5)] hover-lift flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>Get Video</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* "How it works" Button: Ghost button */}
          <button
            type="button"
            onClick={onScrollToHowItWorks}
            className="min-h-[48px] py-3 px-5 rounded-xl sm:rounded-2xl font-medium text-sm text-[#8A97B8] hover:text-[#E8EEFF] bg-transparent hover:bg-[#1B2742]/50 border border-transparent hover:border-[#1B2742] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>How it works</span>
          </button>
        </div>
      </div>
    </div>
  );
};
