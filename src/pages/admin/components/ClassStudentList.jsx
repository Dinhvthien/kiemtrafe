import React, { useState } from 'react';
import ShowDetailExamModal from '../components/ShowDetailExamModal';

const ClassStudentList = ({ students, className, classId }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("ClassStudentList - classId:", classId);
  const handleDetail = (id) => {
    setSelectedStudentId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudentId(null);
  };
  const token = localStorage.getItem('token'); 
  const handleDownloadExcel = async () => {
    try {
      const response = await fetch(`http://localhost:8080/lms/exams-result/export/${classId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải file Excel');
      }

      // Lấy dữ liệu blob từ response
      const blob = await response.blob();
      // Tạo URL tạm thời cho file
      const url = window.URL.createObjectURL(blob);
      // Tạo thẻ <a> tạm thời để kích hoạt tải file
      const link = document.createElement('a');
      link.href = url;
      link.download = `student_scores_class_${classId}.xlsx`; // Tên file tải về
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Xóa thẻ <a> sau khi tải
      window.URL.revokeObjectURL(url); // Giải phóng URL
    } catch (error) {
      console.error('Lỗi khi tải file Excel:', error);
      alert('Đã có lỗi xảy ra khi tải file Excel!');
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Danh sách sinh viên của lớp: {className}
        </h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          onClick={handleDownloadExcel}
        >
          Tải Excel
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">ID</th>
              <th className="py-3 px-4 text-left font-semibold">Tên</th>
              <th className="py-3 px-4 text-left font-semibold">Số điện thoại</th>
              <th className="py-3 px-4 text-left font-semibold">Email</th>
              <th className="py-3 px-4 text-left font-semibold">Trạng thái</th>
              <th className="py-3 px-4 text-left font-semibold">Hoàn thành kỳ thi</th>
              <th className="py-3 px-4 text-left font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((studentClass) => (
              <tr
                key={studentClass.studentClassId}
                className="hover:bg-gray-100 transition-colors"
              >
                <td className="py-3 px-4 border-b">
                  {studentClass.student.studentId}
                </td>
                <td className="py-3 px-4 border-b">
                  {studentClass.student.userName}
                </td>
                <td className="py-3 px-4 border-b">
                  {studentClass.student.phoneNumber}
                </td>
                <td className="py-3 px-4 border-b">
                  {studentClass.student.email}
                </td>
                <td className="py-3 px-4 border-b">
                  {studentClass.student.status
                    ? 'Hoạt động'
                    : 'Không hoạt động'}
                </td>
                <td className="py-3 px-4 border-b">
                  {studentClass.isCompletedExam
                    ? 'Đã hoàn thành'
                    : 'Chưa hoàn thành'}
                </td>
                <td className="py-3 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => handleDetail(studentClass.student.studentId)}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal hiển thị chi tiết */}
      {isModalOpen && (
        <ShowDetailExamModal
          studentId={selectedStudentId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ClassStudentList;