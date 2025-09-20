import React from 'react';

const Question = ({ question, index }) => {
  // Sử dụng index + 1 để hiển thị số thứ tự từ 1
  const displayNumber = index + 1;
  // Vẫn lưu questionId để nộp kết quả
  const questionId = question.questionId || question.id;
  const questionText = question.content || question.text || question.questionText;
  const questionOptions = question.options || [];

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-8 mb-8 hover:shadow-xl">
      <div className="flex items-start space-x-4 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
          <span className="text-sm font-bold">{displayNumber}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {questionText}
          </h3>
        </div>
      </div>
      
      <div className="space-y-3 pl-14">
        {questionOptions.map((option, optionIndex) => {
          // Xử lý trường hợp option là object hoặc string
          const optionValue = typeof option === 'object' ? (option.content || option.optionLabel || option.text || option.optionText) : option;
          const optionId = typeof option === 'object' ? option.optionId : optionIndex;
          const optionLabel = String.fromCharCode(65 + optionIndex); // A, B, C, D...
          
          return (
            <div 
              className="group bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-lg p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md" 
              key={optionId || optionIndex}
            >
              <label className="flex items-center cursor-pointer w-full">
                <div className="relative">
                  <input
                    type="radio"
                    name={`question_${questionId}`} // Đổi tên để dễ xử lý
                    value={optionId} // Lưu optionId thay vì optionValue
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all duration-200 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </div>
                
                <div className="ml-4 flex items-center space-x-3 flex-1">
                  <span className="bg-gray-100 group-hover:bg-blue-100 text-gray-700 group-hover:text-blue-700 rounded-md px-2 py-1 text-sm font-medium min-w-[24px] text-center transition-colors duration-200">
                    {optionLabel}
                  </span>
                  <span className="text-gray-800 font-medium leading-relaxed flex-1">
                    {optionValue}
                  </span>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Question;