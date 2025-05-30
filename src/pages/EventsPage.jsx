import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter, X } from "lucide-react";
import EventCard from "../components/events/EventCard.jsx";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MapPin } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const categories = [
	"Technology",
	"Music",
	"Charity",
	"Business",
	"Art",
	"Food",
	"Education",
	"Sports",
];

const EventsPage = () => {
	const { user } = useAuth();
	const [events, setEvents] = useState([]);
	const [recommendedEvents, setRecommendedEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedDate, setSelectedDate] = useState("");
	const [filtersVisible, setFiltersVisible] = useState(false);

	// Fetch events from API
	useEffect(() => {
		const fetchEvents = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(`${baseUrl}/api/events`, {
					// params: {
					// 	search: searchQuery,
					// 	category: selectedCategory,
					// 	startDate: selectedDate,
					// },
				});
				setEvents(response.data.data);
				setFilteredEvents(response.data.data);

				// If user is logged in, get recommended events
				if (user?._id) {
					const recommendedResponse = await axios.get(
						`${baseUrl}/api/events`,
						{
							params: {
								userId: user._id || user.id,
								recommended: true,
								limit: 3,
							},
						}
					);
					setRecommendedEvents(recommendedResponse.data.data);
				}
			} catch (error) {
				console.error("Failed to fetch events:", error);
				toast.error("Failed to fetch events");
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvents();
	}, [user, searchQuery, selectedCategory, selectedDate]);

	// Apply filters when search query, category or date changes
	useEffect(() => {
		const applyFilters = () => {
			let filtered = events;

			// Apply search filter
			if (searchQuery) {
				filtered = filtered.filter(
					(event) =>
						event.title
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						event.description
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						event.tags.some((tag) =>
							tag
								.toLowerCase()
								.includes(searchQuery.toLowerCase())
						)
				);
			}

			// Apply category filter
			if (selectedCategory) {
				filtered = filtered.filter(
					(event) => event.category === selectedCategory
				);
			}

			// Apply date filter
			if (selectedDate) {
				const filterDate = new Date(selectedDate);
				filtered = filtered.filter((event) => {
					const eventDate = new Date(event.date);
					return (
						eventDate.getFullYear() === filterDate.getFullYear() &&
						eventDate.getMonth() === filterDate.getMonth() &&
						eventDate.getDate() === filterDate.getDate()
					);
				});
			}

			setFilteredEvents(filtered);
		};

		applyFilters();
	}, [events, searchQuery, selectedCategory, selectedDate]);

	const clearFilters = () => {
		setSearchQuery("");
		setSelectedCategory("");
		setSelectedDate("");
	};

	return (
		<div className="animate-fade-in">
			<div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-16 md:py-24">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-5xl font-bold mb-4">
							Discover Events
						</h1>
						<p className="text-xl text-gray-100 mb-8">
							Find and join amazing events happening around you
						</p>

						{/* Search Bar */}
						<div className="relative max-w-xl mx-auto">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 pr-4 py-3 w-full bg-white dark:bg-dark-800/90 text-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-offset-dark-900 dark:focus:ring-primary-500"
								placeholder="Search events by name, description, or tags..."
							/>
							<div className="absolute inset-y-0 right-0 flex items-center pr-3">
								<button
									onClick={() =>
										setFiltersVisible(!filtersVisible)
									}
									className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
								>
									<Filter size={20} />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Filters */}
				<div
					className={`bg-white dark:bg-dark-700 rounded-lg shadow-md p-6 mb-8 transition-all ${
						filtersVisible
							? "max-h-96 opacity-100"
							: "max-h-0 opacity-0 overflow-hidden p-0 mb-0"
					}`}
				>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
							Filters
						</h2>
						<button
							onClick={clearFilters}
							className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
						>
							<X size={16} className="mr-1" />
							Clear all
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Category Filter */}
						<div>
							<label htmlFor="category-filter" className="label">
								Category
							</label>
							<select
								id="category-filter"
								value={selectedCategory}
								onChange={(e) =>
									setSelectedCategory(e.target.value)
								}
								className="input"
							>
								<option value="">All Categories</option>
								{categories.map((category, index) => (
									<option key={index} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>

						{/* Date Filter */}
						<div>
							<label htmlFor="date-filter" className="label">
								Date
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Calendar className="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="date"
									id="date-filter"
									value={selectedDate}
									onChange={(e) =>
										setSelectedDate(e.target.value)
									}
									className="pl-10 input"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Filter Indicators */}
				{(searchQuery || selectedCategory || selectedDate) && (
					<div className="flex flex-wrap items-center gap-2 mb-6">
						<span className="text-sm text-gray-600 dark:text-gray-300">
							Active filters:
						</span>

						{searchQuery && (
							<div className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-sm text-primary-800 dark:text-primary-300">
								Search: {searchQuery}
								<button
									onClick={() => setSearchQuery("")}
									className="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
								>
									<X size={14} />
								</button>
							</div>
						)}

						{selectedCategory && (
							<div className="inline-flex items-center rounded-full bg-secondary-100 dark:bg-secondary-900/30 px-3 py-1 text-sm text-secondary-800 dark:text-secondary-300">
								Category: {selectedCategory}
								<button
									onClick={() => setSelectedCategory("")}
									className="ml-1 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200"
								>
									<X size={14} />
								</button>
							</div>
						)}

						{selectedDate && (
							<div className="inline-flex items-center rounded-full bg-accent-100 dark:bg-accent-900/30 px-3 py-1 text-sm text-accent-800 dark:text-accent-300">
								Date:{" "}
								{new Date(selectedDate).toLocaleDateString()}
								<button
									onClick={() => setSelectedDate("")}
									className="ml-1 text-accent-600 dark:text-accent-400 hover:text-accent-800 dark:hover:text-accent-200"
								>
									<X size={14} />
								</button>
							</div>
						)}

						<button
							onClick={clearFilters}
							className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 underline"
						>
							Clear all
						</button>
					</div>
				)}

				{/* Recommended Events */}
				{user &&
					recommendedEvents.length > 0 &&
					!searchQuery &&
					!selectedCategory &&
					!selectedDate && (
						<div className="mb-12">
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
								Recommended for You
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{recommendedEvents.map((event) => (
									<Link
										key={event._id}
										to={`/events/${event._id}`}
										className="card overflow-hidden hover:shadow-lg transition-all group"
									>
										<div className="relative h-48">
											<img
												src={
													event.image ||
													`https://ui-avatars.com/api/?name=${encodeURIComponent(
														event.title
													)}&background=random`
												}
												alt={event.title}
												className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
											/>
											<div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-sm">
												Recommended
											</div>
										</div>
										<div className="p-6">
											<h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
												{event.title}
											</h3>
											<div className="space-y-2 text-gray-600 dark:text-gray-300">
												<div className="flex items-center">
													<Calendar
														size={16}
														className="mr-2"
													/>
													<span>
														{new Date(
															event.date
														).toLocaleDateString()}
													</span>
												</div>
												<div className="flex items-center">
													<MapPin
														size={16}
														className="mr-2"
													/>
													<span>
														{event.location}
													</span>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					)}

				{/* All Events */}
				<div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
						{searchQuery || selectedCategory || selectedDate
							? "Search Results"
							: "All Events"}
					</h2>
					{filteredEvents.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredEvents.map((event) => (
								<Link
									key={event._id}
									to={`/events/${event._id}`}
									className="card overflow-hidden hover:shadow-lg transition-all group"
								>
									<div className="relative h-48">
										<img
											src={
												event.image ||
												`https://ui-avatars.com/api/?name=${encodeURIComponent(
													event.title
												)}&background=random`
											}
											alt={event.title}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										/>
									</div>
									<div className="p-6">
										<h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
											{event.title}
										</h3>
										<div className="space-y-2 text-gray-600 dark:text-gray-300">
											<div className="flex items-center">
												<Calendar
													size={16}
													className="mr-2"
												/>
												<span>
													{new Date(
														event.date
													).toLocaleDateString()}
												</span>
											</div>
											<div className="flex items-center">
												<MapPin
													size={16}
													className="mr-2"
												/>
												<span>{event.location}</span>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className="card p-8 text-center">
							<div className="mb-4">
								<Filter className="h-12 w-12 mx-auto text-gray-400" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
								No events found
							</h3>
							<p className="text-gray-600 dark:text-gray-300 mb-4">
								{searchQuery || selectedCategory || selectedDate
									? "Try adjusting your filters"
									: "No events are currently available"}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default EventsPage;
