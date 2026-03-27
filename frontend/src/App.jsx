import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import {
  Download, RefreshCw, Image as ImageIcon, Loader2,
  AlertCircle, CheckCircle2, Sparkles, Zap, X,
  UploadCloud, FileImage
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// ─────────────────────────────────────────────
//  ImageCard
// ─────────────────────────────────────────────
function ImageCard({ result, index }) {
  const [expanded, setExpanded] = useState(false);
  const { originalName, description, previewUrl, error, timestamp } = result;

  return (
    <div
      className="card group flex flex-col animate-scale-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-gray-800 aspect-video shrink-0">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={originalName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <ImageIcon size={40} strokeWidth={1} />
          </div>
        )}
        {/* Status badge */}
        <div className={`absolute top-2 right-2 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-md ${
          error
            ? 'bg-red-500/30 text-red-300 border border-red-500/40'
            : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
        }`}>
          {error ? <AlertCircle size={10} /> : <CheckCircle2 size={10} />}
          {error ? 'Error' : 'Analyzed'}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow gap-3">
        <p className="font-semibold text-gray-100 truncate text-sm" title={originalName}>
          {originalName}
        </p>

        {/* Description */}
        <div
          className={`relative text-xs text-gray-300 leading-relaxed bg-gray-800/60 rounded-xl p-3 border-l-2 cursor-pointer select-none transition-all ${
            error ? 'border-red-500/60 text-red-300' : 'border-emerald-500/50'
          }`}
          onClick={() => setExpanded(e => !e)}
        >
          <p className={expanded ? '' : 'line-clamp-4'}>{description}</p>
          {description && description.length > 200 && (
            <span className="text-emerald-400 mt-1 block text-[10px]">
              {expanded ? 'Show less ▲' : 'Read more ▼'}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto text-[10px] text-gray-500">
          <span>{timestamp ? new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Just now'}</span>
          {!error && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles size={9} /> AI Generated
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  UploadZone
// ─────────────────────────────────────────────
function UploadZone({ onFilesAccepted, isProcessing }) {
  const onDrop = useCallback(files => {
    if (files.length > 0) onFilesAccepted(files);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/jpg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 100,
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative rounded-2xl border-2 border-dashed p-12 flex flex-col items-center justify-center min-h-64 cursor-pointer transition-all duration-300 group select-none
        ${isDragActive && !isDragReject ? 'border-emerald-500 bg-emerald-500/5 glow-emerald' : ''}
        ${isDragReject ? 'border-red-500 bg-red-500/5' : ''}
        ${!isDragActive && !isDragReject ? 'border-gray-700 hover:border-gray-500 bg-gray-900/50 hover:bg-gray-800/50' : ''}
        ${isProcessing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />

      {/* Animated orb background */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 transition-opacity duration-500 pointer-events-none ${isDragActive ? 'opacity-100' : 'group-hover:opacity-100'}`} />

      <div className={`relative p-5 rounded-2xl mb-5 transition-all duration-300 ${
        isDragActive ? 'bg-emerald-500/20 scale-110' : 'bg-gray-800 group-hover:bg-gray-700'
      }`}>
        <UploadCloud
          size={40}
          strokeWidth={1.5}
          className={`transition-colors duration-300 ${isDragActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-emerald-400'}`}
        />
      </div>

      <h3 className="text-lg font-bold text-gray-100 mb-2 text-center">
        {isDragActive && !isDragReject ? 'Release to upload' : isDragReject ? 'Unsupported file type' : 'Drop images here'}
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-xs mb-6">
        {isDragReject
          ? 'Only JPG, PNG, and WEBP files are accepted'
          : 'Supports JPG · PNG · WEBP · Up to 100 images at once'}
      </p>

      <button
        type="button"
        className="btn-primary pointer-events-none"
        tabIndex={-1}
      >
        <FileImage size={16} />
        Browse Files
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  ProgressBar
// ─────────────────────────────────────────────
function ProgressBar({ progress, fileCount }) {
  return (
    <div className="glass rounded-2xl p-5 animate-fade-up">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Loader2 size={15} className="animate-spin text-emerald-400" />
          <span>Analyzing {fileCount} image{fileCount !== 1 ? 's' : ''} with Gemini AI…</span>
        </div>
        <span className="text-sm font-bold text-emerald-400 tabular-nums">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">This may take a moment depending on image size</p>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Main App
// ─────────────────────────────────────────────
export default function App() {
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load past results from DB on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/images`);
      if (data.success) setResults(data.results);
    } catch (err) {
      console.error('Could not load history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files) => {
    if (!files.length) return;
    setIsProcessing(true);
    setFileCount(files.length);
    setProgress(5);
    setError(null);

    // Fake incremental progress (AI takes variable time)
    const ticker = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 4 + 1, 88));
    }, 900);

    const formData = new FormData();
    files.forEach(f => formData.append('images', f));

    try {
      const { data } = await axios.post(`${API}/images/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearInterval(ticker);
      setProgress(100);

      if (data.success) {
        setResults(prev => [...data.results, ...prev]);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors: ['#10b981', '#34d399', '#6ee7b7', '#ffffff'] });
      }
    } catch (err) {
      clearInterval(ticker);
      setProgress(0);
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 2500);
    }
  };

  const downloadExcel = async () => {
    try {
      const res = await axios.get(`${API}/images/export/excel`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai_image_analysis.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Export failed. Make sure you have analyzed some images first.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* ── Background noise/gradient ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 border-b border-gray-800/80 sticky top-0 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Zap size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">AI Image Analyzer</h1>
              <p className="text-[10px] text-gray-500 leading-none mt-0.5">Powered by Gemini Vision</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchHistory}
              disabled={loading || isProcessing}
              className="btn-ghost text-sm"
              title="Refresh results"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={downloadExcel}
              disabled={results.length === 0}
              className="btn-primary text-sm"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero / Upload section ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto mb-14 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
            Understand your images<br />
            <span className="text-gradient">with AI in seconds</span>
          </h2>
          <p className="text-center text-gray-400 text-base max-w-xl mx-auto mb-8">
            Upload up to 100 images at once. Our Gemini Vision AI generates accurate descriptions — export them all to Excel with one click.
          </p>

          {/* Upload zone */}
          <UploadZone onFilesAccepted={handleUpload} isProcessing={isProcessing} />

          {/* Progress */}
          <div className={`mt-5 transition-all duration-500 ${isProcessing || progress > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <ProgressBar progress={progress} fileCount={fileCount} />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-fade-up">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto shrink-0 text-red-400/60 hover:text-red-400">
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ── Results ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-100 flex items-center gap-3">
              Analysis History
              <span className="text-sm px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-400 font-normal tabular-nums">
                {results.length}
              </span>
            </h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-600">
              <Loader2 size={36} className="animate-spin mb-4 text-emerald-500/40" />
              <p className="text-sm">Loading your analyses…</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {results.map((r, i) => (
                <ImageCard key={r.id || `tmp-${i}`} result={r} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-gray-800 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4 text-gray-600">
                <ImageIcon size={28} strokeWidth={1} />
              </div>
              <h4 className="font-semibold text-gray-300 mb-2">No analyses yet</h4>
              <p className="text-sm text-gray-600 max-w-xs">
                Upload some images above and Gemini AI will describe each one for you.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-gray-800/60 mt-20 py-6 text-center text-xs text-gray-600">
        AI Image Analyzer · Powered by Gemini Vision &amp; React · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
