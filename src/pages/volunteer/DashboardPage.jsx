import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import {
	Calendar,
	Users,
	ClipboardList,
	CheckCircle,
	Clock,
	XCircle,
	ChevronRight,
	AlertCircle,
} from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const DashboardPage = () => {
	const { user, isVolunteer } = useAuth();
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		totalEvents: 0,
		totalRegistrations: 0,
		pendingApprovals: 0,
		upcomingEvents: [],
		totalVolunteers: 0,
		completedEvents: 0,
		pendingTasks: 0,
	});
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const [dashboardRes, eventsRes] = await Promise.all([
					axios.get(
						`${baseUrl}/api/volunteers/${
							user._id || user.id
						}/dashboard`
					),
					axios.get(`${baseUrl}/api/events`, {
						params: {
							type: "volunteering",
						},
					}),
				]);
				setStats(dashboardRes.data.data);
				setEvents(eventsRes.data.data);
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error);
				toast.error("Failed to fetch dashboard data");
			} finally {
				setLoading(false);
			}
		};

		if (user && isVolunteer) {
			fetchDashboardData();
		}
	}, [user, isVolunteer]);

	if (!isVolunteer) {
		return (
			<div className="p-8 text-center">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Access Denied
				</h2>
				<p className="text-gray-600 dark:text-gray-300">
					You must be a volunteer to access this page.
				</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="p-8 text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold text-gray-900">
				Volunteer Dashboard
			</h1>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">
								Assigned Events
							</p>
							<p className="text-2xl font-semibold">
								{stats.totalEvents}
							</p>
						</div>
						<Calendar className="h-8 w-8 text-blue-500" />
					</div>
				</div>
				<div className="bg-white p-6 rounded-lg shadow-md">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">
								Total Registrations
							</p>
							<p className="text-2xl font-semibold">
								{stats.totalRegistrations}
							</p>
						</div>
						<Users className="h-8 w-8 text-green-500" />
					</div>
				</div>
				<div className="bg-white p-6 rounded-lg shadow-md">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">
								Pending Approvals
							</p>
							<p className="text-2xl font-semibold">
								{stats.pendingApprovals}
							</p>
						</div>
						<ClipboardList className="h-8 w-8 text-yellow-500" />
					</div>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="card p-6">
					<div className="flex items-center">
						<Calendar className="h-10 w-10 text-primary-600 dark:text-primary-400" />
						<div className="ml-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Upcoming Events
							</h3>
							<p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
								{stats.upcomingEvents.length}
							</p>
						</div>
					</div>
				</div>

				<div className="card p-6">
					<div className="flex items-center">
						<Users className="h-10 w-10 text-secondary-600 dark:text-secondary-400" />
						<div className="ml-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Total Volunteers
							</h3>
							<p className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
								{stats.totalVolunteers}
							</p>
						</div>
					</div>
				</div>

				<div className="card p-6">
					<div className="flex items-center">
						<CheckCircle className="h-10 w-10 text-success-600 dark:text-success-400" />
						<div className="ml-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Completed Events
							</h3>
							<p className="text-3xl font-bold text-success-600 dark:text-success-400">
								{stats.completedEvents}
							</p>
						</div>
					</div>
				</div>

				<div className="card p-6">
					<div className="flex items-center">
						<AlertCircle className="h-10 w-10 text-warning-600 dark:text-warning-400" />
						<div className="ml-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Pending Tasks
							</h3>
							<p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
								{stats.pendingTasks}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Events List */}
			<div className="bg-white rounded-lg shadow-md">
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-lg font-semibold text-gray-900">
						Your Events
					</h2>
				</div>
				<div className="divide-y divide-gray-200">
					{events.map((event) => (
						<div key={event._id} className="p-6 hover:bg-gray-50">
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<img
										src={
											event.image ||
											`https://ui-avatars.com/api/?name=${encodeURIComponent(
												event.title
											)}&background=random`
										}
										alt={event.title}
										className="h-16 w-16 rounded-lg object-cover"
									/>
									<div className="ml-4">
										<h3 className="text-lg font-medium text-gray-900">
											{event.title}
										</h3>
										<div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
											<span className="flex items-center">
												<Calendar className="h-4 w-4 mr-1" />
												{new Date(
													event.date
												).toLocaleDateString()}
											</span>
											<span className="flex items-center">
												<Users className="h-4 w-4 mr-1" />
												{event.registrations?.length ||
													0}{" "}
												/ {event.capacity}
											</span>
											<span
												className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
													event.status === "completed"
														? "bg-green-100 text-green-800"
														: event.status ===
														  "cancelled"
														? "bg-red-100 text-red-800"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{event.status ===
													"completed" && (
													<CheckCircle className="w-3 h-3 mr-1" />
												)}
												{event.status ===
													"cancelled" && (
													<XCircle className="w-3 h-3 mr-1" />
												)}
												{event.status === "pending" && (
													<Clock className="w-3 h-3 mr-1" />
												)}
												{event.status
													.charAt(0)
													.toUpperCase() +
													event.status.slice(1)}
											</span>
										</div>
									</div>
								</div>
								<div className="flex space-x-4">
									<Link
										to={`/volunteer/forms/${event._id}`}
										className="text-blue-600 hover:text-blue-800 flex items-center"
									>
										Form Builder
										<ChevronRight className="h-4 w-4 ml-1" />
									</Link>
									<Link
										to={`/volunteer/events/${event._id}/registrations`}
										className="text-blue-600 hover:text-blue-800 flex items-center"
									>
										Registrations
										<ChevronRight className="h-4 w-4 ml-1" />
									</Link>
								</div>
							</div>
						</div>
					))}

					{events.length === 0 && (
						<div className="p-6 text-center text-gray-500">
							No events assigned yet.
						</div>
					)}
				</div>
			</div>

			{/* Upcoming Events */}
			<div className="card p-6">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
					Upcoming Events
				</h2>
				{stats.upcomingEvents.length > 0 ? (
					<div className="space-y-4">
						{stats.upcomingEvents.map((event) => (
							<div
								key={event._id}
								className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg"
							>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										{event.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-300">
										{new Date(
											event.date
										).toLocaleDateString()}
									</p>
								</div>
								<div className="text-right">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
										{event.role || "Volunteer"}
									</span>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-600 dark:text-gray-300">
						No upcoming events found.
					</p>
				)}
			</div>
		</div>
	);
};

export default DashboardPage;
