import React, { useState } from 'react';
import {
  ListVideo,
  Download,
  Archive,
  Clock,
  Film,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  Lock,
  ArrowRight
} from 'lucide-react';
import { VideoInfo, FormatOption, PlaylistEntry } from '../types.ts';
import { formatDuration, formatPlaylistCount, getPlatformMeta } from '../utils/helpers.ts';

interface PlaylistCardProps {
  playlist: VideoInfo;
  onDownloadZip: (format: FormatOption) => void;
  onFetchSingleVideo: (url: string) => void;
  onChangeLink: () => void;
  isFetchingSingle?: boolean;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onDownloadZip,
  onFetchSingleVideo,
  onChangeLink,
  isFetchingSingle = false,
}) => {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [imgError, setImgError] = useState(false);

  const platformMeta = playlist.platform ? getPlatformMeta(playlist.platform) : null;
  const countText = formatPlaylistCount(playlist);

  const handleCopyTitle = () => {
    if (!playlist.title) return;
    navigator.clipboard?.writeText(playlist.title).then(() => {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    }).catch(() => {});
  };

  const entries: PlaylistEntry[] = playlist.entries || [];

  return (
    <div className="w-full max-w-[720px] mx-auto mt-6 glass-card rounded-2xl sm:rounded-3xl border border-[#1B2742] overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.5)] transition-all animate-fadeIn">
      {/* Top Bar with "Change link" button */}
      <div className="px-4 sm:px-6 py-3.5 bg-[#070B16] border-b border-[#1B2742] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {platformMeta && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${platformMeta.bg}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {platformMeta.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#7A3CFF]/15 border border-[#7A3CFF]/30 text-[#00C2FF]">
            <ListVideo className="w-3.5 h-3.5" />
            Playlist
          </span>
        </div>

        {/* Change Link Button */}
        <button
          type="button"
          onClick={onChangeLink}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8A97B8] hover:text-[#E8EEFF] hover:bg-[#1B2742]/60 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#00C2FF]" />
          <span>Change link</span>
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {/* Playlist Media Preview Box (No player needed for playlists) */}
        <div className="relative aspect-video w-full rounded-2xl bg-[#070B16] border border-[#1B2742] overflow-hidden mb-5 group shadow-inner flex items-center justify-center">
          {playlist.thumbnail && !imgError ? (
            <img
              src={playlist.thumbnail}
              alt={playlist.title || 'Playlist thumbnail'}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#8A97B8] bg-gradient-to-br from-[#0E1526] to-[#070B16]">
              <ListVideo className="w-12 h-12 text-[#8A97B8]/60 mb-2" />
              <span className="text-xs text-[#8A97B8]">Playlist Preview</span>
            </div>
          )}

          {/* Stacked Playlist Indicator Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[#E8EEFF] text-xs font-semibold border border-[#1B2742] shadow-sm">
            <ListVideo className="w-3.5 h-3.5 text-[#00C2FF]" />
            <span>{countText}</span>
          </div>

          {/* Total Duration Badge */}
          {playlist.duration !== undefined && playlist.duration !== null && playlist.duration > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[#E8EEFF] text-xs font-mono font-medium border border-[#1B2742] shadow-sm">
              <Clock className="w-3.5 h-3.5 text-[#00C2FF]" />
              <span>Total: {formatDuration(playlist.duration)}</span>
            </div>
          )}
        </div>

        {/* Playlist Title & Meta */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base sm:text-xl font-bold text-[#E8EEFF] leading-snug break-words">
              {playlist.title || 'Untitled Playlist'}
            </h2>
            <button
              type="button"
              onClick={handleCopyTitle}
              title="Copy title"
              className="min-h-[36px] min-w-[36px] p-2 shrink-0 rounded-xl text-[#8A97B8] hover:text-[#E8EEFF] hover:bg-[#1B2742] transition-colors cursor-pointer"
            >
              {copiedTitle ? (
                <Check className="w-4 h-4 text-[#22C55E]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Count and Duration summary badges */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#0E1526] border border-[#1B2742] text-[#00C2FF]">
              {countText}
            </span>
            {playlist.duration !== undefined && playlist.duration !== null && playlist.duration > 0 && (
              <span className="text-xs font-medium px-3 py-1 rounded-lg bg-[#070B16] border border-[#1B2742] text-[#8A97B8] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7A3CFF]" />
                <span>Total Duration: {formatDuration(playlist.duration)}</span>
              </span>
            )}
          </div>

          {playlist.originalUrl && (
            <a
              href={playlist.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#8A97B8] hover:text-[#00C2FF] mt-2 transition-colors truncate max-w-full"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{playlist.originalUrl}</span>
            </a>
          )}
        </div>

        {/* Section 1: Scrollable List of Entries */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A97B8] flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-[#00C2FF]" />
              <span>Playlist Videos</span>
            </h3>
            <span className="text-xs text-[#8A97B8]">
              {entries.length} {entries.length === 1 ? 'video' : 'videos'}
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-6 px-4 bg-[#070B16] rounded-2xl border border-[#1B2742] text-[#8A97B8] text-xs">
              No individual video items returned. You can download the complete playlist below.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {entries.map((entry, index) => (
                <div
                  key={entry.url || index}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#070B16] hover:bg-[#0A1020] border border-[#1B2742] hover:border-[#3B82F6]/40 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Index + Thumbnail */}
                    <div className="relative w-14 h-10 rounded-lg bg-[#0E1526] border border-[#1B2742] overflow-hidden shrink-0 flex items-center justify-center">
                      {entry.thumbnail ? (
                        <img
                          src={entry.thumbnail}
                          alt={entry.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <Film className="w-4 h-4 text-[#8A97B8]" />
                      )}
                      <span className="absolute top-0.5 left-0.5 text-[9px] font-bold px-1 rounded bg-black/80 text-[#8A97B8]">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Entry Title & Duration */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-[#E8EEFF] truncate group-hover:text-[#00C2FF] transition-colors">
                        {entry.title || `Video #${index + 1}`}
                      </h4>
                      {entry.duration !== undefined && (
                        <span className="text-[10px] text-[#8A97B8] font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5 text-[#00C2FF]" />
                          {formatDuration(entry.duration)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* "Get this video" button */}
                  <button
                    type="button"
                    onClick={() => onFetchSingleVideo(entry.url)}
                    disabled={isFetchingSingle || !entry.url}
                    className="min-h-[40px] shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl bg-[#0E1526] hover:bg-[#1B2742] text-[#E8EEFF] border border-[#1B2742] hover:border-[#00C2FF]/60 text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    title="Load and download this single video"
                  >
                    <span>Get this video</span>
                    <ArrowRight className="w-3 h-3 text-[#00C2FF]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Formats as ZIP download buttons */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A97B8] flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-[#00C2FF]" />
              <span>Download Full Playlist (ZIP)</span>
            </h3>
            <span className="text-xs font-medium text-[#00C2FF]">
              Bundled Archive
            </span>
          </div>

          {(!playlist.formats || playlist.formats.length === 0) ? (
            <div className="text-center py-6 px-4 bg-[#070B16] rounded-2xl border border-[#1B2742] text-[#8A97B8] text-sm">
              No ZIP download formats available for this playlist. You can download individual videos using the buttons above.
            </div>
          ) : (
            <div className="space-y-3">
              {playlist.formats.map((fmt, index) => {
                const isLocked = Boolean(fmt.locked);
                const extUpper = (fmt.ext || 'ZIP').toUpperCase();

                return (
                  <div
                    key={`${fmt.downloadUrl || fmt.label}-${index}`}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
                      isLocked
                        ? 'bg-[#070B16]/60 border-[#1B2742]/70 opacity-60'
                        : 'bg-[#070B16] hover:bg-[#0A1020] border-[#1B2742] hover:border-[#3B82F6]/50 shadow-sm'
                    }`}
                  >
                    {/* Responsive flex wrapping: on <420px stacked full-width button, on >=420px button beside text */}
                    <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isLocked
                              ? 'bg-[#1B2742]/50 text-[#8A97B8] border border-[#1B2742]'
                              : 'bg-gradient-to-br from-[#7A3CFF]/20 to-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/30'
                          }`}
                        >
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-[#8A97B8]" />
                          ) : (
                            <Archive className="w-5 h-5 text-[#00C2FF]" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <span
                              className={`font-bold text-sm sm:text-base leading-tight ${
                                isLocked ? 'text-[#8A97B8]' : 'text-[#E8EEFF]'
                              }`}
                              style={{ textOverflow: 'clip', whiteSpace: 'normal', maxWidth: 'none' }}
                            >
                              {fmt.label || 'Complete Playlist Archive'}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                isLocked
                                  ? 'bg-[#1B2742] text-[#8A97B8]'
                                  : 'bg-[#7A3CFF]/20 text-[#00C2FF] border border-[#7A3CFF]/30'
                              }`}
                            >
                              {extUpper}
                            </span>
                          </div>
                          <div className="text-xs text-[#8A97B8] mt-1">
                            Includes all available playlist videos in ZIP archive
                            {fmt.filesize ? ` • ${fmt.filesize}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Download ZIP Button or Locked Badge */}
                      {isLocked ? (
                        <button
                          type="button"
                          disabled
                          className="w-full min-[420px]:w-auto min-h-[44px] shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B2742]/50 text-[#8A97B8] border border-[#1B2742] text-xs font-semibold cursor-not-allowed"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#8A97B8]" />
                          <span>Locked</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDownloadZip(fmt)}
                          className="w-full min-[420px]:w-auto min-h-[44px] shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl brand-gradient-bg text-white text-xs sm:text-sm font-bold shadow-[0_4px_15px_rgba(122,60,255,0.3)] hover:shadow-[0_4px_20px_rgba(0,194,255,0.4)] hover-lift cursor-pointer active:scale-95 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download ZIP</span>
                        </button>
                      )}
                    </div>

                    {/* Locked quality note underneath */}
                    {isLocked && fmt.note && (
                      <div className="mt-2.5 pt-2.5 border-t border-[#1B2742] text-xs text-[#F5B544] flex items-start gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#F5B544] shrink-0 mt-0.5" />
                        <span className="leading-tight">{fmt.note}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
