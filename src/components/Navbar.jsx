import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu } from '@headlessui/react';
import { UserCircle, LogOut, Settings, Calendar, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            OnlyPlans
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              Home
            </Link>
            <Link to="/events" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              Browse Events
            </Link>
            {user && (
              <Link to="/user/events" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                My Events
              </Link>
            )}
          </div>

          {/* Right Section: Theme Toggle + User Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  {user.role === 'admin' && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/admin"
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                  
                  {user.role === 'volunteer' && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/volunteer"
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          Volunteer Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                  )}

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/dashboard"
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 