// src/components/Assessment/QuestionCard.jsx
import React from 'react';

const QuestionCard = ({ question, currentQuestion, totalQuestions, selectedOption, onOptionSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="mb-4">
        <span className="text-gray-500">
          Question {currentQuestion} of {totalQuestions}
        </span>
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">{question.text}</h3>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`p-3 border rounded-md cursor-pointer transition-colors duration-200 ${
              selectedOption === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onOptionSelect(option.value)}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  selectedOption === option.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedOption === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-gray-700">{option.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;