import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, GitHub } from 'lucide-react';
import Logo from './Logo.jsx';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-900 border-t dark:border-dark-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Logo className="h-8 w-auto" />
              <h3 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">OnlyPlans</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Making event planning and management simple, organized, and delightful.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/events" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookies" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-primary-600 dark:text-primary-400 mr-2 mt-0.5" size={18} />
                <span className="text-gray-600 dark:text-gray-300">
                  123 Event Street, Suite 100<br />
                  San Francisco, CA 94103
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="text-primary-600 dark:text-primary-400 mr-2" size={18} />
                <a 
                  href="tel:+1234567890" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="text-primary-600 dark:text-primary-400 mr-2" size={18} />
                <a 
                  href="mailto:info@onlyplans.com" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  info@onlyplans.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} OnlyPlans. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <a 
                href="https://github.com/onlyplans"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 flex items-center"
              >
                <GitHub size={18} className="mr-1" />
                <span className="text-sm">View on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;