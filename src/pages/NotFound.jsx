import React from "react";
import { Link } from "react-router-dom";
function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg
              className="w-24 h-24 text-red-500 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              404
            </span>
          </div>
        </div>
        <h1 className="text-6xl font-extrabold mb-4 animate-bounce">Oops!</h1>
        <p className="text-xl mb-6">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <p className="text-lg mb-8">
          Hãy kiểm tra lại URL hoặc quay lại trang chủ!
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
