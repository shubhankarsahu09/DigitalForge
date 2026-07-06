import { useState, useRef, useEffect, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import './index.css';

function App() {
  const [frames, setFrames] = useState([]);
  const [fps, setFps] = useState(24);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const ffmpegRef = useRef(new FFmpeg());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }) => {
          console.log(message);
        });
        ffmpeg.on('progress', ({ progress }) => {
          setProgress(Math.round(progress * 100));
        });
        await ffmpeg.load();
        setLoaded(true);
      } catch (err) {
        console.error("Failed to load FFmpeg", err);
      }
    };
    loadFFmpeg();
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFiles = useCallback((filesList) => {
    const files = Array.from(filesList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    const newFrames = files.map(file => ({
      file,
      name: file.name
    }));

    setFrames(prev => [...prev, ...newFrames]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const clearFrames = () => {
    setFrames([]);
    setProgress(0);
    setStatus('');
  };

  const generateVideo = async () => {
    if (!loaded || frames.length === 0) return;

    setIsGenerating(true);
    setProgress(0);
    setStatus('Loading frames into memory (Parallel)...');

    const ffmpeg = ffmpegRef.current;

    try {
      // 1. PEAK SPEED (Memory Safe): Batch file I/O to prevent crashing on 600+ frames
      const firstExt = frames[0].file.name.split('.').pop() || 'png';
      
      const BATCH_SIZE = 50;
      for (let i = 0; i < frames.length; i += BATCH_SIZE) {
        const batch = frames.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (frame, j) => {
          const index = i + j;
          const num = String(index + 1).padStart(4, '0');
          const ext = frame.file.name.split('.').pop() || 'png';
          const filename = `img_${num}.${ext}`;
          const fileData = await fetchFile(frame.file);
          return ffmpeg.writeFile(filename, fileData);
        }));
      }

      setStatus('Encoding (Peak Speed)...');

      // 2. PEAK SPEED ENCODING:
      // -preset ultrafast: Absolute fastest H.264 encode profile
      // -tune fastdecode: Disables CABAC and deblocking for even faster encoding
      // -tune zerolatency: Eliminates buffering delays
      // -threads 0: Force max CPU cores
      await ffmpeg.exec([
        '-framerate', String(fps),
        '-i', `img_%04d.${firstExt}`,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'fastdecode',
        '-tune', 'zerolatency',
        '-threads', '0',
        '-pix_fmt', 'yuv420p',
        'out.mp4'
      ]);

      setStatus('Finalizing...');

      const data = await ffmpeg.readFile('out.mp4');
      const blob = new Blob([data.buffer], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `animation_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStatus('Completed');
      
      // Cleanup in parallel batches
      for (let i = 0; i < frames.length; i += BATCH_SIZE) {
        const batch = frames.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map((frame, j) => {
          const index = i + j;
          const num = String(index + 1).padStart(4, '0');
          const ext = frame.file.name.split('.').pop() || 'png';
          return ffmpeg.deleteFile(`img_${num}.${ext}`);
        }));
      }
      
    } catch (error) {
      console.error('Error generating video:', error);
      setStatus('Failed: ' + (error.message || 'Unknown error occurred.'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
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

      <div className="app-container">
        <header className="header">
          <h1 className="title">FrameWeaver</h1>
          <p className="subtitle">Pro-level sequence encoding, instantly.</p>
        </header>

        <main>
          <div 
            className={`dropzone-container ${isDragActive ? 'active' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="dropzone-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <h2 className="dropzone-text">Add your frames</h2>
            <p className="dropzone-subtext">Drag and drop, or browse to select.</p>
            <input 
              type="file" 
              ref={fileInputRef}
              className="file-input" 
              multiple 
              accept="image/*"
              onChange={handleFileInput}
            />
          </div>

          {frames.length > 0 && (
            <div className="controls-wrapper">
              <div className="info-pill">
                <span className="frames-count">{frames.length} frames selected</span>
                {!isGenerating && (
                  <button className="clear-btn" onClick={clearFrames}>Clear</button>
                )}
              </div>
              
              <div className="actions-group">
                <div className="select-wrapper">
                  <select 
                    className="framerate-select"
                    value={fps} 
                    onChange={(e) => setFps(Number(e.target.value))}
                    disabled={isGenerating}
                  >
                    <option value={12}>12 FPS</option>
                    <option value={24}>24 FPS</option>
                    <option value={30}>30 FPS</option>
                    <option value={60}>60 FPS</option>
                  </select>
                  <span className="select-icon">▼</span>
                </div>
                
                <button 
                  className="generate-btn" 
                  onClick={generateVideo}
                  disabled={isGenerating || !loaded}
                >
                  {isGenerating ? (
                    <span className="spinner"></span>
                  ) : !loaded ? (
                    'Loading Engine...'
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
            </div>
          )}

          {(isGenerating || status.includes('Completed') || status.includes('Failed')) && (
            <div className={`status-container ${status.includes('Failed') ? 'error-state' : ''}`}>
              <div className="status-text-row">
                <span style={{ color: status.includes('Failed') ? '#ff453a' : 'inherit' }}>{status}</span>
                {isGenerating && <span>{progress}%</span>}
              </div>
              {isGenerating && (
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              {status === 'Completed' && (
                <div className="success-message">Downloaded successfully.</div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
