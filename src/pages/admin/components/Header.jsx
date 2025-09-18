import React from 'react';

const Header = () => {
  const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;