import React from 'react';
import {
  SiYoutube,
  SiTiktok,
  SiInstagram,
  SiFacebook,
  SiX,
  SiVimeo,
  SiDailymotion,
  SiReddit,
  SiPinterest,
  SiThreads,
  SiVk,
} from 'react-icons/si';
import { Plus } from 'lucide-react';

interface SupportedSitesProps {
  activeSiteSlug?: string;
  onNavigate?: (slug: string) => void;
}

interface SiteItem {
  name: string;
  slug: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const SITES: SiteItem[] = [
  { name: 'YouTube', slug: 'youtube', color: '#FF0000', icon: SiYoutube },
  { name: 'TikTok', slug: 'tiktok', color: '#00F2FE', icon: SiTiktok },
  { name: 'Instagram', slug: 'instagram', color: '#E4405F', icon: SiInstagram },
  { name: 'Facebook', slug: 'facebook', color: '#1877F2', icon: SiFacebook },
  { name: 'X', slug: 'x', color: '#FFFFFF', icon: SiX },
  { name: 'Vimeo', slug: 'vimeo', color: '#1AB7EA', icon: SiVimeo },
  { name: 'Dailymotion', slug: 'dailymotion', color: '#0066DC', icon: SiDailymotion },
  { name: 'Reddit', slug: 'reddit', color: '#FF4500', icon: SiReddit },
  { name: 'Pinterest', slug: 'pinterest', color: '#E60023', icon: SiPinterest },
  { name: 'Threads', slug: 'threads', color: '#FFFFFF', icon: SiThreads },
  { name: 'VK', slug: 'vk', color: '#0077FF', icon: SiVk },
  { name: 'and many more', slug: '', color: '#8A97B8', icon: Plus },
];

export const SupportedSites: React.FC<SupportedSitesProps> = ({ activeSiteSlug, onNavigate }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(slug);
    }
  };

  return (
    <section id="supported-sites" className="w-full max-w-4xl mx-auto py-12 px-4 scroll-mt-24">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#E8EEFF] tracking-tight">
          Supported Sites
        </h2>
        <p className="text-sm text-[#8A97B8] mt-1 max-w-md mx-auto">
          Tap any site to open its dedicated downloader, or use the home page for all sites.
        </p>
      </div>

      {/* Grid: 2 columns on phone, 4 columns on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {SITES.map((site) => {
          const IconComponent = site.icon;
          const isActive = Boolean(activeSiteSlug && activeSiteSlug === site.slug);
          const targetHash = site.slug ? `#/${site.slug}` : '#/';

          return (
            <a
              key={site.name}
              href={targetHash}
              onClick={(e) => handleClick(e, site.slug)}
              className={`glass-card rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all duration-200 hover-lift cursor-pointer group ${
                isActive
                  ? 'border-[#00C2FF] ring-2 ring-[#00C2FF]/30 shadow-[0_0_20px_rgba(0,194,255,0.25)] bg-[#0E1526]'
                  : 'hover:border-[#3B82F6]/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Icon 28px to 32px */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#070B16] border border-[#1B2742] transition-colors">
                  <IconComponent
                    className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110"
                    style={{ color: site.color }}
                  />
                </div>

                {/* Site Name */}
                <span
                  className={`text-xs sm:text-sm font-semibold truncate ${
                    isActive ? 'text-[#00C2FF]' : 'text-[#E8EEFF] group-hover:text-white'
                  }`}
                >
                  {site.name}
                </span>
              </div>

              {isActive && (
                <span className="w-2 h-2 rounded-full bg-[#00C2FF] animate-pulse shrink-0" />
              )}
            </a>
          );
        })}
      </div>

      {/* Required Disclaimer */}
      <p className="text-center text-xs text-[#8A97B8] mt-6 leading-relaxed max-w-xl mx-auto">
        Brand names and logos belong to their respective owners. FavouraFetch is not affiliated with these services.
      </p>
    </section>
  );
};
