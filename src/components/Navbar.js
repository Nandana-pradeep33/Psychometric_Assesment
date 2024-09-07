import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";

const Navbar = ({ handleUpdateProfile, handleLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isBackToDashboardVisible = () => {
    return (
      currentPath.startsWith("/admin/") || currentPath.startsWith("/manager/")
    );
  };
  // Function to check if the user icon should be visible
  const handleBackToDashboard = () => {
    // Extract the base path (either '/admin' or '/manager')
    const basePath = currentPath.startsWith("/admin/") ? "/admin" : "/manager";

    // Navigate back to the base path
    navigate(basePath);
  };

  const isUserIconVisible = () => {
    return currentPath === "/admin" || currentPath === "/manager";
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`bg-white p-1  fixed top-0 mb-5 w-full h-14 ${
        isUserIconVisible() ? "with-icon" : "pt-3"
      }`}
    >
      <div className="container mx-auto my-auto flex items-center justify-between space-x-28">
        <img
          src="/logo.png" // Replace with the path to your logo image
          alt="Logo"
          className="mr-2 w-18 h-8 pb-1 my-auto" // Adjust width and height based on your design
        />

        {/* User icon and dropdown for larger screens */}
        {isBackToDashboardVisible() ? (
          <Link
            to={
              isBackToDashboardVisible()
                ? currentPath.split("/").slice(0, -1).join("/")
                : "#"
            }
            className="text-black font-bold"
            style={{ fontSize: "19px", color: "green" }}
          >
            Back to Dashboard
          </Link>
        ) : (
          isUserIconVisible() && (
            <div className="hidden md:flex ml-auto">
              <div className="relative">
                <Link
                  to="#"
                  onClick={toggleNavbar}
                  className="focus:outline-none"
                >
                  <img
                    src="/th.jpeg"
                    alt="User Icon"
                    className="w-5 h-7 pt-2 "
                  />
                </Link>

                {isOpen && (
                  <div
                    className="absolute right-0 mt-2 bg-gray-800 p-4"
                    style={{ color: "white" }}
                  >
                    <a
                      href="#"
                      onClick={handleUpdateProfile}
                      className="block mb-2"
                    >
                      UpdateProfile
                    </a>
                    <a href="/resetpassword" className="block mb-2">
                      ResetPassword
                    </a>
                    <a href="#" onClick={handleLogout} className="block mb-2">
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Toggling icon for mobile */}
        {isUserIconVisible() && (
          <div className="md:hidden ml-auto">
            <div className="relative">
              <button onClick={toggleNavbar} className="focus:outline-none">
                <img src="/th.jpeg" alt="User Icon" className="w-14 h-8 pb-3" />
              </button>
              {isOpen && (
                <div
                  className="absolute right-0 mt-2 bg-gray-800 p-4"
                  style={{ color: "white" }}
                >
                  <a href="#" className="block mb-2">
                    Profile
                  </a>
                  <a href="#" className="block mb-2">
                    ResetPassword
                  </a>
                  <a href="#" className="block mb-2">
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Responsive navbar links for mobile */}
      </div>
    </nav>
  );
};

export default Navbar;
