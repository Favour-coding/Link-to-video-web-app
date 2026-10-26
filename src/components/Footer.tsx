import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-lg mx-auto mt-12 mb-8 px-4 text-center">
      <div className="p-4 rounded-xl bg-[#091024]/70 border border-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Fair Use & Content Policy</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
          Only download content you own or have permission to save. Respect creators' rights and each platform's terms.
        </p>
      </div>

      <div className="mt-4 text-[11px] text-slate-400">
        LinkSaver &bull; Free, client-side personal media saver
      </div>
    </footer>
  );
};
