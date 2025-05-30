import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AdminRoute from "./components/AdminRoute";
import VolunteerRoute from "./components/VolunteerRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

// Public Pages
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import About from "./pages/AboutPage";
import Contact from "./pages/ContactPage";
import NotFound from "./pages/NotFoundPage";

// User Pages
import Profile from "./pages/user/ProfilePage";
import UserDashboard from "./pages/user/DashboardPage";
import UserEvents from "./pages/user/EventsPage";

// Event Pages
import EventDetails from "./pages/EventDetailsPage";
import Events from "./pages/EventsPage";

// Admin Pages
import AdminDashboard from "./pages/admin/DashboardPage";
import UserManagement from "./pages/admin/UserManagementPage";
import Statistics from "./pages/admin/StatisticsPage";
import CreateEvent from "./pages/admin/CreateEventPage";
import EditEvent from "./pages/admin/EditEventPage";
import EventAnalytics from "./pages/admin/EventAnalyticsPage";
import EventsManagementPage from "./pages/admin/EventsManagementPage";
import AssignVolunteersPage from "./pages/admin/AssignVolunteersPage";

// Volunteer Pages.
import VolunteerDashboard from "./pages/volunteer/DashboardPage";
import FormBuilder from "./pages/volunteer/FormBuilderPage";
import EventRegistrations from "./pages/volunteer/EventRegistrationsPage";

function App() {
	return (
		// <Router>
		<ThemeProvider>
			<AuthProvider>
				<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col text-gray-900 dark:text-gray-100 transition-colors">
					<Toaster position="top-right" />
					<Navbar />

					<main className="flex-grow container mx-auto px-4 py-8">
						<Routes>
							{/* Public Routes */}
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/about" element={<About />} />
							<Route path="/contact" element={<Contact />} />
							<Route path="/events" element={<Events />} />

							{/* Protected Routes */}
							<Route
								path="/events/:id"
								element={
									<PrivateRoute>
										<EventDetails />
									</PrivateRoute>
								}
							/>

							{/* User Routes */}
							<Route
								path="/profile"
								element={
									<PrivateRoute>
										<Profile />
									</PrivateRoute>
								}
							/>
							<Route
								path="/dashboard"
								element={
									<PrivateRoute>
										<UserDashboard />
									</PrivateRoute>
								}
							/>
							<Route
								path="/user/events"
								element={
									<PrivateRoute>
										<UserEvents />
									</PrivateRoute>
								}
							/>

							{/* Admin Routes */}
							<Route
								path="/admin"
								element={
									<AdminRoute>
										<AdminDashboard />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/users"
								element={
									<AdminRoute>
										<UserManagement />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/events/analytics"
								element={
									<AdminRoute>
										<EventAnalytics />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/statistics"
								element={
									<AdminRoute>
										<Statistics />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/events"
								element={
									<AdminRoute>
										<EventsManagementPage />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/events/:eventId/volunteers"
								element={
									<AdminRoute>
										<AssignVolunteersPage />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/events/create"
								element={
									<AdminRoute>
										<CreateEvent />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/events/:id/edit"
								element={
									<AdminRoute>
										<EditEvent />
									</AdminRoute>
								}
							/>

							{/* Volunteer Routes */}
							<Route
								path="/volunteer"
								element={
									<VolunteerRoute>
										<VolunteerDashboard />
									</VolunteerRoute>
								}
							/>
							<Route
								path="/volunteer/forms/:eventId"
								element={
									<VolunteerRoute>
										<FormBuilder />
									</VolunteerRoute>
								}
							/>
							<Route
								path="/volunteer/events/:eventId/registrations"
								element={
									<VolunteerRoute>
										<EventRegistrations />
									</VolunteerRoute>
								}
							/>

							{/* 404 Route */}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</main>

					<Footer />
				</div>
			</AuthProvider>
		</ThemeProvider>
		// </Router>
	);
}

export default App;
