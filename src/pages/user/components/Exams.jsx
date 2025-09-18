import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ExamList = () => {
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const API_URL = import.meta.env.VITE_API_URL;
  // Fetch data from API
  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const response = await fetch(`${API_URL}/classes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const mappedClassList = data.result.content.map((classItem) => ({
          id: classItem.classId,
          classCode: classItem.classCode,
          title: classItem.className,
          imageUrl: classItem.imageUrl,
        }));
        setClassList(mappedClassList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassList();
  }, []); // Chạy một lần khi component mount

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-600">Đang tải danh sách lớp...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        Danh sách lớp
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classList.map((exam) => (
          <div
            key={exam.id}
            className="relative bg-white shadow-lg rounded-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
            {/* Background image with fallback */}
            <div
              className="w-full h-48 sm:h-56 lg:h-64 bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: `url(${exam.imageUrl || ""})`,
              }}
            >
              {!exam.imageUrl && (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <p className="text-white text-center px-4">Hình ảnh không có sẵn</p>
                </div>
              )}
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <h2 className="text-white text-xl sm:text-xl font-semibold drop-shadow-lg">
                {exam.title}
              </h2>
              <Link
                to={`/exam-check`}
                className="self-end bg-red-600 text-white px-4 py-2 rounded-lg 
                         hover:bg-red-700 transition-all duration-300 
                         opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                         font-medium shadow-lg hover:shadow-xl"
              >
                Bắt đầu làm bài
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamList;