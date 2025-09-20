import React from 'react';

const Header = () => {
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      // gọi API logout
      const response = await fetch("http://localhost:8080/lms/auth/logout", {
        method: "POST", // hoặc "DELETE" tuỳ backend bạn định nghĩa
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // nếu backend check JWT từ header
        },
        body: JSON.stringify({ token }), // nếu backend nhận token trong body
      });

      if (!response.ok) {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      // Xoá token và redirect về login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
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
