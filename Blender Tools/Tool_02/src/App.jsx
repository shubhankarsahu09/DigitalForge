import { useState, useRef, useEffect, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import './index.css';

function App() {
  const [inputFile, setInputFile] = useState(null);
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
    const file = filesList[0];
    if (!file) return;
    
    // Check if it's an AVI file or generally a video
    if (file.name.toLowerCase().endsWith('.avi') || file.type.startsWith('video/')) {
        setInputFile(file);
    } else {
        setStatus("Please select an AVI file.");
    }
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

  const clearFile = () => {
    setInputFile(null);
    setProgress(0);
    setStatus('');
  };

  const generateVideo = async () => {
    if (!loaded || !inputFile) return;

    setIsGenerating(true);
    setProgress(0);
    setStatus('Loading file into memory...');

    const ffmpeg = ffmpegRef.current;

    try {
      const filename = 'input.avi';
      const fileData = await fetchFile(inputFile);
      await ffmpeg.writeFile(filename, fileData);

      setStatus('Encoding (Peak Speed)...');

      // Peak speed MP4 conversion
      await ffmpeg.exec([
        '-i', filename,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'fastdecode',
        '-tune', 'zerolatency',
        '-threads', '0',
        '-c:a', 'aac', // Encode audio to AAC for wide MP4 compatibility
        'out.mp4'
      ]);

      setStatus('Finalizing...');

      const data = await ffmpeg.readFile('out.mp4');
      const blob = new Blob([data.buffer || data], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = videoUrl;
      const originalName = inputFile.name.replace(/\.[^/.]+$/, "");
      a.download = `${originalName}_converted.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStatus('Completed');
      
      // Cleanup
      await ffmpeg.deleteFile(filename);
      await ffmpeg.deleteFile('out.mp4');
      
    } catch (error) {
      console.error('Error converting video:', error);
      setStatus('Failed: ' + (error.message || 'Unknown error occurred.'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="frameweaver-app pt-24 min-h-screen relative z-10">
      <div className="video-bg-container">
        <div className="video-overlay" style={{background: '#000'}}></div>
      </div>

      <div className="app-container mx-auto">
        <header className="header">
          <h1 className="title">AVI to MP4 Converter</h1>
          <p className="subtitle">Lightning fast client-side conversion.</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <h2 className="dropzone-text">Upload AVI File</h2>
            <p className="dropzone-subtext">Drag and drop, or click to browse.</p>
            <input 
              type="file" 
              ref={fileInputRef}
              className="file-input" 
              accept=".avi,video/x-msvideo"
              onChange={handleFileInput}
            />
          </div>

          {inputFile && (
            <div className="controls-wrapper">
              <div className="info-pill">
                <span className="frames-count">{inputFile.name}</span>
                {!isGenerating && (
                  <button className="clear-btn" onClick={clearFile}>Clear</button>
                )}
              </div>
              
              <div className="actions-group">
                <button 
                  className="generate-btn" 
                  onClick={generateVideo}
                  disabled={isGenerating || !loaded}
                >
                  {isGenerating ? (
                    <>
                      <span className="spinner"></span>
                      Converting...
                    </>
                  ) : (
                    'Convert to MP4'
                  )}
                </button>
              </div>
            </div>
          )}

          {status && (
            <div className="status-container">
              <div className="status-text-row">
                <span>{status}</span>
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
                <div className="success-message">
                  Conversion successful! Your download should begin automatically.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
