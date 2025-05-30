import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	Users,
	Calendar,
	Star,
	Clipboard,
	ArrowUp,
	ArrowDown,
	TrendingUp,
	BarChart2,
	ListChecks,
} from "lucide-react";
import axios from "axios";
import Chart from "chart.js/auto";
import { Line, Bar, Doughnut } from "react-chartjs-2";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Mock data (would be fetched from API)
const mockData = {
	stats: {
		totalEvents: 27,
		totalUsers: 583,
		totalRegistrations: 1247,
		volunteerCount: 15,
		recentRegistrations: 87,
		recentEventsCreated: 5,
	},
	recentEvents: [
		{
			_id: "1",
			title: "Annual Developer Conference 2025",
			date: "2025-06-15",
			registrations: 1200,
		},
		{
			_id: "2",
			title: "Summer Music Festival",
			date: "2025-08-05",
			registrations: 5000,
		},
		{
			_id: "3",
			title: "Charity 5K Run",
			date: "2025-09-12",
			registrations: 850,
		},
	],
	eventsByCategory: {
		labels: ["Technology", "Music", "Charity", "Business", "Art", "Food"],
		data: [12, 8, 5, 7, 3, 2],
	},
	registrationsOverTime: {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
		data: [250, 320, 280, 500, 420, 380],
	},
	feedbackStats: {
		labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
		data: [350, 270, 120, 45, 25],
	},
};

const DashboardPage = () => {
	const [stats, setStats] = useState(mockData.stats);
	const [recentEvents, setRecentEvents] = useState(mockData.recentEvents);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchDashboardData = async () => {
			setIsLoading(true);
			try {
				const statsResponse = await axios.get(
					`${baseUrl}/api/admin/stats`
				);
				const eventsResponse = await axios.get(
					`${baseUrl}/api/admin/recent-events`
				);

				setStats(statsResponse.data.data);
				setRecentEvents(eventsResponse.data.data);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	// Chart configurations
	const eventsByCategoryConfig = {
		labels: mockData.eventsByCategory.labels,
		datasets: [
			{
				label: "Events by Category",
				data: mockData.eventsByCategory.data,
				backgroundColor: [
					"rgba(139, 92, 246, 0.7)", // primary
					"rgba(236, 72, 153, 0.7)", // accent
					"rgba(14, 165, 233, 0.7)", // secondary
					"rgba(34, 197, 94, 0.7)", // success
					"rgba(245, 158, 11, 0.7)", // warning
					"rgba(239, 68, 68, 0.7)", // error
				],
				borderColor: [
					"rgba(139, 92, 246, 1)",
					"rgba(236, 72, 153, 1)",
					"rgba(14, 165, 233, 1)",
					"rgba(34, 197, 94, 1)",
					"rgba(245, 158, 11, 1)",
					"rgba(239, 68, 68, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	const registrationsOverTimeConfig = {
		labels: mockData.registrationsOverTime.labels,
		datasets: [
			{
				label: "Registrations",
				data: mockData.registrationsOverTime.data,
				fill: true,
				backgroundColor: "rgba(139, 92, 246, 0.2)",
				borderColor: "rgba(139, 92, 246, 1)",
				tension: 0.4,
			},
		],
	};

	const feedbackStatsConfig = {
		labels: mockData.feedbackStats.labels,
		datasets: [
			{
				label: "User Feedback",
				data: mockData.feedbackStats.data,
				backgroundColor: [
					"rgba(34, 197, 94, 0.7)", // 5 stars - success
					"rgba(14, 165, 233, 0.7)", // 4 stars - info
					"rgba(245, 158, 11, 0.7)", // 3 stars - warning
					"rgba(249, 115, 22, 0.7)", // 2 stars - orange
					"rgba(239, 68, 68, 0.7)", // 1 star - error
				],
				borderColor: [
					"rgba(34, 197, 94, 1)",
					"rgba(14, 165, 233, 1)",
					"rgba(245, 158, 11, 1)",
					"rgba(249, 115, 22, 1)",
					"rgba(239, 68, 68, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className="animate-fade-in">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					Admin Dashboard
				</h1>
				<p className="text-gray-600 dark:text-gray-300">
					Welcome to the OnlyPlans admin dashboard. Manage events,
					users, and view insights.
				</p>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{/* Total Events */}
				<div className="card p-6 flex items-start">
					<div className="rounded-full bg-primary-100 dark:bg-primary-900/30 p-3 mr-4">
						<Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
							Total Events
						</p>
						<p className="text-2xl font-semibold text-gray-900 dark:text-white">
							{stats.totalEvents}
						</p>
						<div className="flex items-center mt-1">
							<ArrowUp className="h-4 w-4 text-success-500 mr-1" />
							<span className="text-xs font-medium text-success-500">
								+{stats.recentEventsCreated} new
							</span>
						</div>
					</div>
				</div>

				{/* Total Users */}
				<div className="card p-6 flex items-start">
					<div className="rounded-full bg-accent-100 dark:bg-accent-900/30 p-3 mr-4">
						<Users className="h-6 w-6 text-accent-600 dark:text-accent-400" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
							Total Users
						</p>
						<p className="text-2xl font-semibold text-gray-900 dark:text-white">
							{stats.totalUsers}
						</p>
						<div className="flex items-center mt-1">
							<ArrowUp className="h-4 w-4 text-success-500 mr-1" />
							<span className="text-xs font-medium text-success-500">
								+12% this month
							</span>
						</div>
					</div>
				</div>

				{/* Total Registrations */}
				<div className="card p-6 flex items-start">
					<div className="rounded-full bg-secondary-100 dark:bg-secondary-900/30 p-3 mr-4">
						<Clipboard className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
							Registrations
						</p>
						<p className="text-2xl font-semibold text-gray-900 dark:text-white">
							{stats.totalRegistrations}
						</p>
						<div className="flex items-center mt-1">
							<ArrowUp className="h-4 w-4 text-success-500 mr-1" />
							<span className="text-xs font-medium text-success-500">
								+{stats.recentRegistrations} new
							</span>
						</div>
					</div>
				</div>

				{/* Volunteers */}
				<div className="card p-6 flex items-start">
					<div className="rounded-full bg-success-100 dark:bg-success-900/30 p-3 mr-4">
						<Users className="h-6 w-6 text-success-600 dark:text-success-400" />
					</div>
					<div>
						<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
							Volunteers
						</p>
						<p className="text-2xl font-semibold text-gray-900 dark:text-white">
							{stats.volunteerCount}
						</p>
						<div className="flex items-center mt-1">
							<ArrowUp className="h-4 w-4 text-success-500 mr-1" />
							<span className="text-xs font-medium text-success-500">
								+3 this month
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
				{/* Events by Category */}
				<div className="card p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Events by Category
					</h3>
					<div className="h-64">
						<Doughnut
							data={eventsByCategoryConfig}
							options={{
								responsive: true,
								maintainAspectRatio: false,
								plugins: {
									legend: {
										position: "right",
										labels: {
											color: document.documentElement.classList.contains(
												"dark"
											)
												? "white"
												: "black",
										},
									},
								},
							}}
						/>
					</div>
				</div>

				{/* Registrations Over Time */}
				<div className="card p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Registrations Over Time
					</h3>
					<div className="h-64">
						<Line
							data={registrationsOverTimeConfig}
							options={{
								responsive: true,
								maintainAspectRatio: false,
								scales: {
									y: {
										beginAtZero: true,
										ticks: {
											color: document.documentElement.classList.contains(
												"dark"
											)
												? "white"
												: "black",
										},
										grid: {
											color: document.documentElement.classList.contains(
												"dark"
											)
												? "rgba(255, 255, 255, 0.1)"
												: "rgba(0, 0, 0, 0.1)",
										},
									},
									x: {
										ticks: {
											color: document.documentElement.classList.contains(
												"dark"
											)
												? "white"
												: "black",
										},
										grid: {
											color: document.documentElement.classList.contains(
												"dark"
											)
												? "rgba(255, 255, 255, 0.1)"
												: "rgba(0, 0, 0, 0.1)",
										},
									},
								},
								plugins: {
									legend: {
										labels: {
											color: document.documentElement.classList.contains(
												"dark"
											)
												? "white"
												: "black",
										},
									},
								},
							}}
						/>
					</div>
				</div>

				{/* Feedback Statistics */}
				<div className="card p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						User Feedback
					</h3>
					<div className="h-64">
						<Bar
							data={feedbackStatsConfig}
							options={{
								responsive: true,
								maintainAspectRatio: false,
								scales: {
									y: {
										beginAtZero: true,
										ticks: {
											color: document.documentElement.classList.contains(
												"dark"
											)
												? "white"
												: "black",
										},
										grid: {
											color: document.documentElement.classList.contains(
												"dark"
											)
												? "rgba(255, 255, 255, 0.1)"
												: "rgba(0, 0, 0, 0.1)",
										},
									},
									x: {
										ticks: {
											color: document.documentElement.classList.contains(
												"dark"
											)
												? "white"
												: "black",
										},
										grid: {
											color: document.documentElement.classList.contains(
												"dark"
											)
												? "rgba(255, 255, 255, 0.1)"
												: "rgba(0, 0, 0, 0.1)",
										},
									},
								},
								plugins: {
									legend: {
										display: false,
									},
								},
							}}
						/>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="card p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Recent Events
					</h3>
					<div className="overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
							<thead>
								<tr>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Event
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Date
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Registrations
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-dark-700">
								{recentEvents.map((event, index) => (
									<tr
										key={event._id}
										className={
											index % 2 === 0
												? "bg-white dark:bg-dark-700"
												: "bg-gray-50 dark:bg-dark-800"
										}
									>
										<td className="px-4 py-3 whitespace-nowrap">
											<Link
												to={`/admin/events/edit/${event._id}`}
												className="text-primary-600 dark:text-primary-400 hover:underline"
											>
												{event.title}
											</Link>
										</td>
										<td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
											{new Date(
												event.date
											).toLocaleDateString()}
										</td>
										<td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
											{event.registrations}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="mt-4">
						<Link
							to="/admin/events"
							className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
						>
							View all events →
						</Link>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="card p-6 mb-8">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					Quick Actions
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<Link
						to="/admin/events/create"
						className="btn bg-primary-600 hover:bg-primary-700 text-white inline-flex items-center justify-center"
					>
						<Calendar className="mr-2 h-5 w-5" />
						Create Event
					</Link>
					<Link
						to="/admin/events"
						className="btn btn-secondary inline-flex items-center justify-center"
					>
						<ListChecks className="mr-2 h-5 w-5" />
						Manage Events
					</Link>
					<Link
						to="/admin/users"
						className="btn btn-secondary inline-flex items-center justify-center"
					>
						<Users className="mr-2 h-5 w-5" />
						Manage Users
					</Link>
					<Link
						to="/admin/events/analytics"
						className="btn btn-outline inline-flex items-center justify-center"
					>
						<BarChart2 className="mr-2 h-5 w-5" />
						View Analytics
					</Link>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
