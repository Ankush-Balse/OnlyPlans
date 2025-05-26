import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

const EventCard = ({ event }) => {
  // Destructure event properties
  const { 
    _id, 
    title, 
    description, 
    image, 
    date, 
    location, 
    attendeeCount,
    category,
    duration,
    tags = [] 
  } = event;
  
  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Truncate description
  const truncatedDescription = description.length > 120 
    ? `${description.substring(0, 120)}...` 
    : description;
  
  // Get category color class
  const getCategoryColorClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'technology':
        return 'bg-primary-600';
      case 'music':
        return 'bg-accent-600';
      case 'charity':
        return 'bg-secondary-600';
      case 'business':
        return 'bg-warning-600';
      case 'education':
        return 'bg-success-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="card overflow-hidden transition-all hover:shadow-lg group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image || "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {category && (
          <div className={`absolute top-0 right-0 ${getCategoryColorClass(category)} text-white px-3 py-1 text-sm font-medium`}>
            {category}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 h-14">
          {truncatedDescription}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={16} className="mr-2" />
            <span>{formattedDate}</span>
          </div>
          {location && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin size={16} className="mr-2" />
              <span>{location}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock size={16} className="mr-2" />
              <span>{duration}</span>
            </div>
          )}
          {attendeeCount !== undefined && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users size={16} className="mr-2" />
              <span>{attendeeCount} registered</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto">
          <Link 
            to={`/events/${_id}`} 
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;