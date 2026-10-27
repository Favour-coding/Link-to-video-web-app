import React from 'react';
import { Check, ShieldCheck, Smartphone, Trash2 } from 'lucide-react';

const TRUST_ITEMS = [
  { label: 'No sign-up', icon: Check },
  { label: 'Free to use', icon: ShieldCheck },
  { label: 'Works on phone and laptop', icon: Smartphone },
  { label: 'Files are deleted after download', icon: Trash2 },
];

export const TrustChips: React.FC = () => {
  return (
    <section className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0E1526]/70 border border-[#1B2742] text-xs sm:text-sm font-medium text-[#E8EEFF] shadow-sm"
            >
              <div className="w-4 h-4 rounded-full bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center shrink-0">
                <Icon className="w-2.5 h-2.5" />
              </div>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
