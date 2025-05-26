import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/common/Logo.jsx';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm();

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const success = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      if (success) {
        navigate('/login', { 
          state: { message: 'Account created successfully. Please login.' } 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="card max-w-md w-full p-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center mb-8">
          <Logo className="h-12 w-12 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h2>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
            Join OnlyPlans to discover and create amazing events
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="label">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className={`input ${errors.name ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              {...register('name', { 
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`input ${errors.email ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.email.message}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`input pr-10 ${errors.password ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                  }
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                onClick={toggleShowPassword}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.password.message}</p>
            )}
          </div>
          
          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`input ${errors.confirmPassword ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:focus:ring-primary-800 dark:bg-dark-700"
              {...register('terms', { 
                required: 'You must agree to the terms and conditions'
              })}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Terms and Conditions
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.terms.message}</p>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn btn-primary flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus size={16} className="mr-2" />
                Create Account
              </>
            )}
          </button>
        </form>
        
        {/* Sign in link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;