import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResultModal = ({ isOpen, message, onClose, studentInfo }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Ngăn cuộn trang khi modal mở
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    navigate('/'); // Chuyển về trang home
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md mx-auto transform transition-all">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Thông báo</h2>
          <p id="resultMessage" className="text-gray-700 mb-6">{message || "Bài thi đã được nộp thành công!"}</p>
          
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Thông tin thí sinh</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center">
                <i className="fas fa-user mr-2 text-blue-600"></i>
                <span className="font-medium">Họ tên:</span> 
                <span className="ml-2">{studentInfo?.name || localStorage.getItem('userName') || ''}</span>
              </p>
              <p className="flex items-center">
                <i className="fas fa-phone mr-2 text-blue-600"></i>
                <span className="font-medium">SĐT:</span> 
                <span className="ml-2">{studentInfo?.phone || localStorage.getItem('userPhoneNumber') || ''}</span>
              </p>
              <p className="flex items-center">
                <i className="fas fa-users mr-2 text-blue-600"></i>
                <span className="font-medium">Mã lớp:</span> 
                <span className="ml-2">{studentInfo?.classCode || localStorage.getItem('userClassCode') || ''}</span>
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              id="closeResult" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
              onClick={handleClose}
            >
              <span>Về trang chủ</span>
              <i className="fas fa-home ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResultModal;