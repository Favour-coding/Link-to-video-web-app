import React from 'react';

const STATS = [
  { value: '4', label: 'Quality options' },
  { value: '12h', label: 'Max video length' },
  { value: 'ZIP', label: 'Playlist downloads' },
  { value: 'MP3', label: 'Audio only' },
  { value: 'Many', label: 'Supported sites' },
  { value: 'Free', label: 'No sign-up' },
];

export const StatsRow: React.FC = () => {
  return (
    <section className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Grid: 2 or 3 on phone, 6 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-2xl p-3.5 sm:p-4 text-center border border-[#1B2742] hover:border-[#3B82F6]/40 transition-colors"
          >
            <div className="font-extrabold text-2xl sm:text-3xl tracking-tight brand-gradient-text">
              {stat.value}
            </div>
            <div className="text-[11px] sm:text-xs font-medium text-[#8A97B8] mt-1 leading-tight">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
