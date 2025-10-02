import React from 'react'
import Module from "./play"

// data/videos.js

export const moduleData = [
  {
    id: 1,
    title: "Learn React in 5 Minutes",
    topic: [
      {
        id: 1,
        description: "Introduction to React components and JSX.",
        video_id: "LUQy6SSokSE",
        is_completed: true,
        is_locked: false,
      },
      {
        id: 2,
        description: "Understanding React hooks: useState and useEffect.",
        video_id: "_Td7JjCTfyc",
        is_completed: false,
        is_locked: false,
      },
    ],
  },
  {
    id: 2,
    title: "Next.js Routing Simplified",
    topic: [
      {
        id: 3,
        description: "Learn about Next.js file-based routing.",
        video_id: "NSAOrGb9orM",
        is_completed: false,
        is_locked: false,
      },
      {
        id: 4,
        description: "Dynamic routes and catch-all routes in Next.js.",
        video_id: "pJCJuz4zwnM",
        is_completed: false,
        is_locked: true,
      },
    ],
  },
  {
    id: 3,
    title: "State Management with Redux",
    topic: [
      {
        id: 5,
        description: "Introduction to Redux and the core concepts.",
        video_id: "w7ejDZ8SWv8",
        is_completed: false,
        is_locked: true,
      },
      {
        id: 6,
        description: "Setting up Redux Toolkit and the store.",
        video_id: "zrs7u6bdbUw",
        is_completed: false,
        is_locked: true,
      },
      {
        id: 7,
        description: "Using Redux with React components.",
        video_id: "CVpUuw9XSjY",
        is_completed: false,
        is_locked: true,
      },
    ],
  },
  {
    id: 4,
    title: "CSS Grid Crash Course",
    topic: [
      {
        id: 8,
        description: "Basic grid container and grid items.",
        video_id: "d95PPykB2vE",
        is_completed: false,
        is_locked: true,
      },
      {
        id: 9,
        description: "Building a responsive layout with CSS Grid.",
        video_id: "jV8B24rSN5o",
        is_completed: false,
        is_locked: true,
      },
    ],
  },
  {
    id: 5,
    title: "JavaScript ES6 Features",
    topic: [
      {
        id: 10,
        description: "Arrow functions and template literals.",
        video_id: "-oOoTIuoL8M",
        is_completed: false,
        is_locked: true,
      },
      {
        id: 11,
        description: "Destructuring and default parameters.",
        video_id: "IEf1KAcK6A8",
        is_completed: false,
        is_locked: true,
      },
      {
        id: 12,
        description: "Modules and async/await explained.",
        video_id: "TNhaISOUy6Q",
        is_completed: false,
        is_locked: true,
      },
    ],
  },
];


export default function page() {
  return (
    <div className='w-full px-2 md:px-20 lg:px-32 h-auto '>
      <Module modules={moduleData} />
    </div>
  )
}
