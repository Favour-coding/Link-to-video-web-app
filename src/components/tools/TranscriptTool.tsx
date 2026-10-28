import React, { useState } from 'react';
import {
  AlignLeft,
  Search,
  Copy,
  Download,
  Check,
  AlertTriangle,
  RotateCcw,
  Loader2,
  Clock,
} from 'lucide-react';
import { formatDuration } from '../../utils/helpers.ts';

interface TranscriptLine {
  start: number;
  duration?: number;
  text: string;
}

interface AvailableLang {
  code: string;
  name: string;
}

interface TranscriptResponse {
  title: string;
  thumbnail?: string;
  duration?: number;
  currentLang?: string;
  availableLangs?: AvailableLang[];
  lines: TranscriptLine[];
}

interface TranscriptToolProps {
  apiBaseUrl: string;
}

export const TranscriptTool: React.FC<TranscriptToolProps> = ({ apiBaseUrl }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TranscriptResponse | null>(null);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTranscript = async (targetUrl: string, langCode: string = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/transcript`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl, lang: langCode }),
      });

      if (!response.ok) {
        let msg = 'Transcript unavailable for this video.';
        try {
          const errData = await response.json();
          if (errData?.error) msg = errData.error;
          else if (errData?.detail) msg = errData.detail;
        } catch {
          // Non-JSON
        }

        if (response.status === 404) {
          setError(
            'No transcript available for this video. Transcripts may be disabled by the video owner or captions are not yet available.'
          );
        } else {
          setError(msg);
        }
        return;
      }

      const resData = await response.json();
      const lines: TranscriptLine[] = Array.isArray(resData.lines) ? resData.lines : [];

      if (lines.length === 0) {
        setError(
          'This video has no spoken dialogue or transcripts are disabled by the owner.'
        );
        return;
      }

      setData({
        title: resData.title || 'YouTube Video Transcript',
        thumbnail: resData.thumbnail,
        duration: resData.duration,
        currentLang: resData.currentLang || langCode || 'en',
        availableLangs: Array.isArray(resData.availableLangs) ? resData.availableLangs : [],
        lines: lines,
      });
    } catch (err) {
      setError(
        'Unable to connect to the transcript service. Please verify your connection or try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = url.trim();
    if (!clean) {
      setError('Please enter a YouTube video URL.');
      return;
    }
    setData(null);
    fetchTranscript(clean, '');
  };

  const handleLanguageChange = (newLang: string) => {
    if (!url.trim()) return;
    fetchTranscript(url.trim(), newLang);
  };

  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getFullTranscriptText = (includeTimestamps: boolean): string => {
    if (!data) return '';
    return data.lines
      .map((l) => (includeTimestamps ? `[${formatTimestamp(l.start)}] ${l.text}` : l.text))
      .join('\n');
  };

  const handleCopy = async () => {
    const text = getFullTranscriptText(showTimestamps);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    if (!data) return;
    const text = getFullTranscriptText(showTimestamps);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const safeTitle = (data.title || 'transcript').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${safeTitle}_transcript.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  };

  const handleReset = () => {
    setUrl('');
    setData(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A3CFF]/15 border border-[#7A3CFF]/30 text-[#00C2FF] text-xs font-semibold mb-3">
          <AlignLeft className="w-3.5 h-3.5" />
          <span>Full Video Text & Timestamps</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          YouTube <span className="brand-gradient-text">Transcript Extractor</span>
        </h1>
        <p className="text-sm text-[#8A97B8] mt-2 max-w-lg mx-auto">
          Read, search, copy, and export the complete dialogue transcript of any YouTube video with timestamp cues.
        </p>
      </div>

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
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Get transcript</span>
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
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-[#1B2742]/40 rounded w-full" />
              <div className="h-4 bg-[#1B2742]/40 rounded w-5/6" />
              <div className="h-4 bg-[#1B2742]/40 rounded w-4/6" />
              <div className="h-4 bg-[#1B2742]/40 rounded w-full" />
            </div>
          </div>
        )}

        {/* Error Card */}
        {error && !isLoading && (
          <div className="mt-6 p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Transcript Unavailable</p>
              <p className="mt-1 text-xs text-[#EF4444]/80 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Transcript Results Card */}
        {data && !isLoading && (
          <div className="mt-6 pt-6 border-t border-[#1B2742] space-y-5">
            {/* Meta Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-3.5 rounded-xl bg-[#070B16] border border-[#1B2742]">
              <div className="flex gap-3 items-center min-w-0">
                {data.thumbnail && (
                  <img
                    src={data.thumbnail}
                    alt={data.title}
                    className="w-20 sm:w-24 aspect-video object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-[#E8EEFF] truncate">
                    {data.title}
                  </h3>
                  {data.duration ? (
                    <p className="text-xs text-[#8A97B8] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00C2FF]" />
                      <span>{formatDuration(data.duration)}</span>
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Language Dropdown (if multiple languages returned) */}
              {data.availableLangs && data.availableLangs.length > 1 && (
                <div className="w-full sm:w-auto">
                  <select
                    value={data.currentLang || ''}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full sm:w-auto bg-[#0E1526] border border-[#1B2742] focus:border-[#00C2FF] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {data.availableLangs.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name || l.code}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Toolbar: Toggle Timestamps, Copy, Download TXT */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Show timestamps toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showTimestamps}
                  onChange={(e) => setShowTimestamps(e.target.checked)}
                  className="rounded border-[#1B2742] text-[#00C2FF] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs text-[#8A97B8]">Show timestamps (m:ss)</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-lg bg-[#070B16] border border-[#1B2742] hover:border-[#00C2FF] text-[#E8EEFF] hover:text-[#00C2FF] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span className="text-[#22C55E]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="px-3.5 py-1.5 rounded-lg brand-gradient-bg text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover-lift"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            {/* Scrollable Transcript Card */}
            <div className="rounded-xl bg-[#070B16] border border-[#1B2742] p-4 max-h-96 overflow-y-auto space-y-3 font-sans text-xs sm:text-sm leading-relaxed divide-y divide-[#1B2742]/40">
              {data.lines.map((line, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex gap-3 items-baseline group">
                  {showTimestamps && (
                    <span className="text-[11px] font-mono text-[#00C2FF] flex-shrink-0 select-none bg-[#00C2FF]/10 px-1.5 py-0.5 rounded">
                      {formatTimestamp(line.start)}
                    </span>
                  )}
                  <p className="text-[#E8EEFF] group-hover:text-white transition-colors">
                    {line.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer reset button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-[#8A97B8] hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Search another video</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-6 text-xs text-[#8A97B8]">
        <span>Accurate speech timestamps · Export directly to .txt or clipboard</span>
      </div>
    </div>
  );
};
