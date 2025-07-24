// src/components/Assessment/ProgressTracker.jsx
import React from 'react';

const ProgressTracker = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">
          Progress: {current}/{total}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressTracker;