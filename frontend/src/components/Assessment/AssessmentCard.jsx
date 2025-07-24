 import React from 'react';
import { Link } from 'react-router-dom';

const AssessmentCard = ({ assessment, onStart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{assessment.title}</h3>
      <p className="text-gray-600 mb-4">{assessment.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {assessment.questions?.length || 0} questions
        </span>
        <button
          onClick={onStart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
};

export default AssessmentCard;