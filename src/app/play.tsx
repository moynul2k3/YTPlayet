"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  CirclePause,
  Volume1,
  VolumeOff,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubePlayer({ videoId }: { videoId: string }) {
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false); // ✅ hydration guard
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [maxProgressPercent, setMaxProgressPercent] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  // Only run on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load YouTube API
  useEffect(() => {
    if (!mounted) return;

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }
  }, [mounted]);

  const initPlayer = () => {
    playerRef.current = new window.YT.Player(iframeRef.current!, {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        fs: 0,
        iv_load_policy: 3,
        disablekb: 1,
      },
      events: {
        onReady: (event: any) => {
          setIsReady(true);
          setDuration(event.target.getDuration());
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            setIsEnded(false);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          } else if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            setIsEnded(true);
          }
        },
      },
    });
  };

  // Update time
  useEffect(() => {
    if (!mounted || !isReady) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);

        if (duration > 0) {
          const percent = (time / duration) * 100;
          if (percent > maxProgressPercent) {
            setMaxProgressPercent(percent);
          }
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [mounted, isReady, duration, maxProgressPercent]);

  // Controls
  const togglePlay = () => {
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    playerRef.current.setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    const allowedTime = (maxProgressPercent / 100) * duration;

    if (newTime > allowedTime) {
      playerRef.current.seekTo(allowedTime, true);
      setCurrentTime(allowedTime);
    } else {
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const handleReplay = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    playerRef.current.playVideo();
    setIsEnded(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!mounted) {
    // ✅ Prevent SSR/client mismatch
    return <div className="w-full h-full bg-black rounded-xl" />;
  }

  return (
    <div className="w-full h-full bg-black rounded-xl overflow-hidden shadow-lg relative group">
      <div ref={iframeRef} className="w-full h-full aspect-video" />

      <div className="">
        {!isEnded ? (
          <div className="fixed bottom-0 left-0 w-full bg-transparent group-hover:bg-white text-white group-hover:text-purple-600  p-4 flex gap-2 items-center  overflow-hidden rounded-b-xl transition-all ease-in-out duration-100">
            <button onClick={togglePlay} className="p-2 rounded-full">
              {isPlaying ? <CirclePause /> : <Play />}
            </button>

            {/* Progress */}
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-[3px] bg-purple-600"
              />
              <span className="text-xs">{formatTime(duration)}</span>
              <div className="text-xs text-gray-400 text-right">
                {Math.floor(maxProgressPercent)}% played
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 bg-purple-500 p-4 absolute top-0 left-0 h-full w-full">
            <button className="px-4 py-2  rounded-lg flex items-center gap-2  text-white">
              <SkipBack className="hover:scale-105 transition-all ease-in-out duration-200" />
            </button>
            <button
              onClick={handleReplay}
              className="px-4 py-2  rounded-lg flex items-center gap-2  text-white"
            >
              <RotateCcw className="hover:scale-105 transition-all ease-in-out duration-200" /> 
            </button>
            <button className="px-4 py-2  rounded-lg flex items-center gap-2  text-white ">
              <SkipForward className="hover:scale-105 transition-all ease-in-out duration-200" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
