import React from 'react'
// import Video from "./play"

// data/videos.js

export const videos = [
  {
    id: 1,
    title: "Learn React in 5 Minutes",
    description: "A quick introduction to React components and hooks.",
    video_id: "dGcsHMXbSOA",
    duration: 300, // seconds
    module: "React Basics"
  },
  {
    id: 2,
    title: "Next.js Routing Simplified",
    description: "Learn about Next.js pages and dynamic routes.",
    video_id: "mTz0GXj8NN0",
    duration: 240,
    module: "Next.js Routing"
  },
  {
    id: 3,
    title: "State Management with Redux",
    description: "Quick guide to Redux Toolkit and store setup.",
    video_id: "poQXNp9ItL4",
    duration: 360,
    module: "State Management"
  },
  {
    id: 4,
    title: "CSS Grid Crash Course",
    description: "Learn CSS Grid layout in 5 minutes.",
    video_id: "t6CBKf8K_Ac",
    duration: 180,
    module: "CSS Layout"
  },
  {
    id: 5,
    title: "JavaScript ES6 Features",
    description: "Short tutorial on modern JavaScript features.",
    video_id: "NCwa_xi0Uuc",
    duration: 300,
    module: "JavaScript Basics"
  },
];


export default function page() {
  return (
    <div className='w-full px-2 md:px-20 lg:px-32 h-auto '>
      <div className='flex justify-between items-start max-lg:flex-col gap-10 mt-20'>
        <div className='w-[60%] bg-white/5 backdrop-blur-2xl rounded-2xl min-h-80 '>
          {/* <Video videoId="LUQy6SSokSE" /> */}
        </div>
        <div className='w-[40%] bg-purple-600/10 backdrop-blur-2xl rounded-2xl min-h-80 '></div>
      </div>
    </div>
  )
}
