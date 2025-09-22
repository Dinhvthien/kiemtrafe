import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../services/user/api";

const ShowDetailExamModal = ({ studentId, onClose }) => {
  const [examResults, setExamResults] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [studentInfo, setStudentInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API thực tế
        const response = await fetchWithAuth(`/students/${studentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Thêm Authorization header nếu cần
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Kiểm tra response format từ ApiResponse
        if (data.code === 200 && data.result) {
          const { student, exams } = data.result;
          
          // Map studentId thành id để phù hợp với component
          const studentWithId = {
            ...student,
            id: student.studentId
          };

          setStudentInfo(studentWithId);
          setExamResults(exams || []);
          
          // Chọn mặc định bài thi đầu tiên nếu có
          if (exams && exams.length > 0) {
            setSelectedExam(exams[0]);
          }
        } else {
          // Xử lý trường hợp API trả về lỗi
          throw new Error(data.message || 'Không thể lấy dữ liệu');
        }

      } catch (err) {
        console.error("Lỗi fetch exam result:", err);
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
        
        // Fallback với mock data để test UI (có thể xóa sau khi API hoàn thiện)
        const mock = {
          student: {
            id: studentId,
            userName: "Nguyen Van A",
            phoneNumber: "0123456789",
            email: "vana@example.com",
          },
          exams: [
            {
              examId: "exam1",
              className: "Toán học",
              examName: "Bài kiểm tra Toán",
              questions: [
                {
                  content: "1 + 1 = ?",
                  correctAnswer: "2",
                  studentAnswer: "2",
                },
                {
                  content: "5 * 3 = ?",
                  correctAnswer: "15",
                  studentAnswer: "12",
                },
              ],
            },
            {
              examId: "exam2",
              className: "Tiếng Anh",
              examName: "Bài kiểm tra Tiếng Anh",
              questions: [
                {
                  content: "Dog nghĩa là gì?",
                  correctAnswer: "Con chó",
                  studentAnswer: "Con mèo",
                },
                {
                  content: "Cat nghĩa là gì?",
                  correctAnswer: "Con mèo",
                  studentAnswer: "Con mèo",
                },
              ],
            },
          ],
        };

        setStudentInfo(mock.student);
        setExamResults(mock.exams);
        setSelectedExam(mock.exams[0]);
        
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchExamResults();
    }
  }, [studentId]);

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-gray-700">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && examResults.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Thử lại
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-4xl rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Chi tiết bài thi
              {error && (
                <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Đang dùng dữ liệu mẫu
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">ID:</span> {studentInfo.id} &nbsp;|&nbsp; 
              <span className="font-semibold">Tên:</span> {studentInfo.userName} &nbsp;|&nbsp; 
              <span className="font-semibold">SĐT:</span> {studentInfo.phoneNumber} &nbsp;|&nbsp; 
              <span className="font-semibold">Email:</span> {studentInfo.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Nút chọn lớp/bài thi */}
        {examResults.length > 0 ? (
          <div className="flex gap-2 p-4 border-b overflow-x-auto">
            {examResults.map((exam) => (
              <button
                key={exam.examId}
                onClick={() => setSelectedExam(exam)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedExam?.examId === exam.examId
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {exam.className || exam.examName || `Bài thi ${exam.examId}`}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 border-b">
            <p className="text-gray-500 text-center">Không có dữ liệu bài thi</p>
          </div>
        )}

        {/* Danh sách câu hỏi */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {selectedExam?.questions && selectedExam.questions.length > 0 ? (
            selectedExam.questions.map((q, index) => (
              <div
                key={index}
                className="border-b py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="font-semibold text-gray-800">
                    Câu {index + 1}: {q.content}
                  </p>
                  <p className="text-sm text-green-600">
                    Đáp án đúng: {q.correctAnswer}
                  </p>
                  <p
                    className={`text-sm ${
                      q.correctAnswer === q.studentAnswer
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    Bạn chọn: {q.studentAnswer || "Không trả lời"}
                  </p>
                </div>
                {q.correctAnswer === q.studentAnswer ? (
                  <span className="text-green-600 font-bold">✔ Đúng</span>
                ) : (
                  <span className="text-red-600 font-bold">✘ Sai</span>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có câu hỏi nào trong bài thi này</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t text-right">
          {error && (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mr-2"
            >
              Tải lại
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowDetailExamModal;