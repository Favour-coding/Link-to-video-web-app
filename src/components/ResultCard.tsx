import React, { useState } from 'react';
import { Download, Film, Music, Clock, Copy, Check, ExternalLink, RefreshCw, Lock } from 'lucide-react';
import { VideoInfo, FormatOption } from '../types.ts';
import { formatDuration, getPlatformMeta } from '../utils/helpers.ts';

interface ResultCardProps {
  video: VideoInfo;
  onDownload: (format: FormatOption) => void;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ video, onDownload, onReset }) => {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [imgError, setImgError] = useState(false);

  const platformMeta = video.platform ? getPlatformMeta(video.platform) : null;

  const handleCopyTitle = () => {
    if (!video.title) return;
    navigator.clipboard?.writeText(video.title).then(() => {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    }).catch(() => {});
  };

  const isAudioOnly = (fmt: FormatOption) => {
    const ext = (fmt.ext || '').toLowerCase();
    const lbl = (fmt.label || '').toLowerCase();
    return ext === 'mp3' || ext === 'm4a' || ext === 'aac' || lbl.includes('audio') || lbl.includes('mp3');
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-6 bg-[#0c1429]/95 backdrop-blur-md rounded-2xl border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.18)] transition-all animate-fadeIn">
      {/* Header bar with platform badge and Reset */}
      <div className="px-5 py-3.5 bg-[#070d1d] border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {platformMeta && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${platformMeta.bg}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {platformMeta.name}
            </span>
          )}
          <span className="text-xs font-medium text-slate-400">Video Ready</span>
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
        {/* Media Preview Box */}
        <div className="relative rounded-xl overflow-hidden bg-[#070d1d] border border-slate-800 mb-4 group aspect-video flex items-center justify-center">
          {video.thumbnail && !imgError ? (
            <img
              src={video.thumbnail}
              alt={video.title || 'Video thumbnail'}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-gradient-to-br from-slate-900 to-[#070d1d]">
              <Film className="w-12 h-12 text-slate-600 mb-2" />
              <span className="text-xs text-slate-400">Media Preview</span>
            </div>
          )}

          {/* Duration Badge formatted as h:mm:ss if > 1h, otherwise mm:ss */}
          {video.duration !== undefined && video.duration !== null && (
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-white text-xs font-mono font-medium border border-white/10 shadow-sm">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{formatDuration(video.duration)}</span>
            </div>
          )}
        </div>

        {/* Video Title */}
        <div className="mb-5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
              {video.title || 'Untitled Video'}
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

          {video.originalUrl && (
            <a
              href={video.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 mt-1 transition-colors truncate max-w-full"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">{video.originalUrl}</span>
            </a>
          )}
        </div>

        {/* Download Options Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Available Formats</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              {video.formats?.length || 0} {video.formats?.length === 1 ? 'option' : 'options'}
            </span>
          </div>

          {(!video.formats || video.formats.length === 0) ? (
            <div className="text-center py-6 px-4 bg-[#070d1d] rounded-xl border border-slate-800 text-slate-400 text-sm">
              No direct download formats were returned for this link. You can try another video link.
            </div>
          ) : (
            <div className="space-y-2.5">
              {video.formats.map((fmt, index) => {
                const isLocked = Boolean(fmt.locked);
                const audio = isAudioOnly(fmt);
                const extUpper = (fmt.ext || 'MP4').toUpperCase();

                return (
                  <div
                    key={`${fmt.downloadUrl}-${index}`}
                    className={`p-3 rounded-xl border transition-all duration-150 ${
                      isLocked
                        ? 'bg-[#080e1d]/70 border-slate-800/80 opacity-60'
                        : 'bg-[#070d1d] hover:bg-[#091226] border-cyan-500/15 hover:border-cyan-500/40 group'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isLocked
                              ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                              : audio
                              ? 'bg-purple-950/60 text-purple-400 border border-purple-500/30'
                              : 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30'
                          }`}
                        >
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-slate-400" />
                          ) : audio ? (
                            <Music className="w-4 h-4" />
                          ) : (
                            <Film className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm truncate ${isLocked ? 'text-slate-400' : 'text-white'}`}>
                              {fmt.label || (audio ? 'Audio Stream' : 'Standard Quality')}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isLocked
                                  ? 'bg-slate-800 text-slate-400'
                                  : audio
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-cyan-500/20 text-cyan-300'
                              }`}
                            >
                              {extUpper}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400">
                            {audio ? 'Audio only' : 'Video with audio'}
                            {fmt.filesize ? ` • ${fmt.filesize}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Download Button or Disabled Locked Indicator */}
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
                          onClick={() => onDownload(fmt)}
                          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-95 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
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
