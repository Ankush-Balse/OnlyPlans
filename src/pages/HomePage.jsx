import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, ChevronRight, Star, Award, Shield } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-accent-600 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight animate-slide-up">
              Event Planning Made <span className="text-secondary-300">Simple</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Create, manage, and join events with ease. The all-in-one platform for memorable experiences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/events" className="btn bg-white text-primary-700 hover:bg-gray-100 focus:ring-white">
                Browse Events
              </Link>
              <Link to="/register" className="btn bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500">
                Create Account
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center transform transition-all hover:scale-105 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-gray-100">Events Created</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center transform transition-all hover:scale-105 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-gray-100">Happy Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center transform transition-all hover:scale-105 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-gray-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Why Choose OnlyPlans?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We offer a comprehensive suite of tools to make event planning and management effortless.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 */}
            <div className="card p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Effortless Planning</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create and manage events with our intuitive interface. Set dates, locations, and details with ease.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg text-secondary-600 dark:text-secondary-400 flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Custom Registration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Build custom registration forms with various field types to collect exactly the information you need.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg text-accent-600 dark:text-accent-400 flex items-center justify-center mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Automated Reminders</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Send automatic email notifications to attendees about upcoming events and important updates.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="card p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-success-100 dark:bg-success-900/30 rounded-lg text-success-600 dark:text-success-400 flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Comprehensive Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access detailed statistics and insights about your events, attendees, and feedback.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="card p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-warning-100 dark:bg-warning-900/30 rounded-lg text-warning-600 dark:text-warning-400 flex items-center justify-center mb-4">
                <Star size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Attendee Feedback</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Collect and analyze attendee feedback to improve future events and measure satisfaction.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="card p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-error-100 dark:bg-error-900/30 rounded-lg text-error-600 dark:text-error-400 flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Role-Based Access</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Manage permissions with dedicated roles for admins, volunteers, and attendees.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gray-100 dark:bg-dark-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 md:p-12 text-white shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Next Event?</h2>
                <p className="text-lg mb-6">
                  Join thousands of event organizers who trust OnlyPlans for their event management needs.
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center btn bg-white text-primary-700 hover:bg-gray-100 focus:ring-white"
                >
                  Get Started <ChevronRight size={16} className="ml-2" />
                </Link>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Event Planning" 
                  className="rounded-lg shadow-md object-cover h-72 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of satisfied event organizers and attendees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-400 font-semibold">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Jane Doe</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Event Organizer</p>
                </div>
              </div>
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className="text-warning-500 fill-warning-500" 
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "OnlyPlans revolutionized how I manage my corporate events. The custom form builder is incredibly versatile, and the analytics help me demonstrate ROI to stakeholders."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center text-secondary-700 dark:text-secondary-400 font-semibold">
                  JS
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">John Smith</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Volunteer Coordinator</p>
                </div>
              </div>
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < 4 ? "text-warning-500 fill-warning-500" : "text-warning-500"}`} 
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Managing volunteers used to be a nightmare. With OnlyPlans, I can easily assign roles, track hours, and communicate with my team. The platform has saved us countless hours."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center text-accent-700 dark:text-accent-400 font-semibold">
                  AL
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Alex Lee</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Conference Attendee</p>
                </div>
              </div>
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className="text-warning-500 fill-warning-500" 
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "As someone who attends many industry events, OnlyPlans makes registration a breeze. I love getting timely reminders and having all my event details in one place."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Events Showcase */}
      <section className="py-16 bg-gray-50 dark:bg-dark-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Recent Events</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Check out some of our recent successful events.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Event Card 1 */}
            <div className="card overflow-hidden transition-all hover:shadow-lg group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Tech Conference" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-0 right-0 bg-primary-600 text-white px-3 py-1 text-sm font-medium">
                  Technology
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Annual Developer Conference 2025
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Join us for the biggest tech conference of the year with workshops, networking, and keynotes.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={16} className="mr-1" />
                    <span>Jun 15-17, 2025</span>
                  </div>
                  <Link to="/events/1" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Event Card 2 */}
            <div className="card overflow-hidden transition-all hover:shadow-lg group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Music Festival" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-0 right-0 bg-accent-600 text-white px-3 py-1 text-sm font-medium">
                  Music
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Summer Music Festival
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Three days of amazing performances, food, and fun for music lovers of all genres.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={16} className="mr-1" />
                    <span>Aug 5-7, 2025</span>
                  </div>
                  <Link to="/events/2" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Event Card 3 */}
            <div className="card overflow-hidden transition-all hover:shadow-lg group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Charity Run" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-0 right-0 bg-secondary-600 text-white px-3 py-1 text-sm font-medium">
                  Charity
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Charity 5K Run
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Run for a cause in our annual charity event to raise funds for children's education.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={16} className="mr-1" />
                    <span>Sep 12, 2025</span>
                  </div>
                  <Link to="/events/3" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/events" 
              className="btn btn-primary inline-flex items-center"
            >
              View All Events <ChevronRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 md:py-20 bg-white dark:bg-dark-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Stay Updated</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Subscribe to our newsletter to receive updates about new events and features.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input flex-grow"
                required
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;