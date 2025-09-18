import React, { useState, useEffect } from 'react';

const ExamForm = ({ mode = 'create', exam, onSuccess }) => {
  const [formData, setFormData] = useState({
    examCode: '',
    title: '',
    description: '',
    duration: '',
  });

  useEffect(() => {
    if (mode === 'edit' && exam) {
      setFormData({
        examCode: exam.examCode || '',
        title: exam.title || '',
        description: exam.description || '',
        duration: exam.duration || '',
      });
    }
  }, [mode, exam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      let response;
      if (mode === 'create') {
        response = await fetch(`${apiUrl}/exams`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else if (mode === 'edit' && exam?.examId) {
        response = await fetch(`${apiUrl}/exams/${exam.examId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        throw new Error(`Không thể ${mode === 'create' ? 'tạo' : 'cập nhật'} đề thi: ${await response.text()}`);
      }

      onSuccess();
    } catch (err) {
      console.error(`Lỗi ${mode} đề thi:`, err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Mã đề thi</label>
        <input
          type="text"
          name="examCode"
          value={formData.examCode}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Thời gian (phút)</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        {mode === 'create' ? 'Tạo' : 'Lưu'}
      </button>
    </form>
  );
};

export default ExamForm;