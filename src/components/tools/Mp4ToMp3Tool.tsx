import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Music,
  FileVideo,
  AlertTriangle,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Loader2,
  Volume2,
} from 'lucide-react';
import { fetchFile } from '@ffmpeg/util';
import { getFFmpeg } from './ffmpegHelper.ts';

type Bitrate = '128' | '192' | '320';

export const Mp4ToMp3Tool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState<Bitrate>('192');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const outputUrlRef = useRef<string | null>(null);

  // Keep outputUrlRef in sync for cleanup
  useEffect(() => {
    outputUrlRef.current = outputUrl;
  }, [outputUrl]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (outputUrlRef.current) {
        URL.revokeObjectURL(outputUrlRef.current);
      }
    };
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setOutputUrl(null);
    setProgress(0);
    setStatusText('');
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.type.startsWith('video/') || dropped.name.match(/\.(mp4|mov|avi|mkv|webm|m4v|flv)$/i)) {
        handleFileSelect(dropped);
      } else {
        setError('Please select a valid video file (MP4, MOV, MKV, WebM, etc.).');
      }
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setProgress(0);
    setError(null);
    setStatusText('Preparing conversion engine...');

    let ffmpegInstance: any = null;
    const inputExt = file.name.split('.').pop() || 'mp4';
    const inputName = `input_${Date.now()}.${inputExt}`;
    const outputName = `output_${Date.now()}.mp3`;

    try {
      ffmpegInstance = await getFFmpeg((msg) => {
        // Debug logging if needed
      });

      setStatusText('Reading video file...');
      const fileData = await fetchFile(file);
      await ffmpegInstance.writeFile(inputName, fileData);

      setStatusText('Extracting MP3 audio...');

      const progressHandler = ({ progress: p }: { progress: number }) => {
        const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
        setProgress(pct);
        if (pct < 100) {
          setStatusText(`Converting audio... ${pct}%`);
        } else {
          setStatusText('Finalizing audio file...');
        }
      };

      ffmpegInstance.on('progress', progressHandler);

      // Command: -i input -vn -acodec libmp3lame -b:a <bitrate>k output.mp3
      const execResult = await ffmpegInstance.exec([
        '-i',
        inputName,
        '-vn',
        '-acodec',
        'libmp3lame',
        '-b:a',
        `${bitrate}k`,
        outputName,
      ]);

      ffmpegInstance.off('progress', progressHandler);

      if (execResult !== 0) {
        throw new Error(`FFmpeg failed with exit code ${execResult}`);
      }

      const rawData = await ffmpegInstance.readFile(outputName);
      const audioBlob = new Blob([rawData], { type: 'audio/mp3' });
      const url = URL.createObjectURL(audioBlob);

      setOutputUrl(url);
      setOutputSize(audioBlob.size);
      setProgress(100);
      setStatusText('Complete!');

      // Clean up in-memory virtual files
      try {
        await ffmpegInstance.deleteFile(inputName);
        await ffmpegInstance.deleteFile(outputName);
      } catch {
        // Ignore file cleanup errors
      }
    } catch (err: any) {
      console.error('MP4 to MP3 error:', err);
      setError(
        err?.message?.includes('SharedArrayBuffer')
          ? 'Browser security settings prevented audio extraction. Please try in Chrome or Edge.'
          : 'Failed to convert video. The format or codec may be unsupported. Please try another file.'
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }
    setOutputUrl(null);
    setOutputSize(null);
    setFile(null);
    setProgress(0);
    setStatusText('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isLargeFile = file && file.size > 200 * 1024 * 1024;
  const originalBaseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'audio';

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      {/* Tool Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A3CFF]/15 border border-[#7A3CFF]/30 text-[#00C2FF] text-xs font-semibold mb-3">
          <Music className="w-3.5 h-3.5" />
          <span>Client-Side Fast Audio Extractor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          MP4 to <span className="brand-gradient-text">MP3 Converter</span>
        </h1>
        <p className="text-sm text-[#8A97B8] mt-2 max-w-lg mx-auto">
          Extract high-fidelity MP3 audio directly in your browser. Runs locally on your device with no server upload.
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="glass-card rounded-2xl p-5 sm:p-7 border border-[#1B2742] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* State 1: File Selection */}
        {!file && (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
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
                accept="video/*,.mp4,.mov,.mkv,.webm,.m4v"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <div className="w-16 h-16 rounded-2xl brand-gradient-bg flex items-center justify-center text-white shadow-lg mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-[#E8EEFF]">
                Choose a video file or drag it here
              </p>
              <p className="text-xs sm:text-sm text-[#8A97B8] mt-1.5 max-w-sm">
                Supports MP4, MOV, MKV, WebM, and other video formats.
              </p>
              <button
                type="button"
                className="mt-5 px-5 py-2.5 rounded-full brand-gradient-bg text-white font-semibold text-xs sm:text-sm shadow-md hover-lift pointer-events-none"
              >
                Choose video file
              </button>
            </div>
          </div>
        )}

        {/* State 2: File Loaded / Conversion Screen */}
        {file && !outputUrl && (
          <div className="space-y-6">
            {/* Selected File Card */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#070B16] border border-[#1B2742]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-[#7A3CFF]/20 border border-[#7A3CFF]/40 flex items-center justify-center text-[#00C2FF] flex-shrink-0">
                  <FileVideo className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#E8EEFF] truncate">{file.name}</p>
                  <p className="text-xs text-[#8A97B8]">{formatFileSize(file.size)}</p>
                </div>
              </div>
              {!isConverting && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-[#8A97B8] hover:text-[#FF4D4D] transition-colors px-2 py-1"
                >
                  Change
                </button>
              )}
            </div>

            {/* Warning if over 200MB */}
            {isLargeFile && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Large file detected ({formatFileSize(file.size)})</p>
                  <p className="text-[#F59E0B]/80 mt-0.5">
                    Large files may be slow on phones. Processing happens entirely on your device.
                  </p>
                </div>
              </div>
            )}

            {/* Bitrate Selector */}
            {!isConverting && (
              <div>
                <label className="block text-xs font-semibold text-[#8A97B8] uppercase tracking-wider mb-2">
                  Select Audio Bitrate
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['128', '192', '320'] as Bitrate[]).map((rate) => {
                    const isSelected = bitrate === rate;
                    return (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setBitrate(rate)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-[#00C2FF] bg-[#00C2FF]/15 text-white shadow-[0_0_15px_rgba(0,194,255,0.25)]'
                            : 'border-[#1B2742] bg-[#070B16] text-[#8A97B8] hover:border-[#3B82F6]/50 hover:text-white'
                        }`}
                      >
                        <div className="text-sm font-bold">{rate} kbps</div>
                        <div className="text-[10px] text-[#8A97B8] mt-0.5">
                          {rate === '128' ? 'Standard' : rate === '192' ? 'High Quality' : 'Ultra Quality'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Progress Bar (during conversion) */}
            {isConverting && (
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
                  <button
                    type="button"
                    onClick={handleConvert}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-white font-semibold text-xs transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Convert Button */}
            {!isConverting && (
              <button
                type="button"
                onClick={handleConvert}
                className="w-full py-3.5 px-6 rounded-xl brand-gradient-bg text-white font-bold text-sm sm:text-base shadow-[0_4px_25px_rgba(122,60,255,0.35)] hover:shadow-[0_6px_30px_rgba(0,194,255,0.45)] hover-lift transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Convert to MP3</span>
              </button>
            )}
          </div>
        )}

        {/* State 3: Conversion Complete */}
        {outputUrl && (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] mx-auto flex items-center justify-center">
              <Check className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Audio Extracted Successfully!</h3>
              <p className="text-xs sm:text-sm text-[#8A97B8] mt-1">
                {originalBaseName}.mp3 ({outputSize ? formatFileSize(outputSize) : ''} · {bitrate} kbps)
              </p>
            </div>

            {/* Audio Preview Player */}
            <div className="p-3 sm:p-4 rounded-xl bg-[#070B16] border border-[#1B2742]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8A97B8] mb-2 text-left">
                <Volume2 className="w-4 h-4 text-[#00C2FF]" />
                <span>Preview Audio</span>
              </div>
              <audio controls src={outputUrl} className="w-full" />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={outputUrl}
                download={`${originalBaseName}.mp3`}
                className="flex-1 py-3 px-5 rounded-xl brand-gradient-bg text-white font-bold text-sm shadow-[0_4px_20px_rgba(122,60,255,0.35)] hover-lift flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download MP3</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-5 rounded-xl bg-[#070B16] border border-[#1B2742] hover:border-[#8A97B8] text-[#8A97B8] hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Convert another</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Footnote */}
      <div className="text-center mt-6 text-xs text-[#8A97B8]">
        <span>100% Client-Side · Unlimited Conversions · Zero Data Saved to Server</span>
      </div>
    </div>
  );
};
