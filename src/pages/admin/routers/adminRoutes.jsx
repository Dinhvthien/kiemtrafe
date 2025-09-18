    import React from 'react';
    import AdminLayout from '../layouts/AdminLayout';
    import Dashboard from '../pages/Dashboard';
    import ClassPage from '../pages/ClassesPage';
    import CreateClassPage from '../pages/CreateClassPage';
    import EditClassPage from '../pages/EditClassPage';
    import ExamPage from '../pages/ExamsPage';
    import StudentManagementPage from '../pages/StudentManagementPage';
    
    export const adminRoutes = [
    {
        path: '/admin',
        element: (
        <AdminLayout>
            <Dashboard />
        </AdminLayout>
        ),
    },
       {
        path: '/classes',
        element: (
        <AdminLayout>
            <ClassPage />
        </AdminLayout>
        ),
    }, 
       {
        path: '/classes/add',
        element: (
        <AdminLayout>
            <CreateClassPage />
        </AdminLayout>
        ),
    }, 
       {
        path: '/classes/edit/:classId',
        element: (
        <AdminLayout>
            <EditClassPage />
        </AdminLayout>
        ),
    }, 
     {
        path: '/exams',
        element: (
        <AdminLayout>
            <ExamPage />
        </AdminLayout>
        ),
    }
    , 
     {
        path: '/students',
        element: (
        <AdminLayout>
            <StudentManagementPage />
        </AdminLayout>
        ),
    }
    ];

    export default adminRoutes;