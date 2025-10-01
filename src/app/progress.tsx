"use client";

import React from "react";
import { Play, Pause, Lock, Check } from "lucide-react";

interface CircleProgressProps {
  progress: number; // 0 to 100
  size?: number; // optional: size in px, default 100
  strokeWidth?: number; // optional: stroke width, default 8
  is_locked? : boolean;
  is_completed? : boolean;
  playing? : boolean;
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  progress,
  size = 30,
  strokeWidth = 2,
  is_locked=true,
  is_completed=false,
  playing=false
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center "
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="#fff"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#800080"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute ">
        {is_locked ? (
          <Lock size={size / 2.8} className="text-purple-700" />
        ) : playing ? (
          <Pause size={size / 2.8} className="text-purple-700" />
        ) : is_completed? (
          <Check size={size / 2.2} className="text-purple-700" />
        ) : (
          <Play size={size / 2.8} className="text-purple-700" />
        )}
      </div>
    </div>
  );
};

export default CircleProgress;
