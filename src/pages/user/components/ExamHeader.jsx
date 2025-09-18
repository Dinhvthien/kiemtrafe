import React from 'react';

const ExamHeader = ({ title, description }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm mb-8 border-l-4 border-blue-600">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
        {title}
      </h1>
      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ExamHeader;