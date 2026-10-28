import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  FileVideo,
  Play,
  RotateCcw,
  Download,
  Loader2,
  AlertTriangle,
  Clock,
  Maximize2,
  Film,
} from 'lucide-react';
import { fetchFile } from '@ffmpeg/util';
import { getFFmpeg } from './ffmpegHelper.ts';

type GifWidth = 320 | 480 | 640;
type GifFps = 8 | 12 | 15;

export const Mp4ToGifTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // Settings
  const [startTime, setStartTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(5);
  const [width, setWidth] = useState<GifWidth>(480);
  const [fps, setFps] = useState<GifFps>(12);

  // Conversion state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoPreviewUrlRef = useRef<string | null>(null);
  const gifUrlRef = useRef<string | null>(null);

  useEffect(() => {
    videoPreviewUrlRef.current = videoPreviewUrl;
  }, [videoPreviewUrl]);

  useEffect(() => {
    gifUrlRef.current = gifUrl;
  }, [gifUrl]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (videoPreviewUrlRef.current) URL.revokeObjectURL(videoPreviewUrlRef.current);
      if (gifUrlRef.current) URL.revokeObjectURL(gifUrlRef.current);
    };
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    // Revoke previous URLs
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (gifUrl) URL.revokeObjectURL(gifUrl);

    setError(null);
    setGifUrl(null);
    setProgress(0);
    setStatusText('');
    setStartTime(0);

    const prevUrl = URL.createObjectURL(selectedFile);
    setVideoPreviewUrl(prevUrl);
    setFile(selectedFile);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = Math.floor(videoRef.current.duration) || 0;
      setVideoDuration(dur);
      setDuration(Math.min(5, Math.max(1, dur)));
    }
  };

  const handleMakeGif = async () => {
    if (!file) return;

    // Validate duration capped at 15 seconds
    const safeDuration = Math.min(15, Math.max(0.5, duration));
    const safeStartTime = Math.max(0, startTime);

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setStatusText('Preparing conversion engine...');

    let ffmpegInstance: any = null;
    const inputExt = file.name.split('.').pop() || 'mp4';
    const inputName = `input_${Date.now()}.${inputExt}`;
    const outputName = `output_${Date.now()}.gif`;

    try {
      ffmpegInstance = await getFFmpeg();

      setStatusText('Reading video stream...');
      const fileData = await fetchFile(file);
      await ffmpegInstance.writeFile(inputName, fileData);

      setStatusText('Generating optimized palette...');

      const progressHandler = ({ progress: p }: { progress: number }) => {
        const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
        setProgress(pct);
        if (pct < 100) {
          setStatusText(`Rendering GIF... ${pct}%`);
        } else {
          setStatusText('Finalizing GIF...');
        }
      };

      ffmpegInstance.on('progress', progressHandler);

      // Two-pass palette method for quality:
      // -vf "fps=<fps>,scale=<width>:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse"
      const filter = `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;

      const execResult = await ffmpegInstance.exec([
        '-ss',
        safeStartTime.toString(),
        '-t',
        safeDuration.toString(),
        '-i',
        inputName,
        '-vf',
        filter,
        outputName,
      ]);

      ffmpegInstance.off('progress', progressHandler);

      if (execResult !== 0) {
        throw new Error(`FFmpeg error with code ${execResult}`);
      }

      const rawData = await ffmpegInstance.readFile(outputName);
      const gifBlob = new Blob([rawData], { type: 'image/gif' });
      const url = URL.createObjectURL(gifBlob);

      setGifUrl(url);
      setGifSize(gifBlob.size);
      setProgress(100);
      setStatusText('Complete!');

      // Clean up virtual files
      try {
        await ffmpegInstance.deleteFile(inputName);
        await ffmpegInstance.deleteFile(outputName);
      } catch {
        // Ignore
      }
    } catch (err: any) {
      setError('Failed to generate GIF. Please try a shorter duration or smaller dimensions.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (gifUrl) URL.revokeObjectURL(gifUrl);

    setVideoPreviewUrl(null);
    setGifUrl(null);
    setGifSize(null);
    setFile(null);
    setProgress(0);
    setStatusText('');
    setError(null);
    setStartTime(0);
    setDuration(5);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const originalBaseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'clip';

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A3CFF]/15 border border-[#7A3CFF]/30 text-[#00C2FF] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Quality Two-Pass Palette Maker</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          MP4 to <span className="brand-gradient-text">GIF Maker</span>
        </h1>
        <p className="text-sm text-[#8A97B8] mt-2 max-w-lg mx-auto">
          Turn your video clip into an animated GIF right in your browser. Trim, resize, and optimize without limits.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-5 sm:p-7 border border-[#1B2742] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Step 1: Upload */}
        {!file && (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                isDragOver
                  ? 'border-[#00C2FF] bg-[#00C2FF]/10 scale-[1.01]'
                  : 'border-[#1B2742] hover:border-[#3B82F6]/60 hover:bg-[#0E1526]/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,.mp4,.mov,.webm,.mkv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                }}
              />
              <div className="w-16 h-16 rounded-2xl brand-gradient-bg flex items-center justify-center text-white shadow-lg mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-[#E8EEFF]">
                Select video to convert to GIF
              </p>
              <p className="text-xs sm:text-sm text-[#8A97B8] mt-1.5 max-w-sm">
                Drop your clip here or tap to browse
              </p>
              <button
                type="button"
                className="mt-5 px-5 py-2.5 rounded-full brand-gradient-bg text-white font-semibold text-xs sm:text-sm shadow-md pointer-events-none"
              >
                Choose video file
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Trim, Configure & Make GIF */}
        {file && !gifUrl && (
          <div className="space-y-6">
            {/* Video Preview */}
            {videoPreviewUrl && (
              <div className="rounded-xl overflow-hidden bg-black border border-[#1B2742] relative">
                <video
                  ref={videoRef}
                  src={videoPreviewUrl}
                  controls
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata}
                  className="w-full max-h-64 object-contain mx-auto"
                />
                <div className="p-2 bg-[#070B16] flex items-center justify-between text-xs text-[#8A97B8] border-t border-[#1B2742]">
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <span>Total duration: {videoDuration}s</span>
                </div>
              </div>
            )}

            {/* Trimming Controls: Start time & Duration (capped at 15s) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#070B16] border border-[#1B2742]">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#8A97B8] mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00C2FF]" />
                  <span>Start Time (seconds)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={Math.max(0, videoDuration - 0.5)}
                    step="0.5"
                    value={startTime}
                    disabled={isProcessing}
                    onChange={(e) => setStartTime(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#0E1526] border border-[#1B2742] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00C2FF]"
                  />
                  <span className="text-xs text-[#8A97B8]">sec</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070B16] border border-[#1B2742]">
                <label className="flex items-center justify-between text-xs font-semibold text-[#8A97B8] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#00C2FF]" />
                    <span>Duration (Max 15s)</span>
                  </span>
                  <span className="text-[11px] text-[#00C2FF] font-bold">{duration}s</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={duration}
                    disabled={isProcessing}
                    onChange={(e) => setDuration(Math.min(15, Math.max(1, parseFloat(e.target.value) || 1)))}
                    className="w-full accent-[#00C2FF] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Width Picker (320, 480, 640) */}
            <div>
              <label className="block text-xs font-semibold text-[#8A97B8] uppercase tracking-wider mb-2">
                GIF Width
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {([320, 480, 640] as GifWidth[]).map((w) => (
                  <button
                    key={w}
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setWidth(w)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                      width === w
                        ? 'border-[#00C2FF] bg-[#00C2FF]/15 text-white shadow-[0_0_15px_rgba(0,194,255,0.25)] font-bold'
                        : 'border-[#1B2742] bg-[#070B16] text-[#8A97B8] hover:border-[#3B82F6]/50 hover:text-white'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">{w}px</div>
                    <div className="text-[10px] text-[#8A97B8] mt-0.5">
                      {w === 320 ? 'Small (Light)' : w === 480 ? 'Standard' : 'HD (Crisp)'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* FPS Picker (8, 12, 15) */}
            <div>
              <label className="block text-xs font-semibold text-[#8A97B8] uppercase tracking-wider mb-2">
                Frame Rate (FPS)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {([8, 12, 15] as GifFps[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setFps(f)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      fps === f
                        ? 'border-[#00C2FF] bg-[#00C2FF]/15 text-white shadow-[0_0_15px_rgba(0,194,255,0.25)] font-bold'
                        : 'border-[#1B2742] bg-[#070B16] text-[#8A97B8] hover:border-[#3B82F6]/50 hover:text-white'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">{f} fps</div>
                    <div className="text-[10px] text-[#8A97B8]">
                      {f === 8 ? 'Smallest file' : f === 12 ? 'Balanced' : 'Smooth motion'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress indicator */}
            {isProcessing && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#8A97B8] flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00C2FF]" />
                    {statusText}
                  </span>
                  <span className="font-bold text-[#00C2FF]">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#070B16] overflow-hidden border border-[#1B2742]">
                  <div
                    className="h-full brand-gradient-bg transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Conversion Error</p>
                  <p className="mt-0.5 text-xs text-[#EF4444]/80">{error}</p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleMakeGif}
                className="flex-1 py-3.5 px-6 rounded-xl brand-gradient-bg text-white font-bold text-sm sm:text-base shadow-[0_4px_25px_rgba(122,60,255,0.35)] hover-lift transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>Make GIF</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleReset}
                className="py-3 px-4 rounded-xl bg-[#070B16] border border-[#1B2742] text-[#8A97B8] hover:text-white text-xs font-semibold transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Step 3: GIF Preview & Download */}
        {gifUrl && (
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-xl font-bold text-white">Your GIF is Ready!</h3>
              <p className="text-xs text-[#8A97B8] mt-1">
                {originalBaseName}.gif ({gifSize ? formatFileSize(gifSize) : ''} · {width}px · {fps}fps)
              </p>
            </div>

            {/* GIF Preview Image */}
            <div className="p-2 sm:p-3 rounded-2xl bg-[#070B16] border border-[#1B2742] inline-block max-w-full">
              <img
                src={gifUrl}
                alt="Generated GIF Preview"
                className="rounded-xl max-h-80 mx-auto object-contain shadow-lg"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={gifUrl}
                download={`${originalBaseName}.gif`}
                className="flex-1 py-3 px-5 rounded-xl brand-gradient-bg text-white font-bold text-sm shadow-[0_4px_20px_rgba(122,60,255,0.35)] hover-lift flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download GIF</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-5 rounded-xl bg-[#070B16] border border-[#1B2742] hover:border-[#8A97B8] text-[#8A97B8] hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Make another</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-6 text-xs text-[#8A97B8]">
        <span>High-quality lanczos palette optimization · Runs 100% locally on your device</span>
      </div>
    </div>
  );
};
