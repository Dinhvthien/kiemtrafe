import React, { useState, useEffect } from 'react';

const StudentDetailModal = ({ isOpen, onClose, studentDetails, onUpdateClasses, classes }) => {
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [currentClasses, setCurrentClasses] = useState([]);

  useEffect(() => {
    if (studentDetails) {
      setCurrentClasses(studentDetails.classes || []);
      setSelectedClassIds(studentDetails.classes.map((cls) => cls.classId));
    }
  }, [studentDetails]);

  const handleClassIdsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => parseInt(option.value));
    setSelectedClassIds(selectedOptions);
  };

  const handleUpdate = () => {
    onUpdateClasses(studentDetails.student.studentId, selectedClassIds);
    onClose();
  };

  if (!isOpen || !studentDetails) return null;

  const { student } = studentDetails;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <h2 className="text-xl font-semibold mb-4">Chi tiết học sinh</h2>
        <div className="space-y-2">
          <p><strong>ID:</strong> {student.studentId}</p>
          <p><strong>Tên:</strong> {student.userName}</p>
          <p><strong>Số điện thoại:</strong> {student.phoneNumber}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Trạng thái:</strong> {student.status ? 'Hoạt động' : 'Không hoạt động'}</p>
          <h3 className="text-lg font-semibold mt-4">Quản lý lớp học</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Chọn lớp học</label>
            <select
              multiple
              value={selectedClassIds}
              onChange={handleClassIdsChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className} ({cls.classCode})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều lớp</p>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-md"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
              onClick={handleUpdate}
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;