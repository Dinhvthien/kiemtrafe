import React from 'react';

const ExamResultDetail = ({ examResult }) => {
  if (!examResult) {
    return (
      <div className="text-center text-gray-500">
        Không có dữ liệu kết quả bài thi
      </div>
    );
  }

  const { exam, student, submission, questions } = examResult;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Kết Quả Chi Tiết Bài Thi
        </h1>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Thông tin bài thi:</h3>
              <p className="text-gray-600">Tên: {exam?.examName || 'N/A'}</p>
              <p className="text-gray-600">Thời gian: {exam?.duration || 0} phút</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Thông tin học sinh:</h3>
              <p className="text-gray-600">Tên: {student?.userName || 'N/A'}</p>
              <p className="text-gray-600">SĐT: {student?.phoneNumber || 'N/A'}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Thông tin nộp bài:</h3>
            <p className="text-gray-600">
              Thời gian nộp: {submission?.submissionTime ? new Date(submission.submissionTime).toLocaleString('vi-VN') : 'N/A'}
            </p>
            <p className="text-gray-600">
              Điểm số: {submission?.score || 0}/{questions?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Questions and Answers */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Chi Tiết Câu Trả Lời
        </h2>
        
        {questions && questions.length > 0 ? (
          questions.map((question, index) => {
            const studentAnswer = submission?.answers?.find(
              answer => answer.questionId === question.questionId
            );
            
            const correctOption = question.options?.find(option => option.isCorrect);
            question.options?.find(
              option => option.optionId === studentAnswer?.selectedOptionId
            );

            const isCorrect = correctOption?.optionId === studentAnswer?.selectedOptionId;

            return (
              <div 
                key={question.questionId} 
                className={`border-2 rounded-lg p-6 ${
                  isCorrect 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {question.content || question.questionText}
                    </h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isCorrect 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect ? 'Đúng' : 'Sai'}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {question.options?.map((option, optionIndex) => {
                    const isCorrectOption = option.isCorrect;
                    const isSelectedOption = option.optionId === studentAnswer?.selectedOptionId;
                    const optionLabel = String.fromCharCode(65 + optionIndex); // A, B, C, D

                    return (
                      <div 
                        key={option.optionId} 
                        className={`p-3 rounded-lg border-2 ${
                          isCorrectOption
                            ? 'border-green-400 bg-green-100'
                            : isSelectedOption
                            ? 'border-red-400 bg-red-100'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCorrectOption
                              ? 'bg-green-500 text-white'
                              : isSelectedOption
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {optionLabel}
                          </span>
                          <span className="flex-1 text-gray-800">
                            {option.content || option.optionLabel}
                          </span>
                          <div className="flex space-x-2">
                            {isCorrectOption && (
                              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                Đáp án đúng
                              </span>
                            )}
                            {isSelectedOption && !isCorrectOption && (
                              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                Bạn chọn
                              </span>
                            )}
                            {isSelectedOption && isCorrectOption && (
                              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                Bạn chọn (Đúng)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation if available */}
                {question.explanation && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Giải thích:</h4>
                    <p className="text-blue-700">{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-8">
            Không có câu hỏi nào
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tóm Tắt Kết Quả</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {submission?.score || 0}
            </div>
            <div className="text-gray-600">Câu đúng</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {(questions?.length || 0) - (submission?.score || 0)}
            </div>
            <div className="text-gray-600">Câu sai</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {questions?.length || 0}
            </div>
            <div className="text-gray-600">Tổng câu hỏi</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            Tỷ lệ đúng: {questions?.length > 0 ? Math.round(((submission?.score || 0) / questions.length) * 100) : 0}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResultDetail;
