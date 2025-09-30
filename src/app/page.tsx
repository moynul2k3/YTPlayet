import React from 'react'
import Module from "./play"

// data/videos.js

export const module = [
  {
    id: 1,
    title: "Learn React in 5 Minutes",
    description: "A quick introduction to React components and hooks.",
    video_id: "LUQy6SSokSE",
  },
  {
    id: 2,
    title: "Next.js Routing Simplified",
    description: "Learn about Next.js pages and dynamic routes.",
    video_id: "_Td7JjCTfyc",
  },
  {
    id: 3,
    title: "State Management with Redux",
    description: "Quick guide to Redux Toolkit and store setup.",
    video_id: "NSAOrGb9orM",
  },
  {
    id: 4,
    title: "CSS Grid Crash Course",
    description: "Learn CSS Grid layout in 5 minutes.",
    video_id: "d95PPykB2vE",
  },
  {
    id: 5,
    title: "JavaScript ES6 Features",
    description: "Short tutorial on modern JavaScript features.",
    video_id: "-oOoTIuoL8M",
  },
];


export default function page() {
  return (
    <div className='w-full px-2 md:px-20 lg:px-32 h-auto '>
      <Module module={module} />
      
    </div>
  )
}
