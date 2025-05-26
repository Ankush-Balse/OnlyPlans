import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  Menu, X, Calendar, Users, Settings, LogOut, 
  ChevronDown, BarChart2, Home, User, FileText, 
  Sun, Moon, PlusCircle, ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Logo from '../components/common/Logo.jsx';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: <BarChart2 size={20} /> },
          { to: '/admin/events', label: 'Events', icon: <Calendar size={20} /> },
          { to: '/admin/users', label: 'Users', icon: <Users size={20} /> },
          { to: '/admin/volunteers', label: 'Volunteers', icon: <Users size={20} /> },
        ];
      case 'volunteer':
        return [
          { to: '/volunteer', label: 'Dashboard', icon: <BarChart2 size={20} /> },
          { to: '/volunteer/events', label: 'Events', icon: <Calendar size={20} /> },
        ];
      default:
        return [
          { to: '/user', label: 'Dashboard', icon: <BarChart2 size={20} /> },
          { to: '/user/events', label: 'My Events', icon: <Calendar size={20} /> },
          { to: '/user/profile', label: 'Profile', icon: <User size={20} /> },
        ];
    }
  };

  const activeNavClass = "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300";
  const navClass = "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-dark-700";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-800">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-dark-900 shadow-lg transition-transform duration-300 md:translate-x-0 md:relative md:z-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b dark:border-dark-700">
          <Link to="/" className="flex items-center">
            <Logo className="h-8 w-auto" />
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">OnlyPlans</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-800"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Sidebar Content */}
        <div className="py-4 px-4 flex flex-col h-[calc(100%-4rem)]">
          {/* User Info */}
          <div className="mb-6 pb-4 border-b dark:border-dark-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
              </span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-1 flex-grow">
            {getNavLinks().map((link, index) => (
              <NavLink
                key={index}
                to={link.to}
                end={link.to === '/admin' || link.to === '/volunteer' || link.to === '/user'}
                className={({ isActive }) =>
                  `${navClass} ${isActive ? activeNavClass : 'text-gray-700 dark:text-gray-300'}`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
            
            {/* Special links based on role */}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin/events/create"
                className={({ isActive }) =>
                  `${navClass} ${isActive ? activeNavClass : 'text-gray-700 dark:text-gray-300'}`
                }
              >
                <PlusCircle size={20} />
                <span>Create Event</span>
              </NavLink>
            )}
            
            {user?.role === 'volunteer' && (
              <div className="pt-2 mt-2 border-t dark:border-dark-700">
                <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 px-3">
                  Tools
                </div>
                <NavLink
                  to="/volunteer/form-builder/new"
                  className={({ isActive }) =>
                    `${navClass} ${isActive ? activeNavClass : 'text-gray-700 dark:text-gray-300'}`
                  }
                >
                  <FileText size={20} />
                  <span>Form Builder</span>
                </NavLink>
              </div>
            )}
          </nav>
          
          {/* Bottom Actions */}
          <div className="mt-auto pt-4 border-t dark:border-dark-700 space-y-1">
            <button
              onClick={toggleTheme}
              className={`${navClass} w-full justify-between text-gray-700 dark:text-gray-300`}
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
            </button>
            <Link to="/" className={`${navClass} text-gray-700 dark:text-gray-300`}>
              <Home size={20} />
              <span>Back to Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className={`${navClass} text-red-600 dark:text-red-400`}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-dark-900 shadow-sm z-10 border-b dark:border-dark-700">
          <div className="px-4 h-16 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-800"
            >
              <Menu size={24} />
            </button>
            
            {/* Page Title - would be dynamic based on route */}
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white md:ml-0 ml-4">
              Dashboard
            </h1>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <Link to="/events" className="hidden md:flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
                <Calendar size={16} className="mr-1" />
                Browse Events
              </Link>
              
              {/* User Menu (Mobile) */}
              <div className="relative md:hidden">
                <div className="flex">
                  <button 
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <span className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-800 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;