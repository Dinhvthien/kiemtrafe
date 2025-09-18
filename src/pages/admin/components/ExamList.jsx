import React from 'react';

const ExamList = ({ exams, onDelete, onEdit, onManageQuestions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">Mã đề</th>
            <th className="py-2 px-4 border-b text-left">Tiêu đề</th>
            <th className="py-2 px-4 border-b text-left">Thời gian (phút)</th>
            <th className="py-2 px-4 border-b text-left">Mô tả</th>
            <th className="py-2 px-4 border-b text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.examId} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{exam.examCode}</td>
              <td className="py-2 px-4 border-b">{exam.title}</td>
              <td className="py-2 px-4 border-b">{exam.duration}</td>
              <td className="py-2 px-4 border-b">{exam.description}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onEdit(exam.examId)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(exam.examId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded mr-2"
                >
                  Xóa
                </button>
                <button
                  onClick={() => onManageQuestions(exam.examId)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                >
                  Quản lý câu hỏi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamList;