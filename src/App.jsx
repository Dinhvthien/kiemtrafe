import { Routes, Route,Navigate } from "react-router-dom";
import { adminRoutes } from './pages/admin/routers/adminRoutes';
import { userRoutes } from './pages/user/routers/userRoutes';
// import  NotFound  from './pages/NotFound';

import AccessDeniedPage from './pages/user/pages/AccessDeniedPage';
function App() {
  return (
        <Routes>  
           {/* Trang chủ chuyển hướng */} 
          <Route path="/" element={<Navigate to="/exam-check" replace />} />
            {/* Chặn quyền truy cập */} 
          {/* <Route path="/access-denied" element={<AccessDeniedPage />} /> */}
           {/* Admin routes */}
          {adminRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {/* User routes */}
          {userRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {/* <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} /> */}
        </Routes>
  );
}

export default App;
