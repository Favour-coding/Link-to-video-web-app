import React from 'react';
import { LOGO_URL } from './Navbar.tsx';
import { ShieldAlert, Share2, MessageCircle, Mail } from 'lucide-react';
import { getWhatsAppUrl, getEmailUrl } from '../utils/contact.ts';

interface FooterProps {
  onOpenLegal: (type: 'terms' | 'privacy') => void;
  onShare?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onShare }) => {
  const whatsAppUrl = getWhatsAppUrl();
  const emailUrl = getEmailUrl();

  return (
    <footer className="w-full max-w-4xl mx-auto mt-16 mb-10 px-4 block">
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

        {/* Navigation Links, Legal Links & Share */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#8A97B8]">
          <a
            href="#/about"
            className="hover:text-[#00C2FF] transition-colors underline underline-offset-4 decoration-[#1B2742] hover:decoration-[#00C2FF] py-1 cursor-pointer font-medium"
          >
            About
          </a>
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
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              aria-label="Share FavouraFetch"
              title="Share FavouraFetch"
              className="w-8 h-8 rounded-full bg-[#0E1526] border border-[#1B2742] hover:border-[#00C2FF] text-[#8A97B8] hover:text-[#00C2FF] flex items-center justify-center transition-all cursor-pointer hover-lift shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Creator Credits & Contact Buttons */}
      <div className="mt-8 pt-6 border-t border-[#1B2742]/50 text-center space-y-3">
        {/* Line 1 */}
        <p className="text-xs sm:text-sm text-[#8A97B8] font-normal">
          &copy; 2026 FavouraFetch. Designed and built by{' '}
          <span className="text-white font-semibold">Favoura Tech</span>.
        </p>

        {/* Line 2: Two pill buttons in purple-to-cyan style */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white brand-gradient-bg shadow-[0_2px_12px_rgba(122,60,255,0.25)] hover:shadow-[0_2px_16px_rgba(0,194,255,0.35)] hover-lift transition-all no-underline"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={emailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white brand-gradient-bg shadow-[0_2px_12px_rgba(122,60,255,0.25)] hover:shadow-[0_2px_16px_rgba(0,194,255,0.35)] hover-lift transition-all no-underline"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email us</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
