import React, { useState } from 'react';
import {
  Play,
  Download,
  Film,
  Music,
  Clock,
  User,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { VideoInfo, FormatOption } from '../types.ts';
import { formatDuration } from '../utils/helpers.ts';
import { isPortraitVideo, resolveSiteBrand } from '../utils/siteConfigs.ts';

interface ResultCardProps {
  video: VideoInfo;
  onDownload: (format: FormatOption) => void;
  onChangeLink: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ video, onDownload, onChangeLink }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Platform and official brand metadata resolution
  const siteBrand = resolveSiteBrand(video.site || video.platform, video.originalUrl);
  const BrandIcon = siteBrand.icon;

  // Sizing: Portrait (TikTok, Instagram, Shorts, etc.) vs 16:9
  const isPortrait = isPortraitVideo(video.originalUrl, video.site || video.platform);

  const handleCopyTitle = () => {
    if (!video.title) return;
    navigator.clipboard?.writeText(video.title).then(() => {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    }).catch(() => {});
  };

  const handlePlayClick = () => {
    if (!video.embedUrl && !video.previewUrl) {
      setPlayerError(true);
      return;
    }
    setPlayerError(false);
    setIsPlaying(true);
  };

  const isAudioOnly = (fmt: FormatOption) => {
    const ext = (fmt.ext || '').toLowerCase();
    const lbl = (fmt.label || '').toLowerCase();
    return ext === 'mp3' || ext === 'm4a' || ext === 'aac' || lbl.includes('audio') || lbl.includes('mp3');
  };

  return (
    <div className="w-full max-w-[720px] mx-auto mt-6 glass-card rounded-2xl sm:rounded-3xl border border-[#1B2742] overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.5)] transition-all animate-fadeIn">
      {/* Top Bar with "Change link" button and site badge */}
      <div className="px-4 sm:px-6 py-3.5 bg-[#070B16] border-b border-[#1B2742] flex items-center justify-between gap-3">
        {/* Top Badge: rounded pill with 20px brand icon followed by site name in accent color, NO dot */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#0E1526] border border-[#1B2742] shadow-sm">
            <BrandIcon
              className="w-5 h-5 shrink-0"
              style={{ color: siteBrand.color }}
              aria-label={siteBrand.name}
              role="img"
            />
            <span style={{ color: siteBrand.color }}>{siteBrand.name}</span>
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
        {/* Media Container: Sized according to video shape (portrait vs 16:9) */}
        <div
          className={`relative rounded-2xl bg-[#070B16] border border-[#1B2742] overflow-hidden mb-3 shadow-inner flex items-center justify-center ${
            isPortrait ? 'mx-auto' : 'w-full aspect-video'
          }`}
          style={
            isPortrait
              ? {
                  width: 'min(100%, 340px)',
                  height: 'min(600px, 70vh)',
                }
              : undefined
          }
        >
          {isPlaying && !playerError ? (
            video.embedUrl ? (
              <iframe
                src={video.embedUrl}
                title={video.title || 'Video Player'}
                className="w-full h-full border-0 block rounded-2xl"
                style={{ border: 0, width: '100%', height: '100%' }}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                onError={() => setPlayerError(true)}
              />
            ) : video.previewUrl ? (
              <video
                src={video.previewUrl}
                controls
                playsInline
                autoPlay
                className="w-full h-full object-contain bg-black rounded-2xl"
                style={{ objectFit: 'contain', maxHeight: '70vh' }}
                onError={() => setPlayerError(true)}
              />
            ) : null
          ) : (
            // Thumbnail with centered play button
            <div className="relative w-full h-full flex items-center justify-center">
              {video.thumbnail && !imgError ? (
                <img
                  src={video.thumbnail}
                  alt={video.title || 'Video thumbnail'}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#8A97B8] bg-gradient-to-br from-[#0E1526] to-[#070B16]">
                  <Film className="w-12 h-12 text-[#8A97B8]/60 mb-2" />
                  <span className="text-xs text-[#8A97B8]">Media Preview</span>
                </div>
              )}

              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors pointer-events-none" />

              {/* Centered Play Button */}
              <button
                type="button"
                onClick={handlePlayClick}
                className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full brand-gradient-bg flex items-center justify-center text-white shadow-[0_8px_30px_rgba(122,60,255,0.6)] hover:shadow-[0_8px_40px_rgba(0,194,255,0.7)] hover:scale-105 active:scale-95 hover-lift transition-all cursor-pointer group/play"
                aria-label="Play video preview"
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5 group-hover/play:scale-110 transition-transform" />
              </button>

              {/* Thumbnail badge: show only brand icon (24px) inside small dark rounded circle in corner, no text */}
              <div
                className="absolute top-3 left-3 w-10 h-10 rounded-full bg-black/85 backdrop-blur-md flex items-center justify-center border border-[#1B2742] shadow-md"
                title={siteBrand.name}
              >
                <BrandIcon
                  className="w-6 h-6 shrink-0"
                  style={{ color: siteBrand.color }}
                  aria-label={siteBrand.name}
                  role="img"
                />
              </div>

              {/* Duration Badge in bottom corner formatted as m:ss or h:mm:ss */}
              {video.duration !== undefined && video.duration !== null && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[#E8EEFF] text-xs font-mono font-medium border border-[#1B2742] shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-[#00C2FF]" />
                  <span>{formatDuration(video.duration)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* "Open original" link under the player */}
        {video.originalUrl && (
          <div className="flex justify-end mb-4">
            <a
              href={video.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A97B8] hover:text-[#00C2FF] transition-colors py-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open original</span>
            </a>
          </div>
        )}

        {/* Small note if preview is not available or failed */}
        {playerError && (
          <div className="mb-5 p-3 rounded-xl bg-[#0E1526] border border-[#1B2742] flex items-center gap-2 text-xs text-[#F5B544] animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#F5B544]" />
            <span>Preview not available for this site. You can still download.</span>
          </div>
        )}

        {/* Title (max 2 lines), uploader, duration */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3">
            {/* Title clamped to 2 lines */}
            <h2 className="text-base sm:text-xl font-bold text-[#E8EEFF] leading-snug line-clamp-2">
              {video.title || 'Untitled Video'}
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

          {/* Uploader and Duration metadata */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#8A97B8]">
            {video.uploader && (
              <span className="flex items-center gap-1.5 font-medium text-[#E8EEFF]">
                <User className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span className="truncate max-w-[200px]">{video.uploader}</span>
              </span>
            )}

            {video.duration !== undefined && video.duration !== null && (
              <span className="flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#7A3CFF]" />
                <span>{formatDuration(video.duration)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Quality and Download Options Section */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A97B8] flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#00C2FF]" />
              <span>Available qualities &amp; formats</span>
            </h3>
            <span className="text-xs text-[#8A97B8]">
              {video.formats?.length || 0} {video.formats?.length === 1 ? 'option' : 'options'}
            </span>
          </div>

          {(!video.formats || video.formats.length === 0) ? (
            <div className="text-center py-6 px-4 bg-[#070B16] rounded-2xl border border-[#1B2742] text-[#8A97B8] text-sm">
              No direct download formats were returned for this link. You can try another video link.
            </div>
          ) : (
            <div className="space-y-3">
              {video.formats.map((fmt, index) => {
                const isLocked = Boolean(fmt.locked);
                const audio = isAudioOnly(fmt);
                const extUpper = (fmt.ext || 'MP4').toUpperCase();

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
                      {/* Left: Icon, Full Bold Label (NO TRUNCATE), format badge, description */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isLocked
                              ? 'bg-[#1B2742]/50 text-[#8A97B8] border border-[#1B2742]'
                              : audio
                              ? 'bg-[#7A3CFF]/15 text-[#7A3CFF] border border-[#7A3CFF]/30'
                              : 'bg-[#00C2FF]/15 text-[#00C2FF] border border-[#00C2FF]/30'
                          }`}
                        >
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-[#8A97B8]" />
                          ) : audio ? (
                            <Music className="w-4 h-4" />
                          ) : (
                            <Film className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          {/* Label in bold (full label, never truncated) and format badge */}
                          <div className="flex items-center flex-wrap gap-2">
                            <span
                              className={`font-bold text-sm sm:text-base leading-tight ${
                                isLocked ? 'text-[#8A97B8]' : 'text-[#E8EEFF]'
                              }`}
                              style={{ textOverflow: 'clip', whiteSpace: 'normal', maxWidth: 'none' }}
                            >
                              {fmt.label || (audio ? 'Audio only' : 'Standard Quality')}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                isLocked
                                  ? 'bg-[#1B2742] text-[#8A97B8]'
                                  : audio
                                  ? 'bg-[#7A3CFF]/20 text-[#7A3CFF]'
                                  : 'bg-[#00C2FF]/20 text-[#00C2FF]'
                              }`}
                            >
                              {extUpper}
                            </span>
                          </div>

                          {/* Description below label and badge */}
                          <div className="text-xs text-[#8A97B8] mt-1">
                            {audio ? 'Audio only stream' : 'Video with audio'}
                            {fmt.filesize ? ` • ${fmt.filesize}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Right / Below on <420px: Download Button */}
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
                          onClick={() => onDownload(fmt)}
                          className="w-full min-[420px]:w-auto min-h-[44px] shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl brand-gradient-bg text-white text-xs sm:text-sm font-bold shadow-[0_4px_15px_rgba(122,60,255,0.3)] hover:shadow-[0_4px_20px_rgba(0,194,255,0.4)] hover-lift cursor-pointer active:scale-95 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
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
