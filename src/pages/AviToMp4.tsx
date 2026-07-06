import { useState, useRef, useEffect, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import './AviToMp4.css';

export default function AviToMp4() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const [inputFile, setInputFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        setIsAuthorized(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('purchases')
          .select('course_id')
          .eq('user_id', user.id)
          .eq('course_id', '1');
        
        if (data && data.length > 0) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        setIsAuthorized(false);
      }
    };
    checkAuth();
  }, [user]);

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

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFiles = useCallback((filesList: FileList | File[]) => {
    const file = filesList[0];
    if (!file) return;
    
    // Check if it's an AVI file or generally a video
    if (file.name.toLowerCase().endsWith('.avi') || file.type.startsWith('video/')) {
        setInputFile(file);
    } else {
        setStatus("Please select an AVI file.");
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    // Capture logs for debugging
    let ffmpegLogs = '';
    const logCallback = ({ message }: { message: string }) => {
      ffmpegLogs += message + '\n';
    };
    ffmpeg.on('log', logCallback);

    try {
      const filename = 'input.avi';
      const fileData = await fetchFile(inputFile);
      await ffmpeg.writeFile(filename, fileData);

      setStatus('Encoding (Peak Speed)...');

      // Simple MP4 conversion
      const ret = await ffmpeg.exec([
        '-i', filename,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        'out.mp4'
      ]);

      ffmpeg.off('log', logCallback);

      if (ret !== 0) {
        console.error('FFmpeg Logs:', ffmpegLogs);
        throw new Error(`FFmpeg failed (Code ${ret}). Logs: ${ffmpegLogs.slice(-200)}`);
      }

      setStatus('Finalizing...');

      const data = (await ffmpeg.readFile('out.mp4')) as Uint8Array;
      const blob = new Blob([data as any], { type: 'video/mp4' });
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
      
    } catch (error: any) {
      console.error('Error converting video:', error);
      setStatus('Failed: ' + (error.message || 'Unknown error occurred.'));
    } finally {
      setIsGenerating(false);
    }
  };

  if (isAuthorized === null) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Checking access...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="avitomp4-app pt-32 min-h-screen relative z-10 flex flex-col items-center text-center px-6">
        <h1 className="text-4xl font-medium mb-4 text-foreground">Access Restricted</h1>
        <p className="text-muted-foreground mb-8 max-w-md">You need to purchase the Tools bundle to access this converter.</p>
        <button 
          onClick={() => navigate('/checkout/1')}
          className="bg-foreground text-background px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-foreground/90 transition-all"
        >
          Get Access
        </button>
      </div>
    );
  }

  return (
    <div className="avitomp4-app pt-24 min-h-screen relative z-10">
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
