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

export interface SiteConfig {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  domains: string[];
  placeholder: string;
  headingPrefix: string;
  metaDescription: string;
}

export const SITE_CONFIGS: Record<string, SiteConfig> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    slug: 'youtube',
    color: '#FF0000',
    icon: SiYoutube,
    domains: ['youtube.com', 'youtu.be', 'm.youtube.com', 'music.youtube.com'],
    placeholder: 'Paste a YouTube link',
    headingPrefix: 'Download YouTube videos',
    metaDescription: 'Download YouTube videos, shorts, and audio in high quality MP4 and MP3 with FavouraFetch.',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    slug: 'tiktok',
    color: '#00F2FE',
    icon: SiTiktok,
    domains: ['tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'],
    placeholder: 'Paste a TikTok link',
    headingPrefix: 'Download TikTok videos',
    metaDescription: 'Download TikTok videos without watermark in MP4 and MP3 with FavouraFetch.',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    slug: 'instagram',
    color: '#E4405F',
    icon: SiInstagram,
    domains: ['instagram.com', 'instagr.am'],
    placeholder: 'Paste an Instagram link',
    headingPrefix: 'Download Instagram videos',
    metaDescription: 'Save Instagram reels, videos, and stories effortlessly with FavouraFetch.',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    slug: 'facebook',
    color: '#1877F2',
    icon: SiFacebook,
    domains: ['facebook.com', 'fb.watch', 'fb.com', 'm.facebook.com'],
    placeholder: 'Paste a Facebook link',
    headingPrefix: 'Download Facebook videos',
    metaDescription: 'Download Facebook videos, reels, and clips in HD with FavouraFetch.',
  },
  x: {
    id: 'x',
    name: 'X',
    slug: 'x',
    color: '#FFFFFF',
    icon: SiX,
    domains: ['x.com', 'twitter.com', 't.co'],
    placeholder: 'Paste an X link',
    headingPrefix: 'Download X videos',
    metaDescription: 'Download videos and GIFs from X (Twitter) directly in MP4 format with FavouraFetch.',
  },
  vimeo: {
    id: 'vimeo',
    name: 'Vimeo',
    slug: 'vimeo',
    color: '#1AB7EA',
    icon: SiVimeo,
    domains: ['vimeo.com'],
    placeholder: 'Paste a Vimeo link',
    headingPrefix: 'Download Vimeo videos',
    metaDescription: 'Save high-definition Vimeo videos in MP4 format with FavouraFetch.',
  },
  dailymotion: {
    id: 'dailymotion',
    name: 'Dailymotion',
    slug: 'dailymotion',
    color: '#0066DC',
    icon: SiDailymotion,
    domains: ['dailymotion.com', 'dai.ly'],
    placeholder: 'Paste a Dailymotion link',
    headingPrefix: 'Download Dailymotion videos',
    metaDescription: 'Download Dailymotion clips and episodes easily with FavouraFetch.',
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    slug: 'reddit',
    color: '#FF4500',
    icon: SiReddit,
    domains: ['reddit.com', 'redd.it'],
    placeholder: 'Paste a Reddit link',
    headingPrefix: 'Download Reddit videos',
    metaDescription: 'Download Reddit videos with audio in MP4 format with FavouraFetch.',
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    slug: 'pinterest',
    color: '#E60023',
    icon: SiPinterest,
    domains: ['pinterest.com', 'pin.it'],
    placeholder: 'Paste a Pinterest link',
    headingPrefix: 'Download Pinterest videos',
    metaDescription: 'Save Pinterest video pins in high quality with FavouraFetch.',
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    slug: 'threads',
    color: '#FFFFFF',
    icon: SiThreads,
    domains: ['threads.net', 'threads.com'],
    placeholder: 'Paste a Threads link',
    headingPrefix: 'Download Threads videos',
    metaDescription: 'Download Threads video clips and posts with FavouraFetch.',
  },
  vk: {
    id: 'vk',
    name: 'VK',
    slug: 'vk',
    color: '#0077FF',
    icon: SiVk,
    domains: ['vk.com', 'vk.ru', 'vkvideo.ru'],
    placeholder: 'Paste a VK link',
    headingPrefix: 'Download VK videos',
    metaDescription: 'Download VK and VK Video streams in high resolution with FavouraFetch.',
  },
};

/**
 * Validates whether a URL belongs to the allowed domains of a specific site.
 * Matches hostname exactly or as a subdomain of the domain list.
 */
export function validateUrlForSite(rawUrl: string, config: SiteConfig): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  try {
    let toParse = rawUrl.trim();
    if (!/^https?:\/\//i.test(toParse)) {
      toParse = 'https://' + toParse;
    }
    const parsed = new URL(toParse);
    const hostname = parsed.hostname.toLowerCase();

    return config.domains.some((d) => {
      const targetDomain = d.toLowerCase();
      return hostname === targetDomain || hostname.endsWith('.' + targetDomain);
    });
  } catch {
    return false;
  }
}

/**
 * Detects whether the media is in portrait aspect ratio (9:16 or mobile reel/short)
 * vs 16:9 standard video.
 */
export function isPortraitVideo(url: string, siteOrPlatform?: string): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  const lowerSite = (siteOrPlatform || '').toLowerCase();

  // YouTube Shorts
  if (lowerUrl.includes('/shorts/')) return true;

  // TikTok
  if (lowerUrl.includes('tiktok.com') || lowerSite === 'tiktok') return true;

  // Instagram (Reels & stories & general posts are portrait)
  if (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am') || lowerSite === 'instagram') return true;

  // Facebook Reels
  if (lowerUrl.includes('facebook.com') && (lowerUrl.includes('/reel') || lowerUrl.includes('/reels'))) return true;

  // Threads
  if (lowerUrl.includes('threads.net') || lowerUrl.includes('threads.com') || lowerSite === 'threads') return true;

  // Pinterest
  if (lowerUrl.includes('pinterest.com') || lowerUrl.includes('pin.it') || lowerSite === 'pinterest') return true;

  return false;
}
