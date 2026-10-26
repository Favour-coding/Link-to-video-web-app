import React, { useRef, useState } from 'react';
import { Link2, ClipboardPaste, X, ArrowRight, AlertCircle } from 'lucide-react';
import { PlatformId } from '../types.ts';

interface InputCardProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  activePlatform?: PlatformId;
  validationError?: string | null;
  onClearValidationError?: () => void;
}

export const InputCard: React.FC<InputCardProps> = ({
  url,
  setUrl,
  onSubmit,
  isLoading,
  validationError,
  onClearValidationError,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        setPasteNotice('Clipboard API not supported in this browser. Please use Ctrl+V / ⌘+V.');
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
      // Permission might be denied in some iframe environments
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
    <div className="w-full max-w-lg mx-auto bg-[#0c1429]/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-cyan-500/25 shadow-[0_0_40px_-10px_rgba(6,182,212,0.18)] transition-all">
      <div className="relative">
        <label
          htmlFor="video-url-input"
          className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
        >
          Paste Video Link
        </label>

        {/* Input Wrapper */}
        <div
          className={`relative flex items-center bg-[#070d1d] border rounded-xl transition-all duration-200 ${
            validationError
              ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
              : 'border-cyan-500/30 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.25)]'
          }`}
        >
          <div className="pl-3.5 pr-2 text-cyan-400 flex items-center justify-center">
            <Link2 className="w-5 h-5 shrink-0" />
          </div>

          <input
            id="video-url-input"
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (validationError) onClearValidationError?.();
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full py-3.5 px-1 bg-transparent text-white placeholder-slate-500 text-sm sm:text-base font-normal focus:outline-none disabled:opacity-50"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Inline Action Buttons: Clear & Paste */}
          <div className="flex items-center gap-1.5 pr-2 shrink-0">
            {url && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                title="Clear input"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>
          </div>
        </div>

        {/* Inline Feedback or Paste Notice */}
        {pasteNotice && (
          <p className="mt-2 text-xs text-cyan-300 flex items-center gap-1 animate-fadeIn">
            <span>ℹ️</span> {pasteNotice}
          </p>
        )}

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-2.5 flex items-start gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 rounded-lg p-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="leading-tight">{validationError}</div>
          </div>
        )}
      </div>

      {/* Large Get Video CTA Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full mt-4 py-3.5 px-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:via-sky-400 hover:to-blue-500 active:scale-[0.99] transition-all duration-200 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
      >
        <span>Get Video</span>
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};
