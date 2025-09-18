import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './AdminLayout.css'; // File CSS nếu cần tùy chỉnh thêm

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-50">
          {children} {/* Nội dung trang sẽ được render ở đây */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;