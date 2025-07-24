// src/components/Assessment/ResultCard.jsx
import React from 'react';

const ResultCard = ({ result, score, maxPossibleScore, recommendations }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Assessment Results</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Your Score</h3>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-blue-600">
            {score} <span className="text-lg text-gray-500">/ {maxPossibleScore}</span>
          </div>
          <div className="text-lg font-medium text-blue-700">{result}</div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommendations</h3>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex justify-between mt-6">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300">
          Save Results
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
          Discuss with a Therapist
        </button>
      </div>
    </div>
  );
};

export default ResultCard;