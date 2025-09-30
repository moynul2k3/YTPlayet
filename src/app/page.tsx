import React from 'react'
import Video from "./play"

export default function page() {
  return (
    <div className='w-full px-2 md:px-20 lg:px-32 h-auto '>
      <div className='flex justify-between items-start max-lg:flex-col gap-10 mt-20'>
        <div className='w-[60%] bg-white/5 backdrop-blur-2xl rounded-2xl min-h-80 '>
          <Video videoId="LUQy6SSokSE" />
        </div>
        <div className='w-[40%] bg-purple-600/10 backdrop-blur-2xl rounded-2xl min-h-80 '></div>
      </div>
    </div>
  )
}
