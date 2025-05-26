import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Users, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

const UserManagementPage = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const { data } = await axios.get("/api/users");
			setUsers(data.data || []);
		} catch (error) {
			toast.error("Failed to fetch users");
		} finally {
			setLoading(false);
		}
	};

	const handleRoleChange = async (userId, newRole) => {
		try {
			await axios.put(`/api/users/${userId}/role`, { role: newRole });
			toast.success("User role updated successfully");
			fetchUsers();
		} catch (error) {
			toast.error("Failed to update user role");
		}
	};

	const handleDeleteUser = async (userId) => {
		if (!window.confirm("Are you sure you want to delete this user?"))
			return;

		try {
			await axios.delete(`/api/users/${userId}`);
			toast.success("User deleted successfully");
			fetchUsers();
		} catch (error) {
			toast.error("Failed to delete user");
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
					User Management
				</h1>
				<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
					<Users className="h-5 w-5" />
					<span>{users.length} users total</span>
				</div>
			</div>

			<div className="bg-white dark:bg-dark-800 shadow-md rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead className="bg-gray-50 dark:bg-dark-700">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								User
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Role
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Joined
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
						{users.map((user) => (
							<tr
								key={user._id || user.id}
								className="hover:bg-gray-50 dark:hover:bg-dark-700"
							>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="h-10 w-10 flex-shrink-0">
											<img
												className="h-10 w-10 rounded-full"
												src={
													user.profilePicture ||
													`https://ui-avatars.com/api/?name=${encodeURIComponent(
														user.name
													)}&background=random`
												}
												alt={user.name}
											/>
										</div>
										<div className="ml-4">
											<div className="text-sm font-medium text-gray-900 dark:text-white">
												{user.name}
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												{user.email}
											</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<select
										value={user.role}
										onChange={(e) =>
											handleRoleChange(
												user._id || user.id,
												e.target.value
											)
										}
										className="text-sm rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500"
									>
										<option value="user">User</option>
										<option value="volunteer">
											Volunteer
										</option>
										<option value="admin">Admin</option>
									</select>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											user.active
												? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300"
												: "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300"
										}`}
									>
										{user.active ? (
											<>
												<CheckCircle className="w-4 h-4 mr-1" />
												Active
											</>
										) : (
											<>
												<XCircle className="w-4 h-4 mr-1" />
												Inactive
											</>
										)}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
									{new Date(
										user.createdAt
									).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button
										onClick={() => setSelectedUser(user)}
										className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mr-4"
									>
										<Edit className="h-5 w-5" />
									</button>
									<button
										onClick={() =>
											handleDeleteUser(
												user._id || user.id
											)
										}
										className="text-error-600 dark:text-error-400 hover:text-error-800 dark:hover:text-error-300"
									>
										<Trash2 className="h-5 w-5" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* User Edit Modal would go here */}
		</div>
	);
};

export default UserManagementPage;
