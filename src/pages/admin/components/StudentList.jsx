
import React from 'react';

const StudentList = ({ students, onUpdateClasses, onUpdate, onDelete }) => (
  <div className="mt-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh sách học sinh</h2>
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">ID</th>
            <th className="py-3 px-4 text-left font-semibold">Tên</th>
            <th className="py-3 px-4 text-left font-semibold">Số điện thoại</th>
            <th className="py-3 px-4 text-left font-semibold">Email</th>
            <th className="py-3 px-4 text-left font-semibold">Trạng thái</th>
            <th className="py-3 px-4 text-left font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentId} className="hover:bg-gray-100 transition-colors">
              <td className="py-3 px-4 border-b">{student.studentId}</td>
              <td className="py-3 px-4 border-b">{student.userName}</td>
              <td className="py-3 px-4 border-b">{student.phoneNumber}</td>
              <td className="py-3 px-4 border-b">{student.email}</td>
              <td className="py-3 px-4 border-b">{student.status ? 'Hoạt động' : 'Không hoạt động'}</td>
              <td className="py-3 px-4 border-b">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2 transition"
                  onClick={() => onUpdateClasses(student)}
                >
                  Cập nhật lớp
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white px-3 py-1 rounded-md mr-2 transition"
                  onClick={() => onUpdate(student)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
                  onClick={() => onDelete(student.studentId)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default StudentList;