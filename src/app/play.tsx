"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Progress from "./progress";
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

export function YouTubePlayer({
  videoId,
  onProgress,
  onPlayingChange,
  maxProgressPercent,
}: {
  videoId: string;
  onProgress: (videoId: string, progress: number) => void;
  onPlayingChange: (videoId: string, isPlaying: boolean) => void;
  maxProgressPercent: number;
}) {
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => setMounted(true), []);

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
            onPlayingChange(videoId, true);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            onPlayingChange(videoId, false);
          } else if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            setIsEnded(true);
            onPlayingChange(videoId, false);
          }
        },
      },
    });
  };

  // Handle videoId changes
  useEffect(() => {
    if (isReady && playerRef.current) {
      playerRef.current.loadVideoById(videoId);
      setCurrentTime(0);
      setIsEnded(false);
    }
  }, [videoId, isReady]);

  // In YouTubePlayer
  useEffect(() => {
    if (!mounted || !isReady) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime() || 0;
        const dur = playerRef.current.getDuration() || duration;

        setCurrentTime(time);
        setDuration(dur);

        if (dur > 0) {
          const percent = (time / dur) * 100;

          // ✅ Only report exact percent (not force 100 until ended)
          onProgress(videoId, Math.min(100, percent));
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [mounted, isReady, duration, videoId, onProgress]);

  // onStateChange — fix ended case
  onStateChange: (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setIsEnded(false);
      onPlayingChange(videoId, true);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      onPlayingChange(videoId, false);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      setIsEnded(true);

      // ✅ Only here report 100%
      onProgress(videoId, 100);
      onPlayingChange(videoId, false);
    }
  }





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

  if (!mounted) return <div className="w-full h-full bg-black rounded-xl" />;

  return (
    <div className="w-full h-full bg-black rounded-xl overflow-hidden shadow-lg relative group">
      <div ref={iframeRef} className="w-full h-full aspect-video" />

      {/* Controls */}
      <div>
        {!isEnded ? (
          <div className="fixed bottom-0 left-0 w-full bg-transparent group-hover:bg-white text-white group-hover:text-purple-600 p-4 flex gap-2 items-center overflow-hidden rounded-b-xl transition-all ease-in-out duration-100">
            <button onClick={togglePlay} className="p-2 rounded-full">
              {isPlaying ? <CirclePause /> : <Play />}
            </button>

            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime || 0}
                onChange={handleSeek}
                className="flex-1 h-[3px] bg-purple-600"
              />
              <span className="text-xs">{formatTime(duration)}</span>
              <div className="text-xs text-gray-400 text-right">
                {Math.floor(maxProgressPercent)}% played
              </div>
            </div>

            <button onClick={toggleMute} className="p-2">
              {isMuted ? <VolumeOff /> : <Volume1 />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={volume || 0}
              onChange={handleVolumeChange}
              className="w-24 h-[3px] bg-purple-600"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 bg-purple-500 p-4 absolute top-0 left-0 h-full w-full">
            <button className="px-4 py-2 rounded-lg flex items-center gap-2 text-white">
              <SkipBack className="hover:scale-105 transition-all ease-in-out duration-200" />
            </button>
            <button
              onClick={handleReplay}
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-white"
            >
              <RotateCcw className="hover:scale-105 transition-all ease-in-out duration-200" />
            </button>
            <button className="px-4 py-2 rounded-lg flex items-center gap-2 text-white">
              <SkipForward className="hover:scale-105 transition-all ease-in-out duration-200" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface Topic {
  id: number;
  description: string;
  video_id: string;
}

interface Module {
  id: number;
  title: string;
  topic: Topic[];
}

interface ModuleData {
  module: Module[];
}


export default function VideoData({ module }: ModuleData) {
  if (!module || module.length === 0) return null;

  // Flatten all topics across modules in order
  const allTopics = useMemo(() => module.flatMap((m) => m.topic), [module]);

  // First video = first topic of first module
  const firstVideo = allTopics[0];
  const [videoId, setVideoId] = useState(firstVideo.video_id);

  // Progress tracking
  const [progressMap, setProgressMap] = useState<{ [key: string]: number }>({});
  const [maxProgressMap, setMaxProgressMap] = useState<{ [key: string]: number }>({});

  const handleProgress = (id: string, progress: number) => {
    setProgressMap((prev) => ({ ...prev, [id]: progress }));
    setMaxProgressMap((prev) => ({
      ...prev,
      [id]: Math.max(prev[id] || 0, progress),
    }));
  };

  const handlePlayingChange = (id: string, isPlaying: boolean) => {
    // optional: track playing state if needed
  };

  // Current video info
  const currentVideo =
    allTopics.find((t) => t.video_id === videoId) || firstVideo;

  // Global unlock check (across all modules/topics)
  const isUnlocked = (topic: Topic) => {
    const index = allTopics.findIndex((t) => t.video_id === topic.video_id);
    if (index === 0) return true; // very first video is always unlocked

    const prevTopic = allTopics[index - 1];
    return (progressMap[prevTopic.video_id] || 0) >= 100;
  };

  return (
    <div className="flex justify-between items-start max-lg:flex-col gap-10 mt-20">
      <div className="w-[60%] bg-white/5 backdrop-blur-2xl rounded-2xl min-h-80">
        <YouTubePlayer
          videoId={videoId}
          onProgress={handleProgress}
          onPlayingChange={handlePlayingChange}
          maxProgressPercent={maxProgressMap[videoId] || 0}
        />
      </div>

      {/* Sidebar */}
      <div className="w-[40%] bg-purple-600/10 backdrop-blur-2xl rounded-2xl min-h-80 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Now Playing</h2>
        <p className="mb-6">{currentVideo.description}</p>

        <div className="space-y-4">
          {module.map((m) => (
            <div
              key={m.id}
              className="bg-white/5 rounded-xl p-3 border border-white/10"
            >
              {/* Module Title */}
              <h3 className="text-lg font-bold text-purple-700 mb-2">
                📚 {m.title}
              </h3>

              {/* Topics */}
              <div className="space-y-2">
                {m.topic.map((t) => {
                  const isCurrent = t.video_id === videoId;
                  const progress = progressMap[t.video_id] || 0;
                  const unlocked = isUnlocked(t);

                  return (
                    <button
                      key={t.id}
                      disabled={!unlocked}
                      onClick={() => unlocked && setVideoId(t.video_id)}
                      className={`p-2 rounded w-full text-left flex items-center gap-3 transition
                        ${
                          isCurrent
                            ? "bg-purple-500/30"
                            : unlocked
                            ? "bg-white/10 hover:bg-white/20"
                            : "bg-gray-500/20 cursor-not-allowed opacity-50"
                        }`}
                    >
                      <Progress progress={progress} playing={isCurrent} is_locked={!unlocked} />
                      {t.description}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}