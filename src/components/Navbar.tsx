import React, { useState } from 'react';
import { Menu, X, ArrowDown } from 'lucide-react';

interface NavbarProps {
  onScrollToInput: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const LOGO_URL = "/assets/aistudio/file_000000004f648246954afcb807bd6425_206e7c64.png";

export const Navbar: React.FC<NavbarProps> = ({ onScrollToInput, onScrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(sectionId);
  };

  return (
    <nav className="sticky top-3 sm:top-5 z-40 w-full max-w-4xl mx-auto px-3 sm:px-4">
      {/* Floating Pill Container */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 rounded-full bg-[#0E1526]/85 backdrop-blur-xl border border-[#1B2742] shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-all">
        {/* Left: Logo & Wordmark */}
        <button
          type="button"
          onClick={onScrollToInput}
          className="flex items-center gap-2.5 text-left focus-visible:ring-2 focus-visible:ring-[#7A3CFF] rounded-lg p-0.5 cursor-pointer group"
          aria-label="FavouraFetch Home"
        >
          <img
            src={LOGO_URL}
            alt="FavouraFetch logo"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg"
          />
          <div className="flex items-baseline font-bold tracking-tight text-lg sm:text-xl">
            <span className="text-white">favoura</span>
            <span className="brand-gradient-text">fetch</span>
          </div>
        </button>

        {/* Middle Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#8A97B8]">
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

        {/* Right: Gradient CTA Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onScrollToInput}
            className="min-h-[44px] px-4 sm:px-5 rounded-full text-xs sm:text-sm font-semibold text-white brand-gradient-bg shadow-[0_4px_20px_rgba(122,60,255,0.35)] hover:shadow-[0_4px_25px_rgba(0,194,255,0.4)] hover-lift flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Get Started</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-full text-[#8A97B8] hover:text-[#E8EEFF] hover:bg-[#1B2742]/60 transition-colors cursor-pointer"
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
