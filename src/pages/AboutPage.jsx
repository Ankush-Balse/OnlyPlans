import React from 'react';
import { Users, Calendar, Award, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About OnlyPlans</h1>
            <p className="text-xl text-gray-100">
              We're revolutionizing event planning and management, making it simpler and more efficient for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white dark:bg-dark-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              At OnlyPlans, we believe that great events bring people together and create lasting memories. 
              Our mission is to provide a comprehensive platform that simplifies event planning and management, 
              allowing organizers to focus on what matters most - creating exceptional experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50 dark:bg-dark-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Community</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Building strong connections through meaningful events
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Continuously improving the event planning experience
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Delivering exceptional service and support
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-success-600 dark:text-success-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Passion</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Putting our heart into every event's success
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white dark:bg-dark-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg" 
                alt="CEO" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Michael Chen</h3>
              <p className="text-primary-600 dark:text-primary-400 mb-2">CEO & Founder</p>
              <p className="text-gray-600 dark:text-gray-300">
                Visionary leader with 15+ years in event management
              </p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg" 
                alt="CTO" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Sarah Johnson</h3>
              <p className="text-primary-600 dark:text-primary-400 mb-2">CTO</p>
              <p className="text-gray-600 dark:text-gray-300">
                Tech innovator with a passion for user experience
              </p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg" 
                alt="COO" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">Aisha Patel</h3>
              <p className="text-primary-600 dark:text-primary-400 mb-2">COO</p>
              <p className="text-gray-600 dark:text-gray-300">
                Operations expert ensuring smooth event execution
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50 dark:bg-dark-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-primary-600 dark:text-primary-400">5,000+</div>
              <p className="text-gray-600 dark:text-gray-300">Events Hosted</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-secondary-600 dark:text-secondary-400">15,000+</div>
              <p className="text-gray-600 dark:text-gray-300">Happy Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-accent-600 dark:text-accent-400">98%</div>
              <p className="text-gray-600 dark:text-gray-300">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-success-600 dark:text-success-400">50+</div>
              <p className="text-gray-600 dark:text-gray-300">Cities Covered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;