# OnlyPlans - Event Planning & Management Platform

OnlyPlans is a comprehensive event planning and management platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides features for event creation, registration, volunteer management, and more.

## Features

-   **User Management**

    -   User registration and authentication
    -   Role-based access control (Admin, Volunteer, User)
    -   Profile management

-   **Event Management**

    -   Create and manage events
    -   Custom registration forms
    -   Event statistics and analytics
    -   File uploads for event materials
    -   Email notifications for event updates

-   **Volunteer Management**
    -   Assign volunteers to events
    -   Custom form creation for event registration
    -   Export registrations to CSV

## Tech Stack

-   **Frontend**

    -   React
    -   React Router DOM
    -   React Hook Form
    -   Tailwind CSS
    -   Lucide React (Icons)
    -   Chart.js & React-Chartjs-2
    -   Axios

-   **Backend**
    -   Node.js & Express
    -   MongoDB & Mongoose
    -   JWT Authentication
    -   Nodemailer
    -   Multer (File uploads)

## Prerequisites

-   Node.js (v14 or higher)
-   MongoDB
-   npm or yarn

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/onlyplans.git
    cd onlyplans
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a .env file in the root directory with the following variables:

    ```
    # Server Configuration
    PORT=5000
    NODE_ENV=development

    # MongoDB Configuration
    MONGODB_URI=mongodb://localhost:27017/onlyplans

    # JWT Configuration
    JWT_SECRET=your_jwt_secret_key_here
    JWT_EXPIRE=30d
    JWT_COOKIE_EXPIRE=30

    # Email Configuration (SMTP)
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_SECURE=false
    SMTP_USER=your_email@gmail.com
    SMTP_PASS=your_app_specific_password
    SMTP_FROM=OnlyPlans <noreply@onlyplans.com>

    # Client URL
    CLIENT_URL=http://localhost:5173

    # File Upload Configuration
    UPLOAD_PATH=uploads
    MAX_FILE_SIZE=5000000 # 5MB
    ```

4. Create required directories:
    ```bash
    mkdir uploads
    mkdir uploads/events
    mkdir uploads/profiles
    mkdir uploads/speakers
    ```

## Development

1. Start the development server:

    ```bash
    npm run dev
    ```

    This will start both the frontend (Vite) and backend (Node.js) servers concurrently.

2. Access the application:
    - Frontend: http://localhost:5173
    - Backend API: http://localhost:5000

## Production

1. Build the frontend:

    ```bash
    npm run build
    ```

2. Start the production server:
    ```bash
    npm start
    ```

## API Documentation

### Authentication Routes

-   POST `/api/auth/register` - Register a new user
-   POST `/api/auth/login` - Login user
-   GET `/api/auth/me` - Get current user
-   GET `/api/auth/logout` - Logout user

### Event Routes

-   GET `/api/events` - Get all events (with filters)
-   POST `/api/events` - Create new event (Admin only)
-   GET `/api/events/:id` - Get single event
-   PUT `/api/events/:id` - Update event (Admin/Volunteer)
-   DELETE `/api/events/:id` - Delete event (Admin only)
-   POST `/api/events/:id/register` - Register for event
-   PUT `/api/events/:id/registrations/:userId` - Update registration status
-   POST `/api/events/:id/volunteers` - Add volunteer to event
-   GET `/api/events/:id/export` - Export registrations to CSV

### User Routes

-   GET `/api/users` - Get all users (Admin only)
-   GET `/api/users/:id` - Get user profile
-   PUT `/api/users/:id` - Update user profile
-   PUT `/api/users/:id/role` - Update user role (Admin only)
-   GET `/api/users/:id/events` - Get user's events
-   DELETE `/api/users/:id` - Delete user (Admin only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
