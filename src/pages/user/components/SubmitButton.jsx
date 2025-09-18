import React from 'react';

const SubmitButton = ({ onClick, isSubmitted = false }) => {
  return (
    <div className="flex justify-center mt-8 mb-12">
      <button 
        type="button" 
        onClick={onClick}
        disabled={isSubmitted}
        className={`font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
          isSubmitted 
            ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
            : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white hover:scale-105 focus:ring-blue-500"
        }`}
      >
        <div className="flex items-center">
          <span className="mr-2">{isSubmitted ? "Đã Nộp Bài" : "Nộp Bài"}</span>
          {!isSubmitted && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
};

export default SubmitButton;