import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './YTDownloader.css';

export default function YTDownloader() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [videoDetails, setVideoDetails] = useState<{ title: string; thumbnail: string } | null>(null);

  const validateUrl = (testUrl: string) => {
    return /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(testUrl);
  };

  const simulateAnalysis = (callback: () => void) => {
    setStatus('analyzing');
    setMessage('Analyzing video stream...');
    setVideoDetails(null);
    
    // Simulate fetching metadata
    setTimeout(() => {
      setVideoDetails({
        title: 'Video details will appear here in production...',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop',
      });
      callback();
    }, 1500);
  };

  const handleDownload = (format: 'audio' | 'video' | 'thumbnail' | 'subtitle', quality?: string) => {
    if (!url || !validateUrl(url)) {
      setStatus('error');
      setMessage('Please enter a valid YouTube URL');
      return;
    }

    if (status !== 'idle' && status !== 'error' && status !== 'success' && format !== 'video') {
       // if we are already downloading, ignore
       return;
    }

    if (status === 'idle' || status === 'error' || status === 'success') {
      simulateAnalysis(() => triggerDownload(format, quality));
    } else {
       triggerDownload(format, quality);
    }
  };

  const triggerDownload = (format: string, quality?: string) => {
    setStatus('loading');
    setMessage(`Preparing ${format} download...`);
    setProgress(30);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 400);

    try {
      let backendUrl = `http://localhost:3001/download?url=${encodeURIComponent(url)}&format=${format}`;
      if (quality) {
        backendUrl += `&quality=${quality}`;
      }
      
      // Simulate slight delay before triggering actual download for UX
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = backendUrl;
        a.download = ''; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        clearInterval(progressInterval);
        setStatus('success');
        setProgress(100);
        setMessage(`${format.charAt(0).toUpperCase() + format.slice(1)} download started successfully!`);

        setTimeout(() => {
          setStatus('idle');
          setMessage('');
          setProgress(0);
          setVideoDetails(null);
        }, 4000);
      }, 1000);
      
    } catch (error) {
      clearInterval(progressInterval);
      setStatus('error');
      setMessage('Failed to trigger download');
    }
  };

  return (
    <div className="ytdownloader-app pt-24 min-h-screen relative z-10 flex flex-col items-center">
      <div className="video-bg-container">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
        <div className="ambient-glow"></div>
      </div>

      <div className="app-container w-full max-w-5xl px-4 relative z-10 flex-grow pb-20">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="header text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md">
            <span className="text-sm font-semibold text-purple-300 tracking-wider uppercase">Pro Tools</span>
          </div>
          <h1 className="title text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600 mb-6 drop-shadow-sm">
            YT Nexus Downloader
          </h1>
          <p className="subtitle text-xl text-gray-300 max-w-2xl mx-auto font-light">
            The ultimate extraction engine. Pull ultra high-quality audio, video, thumbnails, and subtitles instantly.
          </p>
        </motion.header>

        <motion.main 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="main-content bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-purple-900/20 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-50"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-40"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-40"></div>

          <div className="relative z-10">
            <div className="input-group mb-10">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                  <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="url-input w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg shadow-inner"
                  placeholder="Paste YouTube Video URL to begin..."
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  disabled={status === 'loading' || status === 'analyzing'}
                />
                
                <AnimatePresence>
                  {url && validateUrl(url) && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {videoDetails && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                >
                  <img src={videoDetails.thumbnail} alt="Thumbnail" className="w-32 h-20 object-cover rounded-xl shadow-lg" />
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-lg line-clamp-1">{videoDetails.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">Ready for extraction</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="actions-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <DownloadOption 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />}
                title="Audio"
                subtitle="MP3 / 320kbps"
                gradient="from-indigo-600 to-purple-600"
                onClick={() => handleDownload('audio')}
                disabled={status === 'loading' || status === 'analyzing'}
              />
              <DownloadOption 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />}
                title="Video"
                subtitle="MP4 / Up to 4K"
                gradient="from-pink-600 to-rose-600"
                onClick={() => {
                  if (!url || !validateUrl(url)) {
                    setStatus('error');
                    setMessage('Please enter a valid YouTube URL');
                    return;
                  }
                  setShowQualityModal(true);
                }}
                disabled={status === 'loading' || status === 'analyzing'}
              />
              <DownloadOption 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                title="Thumbnail"
                subtitle="Max Res JPEG"
                gradient="from-orange-500 to-amber-600"
                onClick={() => handleDownload('thumbnail')}
                disabled={status === 'loading' || status === 'analyzing'}
              />
              <DownloadOption 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />}
                title="Subtitles"
                subtitle="SRT / VTT"
                gradient="from-emerald-500 to-teal-600"
                onClick={() => handleDownload('subtitle')}
                disabled={status === 'loading' || status === 'analyzing'}
              />
            </div>

            <AnimatePresence mode="wait">
              {(status !== 'idle') && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`status-container p-6 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
                    status === 'error' ? 'bg-red-500/10 border-red-500/30' : 
                    status === 'success' ? 'bg-green-500/10 border-green-500/30' : 
                    status === 'analyzing' ? 'bg-blue-500/10 border-blue-500/30' :
                    'bg-purple-500/10 border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <div className="flex items-center gap-3">
                      {status === 'analyzing' || status === 'loading' ? (
                        <svg className="animate-spin h-5 w-5 text-current opacity-70" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      <span className={`text-lg font-medium ${
                        status === 'error' ? 'text-red-400' : 
                        status === 'success' ? 'text-green-400' : 
                        status === 'analyzing' ? 'text-blue-300' :
                        'text-purple-300'
                      }`}>
                        {message}
                      </span>
                    </div>
                    {status === 'loading' && (
                      <span className="text-purple-300 font-mono font-bold">{progress}%</span>
                    )}
                  </div>

                  {status === 'loading' && (
                    <div className="progress-track w-full bg-black/40 rounded-full h-3 mt-4 overflow-hidden relative z-10 p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="progress-fill bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-full rounded-full"
                        style={{ backgroundSize: '200% 100%' }}
                      />
                    </div>
                  )}

                  {/* Ambient background for status box */}
                  <div className={`absolute inset-0 opacity-20 ${
                    status === 'error' ? 'bg-red-500' : 
                    status === 'success' ? 'bg-green-500' : 
                    status === 'analyzing' ? 'bg-blue-500' :
                    'bg-purple-500'
                  } blur-xl`}></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.main>
      </div>

      <AnimatePresence>
        {showQualityModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900/90 border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500"></div>
              <h3 className="text-2xl font-bold text-white mb-6">Select Quality</h3>
              <div className="space-y-3 mb-8">
                {[
                  { label: '4K Ultra HD', value: '4k', tag: 'Best' },
                  { label: '1080p HD', value: '1080', tag: 'Popular' },
                  { label: '720p', value: '720' },
                  { label: '480p', value: '480' },
                ].map((q, idx) => (
                  <motion.button
                    key={q.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => {
                      setShowQualityModal(false);
                      handleDownload('video', q.value);
                    }}
                    className="w-full py-4 px-5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-pink-500/30 rounded-2xl text-white transition-all flex justify-between items-center group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="font-semibold text-lg">{q.label}</span>
                      {q.tag && (
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-medium text-pink-300">
                          {q.tag}
                        </span>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-pink-400 transition-colors relative z-10 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.button>
                ))}
              </div>
              <button 
                onClick={() => setShowQualityModal(false)}
                className="w-full py-4 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all font-medium"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DownloadOption({ icon, title, subtitle, gradient, onClick, disabled }: { icon: React.ReactNode, title: string, subtitle: string, gradient: string, onClick: () => void, disabled: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`download-btn group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-[1px] transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100`}
    >
      <div className="relative h-full flex flex-col items-center justify-center gap-3 bg-[#0a0a0a] backdrop-blur-xl rounded-2xl py-6 px-4 transition-all group-hover:bg-black/40">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${gradient} bg-opacity-20 relative`}>
          <div className="absolute inset-0 rounded-full bg-white/20 mix-blend-overlay"></div>
          <svg className="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon}
          </svg>
        </div>
        <div className="text-center">
          <span className="block text-white font-bold text-lg">{title}</span>
          <span className="block text-gray-400 text-sm mt-1">{subtitle}</span>
        </div>
      </div>
    </button>
  );
}
