import React from 'react';
import { ArrowLeft, MessageCircle, Mail, ShieldCheck, Sparkles, Building2, User } from 'lucide-react';
import { getWhatsAppUrl, getEmailUrl, DISPLAY_WHATSAPP, DISPLAY_EMAIL } from '../utils/contact.ts';

export const AboutPage: React.FC = () => {
  const whatsAppUrl = getWhatsAppUrl();
  const emailUrl = getEmailUrl();

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      {/* Back to Home Link */}
      <div className="flex justify-center mb-6">
        <a
          href="#/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A97B8] hover:text-[#00C2FF] transition-colors py-1.5 px-4 rounded-full bg-[#0E1526] border border-[#1B2742] cursor-pointer hover-lift shadow-sm no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#00C2FF]" />
          <span>Back to downloader</span>
        </a>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A3CFF]/15 border border-[#7A3CFF]/30 text-[#00C2FF] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Creator & Brand Information</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About <span className="brand-gradient-text">FavouraFetch</span>
        </h1>
      </div>

      {/* Main Glass Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#1B2742] shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-6">
        {/* Creator Statement */}
        <div className="space-y-4 text-sm sm:text-base text-[#C2CEE5] leading-relaxed">
          <p>
            FavouraFetch was designed and built by{' '}
            <strong className="text-white font-semibold">Favoura Tech</strong>, founded by{' '}
            <strong className="text-white font-semibold">Favour</strong>. The name, logo, design, and code belong to Favoura Tech. Copying this site and presenting it as your own work is not allowed. For permission, collaboration, or business enquiries, contact us below.
          </p>
        </div>

        {/* Ownership & Origin Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-[#070B16] border border-[#1B2742] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center text-white shrink-0 shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A97B8]">Brand & Studio</p>
              <p className="text-sm font-bold text-white">Favoura Tech</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#070B16] border border-[#1B2742] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E1526] border border-[#7A3CFF]/40 flex items-center justify-center text-[#00C2FF] shrink-0 shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A97B8]">Founder & Lead</p>
              <p className="text-sm font-bold text-white">Favour</p>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#070B16] border border-[#1B2742] space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00C2FF]">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Contact Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* WhatsApp Contact */}
            <div className="p-4 rounded-xl bg-[#0E1526] border border-[#1B2742] flex flex-col justify-between gap-3">
              <div>
                <p className="text-xs text-[#8A97B8] font-medium">WhatsApp</p>
                <p className="text-sm font-bold text-white mt-0.5 tracking-wide">{DISPLAY_WHATSAPP}</p>
              </div>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl brand-gradient-bg text-white text-xs font-semibold shadow-md hover-lift flex items-center justify-center gap-2 transition-all no-underline"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Email Contact */}
            <div className="p-4 rounded-xl bg-[#0E1526] border border-[#1B2742] flex flex-col justify-between gap-3">
              <div>
                <p className="text-xs text-[#8A97B8] font-medium">Direct Email</p>
                <p className="text-sm font-bold text-white mt-0.5 break-all">{DISPLAY_EMAIL}</p>
              </div>
              <a
                href={emailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl brand-gradient-bg text-white text-xs font-semibold shadow-md hover-lift flex items-center justify-center gap-2 transition-all no-underline"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright notice */}
      <div className="text-center mt-6 text-xs text-[#8A97B8]">
        <span>&copy; 2026 Favoura Tech. All rights reserved.</span>
      </div>
    </div>
  );
};
