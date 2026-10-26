import { PlatformId } from '../types.ts';

/**
 * Format duration in seconds:
 * - Over an hour: h:mm:ss (e.g. "1:05:30", "12:00:15")
 * - Under an hour: mm:ss (e.g. "04:12", "59:59")
 */
export function formatDuration(seconds: number | string | undefined | null): string {
  if (seconds === undefined || seconds === null) return '00:00';
  const totalSec = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
  if (isNaN(totalSec) || totalSec < 0) return '00:00';

  const rounded = Math.floor(totalSec);
  const hrs = Math.floor(rounded / 3600);
  const mins = Math.floor((rounded % 3600) / 60);
  const secs = rounded % 60;

  const paddedMins = mins.toString().padStart(2, '0');
  const paddedSecs = secs.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${paddedMins}:${paddedSecs}`;
  }
  return `${paddedMins}:${paddedSecs}`;
}

/**
 * Formats count of total videos for playlists (e.g. "25 of 80 videos")
 */
export function formatPlaylistCount(data: {
  count?: number;
  total?: number;
  totalVideos?: number;
  countText?: string;
  entries?: Array<unknown>;
}): string {
  if (data.countText && typeof data.countText === 'string') {
    return data.countText;
  }
  const entriesCount = data.entries?.length;
  const currentCount = data.count ?? entriesCount;
  const totalCount = data.total ?? data.totalVideos;

  if (currentCount !== undefined && totalCount !== undefined && totalCount > 0) {
    return `${currentCount} of ${totalCount} videos`;
  }
  if (currentCount !== undefined && currentCount > 0) {
    return `${currentCount} videos`;
  }
  if (totalCount !== undefined && totalCount > 0) {
    return `${totalCount} videos`;
  }
  return 'Playlist';
}

/**
 * Validates whether a string is a valid HTTP/HTTPS URL
 */
export function isValidUrl(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Identifies the social media platform from a URL
 */
export function detectPlatform(rawUrl: string): PlatformId {
  if (!rawUrl) return 'other';
  const url = rawUrl.toLowerCase();

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('tiktok.com')) {
    return 'tiktok';
  }
  if (url.includes('instagram.com') || url.includes('instagr.am')) {
    return 'instagram';
  }
  if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com')) {
    return 'facebook';
  }
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return 'twitter';
  }

  return 'other';
}

/**
 * Platform display metadata
 */
export function getPlatformMeta(platform: PlatformId) {
  switch (platform) {
    case 'youtube':
      return {
        name: 'YouTube',
        color: '#FF0000',
        bg: 'bg-red-500/15 text-red-400 border-red-500/30',
        badge: 'YouTube',
        icon: 'youtube'
      };
    case 'tiktok':
      return {
        name: 'TikTok',
        color: '#00F2FE',
        bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        badge: 'TikTok',
        icon: 'tiktok'
      };
    case 'instagram':
      return {
        name: 'Instagram',
        color: '#E1306C',
        bg: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
        badge: 'Instagram',
        icon: 'instagram'
      };
    case 'facebook':
      return {
        name: 'Facebook',
        color: '#1877F2',
        bg: 'bg-blue-600/15 text-blue-400 border-blue-600/30',
        badge: 'Facebook',
        icon: 'facebook'
      };
    case 'twitter':
      return {
        name: 'X (Twitter)',
        color: '#FFFFFF',
        bg: 'bg-slate-400/15 text-slate-200 border-slate-400/30',
        badge: 'X (Twitter)',
        icon: 'twitter'
      };
    default:
      return {
        name: 'Web Video',
        color: '#00d2ff',
        bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
        badge: 'Web Video',
        icon: 'video'
      };
  }
}

/**
 * Format relative timestamp
 */
export function formatTimeAgo(timestamp: number): string {
  const elapsed = Math.floor((Date.now() - timestamp) / 1000);
  if (elapsed < 30) return 'Just now';
  if (elapsed < 60) return `${elapsed}s ago`;
  const mins = Math.floor(elapsed / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
