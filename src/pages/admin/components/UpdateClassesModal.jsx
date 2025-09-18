import React, { useState, useEffect } from 'react';

const UpdateClassesModal = ({ isOpen, onClose, onUpdateClasses, student, classes }) => {
  const [classIds, setClassIds] = useState([]);

  useEffect(() => {
    if (student && isOpen) {
      // Kiểm tra nếu student.classes tồn tại và là mảng trước khi map
      setClassIds(student.classes && Array.isArray(student.classes) ? student.classes.map((cls) => cls.classId || cls) : []);
    }
  }, [student, isOpen]);

  const handleClassIdsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => parseInt(option.value));
    setClassIds(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("UpdateClassesModal - Student object:", student);
    console.log("UpdateClassesModal - Student ID:", student.studentId);
    console.log("UpdateClassesModal - Class IDs:", classIds);
    
    // Kiểm tra cấu trúc student object - có thể có student.student hoặc student.studentId
    const studentId = student.studentId || (student.student && student.student.studentId);
    
    if (!studentId) {
      console.error("Student ID is undefined! Student structure:", student);
      return;
    }
    
    onUpdateClasses(studentId, classIds);
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Cập nhật lớp học cho {student.userName || (student.student && student.student.userName)}</h2>
        <p className="text-sm text-gray-600 mb-4">Các lớp hiện tại: {student.classes && Array.isArray(student.classes) ? student.classes.map((cls) => cls.className || cls.toString()).join(', ') : 'Không có'}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Chọn lớp học</label>
            <select
              multiple
              value={classIds}
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
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-md"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateClassesModal;