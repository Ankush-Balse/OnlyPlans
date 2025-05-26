import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  href,
  to,
  onClick,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 rounded-md',
    lg: 'px-6 py-3 text-lg rounded-lg'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 dark:bg-secondary-600 dark:hover:bg-secondary-700 dark:focus:ring-secondary-500',
    accent: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 dark:bg-accent-600 dark:hover:bg-accent-700 dark:focus:ring-accent-500',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 dark:bg-success-600 dark:hover:bg-success-700 dark:focus:ring-success-500',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 dark:bg-error-600 dark:hover:bg-error-700 dark:focus:ring-error-500',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 dark:bg-warning-600 dark:hover:bg-warning-700 dark:focus:ring-warning-500',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-dark-800 dark:focus:ring-gray-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-dark-800 dark:focus:ring-gray-700'
  };
  
  // Combine all classes
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  // Loading state
  const loadingContent = (
    <>
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
      <span className="ml-2 sr-only">Loading...</span>
    </>
  );
  
  // Render as link if href or to is provided
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...props}
      >
        {isLoading ? loadingContent : children}
      </a>
    );
  }
  
  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        {...props}
      >
        {isLoading ? loadingContent : children}
      </Link>
    );
  }
  
  // Otherwise render as button
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? loadingContent : children}
    </button>
  );
};

export default Button;