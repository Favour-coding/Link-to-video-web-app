export interface FormatOption {
  label: string;
  ext: string;
  downloadUrl: string;
  filesize?: string | number;
  quality?: string;
  hasAudio?: boolean;
  hasVideo?: boolean;
  locked?: boolean;
  note?: string;
}

export interface PlaylistEntry {
  id?: string;
  title: string;
  thumbnail?: string;
  duration?: number;
  url: string;
}

export interface VideoInfo {
  type?: 'video' | 'playlist' | string;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  formats: FormatOption[];
  platform?: PlatformId;
  originalUrl: string;
  fetchedAt?: number;
  // Playlist fields
  count?: number;
  total?: number;
  totalVideos?: number;
  countText?: string;
  entries?: PlaylistEntry[];
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  thumbnail?: string;
  duration?: number;
  platform: PlatformId;
  timestamp: number;
  type?: 'video' | 'playlist' | string;
  countText?: string;
}

export type PlatformId = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'other';

export interface ErrorState {
  type: 'empty' | 'invalid_url' | 'not_found' | 'too_many_requests' | 'server_busy' | 'network' | 'generic';
  title: string;
  message: string;
  statusCode?: number;
  canRetry: boolean;
}
