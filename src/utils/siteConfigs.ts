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
import { Globe } from 'lucide-react';

export interface SiteBrandMeta {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
    'aria-label'?: string;
    role?: string;
  }>;
}

export const KNOWN_BRANDS: Record<string, SiteBrandMeta> = {
  youtube: { id: 'youtube', name: 'YouTube', color: '#FF0000', icon: SiYoutube },
  tiktok: { id: 'tiktok', name: 'TikTok', color: '#00F2FE', icon: SiTiktok },
  instagram: { id: 'instagram', name: 'Instagram', color: '#E4405F', icon: SiInstagram },
  facebook: { id: 'facebook', name: 'Facebook', color: '#1877F2', icon: SiFacebook },
  x: { id: 'x', name: 'X', color: '#FFFFFF', icon: SiX },
  vimeo: { id: 'vimeo', name: 'Vimeo', color: '#1AB7EA', icon: SiVimeo },
  dailymotion: { id: 'dailymotion', name: 'Dailymotion', color: '#0066DC', icon: SiDailymotion },
  reddit: { id: 'reddit', name: 'Reddit', color: '#FF4500', icon: SiReddit },
  pinterest: { id: 'pinterest', name: 'Pinterest', color: '#E60023', icon: SiPinterest },
  threads: { id: 'threads', name: 'Threads', color: '#FFFFFF', icon: SiThreads },
  vk: { id: 'vk', name: 'VK', color: '#0077FF', icon: SiVk },
};

/**
 * Detects the site from the backend's "site" value and falls back to URL hostname.
 * Matching is case-insensitive.
 * Returns official brand name (e.g. "YouTube", "TikTok"), brand accent color, and crisp SVG icon.
 * For any unrecognized site, returns a generic Globe icon.
 */
export function resolveSiteBrand(siteValue?: string, rawUrl?: string): SiteBrandMeta {
  const cleanSite = (siteValue || '').trim().toLowerCase();

  // 1. Direct match by site value from backend (case-insensitive)
  if (cleanSite) {
    if (cleanSite.includes('youtube') || cleanSite === 'yt') return KNOWN_BRANDS.youtube;
    if (cleanSite.includes('tiktok')) return KNOWN_BRANDS.tiktok;
    if (cleanSite.includes('instagram') || cleanSite === 'insta' || cleanSite === 'ig') return KNOWN_BRANDS.instagram;
    if (cleanSite.includes('facebook') || cleanSite === 'fb') return KNOWN_BRANDS.facebook;
    if (cleanSite === 'x' || cleanSite.includes('twitter')) return KNOWN_BRANDS.x;
    if (cleanSite.includes('vimeo')) return KNOWN_BRANDS.vimeo;
    if (cleanSite.includes('dailymotion') || cleanSite.includes('daily motion')) return KNOWN_BRANDS.dailymotion;
    if (cleanSite.includes('reddit')) return KNOWN_BRANDS.reddit;
    if (cleanSite.includes('pinterest')) return KNOWN_BRANDS.pinterest;
    if (cleanSite.includes('threads')) return KNOWN_BRANDS.threads;
    if (cleanSite === 'vk' || cleanSite.includes('vkontakte') || cleanSite.includes('vkvideo')) return KNOWN_BRANDS.vk;
  }

  // 2. Fallback match by pasted link's hostname
  if (rawUrl) {
    try {
      let toParse = rawUrl.trim();
      if (!/^https?:\/\//i.test(toParse)) {
        toParse = 'https://' + toParse;
      }
      const parsed = new URL(toParse);
      const host = parsed.hostname.toLowerCase();

      if (host.includes('youtube.com') || host.includes('youtu.be')) return KNOWN_BRANDS.youtube;
      if (host.includes('tiktok.com')) return KNOWN_BRANDS.tiktok;
      if (host.includes('instagram.com') || host.includes('instagr.am')) return KNOWN_BRANDS.instagram;
      if (host.includes('facebook.com') || host.includes('fb.watch') || host.includes('fb.com')) return KNOWN_BRANDS.facebook;
      if (host.includes('x.com') || host.includes('twitter.com') || host.includes('t.co')) return KNOWN_BRANDS.x;
      if (host.includes('vimeo.com')) return KNOWN_BRANDS.vimeo;
      if (host.includes('dailymotion.com') || host.includes('dai.ly')) return KNOWN_BRANDS.dailymotion;
      if (host.includes('reddit.com') || host.includes('redd.it')) return KNOWN_BRANDS.reddit;
      if (host.includes('pinterest.com') || host.includes('pin.it')) return KNOWN_BRANDS.pinterest;
      if (host.includes('threads.net') || host.includes('threads.com')) return KNOWN_BRANDS.threads;
      if (host.includes('vk.com') || host.includes('vk.ru') || host.includes('vkvideo.ru')) return KNOWN_BRANDS.vk;
    } catch {
      // Ignore URL parsing errors
    }
  }

  // 3. Fallback for any other site: show generic globe icon
  let displayName = 'Web Video';
  if (siteValue && siteValue.trim()) {
    const raw = siteValue.trim();
    displayName = raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  return {
    id: 'other',
    name: displayName,
    color: '#00C2FF',
    icon: Globe,
  };
}

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
