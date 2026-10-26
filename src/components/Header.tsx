import React from 'react';
import { DownloadCloud, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full text-center py-6 sm:py-8 px-4 flex flex-col items-center">
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-3 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>Universal Video Downloader</span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-70 blur-sm"></div>
          <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0b1329] border border-cyan-400/40 text-cyan-400 shadow-md">
            <DownloadCloud className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Link<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">Saver</span>
        </h1>
      </div>

      {/* Tagline */}
      <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
        Paste a video link from your favorite platform to save it instantly in MP4 or MP3 audio.
      </p>
    </header>
  );
};
