import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Footer from '../components/common/Footer.jsx';
import Logo from '../components/common/Logo.jsx';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Handle scroll for transparent header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'volunteer':
        return '/volunteer';
      default:
        return '/user';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">OnlyPlans</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/events" 
                className="text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Events
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 font-medium transition-colors"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Contact
              </Link>
            </nav>
            
            {/* Right side items */}
            <div className="hidden md:flex items-center">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700 mr-2"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 btn-outline">
                    <span>{user?.name || 'User'}</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-md shadow-lg overflow-hidden z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="py-1">
                      <Link to={getDashboardLink()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-600">
                        Dashboard
                      </Link>
                      <Link to="/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-600">
                        Profile
                      </Link>
                      <button 
                        onClick={logout} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-600"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link to="/login" className="btn btn-outline">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-dark-800 shadow-lg">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
            >
              Events
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
            >
              Contact
            </Link>
            
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {isAuthenticated ? (
                <>
                  <div className="px-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">{user?.name || 'User'}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email}</div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link 
                      to={getDashboardLink()} 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/user/profile" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={logout} 
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-3 px-3 space-y-1">
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow pt-16 md:pt-20">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;