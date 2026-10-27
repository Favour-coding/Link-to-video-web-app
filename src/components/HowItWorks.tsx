import React from 'react';
import { Copy, Sparkles, Download, Play } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Copy the video link',
      desc: 'Find any video, reel, or short on YouTube, TikTok, Instagram or X and copy the URL.',
      icon: Copy,
    },
    {
      number: '2',
      title: 'Paste it and tap Get Video',
      desc: 'Drop the URL into the input bar above. FavouraFetch extracts stream qualities in seconds.',
      icon: Sparkles,
    },
    {
      number: '3',
      title: 'Choose a quality and download',
      desc: 'Select MP4 video resolution or MP3 audio and start your direct browser download.',
      icon: Download,
    },
  ];

  return (
    <section id="how-it-works" className="w-full max-w-4xl mx-auto py-12 px-4 scroll-mt-24">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#E8EEFF] tracking-tight">
          How to Download
        </h2>
        <p className="text-sm text-[#8A97B8] mt-1 max-w-md mx-auto">
          Save your favorite videos in three effortless steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-[#1B2742] relative flex flex-col justify-between hover-lift group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                    {step.number}
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-[#070B16] border border-[#1B2742] flex items-center justify-center text-[#00C2FF]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-bold text-base text-[#E8EEFF] mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8A97B8] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tutorial Button with Coming soon badge */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          disabled
          className="min-h-[44px] px-5 py-2.5 rounded-full bg-[#0E1526] border border-[#1B2742] text-[#8A97B8] text-xs sm:text-sm font-medium flex items-center gap-2 cursor-not-allowed opacity-80"
          aria-disabled="true"
        >
          <Play className="w-3.5 h-3.5 text-[#8A97B8]" />
          <span>Watch the tutorial</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1B2742] text-[#8A97B8] border border-[#1B2742]">
            Coming soon
          </span>
        </button>
      </div>
    </section>
  );
};
