import { Link } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { useState } from "react";

function Navbar() {
  const { user, isAuthenticated } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            className="text-2xl font-bold text-white hover:text-primary-100 transition-colors duration-200"
            to="/"
          >
            DevSphere
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  className="text-white hover:text-primary-100 transition-colors duration-200 font-medium"
                  to="/"
                >
                  Home
                </Link>
                <Link
                  className="text-white hover:text-primary-100 transition-colors duration-200 font-medium"
                  to={`/profile/${user?.user_id}`}
                >
                  My Profile
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-primary-100 font-medium">
                    Welcome, {user?.username}!
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  className="text-white hover:text-primary-100 transition-colors duration-200 font-medium"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="bg-white text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  to="/signup"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:text-primary-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 rounded-lg p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-500">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  className="block text-white hover:text-primary-100 transition-colors duration-200 font-medium py-2"
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  className="block text-white hover:text-primary-100 transition-colors duration-200 font-medium py-2"
                  to={`/profile/${user?.user_id}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <div className="flex items-center space-x-3 py-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-primary-100 font-medium">
                    Welcome, {user?.username}!
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  className="block text-white hover:text-primary-100 transition-colors duration-200 font-medium py-2"
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  className="block bg-white text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-center"
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
