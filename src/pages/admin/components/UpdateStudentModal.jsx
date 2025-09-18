import React, { useState, useEffect } from 'react';

const UpdateStudentModal = ({ isOpen, onClose, onUpdateStudent, student }) => {
  const [updatedStudent, setUpdatedStudent] = useState({
    studentId: null,
    userName: '',
    phoneNumber: '',
    email: '',
    status: true,
  });

  useEffect(() => {
    if (student && isOpen) {
      setUpdatedStudent({
        studentId: student.studentId,
        userName: student.userName || '',
        phoneNumber: student.phoneNumber || '',
        email: student.email || '',
        status: student.status !== undefined ? student.status : true,
      });
    }
  }, [student, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdatedStudent((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStudent(updatedStudent);
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Sửa thông tin học sinh</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên học sinh</label>
            <input
              type="text"
              name="userName"
              value={updatedStudent.userName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={updatedStudent.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={updatedStudent.email}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <input
              type="checkbox"
              name="status"
              checked={updatedStudent.status}
              onChange={handleInputChange}
              className="mt-1"
            /> Hoạt động
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
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudentModal;