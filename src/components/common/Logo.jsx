import React from 'react';
import { Calendar } from 'lucide-react';

const Logo = ({ className = 'h-8 w-8' }) => {
  return (
    <div className={`${className} flex items-center justify-center bg-gradient-to-br from-primary-600 to-accent-600 text-white rounded-lg p-1`}>
      <Calendar className="h-full w-full" />
    </div>
  );
};

export default Logo;