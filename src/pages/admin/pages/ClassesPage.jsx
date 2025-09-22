import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // để điều hướng
import { fetchWithAuth } from '../../../services/user/api';
const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchClasses = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`/classes?page=${pageNumber}&size=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
      const data = await response.json();
      setClasses(data.result.content);
      setTotalPages(data.result.totalPages);
      setPage(data.result.page);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách lớp học');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async (classId) => {
  if (!window.confirm('Bạn có chắc muốn xóa lớp học này?')) return;
  try {
    const token = localStorage.getItem("token"); // lấy token từ localStorage
    const response = await fetchWithAuth(`/classes/${classId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, // thêm token vào đây
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete class");
    }

    // Tải lại danh sách sau khi xóa
    fetchClasses(page);
  } catch (err) {
    setError("Không thể xóa lớp học");
    console.error(err);
  }
};


  const handleEdit = (classId) => {
    console.log(`Chỉnh sửa lớp học với ID: ${classId}`);
    navigate(`/classes/edit/${classId}`);
  };

  const handleAdd = () => {
    navigate('/classes/add'); // điều hướng đến trang thêm lớp
  };

  useEffect(() => {
    fetchClasses(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Danh sách lớp học</h2>
          <button
            onClick={handleAdd}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            + Thêm lớp
          </button>
        </div>
        {loading && <p className="text-gray-500">Đang tải...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Mã lớp</th>
                <th className="py-2 px-4 border-b text-left">Tên lớp</th>
                <th className="py-2 px-4 border-b text-left">Mô tả</th>
                <th className="py-2 px-4 border-b text-left">Ngày bắt đầu</th>
                <th className="py-2 px-4 border-b text-left">Ngày kết thúc</th>
                <th className="py-2 px-4 border-b text-left">Hình ảnh</th>
                <th className="py-2 px-4 border-b text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem) => (
                <tr key={classItem.classId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{classItem.classCode}</td>
                  <td className="py-2 px-4 border-b">{classItem.className}</td>
                  <td className="py-2 px-4 border-b">{classItem.description}</td>
                  <td className="py-2 px-4 border-b">{classItem.startDate}</td>
                  <td className="py-2 px-4 border-b">{classItem.endDate}</td>
                  <td className="py-2 px-4 border-b">
                    <img
                      src={classItem.imageUrl}
                      alt={classItem.className}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => (e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg')}
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(classItem.classId)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(classItem.classId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Phân trang */}
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="text-gray-700">
            Trang {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Tiếp
          </button>
        </div>
      </div>
  );
};

export default ClassesPage;
