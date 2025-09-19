import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MediaPlayer = ({ 
  mediaContent, 
  connectionStrength = 'high',
  onProgress,
  autoPlay = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRef = useRef(null);
  const progressRef = useRef(null);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    const media = mediaRef?.current;
    if (!media) return;

    const handleLoadedMetadata = () => {
      setDuration(media?.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(media?.currentTime);
      if (onProgress) {
        onProgress((media?.currentTime / media?.duration) * 100);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    media?.addEventListener('loadedmetadata', handleLoadedMetadata);
    media?.addEventListener('timeupdate', handleTimeUpdate);
    media?.addEventListener('play', handlePlay);
    media?.addEventListener('pause', handlePause);
    media?.addEventListener('waiting', handleWaiting);
    media?.addEventListener('canplay', handleCanPlay);

    return () => {
      media?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      media?.removeEventListener('timeupdate', handleTimeUpdate);
      media?.removeEventListener('play', handlePlay);
      media?.removeEventListener('pause', handlePause);
      media?.removeEventListener('waiting', handleWaiting);
      media?.removeEventListener('canplay', handleCanPlay);
    };
  }, [onProgress]);

  const togglePlayPause = () => {
    const media = mediaRef?.current;
    if (!media) return;

    if (isPlaying) {
      media?.pause();
    } else {
      media?.play();
    }
  };

  const handleSeek = (e) => {
    const media = mediaRef?.current;
    const progress = progressRef?.current;
    if (!media || !progress) return;

    const rect = progress?.getBoundingClientRect();
    const clickX = e?.clientX - rect?.left;
    const newTime = (clickX / rect?.width) * duration;
    media.currentTime = newTime;
  };

  const handleSpeedChange = (speed) => {
    const media = mediaRef?.current;
    if (!media) return;

    setPlaybackSpeed(speed);
    media.playbackRate = speed;
  };

  const handleVolumeChange = (newVolume) => {
    const media = mediaRef?.current;
    if (!media) return;

    setVolume(newVolume);
    media.volume = newVolume;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const getQualityBasedSrc = () => {
    if (!mediaContent?.sources) return mediaContent?.src;
    
    const qualityMap = {
      low: mediaContent?.sources?.low || mediaContent?.sources?.medium || mediaContent?.src,
      medium: mediaContent?.sources?.medium || mediaContent?.src,
      high: mediaContent?.sources?.high || mediaContent?.src
    };

    return qualityMap?.[connectionStrength] || mediaContent?.src;
  };

  if (mediaContent?.type === 'video') {
    return (
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={mediaRef}
          className="w-full h-auto"
          poster={mediaContent?.thumbnail}
          autoPlay={autoPlay}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <source src={getQualityBasedSrc()} type="video/mp4" />
          {mediaContent?.subtitles && (
            <track
              kind="subtitles"
              src={mediaContent?.subtitles}
              srcLang="en"
              label="English"
              default
            />
          )}
          Your browser does not support the video tag.
        </video>
        {/* Video Controls Overlay */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="space-y-3">
              {/* Progress Bar */}
              <div
                ref={progressRef}
                className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-primary rounded-full transition-all duration-100"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={isPlaying ? "Pause" : "Play"}
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20"
                  />
                  
                  <div className="text-white text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Speed Control */}
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      {playbackSpeed}x
                    </Button>
                    <div className="absolute bottom-full right-0 mb-2 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {speedOptions?.map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`block w-full px-3 py-2 text-sm text-left hover:bg-muted ${
                            playbackSpeed === speed ? 'bg-muted text-primary' : ''
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <Icon name="Volume2" size={16} className="text-white" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e?.target?.value))}
                      className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Icon name="Loader2" size={32} className="text-white animate-spin" />
          </div>
        )}
      </div>
    );
  }

  // Audio Player
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <audio
        ref={mediaRef}
        autoPlay={autoPlay}
        className="hidden"
      >
        <source src={getQualityBasedSrc()} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="space-y-4">
        {/* Audio Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Music" size={24} className="text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">{mediaContent?.title}</h4>
            <p className="text-sm text-muted-foreground">{mediaContent?.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="w-full h-2 bg-muted rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName={isPlaying ? "Pause" : "Play"}
              onClick={togglePlayPause}
              loading={isLoading}
            />
            
            <div className="text-sm font-mono text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Speed Control */}
            <div className="relative group">
              <Button variant="ghost" size="sm">
                {playbackSpeed}x
              </Button>
              <div className="absolute bottom-full right-0 mb-2 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {speedOptions?.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`block w-full px-3 py-2 text-sm text-left hover:bg-muted ${
                      playbackSpeed === speed ? 'bg-muted text-primary' : ''
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Repeat Button */}
            <Button
              variant="ghost"
              size="sm"
              iconName="Repeat"
              onClick={() => {
                const media = mediaRef?.current;
                if (media) {
                  media.currentTime = 0;
                  media?.play();
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;