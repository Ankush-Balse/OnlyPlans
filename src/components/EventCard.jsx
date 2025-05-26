import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';
import PropTypes from 'prop-types';

const EventCard = ({ event }) => {
  const {
    _id,
    title,
    description,
    date,
    location,
    capacity,
    registrations,
    tags,
    image
  } = event;

  const registeredCount = registrations?.length || 0;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Link
      to={`/events/${_id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <img
          src={image || 'https://via.placeholder.com/400x200'}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50" />
        <div className="absolute top-4 right-4 flex gap-2">
          {tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>
              {registeredCount} / {capacity} registered
              {registeredCount >= capacity && (
                <span className="ml-2 text-red-500">(Full)</span>
              )}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    registrations: PropTypes.array,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.string
  }).isRequired
};

export default EventCard; 