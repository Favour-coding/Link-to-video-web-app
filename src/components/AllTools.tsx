import React from 'react';
import {
  Download,
  Music,
  Film,
  Layers,
  FileVideo,
  Sparkles,
  FileText,
  AlignLeft,
  ArrowRight,
} from 'lucide-react';

interface AllToolsProps {
  onSelectActiveTool: () => void;
}

interface ToolItem {
  title: string;
  status: 'active' | 'coming_soon';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOOLS: ToolItem[] = [
  {
    title: 'Video Downloader',
    status: 'active',
    description: 'Paste a link and download the video',
    icon: Download,
  },
  {
    title: 'MP4 to MP3',
    status: 'coming_soon',
    description: 'Extract audio from a video file',
    icon: Music,
  },
  {
    title: 'MOV to MP4',
    status: 'coming_soon',
    description: 'Convert MOV files to MP4',
    icon: Film,
  },
  {
    title: 'MKV to MP4',
    status: 'coming_soon',
    description: 'Convert MKV files to MP4',
    icon: Layers,
  },
  {
    title: 'WEBM to MP4',
    status: 'coming_soon',
    description: 'Convert WEBM files to MP4',
    icon: FileVideo,
  },
  {
    title: 'MP4 to GIF',
    status: 'coming_soon',
    description: 'Turn a video clip into a GIF',
    icon: Sparkles,
  },
  {
    title: 'YouTube Subtitles',
    status: 'coming_soon',
    description: 'Download subtitles from a video',
    icon: FileText,
  },
  {
    title: 'YouTube Transcript',
    status: 'coming_soon',
    description: 'Get the text of a video',
    icon: AlignLeft,
  },
];

export const AllTools: React.FC<AllToolsProps> = ({ onSelectActiveTool }) => {
  return (
    <section id="all-tools" className="w-full max-w-4xl mx-auto py-12 px-4 scroll-mt-24">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#E8EEFF] tracking-tight">
          All Tools
        </h2>
        <p className="text-sm text-[#8A97B8] mt-1 max-w-md mx-auto">
          Fast, browser-based media conversion and extraction utilities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = tool.status === 'active';

          if (isActive) {
            return (
              <button
                key={tool.title}
                type="button"
                onClick={onSelectActiveTool}
                className="text-left glass-card rounded-2xl p-4 sm:p-5 border border-[#3B82F6]/40 hover:border-[#00C2FF] transition-all duration-200 hover-lift shadow-[0_4px_20px_rgba(122,60,255,0.15)] hover:shadow-[0_4px_25px_rgba(0,194,255,0.25)] flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center text-white shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                      Active
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#E8EEFF] group-hover:text-[#00C2FF] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-[#8A97B8] mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1B2742] flex items-center justify-between text-xs font-semibold text-[#00C2FF]">
                  <span>Use tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          }

          // Coming soon: Not clickable per design system rule
          return (
            <div
              key={tool.title}
              className="glass-card rounded-2xl p-4 sm:p-5 border border-[#1B2742]/80 opacity-70 flex flex-col justify-between cursor-default select-none"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#070B16] border border-[#1B2742] flex items-center justify-center text-[#8A97B8]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1B2742] text-[#8A97B8] border border-[#1B2742]">
                    Coming soon
                  </span>
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-[#E8EEFF]">
                  {tool.title}
                </h3>
                <p className="text-xs text-[#8A97B8] mt-1 line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1B2742]/50 text-[11px] text-[#8A97B8]/70">
                In active development
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
