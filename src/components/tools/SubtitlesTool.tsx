import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  AlertTriangle,
  RotateCcw,
  Loader2,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { formatDuration } from '../../utils/helpers.ts';

interface SubtitleTrack {
  code: string;
  name: string;
  auto?: boolean;
}

interface SubsResponse {
  title: string;
  thumbnail?: string;
  duration?: number;
  subtitles: SubtitleTrack[];
}

type SubtitleFormat = 'srt' | 'vtt' | 'txt';

interface SubtitlesToolProps {
  apiBaseUrl: string;
}

export const SubtitlesTool: React.FC<SubtitlesToolProps> = ({ apiBaseUrl }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SubsResponse | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [format, setFormat] = useState<SubtitleFormat>('srt');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setError('Please paste a YouTube video link.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/subs/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: cleanUrl }),
      });

      if (!response.ok) {
        let errorMsg = 'Could not find subtitles for this video.';
        try {
          const errData = await response.json();
          if (errData?.error) errorMsg = errData.error;
          else if (errData?.detail) errorMsg = errData.detail;
        } catch {
          // Non-JSON response
        }

        if (response.status === 404) {
          setError(
            'No subtitles found for this video. The creator might not have added subtitles or automatic captions may be disabled.'
          );
        } else {
          setError(errorMsg);
        }
        return;
      }

      const resData = await response.json();
      const subs = Array.isArray(resData.subtitles) ? resData.subtitles : [];

      if (subs.length === 0) {
        setError(
          'No subtitles found for this video. The creator has not uploaded captions, and auto-captions are unavailable.'
        );
        return;
      }

      setData({
        title: resData.title || 'YouTube Video',
        thumbnail: resData.thumbnail,
        duration: resData.duration,
        subtitles: subs,
      });

      // Default to first track (prefer non-auto if available)
      const nonAuto = subs.find((s: SubtitleTrack) => !s.auto);
      setSelectedLang(nonAuto ? nonAuto.code : subs[0].code);
    } catch (err) {
      setError(
        'Unable to connect to the subtitle service. Please check your internet connection or try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!data || !selectedLang) return;

    const currentTrack = data.subtitles.find((s) => s.code === selectedLang);
    const isAuto = currentTrack?.auto ? 1 : 0;
    const downloadUrl = `${apiBaseUrl}/api/subs/download?url=${encodeURIComponent(
      url.trim()
    )}&lang=${encodeURIComponent(selectedLang)}&auto=${isAuto}&fmt=${format}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setUrl('');
    setData(null);
    setError(null);
    setSelectedLang('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A3CFF]/15 border border-[#7A3CFF]/30 text-[#00C2FF] text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>YouTube Subtitles Extractor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          YouTube <span className="brand-gradient-text">Subtitles Downloader</span>
        </h1>
        <p className="text-sm text-[#8A97B8] mt-2 max-w-lg mx-auto">
          Extract and download subtitle files (.srt, .vtt, .txt) from any YouTube video in seconds.
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="glass-card rounded-2xl p-5 sm:p-7 border border-[#1B2742] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste YouTube video link..."
                disabled={isLoading}
                className="w-full bg-[#070B16] border border-[#1B2742] focus:border-[#00C2FF] rounded-xl px-4 py-3.5 text-sm sm:text-base text-white placeholder-[#8A97B8] focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="py-3.5 px-6 rounded-xl brand-gradient-bg text-white font-bold text-sm shadow-[0_4px_20px_rgba(122,60,255,0.35)] hover-lift transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Find subtitles</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="mt-6 pt-6 border-t border-[#1B2742] animate-pulse space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-24 h-16 bg-[#1B2742]/60 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#1B2742]/60 rounded w-3/4" />
                <div className="h-3 bg-[#1B2742]/40 rounded w-1/3" />
              </div>
            </div>
            <div className="h-10 bg-[#1B2742]/40 rounded-xl" />
          </div>
        )}

        {/* Error Card */}
        {error && !isLoading && (
          <div className="mt-6 p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Subtitles Unavailable</p>
              <p className="mt-1 text-xs text-[#EF4444]/80 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Subtitles Result */}
        {data && !isLoading && (
          <div className="mt-6 pt-6 border-t border-[#1B2742] space-y-6">
            {/* Video preview meta */}
            <div className="flex gap-3.5 items-start p-3 rounded-xl bg-[#070B16] border border-[#1B2742]">
              {data.thumbnail && (
                <img
                  src={data.thumbnail}
                  alt={data.title}
                  className="w-24 sm:w-28 aspect-video object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-[#E8EEFF] line-clamp-2">
                  {data.title}
                </h3>
                {data.duration ? (
                  <p className="text-xs text-[#8A97B8] mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#00C2FF]" />
                    <span>{formatDuration(data.duration)}</span>
                  </p>
                ) : null}
              </div>
            </div>

            {/* Language dropdown with auto-generated mark */}
            <div>
              <label className="block text-xs font-semibold text-[#8A97B8] uppercase tracking-wider mb-2">
                Choose Language Track ({data.subtitles.length} available)
              </label>
              <div className="relative">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full bg-[#070B16] border border-[#1B2742] focus:border-[#00C2FF] rounded-xl px-4 py-3 text-sm text-white appearance-none cursor-pointer focus:outline-none"
                >
                  {data.subtitles.map((sub) => (
                    <option key={`${sub.code}-${sub.auto ? 'auto' : 'manual'}`} value={sub.code}>
                      {sub.name || sub.code} {sub.auto ? '(auto-generated)' : '(standard)'}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A97B8]">
                  ▼
                </div>
              </div>
            </div>

            {/* Format picker (SRT, VTT, TXT) */}
            <div>
              <label className="block text-xs font-semibold text-[#8A97B8] uppercase tracking-wider mb-2">
                Subtitle Format
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['srt', 'vtt', 'txt'] as SubtitleFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                      format === fmt
                        ? 'border-[#00C2FF] bg-[#00C2FF]/15 text-white font-bold shadow-[0_0_15px_rgba(0,194,255,0.25)]'
                        : 'border-[#1B2742] bg-[#070B16] text-[#8A97B8] hover:border-[#3B82F6]/50 hover:text-white'
                    }`}
                  >
                    <div className="text-xs sm:text-sm uppercase font-mono">{fmt}</div>
                    <div className="text-[10px] text-[#8A97B8] mt-0.5">
                      {fmt === 'srt' ? 'SubRip (VLC/Players)' : fmt === 'vtt' ? 'WebVTT (Web/HTML5)' : 'Plain text'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 py-3.5 px-6 rounded-xl brand-gradient-bg text-white font-bold text-sm shadow-[0_4px_20px_rgba(122,60,255,0.35)] hover-lift flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download .{format.toUpperCase()}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-5 rounded-xl bg-[#070B16] border border-[#1B2742] hover:border-[#8A97B8] text-[#8A97B8] hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Search another</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-6 text-xs text-[#8A97B8]">
        <span>Supports SRT, WebVTT, and TXT · Standard & Auto-Generated Captions</span>
      </div>
    </div>
  );
};
