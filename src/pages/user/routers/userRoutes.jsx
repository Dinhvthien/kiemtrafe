import React from 'react';
import UserLayout from '../layouts/UserLayout';
import Home from '../pages/Home';
import ExamTest from '../pages/ExamTest';
import ExamCheckForm from '../pages/ExamCheckForm';
import ExamPage from '../pages/ExamPage';
import ExamResultPage from '../pages/ExamResultPage';
import LoginPage from '../pages/LoginPage';

export const userRoutes = [
  {
    path: '/home',
    element: (
      <UserLayout>
        <Home />
      </UserLayout>
    ),
  },
  {
    path: '/kiem-tra',
    element: (
      <UserLayout>
        <ExamTest />
      </UserLayout>
    ),
  },
  {
    path: '/exam-check',
    element: (
      <UserLayout>
        <ExamCheckForm />
      </UserLayout>
    ),
  }
  ,
  {
    path: '/exam-page',
    element: (
      <UserLayout>
        <ExamPage />
      </UserLayout>
    ),
  },
  {
    path: '/exam-result',
    element: (
      <UserLayout>
        <ExamResultPage />
      </UserLayout>
    ),
  },
   {
    path: '/login',
    element: (
      <UserLayout>
        <LoginPage />
      </UserLayout>
    ),
  },
];

export default userRoutes;