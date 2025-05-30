import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Check, X, Search, Filter } from "lucide-react";
import { toast } from "react-hot-toast";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const EventRegistrationsPage = () => {
	const { user, isVolunteer } = useAuth();
	const { eventId } = useParams();
	const [registrations, setRegistrations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");

	useEffect(() => {
		const fetchRegistrations = async () => {
			try {
				const response = await axios.get(
					`${baseUrl}/api/events/${eventId}/registrations`,
					{
						user,
					}
				);
				setRegistrations(response.data.data);
			} catch (error) {
				console.error("Failed to fetch registrations:", error);
				toast.error("Failed to fetch registrations");
			} finally {
				setIsLoading(false);
			}
		};

		if (user && isVolunteer && eventId) {
			fetchRegistrations();
		}
	}, [user, isVolunteer, eventId]);

	const handleStatusChange = async (registrationId, newStatus) => {
		try {
			await axios.put(`${baseUrl}/api/registrations/${registrationId}`, {
				status: newStatus,
			});

			setRegistrations((prevRegistrations) =>
				prevRegistrations.map((reg) =>
					reg._id === registrationId
						? { ...reg, status: newStatus }
						: reg
				)
			);

			toast.success(`Registration ${newStatus} successfully`);
		} catch (error) {
			console.error("Failed to update registration status:", error);
			toast.error("Failed to update registration status");
		}
	};

	const filteredRegistrations = registrations.filter((reg) => {
		const matchesSearch =
			reg.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			reg.user.email.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus =
			filterStatus === "all" || reg.status === filterStatus;

		return matchesSearch && matchesStatus;
	});

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

	if (isLoading) {
		return (
			<div className="p-8 text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
			</div>
		);
	}

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
				Event Registrations
			</h1>

			{/* Filters */}
			<div className="flex flex-col md:flex-row gap-4 mb-6">
				<div className="flex-1">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search className="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="input pl-10"
							placeholder="Search by name or email..."
						/>
					</div>
				</div>
				<div className="md:w-48">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Filter className="h-5 w-5 text-gray-400" />
						</div>
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="input pl-10"
						>
							<option value="all">All Status</option>
							<option value="pending">Pending</option>
							<option value="approved">Approved</option>
							<option value="rejected">Rejected</option>
						</select>
					</div>
				</div>
			</div>

			{/* Registrations Table */}
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead className="bg-gray-50 dark:bg-dark-800">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Email
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Registration Date
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white dark:bg-dark-900 divide-y divide-gray-200 dark:divide-gray-700">
						{filteredRegistrations.map((registration) => (
							<tr key={registration._id}>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900 dark:text-white">
										{registration.user.name}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{registration.user.email}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{new Date(
											registration.createdAt
										).toLocaleDateString()}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											registration.status === "approved"
												? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300"
												: registration.status ===
												  "rejected"
												? "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300"
												: "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300"
										}`}
									>
										{registration.status
											.charAt(0)
											.toUpperCase() +
											registration.status.slice(1)}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
									{registration.status === "pending" && (
										<div className="flex space-x-2">
											<button
												onClick={() =>
													handleStatusChange(
														registration._id,
														"approved"
													)
												}
												className="text-success-600 hover:text-success-900 dark:text-success-400 dark:hover:text-success-300"
											>
												<Check className="h-5 w-5" />
											</button>
											<button
												onClick={() =>
													handleStatusChange(
														registration._id,
														"rejected"
													)
												}
												className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300"
											>
												<X className="h-5 w-5" />
											</button>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{filteredRegistrations.length === 0 && (
					<div className="text-center py-8">
						<p className="text-gray-500 dark:text-gray-400">
							No registrations found.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default EventRegistrationsPage;
