import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowDown } from 'lucide-react';

interface NavbarProps {
  onScrollToInput: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const LOGO_URL = "/assets/aistudio/file_000000004f648246954afcb807bd6425_206e7c64.png";

export const FULL_WORD = "favourafetch";
export const LETTERS = FULL_WORD.split('');

export type WordmarkEffect =
  | 'typing'
  | 'wave'
  | 'flip'
  | 'glitch'
  | 'shimmer'
  | 'drop_in'
  | 'scatter'
  | 'pulse';

const ALL_EFFECTS: WordmarkEffect[] = [
  'typing',
  'wave',
  'flip',
  'glitch',
  'shimmer',
  'drop_in',
  'scatter',
  'pulse',
];

// Scatter start offsets for the 12 letters
const SCATTER_OFFSETS = [
  { tx: '-7px', ty: '-5px', rot: '-10deg' }, // f
  { tx: '6px', ty: '7px', rot: '8deg' },    // a
  { tx: '-5px', ty: '6px', rot: '-7deg' },  // v
  { tx: '7px', ty: '-6px', rot: '11deg' },  // o
  { tx: '-6px', ty: '-4px', rot: '-9deg' }, // u
  { tx: '5px', ty: '6px', rot: '7deg' },    // r
  { tx: '-7px', ty: '5px', rot: '-12deg' }, // a
  { tx: '6px', ty: '-5px', rot: '10deg' },  // f
  { tx: '-6px', ty: '7px', rot: '-8deg' },  // e
  { tx: '7px', ty: '5px', rot: '9deg' },    // t
  { tx: '-5px', ty: '-6px', rot: '-11deg' },// c
  { tx: '6px', ty: '-4px', rot: '8deg' },   // h
];

/**
 * Custom hook to control random animation scheduling for the wordmark.
 * - Always plays 'typing' on page load.
 * - Waits random 4-9s between effects.
 * - Never plays the same effect twice in a row.
 * - Wordmark rests fully visible and still between effects.
 * - Pauses when tab is hidden or user is typing in link box.
 * - Respects prefers-reduced-motion.
 */
function useWordmarkEffects() {
  const [activeEffect, setActiveEffect] = useState<WordmarkEffect | null>('typing');
  const [typedCount, setTypedCount] = useState<number>(0);
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);
  const [isTypingInBox, setIsTypingInBox] = useState<boolean>(false);

  const lastEffectRef = useRef<WordmarkEffect | null>('typing');
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const addTimer = (fn: () => void, delayMs: number) => {
    const id = setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      fn();
    }, delayMs);
    timersRef.current.push(id);
    return id;
  };

  // 1. Reduced motion check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener?.('change', handler);
    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  // 2. Tab visibility check (document.visibilityState)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisibility = () => {
      setIsTabHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // 3. Detect when user is typing in the link input box
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isLinkBox = (target: EventTarget | null) => {
      if (!target || !(target instanceof HTMLElement)) return false;
      return target.tagName === 'INPUT' || Boolean(target.closest('#video-input-section'));
    };
    const onFocusIn = (e: FocusEvent) => {
      if (isLinkBox(e.target)) setIsTypingInBox(true);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (isLinkBox(e.target)) setIsTypingInBox(false);
    };
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  // 4. Main animation loop and scheduler
  useEffect(() => {
    // If reduced motion is active, stay static forever
    if (prefersReducedMotion) {
      clearAllTimers();
      setActiveEffect(null);
      setTypedCount(LETTERS.length);
      setShowCursor(false);
      return;
    }

    // If tab is hidden or user is interacting with the link box, rest still and pause
    if (isTabHidden || isTypingInBox) {
      clearAllTimers();
      setActiveEffect(null);
      setTypedCount(LETTERS.length);
      setShowCursor(false);
      return;
    }

    // Runs typing effect (letters appear 1 by 1, hold with cursor, then delete)
    const playTypingEffect = (onComplete: () => void) => {
      setActiveEffect('typing');
      setShowCursor(true);
      setTypedCount(0);

      let current = 0;
      const typeInterval = 110;
      const totalChars = LETTERS.length;

      const typeStep = () => {
        if (current < totalChars) {
          current += 1;
          setTypedCount(current);
          addTimer(typeStep, typeInterval);
        } else {
          // Hold full with blinking cursor for 1.1s
          addTimer(() => {
            // Delete letter by letter
            const deleteStep = () => {
              if (current > 0) {
                current -= 1;
                setTypedCount(current);
                addTimer(deleteStep, 55);
              } else {
                // Done deleting: finish typing effect
                setShowCursor(false);
                setTypedCount(totalChars);
                setActiveEffect(null); // Return to idle, resting fully visible and still
                onComplete();
              }
            };
            deleteStep();
          }, 1100);
        }
      };

      addTimer(typeStep, typeInterval);
    };

    // Schedules the next random effect after 4 to 9 seconds
    const scheduleNext = () => {
      // Random 4 to 9 seconds wait (4000ms to 9000ms)
      const waitTime = Math.floor(Math.random() * 5001) + 4000;

      addTimer(() => {
        // Pick an effect different from the last one (never play same twice in a row)
        const candidates = ALL_EFFECTS.filter((e) => e !== lastEffectRef.current);
        const nextEffect = candidates[Math.floor(Math.random() * candidates.length)];
        lastEffectRef.current = nextEffect;

        if (nextEffect === 'typing') {
          playTypingEffect(() => {
            scheduleNext();
          });
        } else {
          setActiveEffect(nextEffect);

          // Determine effect duration (~2 to 3 seconds, glitch ~600ms)
          let effectDuration = 2200;
          if (nextEffect === 'glitch') effectDuration = 650;
          else if (nextEffect === 'flip') effectDuration = 1800;
          else if (nextEffect === 'wave') effectDuration = 2400;
          else if (nextEffect === 'shimmer') effectDuration = 2000;
          else if (nextEffect === 'drop_in') effectDuration = 1700;
          else if (nextEffect === 'scatter') effectDuration = 1600;
          else if (nextEffect === 'pulse') effectDuration = 1850;

          addTimer(() => {
            setActiveEffect(null); // Wordmark rests fully visible and still
            scheduleNext();
          }, effectDuration);
        }
      }, waitTime);
    };

    // On initial mount, always play typing effect first
    if (lastEffectRef.current === 'typing' && activeEffect === 'typing') {
      playTypingEffect(() => {
        scheduleNext();
      });
    } else {
      // Resuming from pause (resting still, wait 4-9s for next effect)
      scheduleNext();
    }

    return () => {
      clearAllTimers();
    };
  }, [prefersReducedMotion, isTabHidden, isTypingInBox]);

  return {
    activeEffect,
    typedCount,
    showCursor,
    prefersReducedMotion,
  };
}

/**
 * AnimatedWordmark renders "favourafetch" split into individual letter spans.
 * Reserves full width of the text at all times with an invisible layer.
 * Plays 8 distinctive animations using transform and opacity.
 */
const AnimatedWordmark: React.FC = () => {
  const { activeEffect, typedCount, showCursor, prefersReducedMotion } = useWordmarkEffects();

  return (
    <div
      className="relative inline-flex items-center text-[clamp(18px,5vw,26px)] font-bold tracking-tight whitespace-nowrap select-none min-w-0"
      aria-label="favourafetch"
    >
      {/* Invisible reservation layer: renders the full wordmark invisibly at all times to reserve exact width */}
      <div className="invisible select-none flex items-center leading-none" aria-hidden="true">
        {LETTERS.map((char, index) => (
          <span
            key={`phantom-${index}`}
            className={`inline-block ${index < 7 ? 'text-white' : 'brand-gradient-text'}`}
          >
            {char}
          </span>
        ))}
        {!prefersReducedMotion && (
          <span className="inline-block w-[2px] ml-[2px]" aria-hidden="true" />
        )}
      </div>

      {/* Overlay animated layer: absolutely positioned, using only transform and opacity */}
      <div
        className={`absolute inset-0 flex items-center leading-none pointer-events-none ${
          activeEffect === 'glitch' ? 'animate-wordmark-glitch' : ''
        } ${activeEffect === 'pulse' ? 'animate-wordmark-pulse' : ''}`}
        aria-hidden="true"
      >
        {LETTERS.map((char, index) => {
          const isFavoura = index < 7;
          let letterClass = `inline-block ${isFavoura ? 'text-white' : 'brand-gradient-text'}`;
          let letterStyle: React.CSSProperties = {};

          if (prefersReducedMotion || activeEffect === null) {
            letterStyle = { opacity: 1, transform: 'none' };
          } else if (activeEffect === 'typing') {
            letterStyle = {
              opacity: index < typedCount ? 1 : 0,
              transform: 'none',
            };
          } else if (activeEffect === 'wave') {
            letterClass += ' animate-wordmark-wave';
            letterStyle = { animationDelay: `${index * 55}ms` };
          } else if (activeEffect === 'flip') {
            letterClass += ' animate-wordmark-flip';
            letterStyle = { animationDelay: `${index * 40}ms` };
          } else if (activeEffect === 'shimmer') {
            letterClass += ' animate-wordmark-shimmer';
            letterStyle = { animationDelay: `${index * 75}ms` };
          } else if (activeEffect === 'drop_in') {
            letterClass += ' animate-wordmark-drop';
            letterStyle = { animationDelay: `${index * 65}ms` };
          } else if (activeEffect === 'scatter') {
            letterClass += ' animate-wordmark-scatter';
            const offset = SCATTER_OFFSETS[index] || { tx: '-6px', ty: '6px', rot: '-10deg' };
            letterStyle = {
              animationDelay: `${index * 50}ms`,
              ['--tx' as string]: offset.tx,
              ['--ty' as string]: offset.ty,
              ['--rot' as string]: offset.rot,
            };
          }

          return (
            <span key={`animated-${index}`} className={letterClass} style={letterStyle}>
              {char}
            </span>
          );
        })}

        {/* Blinking cyan cursor for typing effect */}
        {activeEffect === 'typing' && showCursor && !prefersReducedMotion && (
          <span
            aria-hidden="true"
            className="inline-block w-[2px] h-[0.8em] bg-[#00C2FF] ml-[2px] animate-cursor-blink self-center"
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
          {/* Static logo icon */}
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
          {/* Get Started Button */}
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
