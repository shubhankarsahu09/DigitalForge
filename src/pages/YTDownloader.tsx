import { useState } from 'react';
import './YTDownloader.css';

export default function YTDownloader() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleDownload = (format: 'audio' | 'video') => {
    if (!url) {
      setStatus('error');
      setMessage('Please enter a valid YouTube URL');
      return;
    }

    // Basic YouTube URL validation
    const ytRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    if (!ytRegex.test(url)) {
      setStatus('error');
      setMessage('Invalid YouTube URL');
      return;
    }

    setStatus('loading');
    setMessage(`Starting ${format} download...`);
    setProgress(50); // Visual cue as browser handles actual progress

    try {
      // Direct to our new Node.js backend
      const backendUrl = `http://localhost:3001/download?url=${encodeURIComponent(url)}&format=${format}`;
      
      const a = document.createElement('a');
      a.href = backendUrl;
      a.download = ''; 
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStatus('success');
      setProgress(100);
      setMessage(`Download triggered! Check your browser downloads.`);

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
        setProgress(0);
        setUrl('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to trigger download');
    }
  };

  return (
    <div className="ytdownloader-app pt-24 min-h-screen relative z-10">
      {/* Background Video/Animation mimicking FrameWeaver */}
      <div className="video-bg-container">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="app-container mx-auto max-w-4xl px-4 relative z-10">
        <header className="header text-center mb-12">
          <h1 className="title text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            YT Nexus Downloader
          </h1>
          <p className="subtitle text-xl text-gray-300">
            Extract high-quality audio or video instantly.
          </p>
        </header>

        <main className="main-content bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="input-group mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </div>
              <input
                type="text"
                className="url-input w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg"
                placeholder="Paste YouTube Video URL here..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                disabled={status === 'loading'}
              />
            </div>
          </div>

          <div className="actions-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button 
              className="download-btn audio-btn group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleDownload('audio')}
              disabled={status === 'loading'}
            >
              <div className="relative flex items-center justify-center gap-3 bg-black/50 backdrop-blur-sm rounded-xl py-4 px-6 transition-all group-hover:bg-black/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span className="text-white font-semibold text-lg tracking-wide">Download Audio (MP3)</span>
              </div>
            </button>

            <button 
              className="download-btn video-btn group relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-600 to-rose-700 p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => handleDownload('video')}
              disabled={status === 'loading'}
            >
              <div className="relative flex items-center justify-center gap-3 bg-black/50 backdrop-blur-sm rounded-xl py-4 px-6 transition-all group-hover:bg-black/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-white font-semibold text-lg tracking-wide">Download Video (MP4)</span>
              </div>
            </button>
          </div>

          {(status !== 'idle') && (
            <div className={`status-container p-6 rounded-xl border ${
              status === 'error' ? 'bg-red-500/10 border-red-500/30' : 
              status === 'success' ? 'bg-green-500/10 border-green-500/30' : 
              'bg-purple-500/10 border-purple-500/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-medium ${
                  status === 'error' ? 'text-red-400' : 
                  status === 'success' ? 'text-green-400' : 
                  'text-purple-300'
                }`}>
                  {message}
                </span>
                {status === 'loading' && (
                  <span className="text-purple-300 font-mono">{progress}%</span>
                )}
              </div>

              {status === 'loading' && (
                <div className="progress-track w-full bg-black/40 rounded-full h-2 mt-4 overflow-hidden">
                  <div 
                    className="progress-fill bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
