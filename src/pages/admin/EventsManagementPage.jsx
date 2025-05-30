import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
	Search,
	Calendar,
	Filter,
	Plus,
	Edit2,
	Trash2,
	MoreVertical,
	Eye,
	CheckCircle,
	XCircle,
	UserPlus,
} from "lucide-react";
import { Menu } from "@headlessui/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const EventsManagementPage = () => {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedDate, setSelectedDate] = useState("");

	const fetchEvents = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(`${baseUrl}/api/events`, {
				params: {
					search: searchQuery,
					status: selectedStatus,
					date: selectedDate,
				},
			});
			setEvents(data.data);
		} catch (error) {
			toast.error("Failed to fetch events");
		} finally {
			setLoading(false);
		}
	};

	// Initial fetch
	useEffect(() => {
		fetchEvents();
	}, []);

	const handleSearch = (e) => {
		e.preventDefault(); // Prevent form submission
		fetchEvents();
	};

	const handleDeleteEvent = async (eventId) => {
		if (!window.confirm("Are you sure you want to delete this event?")) {
			return;
		}

		try {
			await axios.delete(`${baseUrl}/api/events/${eventId}`);
			toast.success("Event deleted successfully");
			fetchEvents();
		} catch (error) {
			toast.error("Failed to delete event");
		}
	};

	const handleStatusChange = async (eventId, newStatus) => {
		try {
			await axios.patch(`${baseUrl}/api/events/${eventId}/status`, {
				status: newStatus,
			});
			toast.success("Event status updated successfully");
			fetchEvents();
		} catch (error) {
			toast.error("Failed to update event status");
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Events Management
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage all your events in one place
					</p>
				</div>
				<Link
					to="/admin/events/create"
					className="btn btn-primary inline-flex items-center"
				>
					<Plus className="h-5 w-5 mr-2" />
					Create Event
				</Link>
			</div>

			{/* Filters */}
			<div className="card p-4 mb-6">
				<form
					onSubmit={handleSearch}
					className="grid grid-cols-1 md:grid-cols-12 gap-4"
				>
					<div className="relative md:col-span-5">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							type="text"
							placeholder="Search events..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="input pl-10"
						/>
					</div>
					<div className="md:col-span-3">
						<select
							value={selectedStatus}
							onChange={(e) => {
								setSelectedStatus(e.target.value);
							}}
							className="input"
						>
							<option value="all">All Statuses</option>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
							<option value="cancelled">Cancelled</option>
							<option value="completed">Completed</option>
						</select>
					</div>
					<div className="md:col-span-3">
						<input
							type="date"
							value={selectedDate}
							onChange={(e) => {
								setSelectedDate(e.target.value);
							}}
							className="input"
						/>
					</div>
					<div>
						<button className="h-full w-full flex items-center justify-center btn btn-primary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-full"
								fill="none"
								viewBox="0 0 25 25"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
								/>
							</svg>
						</button>
					</div>
				</form>
			</div>

			{/* Events Table */}
			<div className="card bg-gray-900 rounded-lg shadow-xl overflow-hidden">
				<div className="relative overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-800/50">
							<tr>
								<th
									scope="col"
									className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
								>
									Event
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
								>
									Date
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
								>
									Status
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
								>
									Registrations
								</th>
								<th
									scope="col"
									className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-800">
							{events.map((event) => (
								<tr
									key={event._id}
									className="bg-gray-900 hover:bg-gray-800/50"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="h-10 w-10 flex-shrink-0">
												<img
													className="h-10 w-10 rounded-lg object-cover"
													src={
														event.image ||
														`https://ui-avatars.com/api/?name=${encodeURIComponent(
															event.title
														)}&background=random`
													}
													alt={event.title}
												/>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-200">
													{event.title}
												</div>
												<div className="text-sm text-gray-400">
													{event.category}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
										{new Date(
											event.date
										).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
												event.status === "published"
													? "bg-green-100 text-green-800"
													: event.status === "draft"
													? "bg-yellow-100 text-yellow-800"
													: event.status ===
													  "cancelled"
													? "bg-red-100 text-red-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{event.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
										{event.registrations?.length || 0} /{" "}
										{event.maxAttendees || "∞"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<Menu
											as="div"
											className="relative inline-block text-left"
										>
											<div>
												<Menu.Button className="inline-flex items-center p-2 border border-gray-700 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500">
													<MoreVertical className="h-5 w-5 text-gray-400" />
												</Menu.Button>
											</div>
											<Menu.Items className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700 focus:outline-none z-50 origin-top-right">
												<div className="py-1">
													<Menu.Item>
														{({ active }) => (
															<Link
																to={`/events/${event._id}`}
																className={`${
																	active
																		? "bg-gray-700"
																		: ""
																} flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white`}
															>
																<Eye className="h-4 w-4 mr-2" />
																View
															</Link>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<Link
																to={`/admin/events/${event._id}/edit`}
																className={`${
																	active
																		? "bg-gray-700"
																		: ""
																} flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white`}
															>
																<Edit2 className="h-4 w-4 mr-2" />
																Edit
															</Link>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<Link
																to={`/admin/events/${event._id}/volunteers`}
																className={`${
																	active
																		? "bg-gray-700"
																		: ""
																} flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white`}
															>
																<UserPlus className="h-4 w-4 mr-2" />
																Assign
																Volunteers
															</Link>
														)}
													</Menu.Item>
												</div>
												<div className="py-1">
													{event.status ===
														"draft" && (
														<Menu.Item>
															{({ active }) => (
																<button
																	onClick={() =>
																		handleStatusChange(
																			event._id,
																			"published"
																		)
																	}
																	className={`${
																		active
																			? "bg-gray-700"
																			: ""
																	} flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white w-full text-left`}
																>
																	<CheckCircle className="h-4 w-4 mr-2" />
																	Publish
																</button>
															)}
														</Menu.Item>
													)}
													{event.status ===
														"published" && (
														<Menu.Item>
															{({ active }) => (
																<button
																	onClick={() =>
																		handleStatusChange(
																			event._id,
																			"completed"
																		)
																	}
																	className={`${
																		active
																			? "bg-gray-700"
																			: ""
																	} flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white w-full text-left`}
																>
																	<CheckCircle className="h-4 w-4 mr-2" />
																	Mark as
																	Completed
																</button>
															)}
														</Menu.Item>
													)}
													<Menu.Item>
														{({ active }) => (
															<button
																onClick={() =>
																	handleDeleteEvent(
																		event._id
																	)
																}
																className={`${
																	active
																		? "bg-gray-700"
																		: ""
																} flex items-center px-4 py-2 text-sm text-red-400 hover:text-red-300 w-full text-left`}
															>
																<Trash2 className="h-4 w-4 mr-2" />
																Delete
															</button>
														)}
													</Menu.Item>
												</div>
											</Menu.Items>
										</Menu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default EventsManagementPage;
