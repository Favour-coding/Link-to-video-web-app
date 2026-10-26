/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { PlatformChips } from './components/PlatformChips.tsx';
import { InputCard } from './components/InputCard.tsx';
import { LoadingCard } from './components/LoadingCard.tsx';
import { ResultCard } from './components/ResultCard.tsx';
import { PlaylistCard } from './components/PlaylistCard.tsx';
import { ErrorCard } from './components/ErrorCard.tsx';
import { HistoryCard } from './components/HistoryCard.tsx';
import { PreparingToast } from './components/PreparingToast.tsx';
import { Footer } from './components/Footer.tsx';
import { VideoInfo, FormatOption, HistoryItem, ErrorState, PlatformId } from './types.ts';
import { isValidUrl, detectPlatform, formatPlaylistCount } from './utils/helpers.ts';

// =========================================================================
// BACKEND CONFIGURATION
// >>> CHANGE API_BASE_URL BELOW TO POINT TO YOUR BACKEND SERVER <<<
// =========================================================================
const API_BASE_URL = "https://linksaver-backend-6vsr.onrender.com";
// =========================================================================

const HISTORY_STORAGE_KEY = 'linksaver_history_v1';

export default function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastFormatLabel, setToastFormatLabel] = useState('');
  const [isToastPlaylist, setIsToastPlaylist] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 5));
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  // Save history to localStorage
  const saveHistoryItem = (item: HistoryItem) => {
    setHistory((prev) => {
      // Remove any duplicate of the same URL, then prepend and keep only 5
      const filtered = prev.filter((h) => h.url.toLowerCase() !== item.url.toLowerCase());
      const updated = [item, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage write errors
      }
      return updated;
    });
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setHistory([]);
  };

  const removeHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  // Detected platform based on current input
  const activePlatform: PlatformId = detectPlatform(url);

  // Validate the link before sending
  const validateInput = (): boolean => {
    setValidationError(null);
    const trimmed = url.trim();

    if (!trimmed) {
      setValidationError('Please enter or paste a video link.');
      return false;
    }

    if (!isValidUrl(trimmed)) {
      setValidationError('Please enter a valid URL (starting with https:// or http://).');
      return false;
    }

    return true;
  };

  const handleFetchVideo = async (targetUrl?: string) => {
    const linkToFetch = (targetUrl || url).trim();

    if (targetUrl) {
      setUrl(targetUrl);
    }

    // Validate input
    if (!linkToFetch) {
      setValidationError('Please enter or paste a video link.');
      return;
    }

    if (!isValidUrl(linkToFetch)) {
      setValidationError('Please enter a valid URL (starting with https:// or http://).');
      return;
    }

    setValidationError(null);
    setError(null);
    setVideoInfo(null);
    setIsLoading(true);

    // 60-second timeout controller
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 60000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: linkToFetch }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-200 responses
      if (!response.ok) {
        let serverErrorMsg = `Server returned error (${response.status})`;
        try {
          const errData = await response.json();
          if (errData && typeof errData.error === 'string' && errData.error.trim()) {
            serverErrorMsg = errData.error;
          }
        } catch {
          // Response was not JSON
        }

        // Categorize the error state
        const lowerMsg = serverErrorMsg.toLowerCase();
        let errorType: ErrorState['type'] = 'generic';
        let errorTitle = 'Unable to download video';

        if (response.status === 404 || lowerMsg.includes('private') || lowerMsg.includes('unavailable') || lowerMsg.includes('not found') || lowerMsg.includes('removed')) {
          errorType = 'not_found';
          errorTitle = 'Video Unavailable or Private';
        } else if (response.status === 429 || lowerMsg.includes('rate limit') || lowerMsg.includes('too many requests')) {
          errorType = 'too_many_requests';
          errorTitle = 'Too Many Requests';
        } else if (response.status === 502 || response.status === 503 || response.status === 504 || lowerMsg.includes('busy') || lowerMsg.includes('overloaded')) {
          errorType = 'server_busy';
          errorTitle = 'Server Busy';
        } else if (response.status === 400 || lowerMsg.includes('invalid url') || lowerMsg.includes('unsupported')) {
          errorType = 'invalid_url';
          errorTitle = 'Invalid or Unsupported Link';
        }

        setError({
          type: errorType,
          title: errorTitle,
          message: serverErrorMsg,
          statusCode: response.status,
          canRetry: true,
        });
        setIsLoading(false);
        return;
      }

      // Parse success response
      const data = await response.json();

      const platform = detectPlatform(linkToFetch);
      const isPlaylist = data.type === 'playlist';

      const parsedInfo: VideoInfo = {
        type: data.type || (data.entries && data.entries.length > 0 ? 'playlist' : 'video'),
        title: data.title || (isPlaylist ? 'Untitled Playlist' : 'Untitled Video'),
        thumbnail: data.thumbnail || '',
        duration: typeof data.duration === 'number' ? data.duration : parseFloat(data.duration) || 0,
        formats: Array.isArray(data.formats) ? data.formats : [],
        platform: platform,
        originalUrl: linkToFetch,
        fetchedAt: Date.now(),
        count: data.count,
        total: data.total,
        totalVideos: data.totalVideos,
        countText: data.countText,
        entries: Array.isArray(data.entries) ? data.entries : [],
      };

      setVideoInfo(parsedInfo);

      // Add to last 5 history items
      const countLabel = isPlaylist ? formatPlaylistCount(parsedInfo) : undefined;
      saveHistoryItem({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        url: linkToFetch,
        title: parsedInfo.title,
        thumbnail: parsedInfo.thumbnail,
        duration: parsedInfo.duration,
        platform: platform,
        timestamp: Date.now(),
        type: parsedInfo.type,
        countText: countLabel,
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === 'AbortError') {
        setError({
          type: 'network',
          title: 'Request Timed Out',
          message:
            'The request took over 60 seconds. Free cloud instances (Render) sleep when idle and may take up to a minute to boot up. Please click Retry below to try again.',
          canRetry: true,
        });
      } else {
        setError({
          type: 'network',
          title: 'Network Error',
          message:
            'Failed to connect to the LinkSaver service. Please check your network connection or verify that the backend server is reachable.',
          canRetry: true,
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  // Trigger normal browser download without JavaScript fetch
  const handleDownload = (format: FormatOption, isPlaylistZip = false) => {
    // 1. Locked qualities: Do not trigger any download for locked items
    if (format.locked) {
      return;
    }

    if (!format.downloadUrl) return;

    // 3. Long waits message:
    // For ZIP (playlist) downloads: "Preparing your playlist. This can take several minutes, please keep this page open."
    // Otherwise: "Preparing your file. Please keep this page open."
    const isZip = Boolean(
      isPlaylistZip ||
      format.ext?.toLowerCase() === 'zip' ||
      (format.label && format.label.toLowerCase().includes('zip'))
    );
    const message = isZip
      ? 'Preparing your playlist. This can take several minutes, please keep this page open.'
      : 'Preparing your file. Please keep this page open.';

    setToastMessage(message);
    setToastFormatLabel(format.label || format.ext || '');
    setIsToastPlaylist(isZip);
    setShowToast(true);

    // Trigger normal browser download
    const anchor = document.createElement('a');
    anchor.href = format.downloadUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.setAttribute('download', '');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setUrl(item.url);
    handleFetchVideo(item.url);
  };

  const handleReset = () => {
    setUrl('');
    setVideoInfo(null);
    setError(null);
    setValidationError(null);
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col justify-between relative overflow-x-hidden">
      {/* Electric Blue Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[300px] bg-blue-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 left-0 w-[350px] h-[250px] bg-cyan-600/10 blur-[130px] pointer-events-none -z-10" />

      {/* Main Content Area */}
      <main className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6 flex-1 flex flex-col justify-start">
        {/* Header */}
        <Header />

        {/* Supported Platforms Badges (YouTube, TikTok, Instagram, Facebook, X and many more sites) */}
        <PlatformChips activePlatform={activePlatform} />

        {/* Big Rounded Input Card */}
        <InputCard
          url={url}
          setUrl={setUrl}
          onSubmit={() => {
            if (validateInput()) {
              handleFetchVideo();
            }
          }}
          isLoading={isLoading}
          activePlatform={activePlatform}
          validationError={validationError}
          onClearValidationError={() => setValidationError(null)}
        />

        {/* Loading State */}
        {isLoading && <LoadingCard onCancel={handleCancelRequest} />}

        {/* Error State with Retry Button */}
        {error && !isLoading && (
          <ErrorCard
            error={error}
            onRetry={() => handleFetchVideo()}
            onClear={() => {
              setError(null);
              setValidationError(null);
            }}
          />
        )}

        {/* Result Card: Video or Playlist */}
        {videoInfo && !isLoading && !error && (
          videoInfo.type === 'playlist' ? (
            <PlaylistCard
              playlist={videoInfo}
              onDownloadZip={(fmt) => handleDownload(fmt, true)}
              onFetchSingleVideo={(entryUrl) => handleFetchVideo(entryUrl)}
              onReset={handleReset}
              isFetchingSingle={isLoading}
            />
          ) : (
            <ResultCard
              video={videoInfo}
              onDownload={(fmt) => handleDownload(fmt, false)}
              onReset={handleReset}
            />
          )
        )}

        {/* Download History (Last 5 Links) */}
        {!isLoading && (
          <HistoryCard
            history={history}
            onSelect={handleSelectHistory}
            onClear={clearHistory}
            onRemoveItem={removeHistoryItem}
          />
        )}
      </main>

      {/* Footer with required copyright & terms notice */}
      <Footer />

      {/* Download Preparing Toast with long waits messaging */}
      <PreparingToast
        isVisible={showToast}
        message={toastMessage}
        onDismiss={() => setShowToast(false)}
        isPlaylist={isToastPlaylist}
        formatLabel={toastFormatLabel}
      />
    </div>
  );
}
