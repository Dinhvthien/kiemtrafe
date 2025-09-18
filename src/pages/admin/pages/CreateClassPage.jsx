import React, { useState, useEffect } from 'react';
 const apiUrl = import.meta.env.VITE_API_URL;
const CreateClassPage = () => {
  const [formData, setFormData] = useState({
    classCode: '',
    className: '',
    description: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    examIds: [],
  });
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Tải danh sách đề thi
  const fetchExams = async () => {
    try {
      const response = await fetch(`${apiUrl}/exams?page=0&size=10`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách đề thi');
      }
      const data = await response.json();
      setExams(data.result.content);
    } catch (err) {
      setError('Không thể tải danh sách đề thi');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn nhiều đề thi
  const handleExamChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => parseInt(option.value));
    setFormData((prev) => ({ ...prev, examIds: selectedOptions }));
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${apiUrl}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo lớp học');
      }

      await response.json();
      setSuccess('Tạo lớp học thành công!');
      // Reset form
      setFormData({
        classCode: '',
        className: '',
        description: '',
        startDate: '',
        endDate: '',
        imageUrl: '',
        examIds: [],
      });
    } catch (err) {
      setError('Không thể tạo lớp học');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6">Tạo lớp học mới</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mã lớp</label>
            <input
              type="text"
              name="classCode"
              value={formData.classCode}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên lớp</label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL hình ảnh</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Chọn đề thi</label>
            <select
              multiple
              name="examIds"
              value={formData.examIds}
              onChange={handleExamChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {exams.map((exam) => (
                <option key={exam.examId} value={exam.examId}>
                  {exam.title} ({exam.examCode})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều đề thi</p>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md disabled:opacity-50"
            >
              {loading ? 'Đang tạo...' : 'Tạo lớp học'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default CreateClassPage;