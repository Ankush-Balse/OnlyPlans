import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
	const [upcomingEvents, setUpcomingEvents] = useState([]);
	const [pastEvents, setPastEvents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { user, getUserEvents } = useAuth();

	useEffect(() => {
		const fetchEvents = async () => {
			if (!user?._id) return;

			setIsLoading(true);
			try {
				const { success, data } = await getUserEvents(
					user._id || user.id
				);
				if (success && data) {
					setUpcomingEvents(data.upcoming || []);
					setPastEvents(data.past || []);
				}
			} catch (error) {
				console.error("Failed to fetch events:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvents();
	}, [user?._id, getUserEvents]);

	if (!user) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
						Please log in to view your dashboard
					</h2>
					<Link to="/login" className="btn btn-primary">
						Log In
					</Link>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="animate-fade-in">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					My Dashboard
				</h1>
				<p className="text-gray-600 dark:text-gray-300">
					View and manage your upcoming and past events
				</p>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				<Link
					to="/events"
					className="card p-6 hover:shadow-lg transition-shadow"
				>
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
								Browse Events
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								Discover new events to attend
							</p>
						</div>
						<ChevronRight className="h-6 w-6 text-gray-400" />
					</div>
				</Link>

				<Link
					to="/profile"
					className="card p-6 hover:shadow-lg transition-shadow"
				>
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
								Edit Profile
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								Update your personal information
							</p>
						</div>
						<ChevronRight className="h-6 w-6 text-gray-400" />
					</div>
				</Link>

				<Link
					to="/user/events"
					className="card p-6 hover:shadow-lg transition-shadow"
				>
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
								My Events
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								View all your registered events
							</p>
						</div>
						<ChevronRight className="h-6 w-6 text-gray-400" />
					</div>
				</Link>
			</div>

			{/* Upcoming Events */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Upcoming Events
				</h2>
				{upcomingEvents && upcomingEvents.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{upcomingEvents.map((event) => (
							<Link
								key={event._id}
								to={`/events/${event._id}`}
								className="card p-6 hover:shadow-lg transition-shadow"
							>
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										{event.title}
									</h3>
									<span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
										{event.category}
									</span>
								</div>
								<div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
									<div className="flex items-center">
										<Calendar className="h-4 w-4 mr-2" />
										{new Date(
											event.date
										).toLocaleDateString()}
									</div>
									<div className="flex items-center">
										<Clock className="h-4 w-4 mr-2" />
										{new Date(
											event.date
										).toLocaleTimeString()}
									</div>
									<div className="flex items-center">
										<MapPin className="h-4 w-4 mr-2" />
										{event.location}
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-8 card">
						<p className="text-gray-600 dark:text-gray-300">
							No upcoming events found.
						</p>
						<Link
							to="/events"
							className="mt-4 btn btn-primary inline-flex items-center"
						>
							<Calendar className="h-4 w-4 mr-2" />
							Browse Events
						</Link>
					</div>
				)}
			</div>

			{/* Past Events */}
			<div>
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Past Events
				</h2>
				{pastEvents && pastEvents.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{pastEvents.map((event) => (
							<Link
								key={event._id}
								to={`/events/${event._id}`}
								className="card p-6 hover:shadow-lg transition-shadow opacity-75"
							>
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										{event.title}
									</h3>
									<span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
										{event.category}
									</span>
								</div>
								<div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
									<div className="flex items-center">
										<Calendar className="h-4 w-4 mr-2" />
										{new Date(
											event.date
										).toLocaleDateString()}
									</div>
									<div className="flex items-center">
										<Clock className="h-4 w-4 mr-2" />
										{new Date(
											event.date
										).toLocaleTimeString()}
									</div>
									<div className="flex items-center">
										<MapPin className="h-4 w-4 mr-2" />
										{event.location}
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-8 card">
						<p className="text-gray-600 dark:text-gray-300">
							No past events found.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default DashboardPage;
