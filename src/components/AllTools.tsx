import React from 'react';
import {
  Music,
  Sparkles,
  FileText,
  AlignLeft,
  ArrowRight,
} from 'lucide-react';

interface ToolItem {
  title: string;
  slug: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOOLS: ToolItem[] = [
  {
    title: 'MP4 to MP3',
    slug: 'tools/mp4-to-mp3',
    description: 'Extract high-fidelity MP3 audio directly in your browser with custom bitrates.',
    icon: Music,
  },
  {
    title: 'MP4 to GIF',
    slug: 'tools/mp4-to-gif',
    description: 'Turn video clips into smooth, optimized animated GIFs with custom trimming.',
    icon: Sparkles,
  },
  {
    title: 'YouTube Subtitles',
    slug: 'tools/subtitles',
    description: 'Download video subtitles in SRT, WebVTT, or plain text formats.',
    icon: FileText,
  },
  {
    title: 'YouTube Transcript',
    slug: 'tools/transcript',
    description: 'Read, copy, and export timestamped dialogue transcripts from videos.',
    icon: AlignLeft,
  },
];

interface AllToolsProps {
  onSelectActiveTool?: () => void;
}

export const AllTools: React.FC<AllToolsProps> = () => {
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

          return (
            <a
              key={tool.slug}
              href={`#/${tool.slug}`}
              className="text-left glass-card rounded-2xl p-4 sm:p-5 border border-[#1B2742] hover:border-[#00C2FF]/70 transition-all duration-200 hover-lift shadow-[0_4px_20px_rgba(122,60,255,0.08)] hover:shadow-[0_4px_25px_rgba(0,194,255,0.22)] flex flex-col justify-between cursor-pointer group no-underline"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00C2FF]/15 text-[#00C2FF] border border-[#00C2FF]/30">
                    Ready
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#E8EEFF] group-hover:text-[#00C2FF] transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-[#8A97B8] mt-1.5 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1B2742] flex items-center justify-between text-xs font-semibold text-[#00C2FF] group-hover:text-white transition-colors">
                <span>Open tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
