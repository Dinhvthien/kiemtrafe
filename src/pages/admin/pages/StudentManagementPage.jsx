import React, { useState, useEffect } from 'react';
import StudentList from '../components/StudentList';
import AddStudentModal from '../components/AddStudentModal';
import UpdateClassesModal from '../components/UpdateClassesModal';
import UpdateStudentModal from '../components/UpdateStudentModal';
import ClassStudentList from '../components/ClassStudentList';
import Notification from '../../Notification';
const apiUrl = import.meta.env.VITE_API_URL;

const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUpdateStudentModal, setShowUpdateStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "info" }), 3000);
  };

  // Tải danh sách học sinh
  const fetchStudents = async (page = 0, search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
      });
      if (search) params.append('search', search);
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/students?${params}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Không thể tải danh sách học sinh');
      const data = await response.json();
      setStudents(data.result.content || []);
      setTotalPages(data.result.totalPages || 0);
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách lớp học
  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/classes?page=0&size=10`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Không thể tải danh sách lớp học');
      const data = await response.json();
      setClasses(data.result.content || []);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  // Tải danh sách học sinh theo lớp
  const fetchStudentsByClass = async (classId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/student-class/class/${classId}/students`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tải danh sách học sinh theo lớp');
      }
      const data = await response.json();
      const students = data.result || [];
      // Lấy điểm xếp loại cho từng học sinh (giả định API)
      const studentsWithGrades = await Promise.all(
        students.map(async (student) => {
          try {
            const gradeResponse = await fetch(`${apiUrl}/students/${student.studentId}/grades`, {
              headers: { "Authorization": `Bearer ${token}` },
            });
            if (gradeResponse.ok) {
              const gradeData = await gradeResponse.json();
              return { ...student, grade: gradeData.result?.grade || 'Chưa có' };
            }
            return { ...student, grade: 'Chưa có' };
          } catch {
            return { ...student, grade: 'Chưa có' };
          }
        })
      );
      setClassStudents(studentsWithGrades);
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Thêm học sinh mới
  const handleAddStudent = async (newStudent) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/students`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newStudent),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo học sinh');
      }
      await response.json();
      showNotification('Tạo học sinh thành công!', "success");
      fetchStudents(currentPage, searchTerm);
      setShowAddModal(false);
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật học sinh
  const handleUpdateStudent = async (updatedStudent) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/students/${updatedStudent.studentId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedStudent),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật học sinh');
      }
      await response.json();
      showNotification('Cập nhật học sinh thành công!', "success");
      fetchStudents(currentPage, searchTerm);
      fetchStudentsByClass(selectedClassId); // Cập nhật danh sách lớp
      setShowUpdateStudentModal(false);
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Xóa học sinh
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/students/${studentId}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa học sinh');
      }
      await response.json();
      showNotification('Xóa học sinh thành công!', "success");
      fetchStudents(currentPage, searchTerm);
      if (selectedClassId) fetchStudentsByClass(selectedClassId); // Cập nhật danh sách lớp
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật lớp học cho học sinh
  const handleUpdateClasses = async (studentId, classIds) => {
    setLoading(true);
    try {
      if (!studentId) throw new Error('Không tìm thấy ID học sinh để cập nhật');
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/students/${studentId}/classes`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(classIds),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật lớp học');
      }
      await response.json();
      showNotification('Cập nhật lớp học thành công!', "success");
      setShowUpdateModal(false);
      if (selectedClassId) fetchStudentsByClass(selectedClassId); // Cập nhật danh sách lớp
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(0, searchTerm);
    fetchClasses();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchStudents(0, searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchStudents(page, searchTerm);
  };

  const prepareUpdateClasses = async (student) => {
    try {
      if (!student.studentId) throw new Error('Không tìm thấy ID học sinh');
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/students/${student.studentId}/with-classes`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Không thể tải thông tin lớp học');
      const data = await response.json();
      setSelectedStudent(data.result);
      setShowUpdateModal(true);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Quản lý học sinh</h2>
      <div className="flex justify-between items-center mb-4 space-x-4">
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tìm kiếm theo lớp</label>
            <select
              value={selectedClassId || ''}
              onChange={(e) => {
                const classId = e.target.value ? parseInt(e.target.value) : null;
                setSelectedClassId(classId);
                if (classId) fetchStudentsByClass(classId);
                else setClassStudents([]);
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn lớp học</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className} ({cls.classCode})
                </option>
              ))}
            </select>
          </div>
        </div>
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc số điện thoại"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md"
          >
            Tìm kiếm
          </button>
        </form>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
          onClick={() => setShowAddModal(true)}
        >
          Thêm học sinh mới
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : (
        <>
          {!selectedClassId && (
            <StudentList
              students={students}
              onUpdateClasses={(student) => prepareUpdateClasses(student)}
              onUpdate={(student) => {
                setSelectedStudent(student);
                setShowUpdateStudentModal(true);
              }}
              onDelete={handleDeleteStudent}
            />
          )}
          {selectedClassId && (
            <ClassStudentList
              students={classStudents}
              className={classes.find((c) => c.classId === selectedClassId)?.className || ''}
              classId ={selectedClassId}
              onUpdate={(student) => {
                setSelectedStudent(student);
                setShowUpdateStudentModal(true);
              }}
            />
          )}
          {!selectedClassId && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddStudent={handleAddStudent}
        classes={classes}
      />
      <UpdateClassesModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdateClasses={handleUpdateClasses}
        student={selectedStudent}
        classes={classes}
      />
      <UpdateStudentModal
        isOpen={showUpdateStudentModal}
        onClose={() => setShowUpdateStudentModal(false)}
        onUpdateStudent={handleUpdateStudent}
        student={selectedStudent}
      />
    </div>
  );
};

export default StudentManagementPage;