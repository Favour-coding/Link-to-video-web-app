import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowDown } from 'lucide-react';

interface NavbarProps {
  onScrollToInput: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const LOGO_URL = "/assets/aistudio/file_000000004f648246954afcb807bd6425_206e7c64.png";

const FULL_WORD = "favourafetch";
const FAVOURA_LEN = 7; // "favoura" = 7 characters, "fetch" = 5 characters

/**
 * AnimatedWordmark renders "favourafetch" typed one letter at a time with a blinking cursor.
 * Uses an invisible reservation layer to prevent layout shift.
 * Respects prefers-reduced-motion.
 */
const AnimatedWordmark: React.FC = () => {
  const [typedLength, setTypedLength] = useState<number>(FULL_WORD.length);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedLength(FULL_WORD.length);
      return;
    }

    let timer: NodeJS.Timeout;
    let currentLen = 0;
    setTypedLength(0);

    // Phase machine: typing (120ms/char) -> pause_full (2000ms) -> deleting (70ms/char) -> pause_empty (400ms) -> repeat
    let phase: 'typing' | 'pause_full' | 'deleting' | 'pause_empty' = 'typing';

    const tick = () => {
      if (phase === 'typing') {
        currentLen += 1;
        setTypedLength(currentLen);
        if (currentLen >= FULL_WORD.length) {
          phase = 'pause_full';
          timer = setTimeout(tick, 2000); // cursor blinks for 2 seconds after completion
        } else {
          timer = setTimeout(tick, 120); // each letter appears every 120ms
        }
      } else if (phase === 'pause_full') {
        phase = 'deleting';
        timer = setTimeout(tick, 70); // start deleting letter by letter every 70ms
      } else if (phase === 'deleting') {
        currentLen -= 1;
        setTypedLength(currentLen);
        if (currentLen <= 0) {
          phase = 'pause_empty';
          timer = setTimeout(tick, 400); // pauses 400ms before typing again
        } else {
          timer = setTimeout(tick, 70); // each deletion takes 70ms
        }
      } else if (phase === 'pause_empty') {
        phase = 'typing';
        timer = setTimeout(tick, 120);
      }
    };

    timer = setTimeout(tick, 120);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  const favouraSlice = FULL_WORD.slice(0, Math.min(typedLength, FAVOURA_LEN));
  const fetchSlice = typedLength > FAVOURA_LEN ? FULL_WORD.slice(FAVOURA_LEN, typedLength) : '';

  return (
    <div
      className="relative inline-flex items-center text-[clamp(18px,5vw,26px)] font-bold tracking-tight whitespace-nowrap select-none min-w-0"
      aria-hidden="true"
    >
      {/* Phantom text: renders the full wordmark invisibly to reserve exact width and prevent header layout shift */}
      <div className="invisible select-none flex items-center leading-none" aria-hidden="true">
        <span className="text-white">favoura</span>
        <span className="brand-gradient-text">fetch</span>
        {!prefersReducedMotion && (
          <span className="inline-block w-[2px] ml-[2px]" aria-hidden="true" />
        )}
      </div>

      {/* Overlay typing text: absolutely positioned on top */}
      <div className="absolute inset-0 flex items-center leading-none pointer-events-none">
        <span className="text-white">{favouraSlice}</span>
        <span className="brand-gradient-text">{fetchSlice}</span>
        {!prefersReducedMotion && (
          <span
            aria-hidden="true"
            className="inline-block w-[2px] h-[0.8em] bg-[#00C2FF] ml-[2px] animate-cursor-blink"
          />
        )}
      </div>
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ onScrollToInput, onScrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(sectionId);
  };

  return (
    <nav className="sticky top-3 sm:top-5 z-40 w-full max-w-4xl mx-auto px-3 sm:px-4">
      {/* Floating Pill Container: Single flex row, align-items: center, gap: 8px */}
      <div className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-full bg-[#0E1526]/85 backdrop-blur-xl border border-[#1B2742] shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-all">
        {/* Left: Logo & Wordmark Group: min-width: 0, flex: 1 1 auto */}
        <button
          type="button"
          onClick={onScrollToInput}
          className="flex items-center gap-2 min-w-0 flex-[1_1_auto] text-left focus-visible:ring-2 focus-visible:ring-[#7A3CFF] rounded-lg p-0.5 cursor-pointer group"
          aria-label="FavouraFetch Home"
        >
          <img
            src={LOGO_URL}
            alt="FavouraFetch logo"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg shrink-0"
          />
          <AnimatedWordmark />
        </button>

        {/* Middle Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#8A97B8] shrink-0">
          <button
            type="button"
            onClick={onScrollToInput}
            className="hover:text-[#E8EEFF] transition-colors cursor-pointer py-1"
          >
            Download
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('supported-sites')}
            className="hover:text-[#E8EEFF] transition-colors cursor-pointer py-1"
          >
            Supported sites
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('all-tools')}
            className="hover:text-[#E8EEFF] transition-colors cursor-pointer py-1"
          >
            Tools
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('how-it-works')}
            className="hover:text-[#E8EEFF] transition-colors cursor-pointer py-1"
          >
            How it works
          </button>
        </div>

        {/* Right Action Container: flex: 0 0 auto */}
        <div className="flex items-center gap-2 shrink-0 flex-[0_0_auto]">
          {/* Get Started Button:
              - white-space: nowrap
              - compact padding 10px 14px, font-size 14px
              - <480px: hide text, show circular gradient button with down-arrow icon
              - >=480px: show full text
              - flex: 0 0 auto
          */}
          <button
            type="button"
            onClick={onScrollToInput}
            aria-label="Get Started"
            className="shrink-0 flex-[0_0_auto] rounded-full text-[14px] font-semibold text-white brand-gradient-bg shadow-[0_4px_20px_rgba(122,60,255,0.35)] hover:shadow-[0_4px_25px_rgba(0,194,255,0.4)] hover-lift flex items-center justify-center cursor-pointer active:scale-95 whitespace-nowrap w-[38px] h-[38px] min-[480px]:w-auto min-[480px]:h-auto min-[480px]:py-[10px] min-[480px]:px-[14px]"
          >
            <span className="hidden min-[480px]:inline">Get Started</span>
            <ArrowDown className="w-4 h-4 shrink-0 min-[480px]:ml-1.5" />
          </button>

          {/* Mobile Menu Icon: flex: 0 0 auto */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden shrink-0 flex-[0_0_auto] w-[38px] h-[38px] flex items-center justify-center rounded-full text-[#8A97B8] hover:text-[#E8EEFF] hover:bg-[#1B2742]/60 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-[#0E1526]/95 backdrop-blur-xl border border-[#1B2742] shadow-2xl flex flex-col gap-3 animate-fadeIn">
          <button
            type="button"
            onClick={onScrollToInput}
            className="text-left py-2 px-3 rounded-xl text-sm font-medium text-[#E8EEFF] hover:bg-[#1B2742]/50 transition-colors cursor-pointer flex items-center justify-between"
          >
            <span>Download</span>
            <ArrowDown className="w-4 h-4 text-[#00C2FF]" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('supported-sites')}
            className="text-left py-2 px-3 rounded-xl text-sm font-medium text-[#8A97B8] hover:text-[#E8EEFF] hover:bg-[#1B2742]/50 transition-colors cursor-pointer"
          >
            Supported sites
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('all-tools')}
            className="text-left py-2 px-3 rounded-xl text-sm font-medium text-[#8A97B8] hover:text-[#E8EEFF] hover:bg-[#1B2742]/50 transition-colors cursor-pointer"
          >
            Tools
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('how-it-works')}
            className="text-left py-2 px-3 rounded-xl text-sm font-medium text-[#8A97B8] hover:text-[#E8EEFF] hover:bg-[#1B2742]/50 transition-colors cursor-pointer"
          >
            How it works
          </button>
        </div>
      )}
    </nav>
  );
};
