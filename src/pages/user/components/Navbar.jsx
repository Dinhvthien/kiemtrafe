import React from 'react';
import { useTimer } from '../../../utils/timer';

const Navbar = ({ studentInfo, examDuration, onTimeExpired }) => {
  // Chuyển đổi từ phút sang giây cho timer
  const durationInSeconds = examDuration * 60;
  
  const handleTimeExpired = () => {
    console.log('Timer expired - calling onTimeExpired callback');
    // Gọi callback từ parent component nếu có
    if (onTimeExpired) {
      onTimeExpired();
    }
  };

  const { timeDisplay } = useTimer(durationInSeconds, handleTimeExpired);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-indigo-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <i className="fas fa-graduation-cap text-yellow-300 text-2xl"></i>
            <h1 className="text-xl font-bold tracking-wide">Hệ Thống Kiểm Tra</h1>
          </div>
         
          <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-all duration-200 transform hover:-translate-y-1">
              <i className="fas fa-user text-blue-200 mr-2"></i>
              <span className="text-sm font-medium">Họ tên: {studentInfo?.name || 'Chưa có'}</span>
            </div>
           
            <div className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-all duration-200 transform hover:-translate-y-1">
              <i className="fas fa-phone text-blue-200 mr-2"></i>
              <span className="text-sm font-medium">SĐT: {studentInfo?.phone || 'Chưa có'}</span>
            </div>
           
            <div className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-all duration-200 transform hover:-translate-y-1">
              <i className="fas fa-users text-blue-200 mr-2"></i>
              <span className="text-sm font-medium">Mã lớp: {studentInfo?.classCode || 'Chưa có'}</span>
            </div>
           
            <div className="flex items-center bg-red-500/80 px-4 py-2 rounded-md animate-pulse">
              <i className="fas fa-clock text-yellow-100 mr-2"></i>
              <span className="text-sm font-bold">Thời gian: {timeDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;