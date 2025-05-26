import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Search, Filter, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const EventsPage = () => {
	const { user, getUserEvents } = useAuth();
	const [events, setEvents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedDate, setSelectedDate] = useState("");

	useEffect(() => {
		fetchEvents();
	}, []);

	const fetchEvents = async () => {
		setIsLoading(true);
		try {
			const { success, data } = await getUserEvents(user._id || user.id);
			if (success && data) {
				const allEvents = [
					...data.registered.map((event) => ({
						...event,
						type: "registered",
					})),
					...data.managed.map((event) => ({
						...event,
						type: "managed",
					})),
				];
				setEvents(allEvents);
			}
		} catch (error) {
			console.error("Failed to fetch events:", error);
			toast.error("Failed to fetch events");
		} finally {
			setIsLoading(false);
		}
	};

	const filteredEvents = events.filter((event) => {
		const matchesSearch =
			event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.location.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus =
			selectedStatus === "all" || event.status === selectedStatus;

		const matchesDate = !selectedDate || event.date === selectedDate;

		return matchesSearch && matchesStatus && matchesDate;
	});

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
					My Events
				</h1>
				<p className="text-gray-600 dark:text-gray-300">
					View and manage all your registered events
				</p>
			</div>

			{/* Filters */}
			<div className="card p-6 mb-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Search */}
					<div className="relative">
						<input
							type="text"
							placeholder="Search events..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="input pl-10"
						/>
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
					</div>

					{/* Status Filter */}
					<select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value)}
						className="input"
					>
						<option value="all">All Events</option>
						<option value="upcoming">Upcoming Events</option>
						<option value="past">Past Events</option>
					</select>

					{/* Date Filter */}
					<input
						type="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						className="input"
					/>
				</div>

				{/* Active Filters */}
				{(searchQuery || selectedStatus !== "all" || selectedDate) && (
					<div className="mt-4 flex flex-wrap gap-2">
						{searchQuery && (
							<div className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-sm text-primary-800 dark:text-primary-300">
								Search: {searchQuery}
								<button
									onClick={() => setSearchQuery("")}
									className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
								>
									<X size={14} />
								</button>
							</div>
						)}

						{selectedStatus !== "all" && (
							<div className="inline-flex items-center rounded-full bg-secondary-100 dark:bg-secondary-900/30 px-3 py-1 text-sm text-secondary-800 dark:text-secondary-300">
								Status:{" "}
								{selectedStatus.charAt(0).toUpperCase() +
									selectedStatus.slice(1)}
								<button
									onClick={() => setSelectedStatus("all")}
									className="ml-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200"
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
									className="ml-2 text-accent-600 dark:text-accent-400 hover:text-accent-800 dark:hover:text-accent-200"
								>
									<X size={14} />
								</button>
							</div>
						)}

						<button
							onClick={() => {
								setSearchQuery("");
								setSelectedStatus("all");
								setSelectedDate("");
							}}
							className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
						>
							Clear all filters
						</button>
					</div>
				)}
			</div>

			{/* Events Grid */}
			{filteredEvents.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredEvents.map((event) => (
						<Link
							key={event._id}
							to={`/events/${event._id}`}
							className={`card overflow-hidden hover:shadow-lg transition-all group ${
								event.status === "past" ? "opacity-75" : ""
							}`}
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
									className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
										event.status === "past"
											? "grayscale"
											: ""
									}`}
								/>
								{event.status === "past" && (
									<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
										<span className="text-white font-medium">
											Event Completed
										</span>
									</div>
								)}
								{event.type === "managed" && (
									<div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-sm">
										Managing
									</div>
								)}
							</div>
							<div className="p-6">
								<h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
									{event.title}
								</h3>
								<div className="space-y-2 text-gray-600 dark:text-gray-300">
									<div className="flex items-center">
										<Calendar size={16} className="mr-2" />
										<span>
											{new Date(
												event.date
											).toLocaleDateString()}
										</span>
									</div>
									<div className="flex items-center">
										<MapPin size={16} className="mr-2" />
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
						{searchQuery || selectedStatus !== "all" || selectedDate
							? "Try adjusting your filters"
							: "You haven't registered for any events yet"}
					</p>
					<Link to="/events" className="btn btn-primary inline-flex">
						Browse Events
					</Link>
				</div>
			)}
		</div>
	);
};

export default EventsPage;
