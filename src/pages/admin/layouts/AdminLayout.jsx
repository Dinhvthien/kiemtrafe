import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkTokenAndRole } from '../../../services/user/auth';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const { isValid, isAdmin } = await checkTokenAndRole(token);
        if (!isValid || !isAdmin) {
          setIsAuthorized(false);
          return;
        }
        setIsAuthorized(true);
      } catch (err) {
        console.error('Error verifying access:', err);
        setIsAuthorized(false);
      }
    };

    verifyAccess();
  }, [navigate]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    navigate('/access-denied', { replace: true });
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;