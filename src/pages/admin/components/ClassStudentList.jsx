
import React from 'react';

const ClassStudentList = ({ students, className }) => (
  <div className="mt-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh sách sinh viên của lớp: {className}</h2>
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
          </tr>
        </thead>
        <tbody>
          {students.map((studentClass) => (
            <tr key={studentClass.studentClassId} className="hover:bg-gray-100 transition-colors">
              <td className="py-3 px-4 border-b">{studentClass.student.studentId}</td>
              <td className="py-3 px-4 border-b">{studentClass.student.userName}</td>
              <td className="py-3 px-4 border-b">{studentClass.student.phoneNumber}</td>
              <td className="py-3 px-4 border-b">{studentClass.student.email}</td>
              <td className="py-3 px-4 border-b">{studentClass.student.status ? 'Hoạt động' : 'Không hoạt động'}</td>
              <td className="py-3 px-4 border-b">{studentClass.isCompletedExam ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ClassStudentList;