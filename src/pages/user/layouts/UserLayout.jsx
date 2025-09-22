import React from 'react';
import Header from '../../user/components/Header';
import Footer from '../../user/components/Footer'; 

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow p-4 md:p-8">{children}</main>
      <Footer />
    </div>
  );
};

export default UserLayout;