/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar, LOGO_URL } from './components/Navbar.tsx';
import { InputBar } from './components/InputBar.tsx';
import { SkeletonCard } from './components/SkeletonCard.tsx';
import { ResultCard } from './components/ResultCard.tsx';
import { PlaylistCard } from './components/PlaylistCard.tsx';
import { ErrorCard } from './components/ErrorCard.tsx';
import { SupportedSites } from './components/SupportedSites.tsx';
import { AllTools } from './components/AllTools.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { StatsRow } from './components/StatsRow.tsx';
import { TrustChips } from './components/TrustChips.tsx';
import { HistoryCard } from './components/HistoryCard.tsx';
import { Footer } from './components/Footer.tsx';
import { LegalModal } from './components/LegalModal.tsx';
import { PreparingToast } from './components/PreparingToast.tsx';
import { VideoInfo, FormatOption, HistoryItem, ErrorState } from './types.ts';
import { isValidUrl, detectPlatform, formatPlaylistCount } from './utils/helpers.ts';
import { SITE_CONFIGS, validateUrlForSite, SiteConfig } from './utils/siteConfigs.ts';
import { Sparkles, ArrowLeft } from 'lucide-react';

// =========================================================================
// BACKEND CONFIGURATION
// >>> KEEP EXISTING API_BASE_URL EXACTLY AS IT IS <<<
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
  const [mismatchSiteError, setMismatchSiteError] = useState<{ message: string; onGoHome: () => void } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Hash-based routing state
  const [currentSlug, setCurrentSlug] = useState<string>('');
  const currentSiteConfig: SiteConfig | undefined = SITE_CONFIGS[currentSlug];

  // Legal modal state
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastFormatLabel, setToastFormatLabel] = useState('');
  const [isToastPlaylist, setIsToastPlaylist] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync hash routing and update document title and meta description
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '';
      let slug = '';
      if (hash.startsWith('#/')) {
        slug = hash.slice(2).trim().toLowerCase();
      }
      setCurrentSlug(slug);
      setMismatchSiteError(null);
      setValidationError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Update page title and meta description
      const config = SITE_CONFIGS[slug];
      if (config) {
        document.title = `FavouraFetch - ${config.headingPrefix}`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', config.metaDescription);
      } else {
        document.title = 'FavouraFetch - Paste. Pick. Fetch. | Video Downloader';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute(
            'content',
            'FavouraFetch: Paste a link, pick a quality, save it. Download videos from any link.'
          );
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  const navigateTo = (slug: string) => {
    window.location.hash = slug ? `#/${slug}` : '#/';
  };

  const scrollToInput = () => {
    const el = document.getElementById('video-input-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = el.querySelector('input');
      if (input) input.focus();
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Validate the link before sending
  const validateInput = (): boolean => {
    setValidationError(null);
    setMismatchSiteError(null);
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

    // Domain validation on dedicated site pages
    if (currentSiteConfig) {
      const isAllowed = validateUrlForSite(linkToFetch, currentSiteConfig);
      if (!isAllowed) {
        setMismatchSiteError({
          message: `This page only accepts ${currentSiteConfig.name} links. Use the home page for other sites.`,
          onGoHome: () => {
            setMismatchSiteError(null);
            navigateTo('');
          },
        });
        return; // Do NOT call backend!
      }
    }

    setValidationError(null);
    setMismatchSiteError(null);
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
        uploader: data.uploader || '',
        site: data.site || currentSiteConfig?.name || '',
        embedUrl: data.embedUrl || '',
        previewUrl: data.previewUrl || '',
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

      // Add to history
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
            'The request took over 60 seconds. Free cloud instances sleep when idle and may take a moment to wake up. Please click Retry below to try again.',
          canRetry: true,
        });
      } else {
        setError({
          type: 'network',
          title: 'Network Error',
          message:
            'Failed to connect to the FavouraFetch service. Please check your internet connection or verify that the server is reachable.',
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
    scrollToInput();
    handleFetchVideo(item.url);
  };

  const handleReset = () => {
    setUrl('');
    setVideoInfo(null);
    setError(null);
    setValidationError(null);
    setMismatchSiteError(null);
    scrollToInput();
  };

  return (
    <div className="min-h-screen bg-[#070B16] text-[#E8EEFF] flex flex-col justify-between relative overflow-x-hidden selection:bg-[#7A3CFF] selection:text-white">
      {/* Soft Design System Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[650px] h-[340px] bg-[#7A3CFF]/15 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-0 w-[500px] h-[350px] bg-[#00C2FF]/10 blur-[160px] pointer-events-none -z-10" />

      {/* 1. Floating Pill Navbar */}
      <Navbar
        onScrollToInput={scrollToInput}
        onScrollToSection={scrollToSection}
      />

      {/* 2. Hero with Link Input and Results Area */}
      <main className="w-full max-w-4xl mx-auto px-4 pt-6 sm:pt-10 flex-1 flex flex-col justify-start">
        {/* Hero Header */}
        <div className="text-center mb-6 sm:mb-8">
          {/* Back to all sites link when on a dedicated site page */}
          {currentSiteConfig ? (
            <div className="flex justify-center mb-3">
              <button
                type="button"
                onClick={() => navigateTo('')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A97B8] hover:text-[#00C2FF] transition-colors py-1 px-3.5 rounded-full bg-[#0E1526] border border-[#1B2742] cursor-pointer hover-lift shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span>Back to all sites</span>
              </button>
            </div>
          ) : (
            /* Tagline Badge for Home Page */
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1526] border border-[#1B2742] text-xs font-semibold text-[#00C2FF] uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#7A3CFF]" />
              <span>Paste. Pick. Fetch.</span>
            </div>
          )}

          {/* Heading */}
          {currentSiteConfig ? (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
              Download{' '}
              <span style={{ color: currentSiteConfig.color }}>
                {currentSiteConfig.name}
              </span>{' '}
              videos
            </h1>
          ) : (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
              Download videos from <span className="brand-gradient-text">any link</span>
            </h1>
          )}

          {/* Hero Support Line */}
          <p className="text-sm sm:text-base text-[#8A97B8] max-w-md mx-auto mt-3 leading-relaxed">
            {currentSiteConfig
              ? `Fast, free ${currentSiteConfig.name} video downloader in high resolution MP4 & MP3.`
              : 'Paste a link, pick a quality, save it.'}
          </p>
        </div>

        {/* Input Bar with custom placeholder and site mismatch error */}
        <InputBar
          url={url}
          setUrl={setUrl}
          onSubmit={() => {
            if (validateInput()) {
              handleFetchVideo();
            }
          }}
          onScrollToHowItWorks={() => scrollToSection('how-it-works')}
          isLoading={isLoading}
          placeholder={currentSiteConfig ? currentSiteConfig.placeholder : 'Paste a video link'}
          validationError={validationError}
          onClearValidationError={() => {
            setValidationError(null);
            setMismatchSiteError(null);
          }}
          mismatchSiteError={mismatchSiteError}
        />

        {/* Results Area */}
        {/* Loading State: Skeleton loading card while waiting */}
        {isLoading && <SkeletonCard onCancel={handleCancelRequest} />}

        {/* Error State with Try again and Change link */}
        {error && !isLoading && (
          <ErrorCard
            error={error}
            onRetry={() => handleFetchVideo()}
            onClear={handleReset}
          />
        )}

        {/* Result Card: Video Preview or Playlist */}
        {videoInfo && !isLoading && !error && (
          videoInfo.type === 'playlist' ? (
            <PlaylistCard
              playlist={videoInfo}
              onDownloadZip={(fmt) => handleDownload(fmt, true)}
              onFetchSingleVideo={(entryUrl) => handleFetchVideo(entryUrl)}
              onChangeLink={handleReset}
              isFetchingSingle={isLoading}
            />
          ) : (
            <ResultCard
              video={videoInfo}
              onDownload={(fmt) => handleDownload(fmt, false)}
              onChangeLink={handleReset}
            />
          )
        )}

        {/* 3. Supported Sites Section with active site highlighted & navigation */}
        <SupportedSites
          activeSiteSlug={currentSlug}
          onNavigate={(slug) => navigateTo(slug)}
        />

        {/* 4. All Tools Section */}
        <AllTools onSelectActiveTool={scrollToInput} />

        {/* 5. How to Download Section */}
        <HowItWorks />

        {/* 6. Stats Row Section */}
        <StatsRow />

        {/* 7. Trust Chips Section */}
        <TrustChips />

        {/* 8. Recent Links Section */}
        <HistoryCard
          history={history}
          onSelect={handleSelectHistory}
          onClear={clearHistory}
          onRemoveItem={removeHistoryItem}
        />
      </main>

      {/* 9. Footer */}
      <Footer onOpenLegal={(type) => setLegalModalType(type)} />

      {/* Legal Pages Modal (Terms & Privacy) */}
      <LegalModal
        isOpen={Boolean(legalModalType)}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

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
