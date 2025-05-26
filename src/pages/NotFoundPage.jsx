import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="h-24 w-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="btn btn-primary inline-flex items-center justify-center"
            >
              <Home size={16} className="mr-2" />
              Back to Home
            </Link>
            <Link 
              to="/events" 
              className="btn btn-outline inline-flex items-center justify-center"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;