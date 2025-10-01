"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2,
    //   easing: (t) => t, // linear
      smoothWheel: true,
    //   smoothTouch: true,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // GSAP ScrollTrigger animation
    gsap.utils.toArray(".element").forEach((el: any) => {
      gsap.from(el, {
        opacity: 100,
        y: 90,
        scrollTrigger: {
          trigger: el,
          start: "top 0%",
          end: "top 0%",
          scrub: true,
        },
      });
    });

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      <div className="element h-auto w-full flex justify-center items-center flex-col">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-[40vh] w-2/3 bg-blue-400 flex justify-center items-center mb-4"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique,
            dolores impedit laudantium debitis mollitia natus ex quod libero
            harum eius.
          </div>
        ))}
      </div>

      <div className="element h-screen w-full bg-amber-200 flex justify-center items-center">
        Scroll-triggered Animation
      </div>
      <div className="element h-screen w-full bg-cyan-500 flex justify-center items-center">
        Scroll-triggered Animation
      </div>
      <div className="element h-screen w-full bg-fuchsia-400 flex justify-center items-center">
        Scroll-triggered Animation
      </div>
      <div className="element h-screen w-full bg-green-400 flex justify-center items-center">
        Scroll-triggered Animation
      </div>
    </>
  );
};

export default ScrollAnimation;






// // import React, { useMemo, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "@/store/store";
// import {
//   setProgress as setProgressAction,
//   setPlaying as setPlayingAction,
//   setVideoId as setVideoIdAction,
//   unlockVideo as unlockVideoAction,
// } from "@/store/videoSlice";
// // import { getCookie } from "cookies-next";

// // import YouTubePlayer from "./YouTubePlayer";
// // import Progress from "./progress";

// interface Topic {
//   id: number;
//   description: string;
//   video_id: string;
// }

// interface Module {
//   id: number;
//   title: string;
//   topic: Topic[];
// }

// interface ModuleData {
//   module: Module[];
// }

// export default function VideoData({ module }: ModuleData) {
//   if (!module || module.length === 0) return null;

//   const u_id = getCookie("u_id"); // keep for store key if needed later

//   // Flatten all topics across modules in order
//   const allTopics = useMemo(() => module.flatMap((m) => m.topic), [module]);

//   // First video = first topic of first module
//   const firstVideo = allTopics[0];

//   const dispatch = useDispatch<AppDispatch>();
//   const videoState = useSelector((s: RootState) => s.video);

//   // locally compute sets for quick checks:
//   const completedVideos = new Set(videoState.completedVideos);
//   const unlockedVideosSet = new Set(videoState.unlockedVideos);

//   // ensure there's a currentVideoId on first load (set default if not persisted)
//   useEffect(() => {
//     if (!videoState.currentVideoId) {
//       dispatch(setVideoIdAction(firstVideo.video_id));
//       dispatch(unlockVideoAction(firstVideo.video_id));
//     }
//   }, [dispatch, firstVideo.video_id, videoState.currentVideoId]);

//   // derive videoId from redux state (fallback to firstVideo)
//   const videoId = videoState.currentVideoId ?? firstVideo.video_id;
//   const playingVideoId = videoState.playingVideoId;
//   const progressMap = videoState.progressMap;
//   const maxProgressMap = videoState.maxProgressMap;

//   const currentIndex = allTopics.findIndex((t) => t.video_id === videoId);
//   const hasPrev = currentIndex > 0;
//   const hasNext = currentIndex < allTopics.length - 1;
//   const nextVideoId = hasNext ? allTopics[currentIndex + 1].video_id : null;

//   const currentVideo =
//     allTopics.find((t) => t.video_id === videoId) || firstVideo;

//   const isUnlocked = (topic: Topic) => {
//     return unlockedVideosSet.has(topic.video_id);
//   };

//   const handleProgress = (id: string, progress: number) => {
//     dispatch(setProgressAction({ id, progress }));

//     if (progress >= 100) {
//       // unlock next topic in sequence
//       const index = allTopics.findIndex((t) => t.video_id === id);
//       if (index !== -1 && index < allTopics.length - 1) {
//         const nextId = allTopics[index + 1].video_id;
//         dispatch(unlockVideoAction(nextId));
//       }
//     }
//   };

//   const handlePlayingChange = (id: string, isPlaying: boolean) => {
//     dispatch(setPlayingAction({ id: isPlaying ? id : null, isPlaying }));
//     console.log("id : ", id, "isPlaying : ", isPlaying);
//   };

//   const handlePrev = () => {
//     if (hasPrev) dispatch(setVideoIdAction(allTopics[currentIndex - 1].video_id));
//   };

//   const handleNext = () => {
//     if (hasNext && nextVideoId && unlockedVideosSet.has(nextVideoId)) {
//       dispatch(setVideoIdAction(nextVideoId));
//     }
//   };

//   return (
//     <div className="flex justify-between items-start max-lg:flex-col gap-10 mt-20">
//       {/* Video Player */}
//       <div className="w-[60%] bg-white/5 backdrop-blur-2xl rounded-2xl min-h-80">
//         <YouTubePlayer
//           videoId={videoId}
//           onProgress={handleProgress}
//           onPlayingChange={handlePlayingChange}
//           maxProgressPercent={maxProgressMap[videoId] || 0}
//           onPrev={handlePrev}
//           onNext={handleNext}
//           isPrevDisabled={!hasPrev}
//           isNextDisabled={!hasNext || !unlockedVideosSet.has(nextVideoId || "")}
//         />
//       </div>

//       {/* Sidebar */}
//       <div className="w-[40%] bg-purple-600/10 backdrop-blur-2xl rounded-2xl min-h-80 p-4 overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">Now Playing</h2>
//         <p className="mb-6">{currentVideo.description}</p>

//         <div className="space-y-4">
//           {module.map((m) => (
//             <div
//               key={m.id}
//               className="bg-white/5 rounded-xl p-3 border border-white/10"
//             >
//               {/* Module Title */}
//               <h3 className="text-lg font-bold text-purple-700 mb-2">
//                 📚 {m.title}
//               </h3>

//               {/* Topics */}
//               <div className="space-y-2">
//                 {m.topic.map((t) => {
//                   const isCurrent = t.video_id === videoId;
//                   const progress = progressMap[t.video_id] || 0;
//                   const unlocked = isUnlocked(t);

//                   return (
//                     <button
//                       key={t.id}
//                       disabled={!unlocked}
//                       onClick={() =>
//                         unlocked && dispatch(setVideoIdAction(t.video_id))
//                       }
//                       className={`p-2 rounded w-full text-left flex items-center gap-3 transition
//                         ${
//                           isCurrent
//                             ? "bg-purple-500/30"
//                             : unlocked
//                             ? "bg-white/10 hover:bg-white/20"
//                             : "bg-gray-500/20 cursor-not-allowed opacity-50"
//                         }`}
//                     >
//                       <Progress
//                         progress={progress}
//                         playing={playingVideoId === t.video_id}
//                         is_completed={completedVideos.has(t.video_id)}
//                         is_locked={!unlocked}
//                       />
//                       {t.description}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }