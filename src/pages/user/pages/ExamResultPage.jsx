import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getExamResultByStudent } from '../../../services/user/api';
import ExamResultDetail from '../components/ExamResultDetail';

const ExamResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [examResult, setExamResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamResult = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin từ location state hoặc localStorage
        const { examId, phoneNumber } = location.state || {};
        const storedExamId = localStorage.getItem('examId');
        const storedPhoneNumber = localStorage.getItem('phoneNumber');
        
        const finalExamId = examId || storedExamId;
        const finalPhoneNumber = phoneNumber || storedPhoneNumber;
        
        if (!finalExamId || !finalPhoneNumber) {
          throw new Error('Thiếu thông tin examId hoặc phoneNumber');
        }

        console.log('Fetching exam result for:', { examId: finalExamId, phoneNumber: finalPhoneNumber });
        
        const response = await getExamResultByStudent(finalExamId, finalPhoneNumber);
        
        if (response.success) {
          setExamResult(response.data);
        } else {
          throw new Error(response.message || 'Không thể lấy kết quả bài thi');
        }
      } catch (err) {
        console.error('Error fetching exam result:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamResult();
  }, [location.state]);

  const handleBackToHome = () => {
    // Clear localStorage
    localStorage.removeItem('examId');
    localStorage.removeItem('phoneNumber');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải kết quả bài thi...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">Lỗi</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleBackToHome}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ExamResultDetail examResult={examResult} />
        
        <div className="mt-8 text-center">
          <button
            onClick={handleBackToHome}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResultPage;
