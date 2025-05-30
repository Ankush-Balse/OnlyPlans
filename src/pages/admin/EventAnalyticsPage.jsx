import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Calendar, Users, Star, TrendingUp } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const EventAnalyticsPage = () => {
	const [stats, setStats] = useState({
		totalEvents: 0,
		totalRegistrations: 0,
		averageRating: 0,
		completionRate: 0,
	});
	const [loading, setLoading] = useState(true);
	const [timeRange, setTimeRange] = useState("month"); // month, quarter, year
	const [chartData, setChartData] = useState({
		registrations: {
			labels: [],
			data: [],
		},
		categories: {
			labels: [],
			data: [],
		},
		ratings: {
			labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
			data: [],
		},
	});

	useEffect(() => {
		fetchAnalytics();
	}, [timeRange]);

	const fetchAnalytics = async () => {
		try {
			const response = await axios.get(
				`${baseUrl}/api/admin/analytics?timeRange=${timeRange}`
			);
			const data = response.data.data;

			setStats(data.stats);
			setChartData({
				registrations: {
					labels: data.registrations.labels,
					data: data.registrations.data,
				},
				categories: {
					labels: data.categories.labels,
					data: data.categories.data,
				},
				ratings: {
					labels: [
						"5 Stars",
						"4 Stars",
						"3 Stars",
						"2 Stars",
						"1 Star",
					],
					data: data.ratings.data,
				},
			});
		} catch (error) {
			console.error("Error fetching analytics:", error);
			toast.error("Failed to fetch analytics data");
		} finally {
			setLoading(false);
		}
	};

	const registrationsConfig = {
		labels: chartData.registrations.labels,
		datasets: [
			{
				label: "Registrations",
				data: chartData.registrations.data,
				fill: true,
				backgroundColor: "rgba(139, 92, 246, 0.2)",
				borderColor: "rgba(139, 92, 246, 1)",
				tension: 0.4,
			},
		],
	};

	const categoriesConfig = {
		labels: chartData.categories.labels,
		datasets: [
			{
				label: "Events by Category",
				data: chartData.categories.data,
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

	const ratingsConfig = {
		labels: chartData.ratings.labels,
		datasets: [
			{
				label: "Ratings Distribution",
				data: chartData.ratings.data,
				backgroundColor: [
					"rgba(34, 197, 94, 0.7)", // 5 stars
					"rgba(14, 165, 233, 0.7)", // 4 stars
					"rgba(245, 158, 11, 0.7)", // 3 stars
					"rgba(249, 115, 22, 0.7)", // 2 stars
					"rgba(239, 68, 68, 0.7)", // 1 star
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

	if (loading) {
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
					Event Analytics
				</h1>
				<p className="text-gray-600 dark:text-gray-300">
					Comprehensive analytics and insights for your events
				</p>
			</div>

			{/* Time Range Selector */}
			<div className="mb-8">
				<div className="inline-flex rounded-lg border border-gray-200 dark:border-dark-700">
					<button
						className={`px-4 py-2 rounded-l-lg ${
							timeRange === "month"
								? "bg-primary-600 text-white"
								: "hover:bg-gray-50 dark:hover:bg-dark-700"
						}`}
						onClick={() => setTimeRange("month")}
					>
						Month
					</button>
					<button
						className={`px-4 py-2 border-l border-gray-200 dark:border-dark-700 ${
							timeRange === "quarter"
								? "bg-primary-600 text-white"
								: "hover:bg-gray-50 dark:hover:bg-dark-700"
						}`}
						onClick={() => setTimeRange("quarter")}
					>
						Quarter
					</button>
					<button
						className={`px-4 py-2 rounded-r-lg border-l border-gray-200 dark:border-dark-700 ${
							timeRange === "year"
								? "bg-primary-600 text-white"
								: "hover:bg-gray-50 dark:hover:bg-dark-700"
						}`}
						onClick={() => setTimeRange("year")}
					>
						Year
					</button>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="card p-6">
					<div className="flex items-center">
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
						</div>
					</div>
				</div>

				<div className="card p-6">
					<div className="flex items-center">
						<div className="rounded-full bg-accent-100 dark:bg-accent-900/30 p-3 mr-4">
							<Users className="h-6 w-6 text-accent-600 dark:text-accent-400" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Total Registrations
							</p>
							<p className="text-2xl font-semibold text-gray-900 dark:text-white">
								{stats.totalRegistrations}
							</p>
						</div>
					</div>
				</div>

				<div className="card p-6">
					<div className="flex items-center">
						<div className="rounded-full bg-secondary-100 dark:bg-secondary-900/30 p-3 mr-4">
							<Star className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Average Rating
							</p>
							<p className="text-2xl font-semibold text-gray-900 dark:text-white">
								{stats.averageRating.toFixed(1)}
							</p>
						</div>
					</div>
				</div>

				<div className="card p-6">
					<div className="flex items-center">
						<div className="rounded-full bg-success-100 dark:bg-success-900/30 p-3 mr-4">
							<TrendingUp className="h-6 w-6 text-success-600 dark:text-success-400" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Completion Rate
							</p>
							<p className="text-2xl font-semibold text-gray-900 dark:text-white">
								{stats.completionRate}%
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
				{/* Registrations Over Time */}
				<div className="card p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Registrations Over Time
					</h3>
					<div className="h-64">
						<Line
							data={registrationsConfig}
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

				{/* Events by Category */}
				<div className="card p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Events by Category
					</h3>
					<div className="h-64">
						<Doughnut
							data={categoriesConfig}
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

				{/* Ratings Distribution */}
				<div className="card p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Ratings Distribution
					</h3>
					<div className="h-64">
						<Bar
							data={ratingsConfig}
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
			</div>
		</div>
	);
};

export default EventAnalyticsPage;
