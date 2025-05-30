import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Search, UserPlus, X, Check } from "lucide-react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AssignVolunteersPage = () => {
	const { eventId } = useParams();
	const [event, setEvent] = useState(null);
	const [volunteers, setVolunteers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedVolunteers, setSelectedVolunteers] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [eventRes, volunteersRes] = await Promise.all([
					axios.get(`${baseUrl}/api/events/${eventId}`),
					axios.get(`${baseUrl}/api/volunteers`),
				]);

				setEvent(eventRes.data.data);
				setVolunteers(volunteersRes.data.data);

				// Set initially assigned volunteers
				if (eventRes.data.data.volunteers) {
					setSelectedVolunteers(
						eventRes.data.data.volunteers.map((v) => v._id)
					);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Failed to fetch data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [eventId]);

	const handleAssignVolunteers = async () => {
		try {
			// Get volunteers to remove (ones that were selected but now aren't)
			const volunteersToRemove = event.volunteers
				.filter((v) => !selectedVolunteers.includes(v._id))
				.map((v) => v._id);

			// Remove volunteers that were unselected
			for (const volunteerId of volunteersToRemove) {
				await axios.delete(
					`${baseUrl}/api/events/${eventId}/volunteers/${volunteerId}`
				);
			}

			// Add new volunteers
			const volunteersToAdd = selectedVolunteers.filter(
				(id) => !event.volunteers.some((v) => v._id === id)
			);

			for (const volunteerId of volunteersToAdd) {
				await axios.post(
					`${baseUrl}/api/events/${eventId}/volunteers`,
					{
						volunteerId,
					}
				);
			}

			toast.success("Volunteers updated successfully");
		} catch (error) {
			console.error("Error updating volunteers:", error);
			toast.error("Failed to update volunteers");
		}
	};

	const toggleVolunteer = (volunteerId) => {
		setSelectedVolunteers((prev) => {
			if (prev.includes(volunteerId)) {
				return prev.filter((id) => id !== volunteerId);
			}
			return [...prev, volunteerId];
		});
	};

	const filteredVolunteers = volunteers.filter(
		(volunteer) =>
			volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			volunteer.email.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					Assign Volunteers
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					{event?.title}
				</p>
			</div>

			{/* Search and Actions */}
			<div className="card p-4 mb-6">
				<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							type="text"
							placeholder="Search volunteers..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="input pl-10 w-full"
						/>
					</div>
					<button
						onClick={handleAssignVolunteers}
						className="btn btn-primary inline-flex items-center"
					>
						<UserPlus className="h-5 w-5 mr-2" />
						Save Assignments
					</button>
				</div>
			</div>

			{/* Volunteers List */}
			<div className="card overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead className="bg-gray-50 dark:bg-gray-800">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
								>
									Name
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
								>
									Email
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
								>
									Status
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
								>
									Action
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
							{filteredVolunteers.map((volunteer) => (
								<tr
									key={volunteer._id}
									className="hover:bg-gray-50 dark:hover:bg-gray-800"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="h-10 w-10 flex-shrink-0">
												<img
													className="h-10 w-10 rounded-full"
													src={
														volunteer.avatar ||
														`https://ui-avatars.com/api/?name=${encodeURIComponent(
															volunteer.name
														)}&background=random`
													}
													alt={volunteer.name}
												/>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900 dark:text-white">
													{volunteer.name}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
										{volunteer.email}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												selectedVolunteers.includes(
													volunteer._id
												)
													? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
													: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
											}`}
										>
											{selectedVolunteers.includes(
												volunteer._id
											)
												? "Assigned"
												: "Not Assigned"}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											onClick={() =>
												toggleVolunteer(volunteer._id)
											}
											className={`inline-flex items-center px-3 py-1 rounded-md ${
												selectedVolunteers.includes(
													volunteer._id
												)
													? "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
													: "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
											}`}
										>
											{selectedVolunteers.includes(
												volunteer._id
											) ? (
												<>
													<X className="h-4 w-4 mr-1" />
													Remove
												</>
											) : (
												<>
													<Check className="h-4 w-4 mr-1" />
													Assign
												</>
											)}
										</button>
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

export default AssignVolunteersPage;
