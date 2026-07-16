import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2, AlertCircle } from 'lucide-react';

const VideoPlayer = ({ isOpen, onClose, videoUrl, title, thumbnailUrl }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [videoDuration, setVideoDuration] = useState('0:00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef(null);

  const hasValidSource = Boolean(videoUrl && typeof videoUrl === 'string' && videoUrl.trim().length > 0 && videoUrl.startsWith('http'));

  useEffect(() => {
    if (!isOpen) {
      setPlaying(false);
      setProgress(0);
      setCurrentTime('0:00');
      setVideoDuration('0:00');
      setLoading(true);
      setError(false);
      setShowControls(true);
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && hasValidSource) {
      setLoading(true);
      setError(false);
      setProgress(0);
      setCurrentTime('0:00');
      setVideoDuration('0:00');
      console.log('[VideoPlayer] Loading video:', videoUrl);
    }
  }, [isOpen, videoUrl, hasValidSource]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video && video.duration && isFinite(video.duration)) {
      setCurrentTime(formatTime(video.currentTime));
      setProgress((video.currentTime / video.duration) * 100);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      console.log('[VideoPlayer] Video loaded, duration:', video.duration);
      setVideoDuration(formatTime(video.duration));
      setLoading(false);
      setError(false);
    }
  }, []);

  const handleError = useCallback((e) => {
    const video = videoRef.current;
    const error = video?.error;
    console.error('[VideoPlayer] Video error:', error?.code, error?.message, 'URL:', videoUrl);
    setLoading(false);
    setError(true);
  }, [videoUrl]);

  const handleCanPlay = useCallback(() => {
    console.log('[VideoPlayer] Video can play');
    setLoading(false);
    setError(false);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(!muted);
  }, [muted]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  }, []);

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    const bar = e.currentTarget;
    if (!video || !bar || !video.duration || isNaN(video.duration)) return;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    video.currentTime = (clickX / rect.width) * video.duration;
  };

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
        onClick={onClose}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl mx-4 bg-black rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300" style={{ opacity: showControls ? 1 : 0 }}>
            <h3 className="text-white text-sm font-medium truncate flex-1 mr-4">{title}</h3>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Video */}
          <div className="relative aspect-video bg-black">
            {!hasValidSource ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-3">
                <AlertCircle size={40} className="text-red-400" />
                <p className="text-white/70 text-sm">Video unavailable.</p>
              </div>
            ) : (
              <>
                {loading && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                    <Loader2 size={40} className="animate-spin text-violet-500" />
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-3 z-10">
                    <AlertCircle size={40} className="text-red-400" />
                    <p className="text-white/70 text-sm">Video unavailable.</p>
                  </div>
                )}
                <video
                  ref={videoRef}
                  key={videoUrl}
                  src={videoUrl}
                  poster={thumbnailUrl}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onError={handleError}
                  onCanPlay={handleCanPlay}
                  onEnded={() => setPlaying(false)}
                  playsInline
                  preload="metadata"
                  controls={false}
                />
              </>
            )}

            {/* Center play button when paused */}
            {hasValidSource && !playing && !loading && !error && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors z-20"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                  <Play size={28} className="text-gray-900 ml-1" fill="currentColor" />
                </div>
              </button>
            )}
          </div>

          {/* Controls */}
          {hasValidSource && !error && (
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 z-20" style={{ opacity: showControls ? 1 : 0 }}>
              <div
                className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group hover:h-2 transition-all"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-violet-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-violet-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="text-white hover:text-violet-400 transition-colors">
                  {playing ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                </button>
                <button onClick={toggleMute} className="text-white hover:text-violet-400 transition-colors">
                  {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <span className="text-white/70 text-xs">
                  {currentTime} / {videoDuration}
                </span>
                <div className="flex-1" />
                <button onClick={toggleFullscreen} className="text-white hover:text-violet-400 transition-colors">
                  {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoPlayer;
