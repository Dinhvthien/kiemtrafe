import React, { useEffect } from 'react';

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
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

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md mx-auto transform transition-all">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Xác nhận nộp bài</h2>
          <p className="text-gray-700 mb-6">Bạn có chắc chắn muốn nộp bài không?</p>
          <div className="flex justify-end space-x-3">
            <button 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
              onClick={onCancel}
            >
              Hủy
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={onConfirm}
            >
              Nộp bài
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;