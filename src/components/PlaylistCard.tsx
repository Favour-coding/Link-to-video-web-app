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
  RefreshCw,
  Lock,
  ArrowRight
} from 'lucide-react';
import { VideoInfo, FormatOption, PlaylistEntry } from '../types.ts';
import { formatDuration, formatPlaylistCount, getPlatformMeta } from '../utils/helpers.ts';

interface PlaylistCardProps {
  playlist: VideoInfo;
  onDownloadZip: (format: FormatOption) => void;
  onFetchSingleVideo: (url: string) => void;
  onReset: () => void;
  isFetchingSingle?: boolean;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onDownloadZip,
  onFetchSingleVideo,
  onReset,
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
    <div className="w-full max-w-lg mx-auto mt-6 bg-[#0c1429]/95 backdrop-blur-md rounded-2xl border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.18)] transition-all animate-fadeIn">
      {/* Top Bar */}
      <div className="px-5 py-3.5 bg-[#070d1d] border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {platformMeta && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${platformMeta.bg}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {platformMeta.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/70 border border-cyan-400/30 text-cyan-300">
            <ListVideo className="w-3 h-3" />
            Playlist
          </span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Link</span>
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {/* Playlist Media Preview Box */}
        <div className="relative rounded-xl overflow-hidden bg-[#070d1d] border border-slate-800 mb-4 group aspect-video flex items-center justify-center">
          {playlist.thumbnail && !imgError ? (
            <img
              src={playlist.thumbnail}
              alt={playlist.title || 'Playlist thumbnail'}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-gradient-to-br from-slate-900 to-[#070d1d]">
              <ListVideo className="w-12 h-12 text-slate-600 mb-2" />
              <span className="text-xs text-slate-400">Playlist Preview</span>
            </div>
          )}

          {/* Stacked Playlist Indicator Overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-sm">
            <ListVideo className="w-3.5 h-3.5 text-cyan-400" />
            <span>{countText}</span>
          </div>

          {/* Total Duration Badge */}
          {playlist.duration !== undefined && playlist.duration !== null && playlist.duration > 0 && (
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-white text-xs font-mono font-medium border border-white/10 shadow-sm">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Total: {formatDuration(playlist.duration)}</span>
            </div>
          )}
        </div>

        {/* Playlist Title & Meta */}
        <div className="mb-5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
              {playlist.title || 'Untitled Playlist'}
            </h2>
            <button
              type="button"
              onClick={handleCopyTitle}
              title="Copy title"
              className="p-1.5 shrink-0 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {copiedTitle ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Count and Duration summary badges */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
              {countText}
            </span>
            {playlist.duration !== undefined && playlist.duration !== null && playlist.duration > 0 && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Total Duration: {formatDuration(playlist.duration)}</span>
              </span>
            )}
          </div>

          {playlist.originalUrl && (
            <a
              href={playlist.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 mt-2 transition-colors truncate max-w-full"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">{playlist.originalUrl}</span>
            </a>
          )}
        </div>

        {/* Section 1: List of Entries */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>Playlist Videos</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              {entries.length} {entries.length === 1 ? 'video listed' : 'videos listed'}
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-5 px-4 bg-[#070d1d] rounded-xl border border-slate-800 text-slate-400 text-xs">
              No individual video items returned. You can download the complete playlist below.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {entries.map((entry, index) => (
                <div
                  key={entry.url || index}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#070d1d] hover:bg-[#091226] border border-slate-800/80 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Index + Thumbnail */}
                    <div className="relative w-14 h-10 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                      {entry.thumbnail ? (
                        <img
                          src={entry.thumbnail}
                          alt={entry.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <Film className="w-4 h-4 text-slate-600" />
                      )}
                      <span className="absolute top-0.5 left-0.5 text-[9px] font-bold px-1 rounded bg-black/70 text-slate-300">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Entry Title & Duration */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {entry.title || `Video #${index + 1}`}
                      </h4>
                      {entry.duration !== undefined && (
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5 text-cyan-400" />
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
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0d1833] hover:bg-cyan-950 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400 text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    title="Load and download this single video"
                  >
                    <span>Get this video</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Formats as ZIP download buttons */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download Full Playlist (ZIP)</span>
            </h3>
            <span className="text-[11px] text-cyan-400/90 font-medium">
              Bundled Archive
            </span>
          </div>

          {(!playlist.formats || playlist.formats.length === 0) ? (
            <div className="text-center py-6 px-4 bg-[#070d1d] rounded-xl border border-slate-800 text-slate-400 text-sm">
              No ZIP download formats available for this playlist. You can download individual videos using the buttons above.
            </div>
          ) : (
            <div className="space-y-2.5">
              {playlist.formats.map((fmt, index) => {
                const isLocked = Boolean(fmt.locked);
                const extUpper = (fmt.ext || 'ZIP').toUpperCase();

                return (
                  <div
                    key={`${fmt.downloadUrl}-${index}`}
                    className={`p-3.5 rounded-xl border transition-all duration-150 ${
                      isLocked
                        ? 'bg-[#080e1d]/70 border-slate-800/80 opacity-60'
                        : 'bg-[#070d1d] hover:bg-[#091226] border-cyan-500/20 hover:border-cyan-400/50 group'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            isLocked
                              ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                              : 'bg-gradient-to-br from-cyan-950 to-blue-950 text-cyan-300 border border-cyan-400/30'
                          }`}
                        >
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-slate-400" />
                          ) : (
                            <Archive className="w-5 h-5 text-cyan-300" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm truncate ${isLocked ? 'text-slate-400' : 'text-white'}`}>
                              {fmt.label || 'Complete Playlist Archive'}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isLocked
                                  ? 'bg-slate-800 text-slate-400'
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              }`}
                            >
                              {extUpper}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Includes all available videos in ZIP archive
                            {fmt.filesize ? ` • ${fmt.filesize}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Download ZIP Button or Locked Badge */}
                      {isLocked ? (
                        <button
                          type="button"
                          disabled
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/60 text-xs font-semibold cursor-not-allowed"
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Locked</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDownloadZip(fmt)}
                          className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:via-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/45 active:scale-95 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download ZIP</span>
                        </button>
                      )}
                    </div>

                    {/* Locked quality note underneath */}
                    {isLocked && fmt.note && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-xs text-amber-300/90 flex items-start gap-1.5">
                        <Lock className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
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
