import React from 'react';
import { PlatformId } from '../types.ts';
import { Globe } from 'lucide-react';

interface PlatformChipsProps {
  activePlatform?: PlatformId;
}

interface PlatformItem {
  id: PlatformId;
  name: string;
  dotColor: string;
  activeClass: string;
}

const PLATFORMS: PlatformItem[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    dotColor: 'bg-red-500',
    activeClass: 'bg-red-950/60 border-red-500 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.35)]',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    dotColor: 'bg-cyan-400',
    activeClass: 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4)]',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    dotColor: 'bg-pink-500',
    activeClass: 'bg-pink-950/60 border-pink-500 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.35)]',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    dotColor: 'bg-blue-500',
    activeClass: 'bg-blue-950/60 border-blue-500 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.35)]',
  },
  {
    id: 'twitter',
    name: 'X',
    dotColor: 'bg-slate-300',
    activeClass: 'bg-slate-800/80 border-slate-300 text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]',
  }
];

export const PlatformChips: React.FC<PlatformChipsProps> = ({ activePlatform }) => {
  return (
    <div className="w-full max-w-lg mx-auto mb-6">
      {/* Required wording as header */}
      <div className="flex items-center justify-between px-1 mb-2.5">
        <span className="text-xs font-semibold tracking-wide text-slate-300">
          YouTube, TikTok, Instagram, Facebook, X and many more sites
        </span>
      </div>

      {/* Chips row */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
        {PLATFORMS.map((plat) => {
          const isActive = activePlatform === plat.id;
          return (
            <div
              key={plat.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all duration-200 ${
                isActive
                  ? plat.activeClass
                  : 'bg-[#0d162d]/80 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${plat.dotColor} ${
                  isActive ? 'animate-ping' : ''
                }`}
              />
              <span>{plat.name}</span>
            </div>
          );
        })}

        {/* And many more sites badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/20 bg-cyan-950/40 text-cyan-300/90 text-xs font-medium">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span>and many more sites</span>
        </div>
      </div>
    </div>
  );
};
