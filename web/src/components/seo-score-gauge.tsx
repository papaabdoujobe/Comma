"use client";

import React from 'react';

interface SeoScoreGaugeProps {
  score: number;
}

export function SeoScoreGauge({ score }: SeoScoreGaugeProps) {
  // Determine color based on score
  let color = 'text-red-500';
  let bgColor = 'bg-red-500';
  if (score >= 80) {
    color = 'text-green-500';
    bgColor = 'bg-green-500';
  } else if (score >= 50) {
    color = 'text-yellow-500';
    bgColor = 'bg-yellow-500';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Simple SVG Donut Chart */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            className="text-gray-100"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <path
            className={`${color} transition-all duration-500 ease-in-out`}
            strokeDasharray={`${score}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{score}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-500 mt-2">Content Score</span>
    </div>
  );
}
