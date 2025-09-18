import React, { useState } from 'react';

const AddStudentModal = ({ isOpen, onClose, onAddStudent, classes }) => {
  const [newStudent, setNewStudent] = useState({
    userName: '',
    phoneNumber: '',
    email: '',
    classIds: [],
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let errorMsg = '';

    if (name === 'phoneNumber') {
      // Regex số điện thoại VN (0xxxxxxxxx hoặc +84xxxxxxxxx)
      if (!/^(0\d{9}|(\+84)\d{9})$/.test(value)) {
        errorMsg = 'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)';
      }
    }

    if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMsg = 'Email không hợp lệ';
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
    validateField(name, value); // validate realtime
  };

  const handleClassIdsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      parseInt(option.value)
    );
    setNewStudent((prev) => ({ ...prev, classIds: selectedOptions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // kiểm tra toàn bộ trước khi submit
    validateField('phoneNumber', newStudent.phoneNumber);
    validateField('email', newStudent.email);

    if (errors.phoneNumber || errors.email) return;

    onAddStudent(newStudent);
    setNewStudent({ userName: '', phoneNumber: '', email: '', classIds: [] });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Thêm học sinh mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên học sinh</label>
            <input
              type="text"
              name="userName"
              value={newStudent.userName}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={newStudent.phoneNumber}
              onChange={handleInputChange}
              className={`mt-1 block w-full p-2 border rounded-md focus:outline-none 
                         focus:ring-2 ${
                           errors.phoneNumber
                             ? 'border-red-500 focus:ring-red-500'
                             : 'border-gray-300 focus:ring-blue-500'
                         }`}
              required
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={newStudent.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full p-2 border rounded-md focus:outline-none 
                         focus:ring-2 ${
                           errors.email
                             ? 'border-red-500 focus:ring-red-500'
                             : 'border-gray-300 focus:ring-blue-500'
                         }`}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Classes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Chọn lớp học</label>
            <select
              multiple
              value={newStudent.classIds}
              onChange={handleClassIdsChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className} ({cls.classCode})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều lớp
            </p>
          </div>

          {/* Buttons */}
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
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
