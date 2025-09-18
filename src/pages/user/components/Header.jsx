import React, { useState } from "react";
import logo from "../../../assets/itat.png"; // Đường dẫn đến logo ITAT (thay thế nếu cần)
import { Link } from "react-router-dom";

const NAV_LINKS = [
  // { to: "/kiem-tra", label: "Kiểm tra" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Link to="/exam-check">
        <div className="flex items-center">
          <img
            src={logo}
            alt="ITAT Logo"
            className="h-8 sm:h-10 lg:h-12 w-auto object-contain"
          />
        </div>
        </Link>

        {/* Search and Login Section */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button (Visible on Mobile) */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>

          {/* Mobile Navigation Menu */}
          <div
            className={`${isMenuOpen ? "block" : "hidden"
              } absolute top-16 left-0 right-0 bg-white shadow-md md:hidden z-50`}
          >
            <nav className="flex flex-col items-center py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="py-2 text-gray-700 hover:text-red-500 font-bold uppercase"
                  onClick={toggleMenu}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-red-500 font-bold uppercase"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border border-gray-300 rounded px-4 py-2 w-40 sm:w-52 lg:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Tìm kiếm"
          />

          {/* Login Button */}
          <Link to="/login">
            <button className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded hover:bg-red-600 text-sm sm:text-base lg:text-lg">
              Đăng nhập
            </button>
          </Link>

        </div>
      </div>
    </header>
  );
};

export default Header;