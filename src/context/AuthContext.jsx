import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../utils/axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		checkUser();
	}, []);

	const checkUser = async () => {
		try {
			const { data } = await api.get(`/api/auth/me`);
			setUser(data.data);
		} catch (error) {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const register = async (userData) => {
		try {
			const { data } = await api.post(`/api/auth/register`, userData);
			setUser(data.user);
			toast.success("Registration successful!");
			navigate("/");
			return true;
		} catch (error) {
			toast.error(error.response?.data?.message || "Registration failed");
			return false;
		}
	};

	const login = async (credentials) => {
		try {
			const { data } = await api.post(`/api/auth/login`, credentials);
			setUser(data.user);
			localStorage.setItem("token", data.token);
			toast.success("Login successful!");
			navigate("/");
			return true;
		} catch (error) {
			toast.error(error.response?.data?.message || "Login failed");
			return false;
		}
	};

	const logout = async () => {
		try {
			await api.get(`/api/auth/logout`);
			setUser(null);
			localStorage.removeItem("token");
			toast.success("Logged out successfully");
			navigate("/login");
		} catch (error) {
			toast.error("Logout failed");
		}
	};

	const updateProfile = async (userId, userData) => {
		try {
			// Transform categories from object to array
			if (userData.preferences?.categories) {
				userData.preferences.categories = Object.entries(
					userData.preferences.categories
				)
					.filter(([, value]) => value)
					.map(([key]) => key);
			}

			const { data } = await api.put(`/api/users/${userId}`, userData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setUser(data.data);
			toast.success("Profile updated successfully");
			return true;
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Profile update failed"
			);
			return false;
		}
	};

	const updateProfilePicture = async (userId, file) => {
		try {
			const formData = new FormData();
			formData.append("profilePicture", file);

			const { data } = await api.put(
				`/api/users/${userId}/profile-picture`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			setUser(data.data);
			toast.success("Profile picture updated successfully");
			return true;
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Failed to update profile picture"
			);
			return false;
		}
	};

	const getUserEvents = async (userId) => {
		try {
			const [registeredResponse, managedResponse] = await Promise.all([
				api.get(`/api/events`, {
					params: { type: "registered" },
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}),
				api.get(`/api/events`, {
					params: { type: "managed" },
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}),
			]);

			// Split events into upcoming and past
			const now = new Date();
			const allEvents = [
				...registeredResponse.data.data.map((event) => ({
					...event,
					type: "registered",
				})),
				...managedResponse.data.data.map((event) => ({
					...event,
					type: "managed",
				})),
			];

			const upcoming = allEvents.filter(
				(event) => new Date(event.date) >= now
			);
			const past = allEvents.filter(
				(event) => new Date(event.date) < now
			);

			return {
				success: true,
				data: {
					upcoming,
					past,
					registered: registeredResponse.data.data,
					managed: managedResponse.data.data,
				},
			};
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to fetch events"
			);
			return {
				success: false,
				data: null,
			};
		}
	};

	const value = {
		user,
		loading,
		register,
		login,
		logout,
		updateProfile,
		updateProfilePicture,
		getUserEvents,
		isAdmin: user?.role === "admin",
		isVolunteer: user?.role === "volunteer",
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
