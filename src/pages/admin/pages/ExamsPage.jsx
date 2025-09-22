import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExamList from '../components/ExamList';
import ExamForm from '../components/ExamForm';
import QuestionForm from '../components/QuestionForm';
import { fetchWithAuth } from '../../../services/user/api';
const ExamsPage = () => {
  useNavigate();
  const [exams, setExams] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [editExam, setEditExam] = useState(null);

  const fetchExams = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/exams?page=${pageNumber}&size=10`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách đề thi');
      }
      const data = await response.json();
      setExams(data.result.content);
      setTotalPages(data.result.totalPages);
      setPage(data.result.page);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách đề thi: ' + err.message);
      console.error('Lỗi fetchExams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleCreateExam = () => {
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
  };

  const handleFormSubmitSuccess = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    fetchExams(page);
  };

  const handleQuestionModalOpen = (examId) => {
    console.log('Mở modal quản lý câu hỏi cho examId:', examId);
    setSelectedExamId(examId);
    setShowQuestionModal(true);
  };

  const handleQuestionModalClose = () => {
    setShowQuestionModal(false);
    setSelectedExamId(null);
  };

  const handleQuestionSubmitSuccess = () => {
    setShowQuestionModal(false);
    setSelectedExamId(null);
    fetchExams(page);
  };

  const handleEditExam = async (examId) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/exams/${examId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Không thể tải thông tin đề thi');
      }
      const data = await response.json();
      setEditExam(data.result || data); // Cập nhật để hỗ trợ cả trường hợp không có 'result'
      setSelectedExamId(examId);
      setShowEditForm(true);
    } catch (err) {
      setError('Không thể tải thông tin đề thi: ' + err.message);
      console.error('Lỗi fetchExam:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Quản lý đề thi</h2>
        <button
          onClick={handleCreateExam}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Tạo đề thi mới
        </button>
      </div>
      {loading && <p className="text-gray-500">Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ExamList
        exams={exams}
        onDelete={async (examId) => {
          if (window.confirm('Bạn có chắc muốn xóa đề thi này?')) {
            try {
              const response = await fetchWithAuth(`/exams/${examId}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              if (!response.ok) {
                throw new Error('Không thể xóa đề thi: ' + (await response.text()));
              }
              fetchExams(page);
            } catch (err) {
              setError('Không thể xóa đề thi: ' + err.message);
              console.error('Lỗi xóa:', err);
            }
          }
        }}
        onEdit={handleEditExam}
        onManageQuestions={handleQuestionModalOpen}
      />
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span className="text-gray-700">Trang {page + 1} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Tiếp
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Tạo đề thi mới</h3>
            <ExamForm
              onClose={handleFormClose}
              onSuccess={handleFormSubmitSuccess}
            />
            <button
              onClick={handleFormClose}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showQuestionModal && selectedExamId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Quản lý câu hỏi cho đề thi ID: {selectedExamId}</h3>
            <QuestionForm
              examId={selectedExamId}
              onClose={handleQuestionModalClose}
              onSuccess={handleQuestionSubmitSuccess}
            />
            <button
              onClick={handleQuestionModalClose}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showEditForm && selectedExamId && editExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Sửa đề thi ID: {selectedExamId}</h3>
            <ExamForm
              mode="edit"
              exam={editExam}
              onClose={handleFormClose}
              onSuccess={handleFormSubmitSuccess}
            />
            <button
              onClick={handleFormClose}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamsPage;