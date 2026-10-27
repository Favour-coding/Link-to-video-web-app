import React from 'react';
import { X, Shield } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy' | null;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen || !type) return null;

  const isTerms = type === 'terms';
  const title = isTerms ? 'Terms of Service' : 'Privacy Policy';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg glass-card rounded-2xl sm:rounded-3xl p-6 border border-[#1B2742] shadow-2xl relative max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1B2742]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#070B16] border border-[#1B2742] flex items-center justify-center text-[#00C2FF]">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-[#E8EEFF]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8A97B8] hover:text-[#E8EEFF] hover:bg-[#1B2742] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#8A97B8] leading-relaxed">
          {isTerms ? (
            <>
              <p>
                Welcome to <strong className="text-[#E8EEFF]">FavouraFetch</strong>. By accessing or using our media conversion and video download tool, you agree to comply with and be bound by these Terms of Service.
              </p>
              <h4 className="font-semibold text-[#E8EEFF] text-sm">1. Fair Personal Use</h4>
              <p>
                Only download content you own or have explicit permission to save. FavouraFetch is provided strictly for personal archival, offline viewing, and educational use. Respect creators’ intellectual property rights and each respective platform’s terms of service.
              </p>
              <h4 className="font-semibold text-[#E8EEFF] text-sm">2. Disclaimer of Warranty</h4>
              <p>
                FavouraFetch is provided &quot;as is&quot; without warranties of any kind. We do not host, store, or copy videos on public servers; all processing is ephemeral.
              </p>
              <h4 className="font-semibold text-[#E8EEFF] text-sm">3. Updates to Terms</h4>
              <p>
                We reserve the right to amend these terms at any time. Continued use of the platform denotes acceptance of any revisions.
              </p>
            </>
          ) : (
            <>
              <p>
                Your privacy is important to us. This Privacy Policy outlines our transparent data practices at <strong className="text-[#E8EEFF]">FavouraFetch</strong>.
              </p>
              <h4 className="font-semibold text-[#E8EEFF] text-sm">1. No Account Required</h4>
              <p>
                FavouraFetch requires no user sign-up, email registration, passwords, or personal account creation.
              </p>
              <h4 className="font-semibold text-[#E8EEFF] text-sm">2. Local Storage</h4>
              <p>
                Recent links are saved exclusively in your browser’s local storage on your own device. You can clear this history at any time using the &quot;Clear History&quot; button.
              </p>
              <h4 className="font-semibold text-[#E8EEFF] text-sm">3. File Deletion</h4>
              <p>
                Temporary files generated for download preparation are cleared immediately after transmission. No personal dossiers or tracking telemetry are maintained.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#1B2742] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-[#1B2742] hover:bg-[#1B2742]/80 text-[#E8EEFF] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
