import React from 'react';
import { LOGO_URL } from './Navbar.tsx';
import { ShieldAlert } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="w-full max-w-4xl mx-auto mt-16 mb-10 px-4">
      {/* Usage Notice Box */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-[#1B2742] text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#8A97B8] mb-1.5 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-[#00C2FF]" />
          <span>Fair Use Notice</span>
        </div>
        <p className="text-xs sm:text-sm text-[#8A97B8] leading-relaxed max-w-2xl mx-auto">
          Only download content you own or have permission to save. Respect creators&apos; rights and each platform&apos;s terms.
        </p>
      </div>

      {/* Footer Main Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#1B2742]/80">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="FavouraFetch logo"
            className="w-8 h-8 object-contain rounded-lg"
          />
          <div>
            <div className="font-bold text-base tracking-tight flex items-baseline">
              <span className="text-white">favoura</span>
              <span className="brand-gradient-text">fetch</span>
            </div>
            <div className="text-xs text-[#8A97B8]">
              Paste. Pick. Fetch.
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex items-center gap-6 text-xs sm:text-sm text-[#8A97B8]">
          <button
            type="button"
            onClick={() => onOpenLegal('terms')}
            className="hover:text-[#E8EEFF] transition-colors underline underline-offset-4 decoration-[#1B2742] hover:decoration-[#3B82F6] cursor-pointer py-1"
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-[#E8EEFF] transition-colors underline underline-offset-4 decoration-[#1B2742] hover:decoration-[#3B82F6] cursor-pointer py-1"
          >
            Privacy Policy
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-[#8A97B8]/60">
        &copy; {new Date().getFullYear()} FavouraFetch. All rights reserved.
      </div>
    </footer>
  );
};
