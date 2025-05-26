import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Save, User, Mail, Lock, Upload, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const ProfilePage = () => {
	const { user, updateProfile, updateProfilePicture } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [activeTab, setActiveTab] = useState("profile");
	const [imagePreview, setImagePreview] = useState(
		user?.profilePicture || null
	);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
			bio: user?.bio || "",
			preferences: {
				emailNotifications:
					user?.preferences?.emailNotifications ?? true,
				categories:
					user?.preferences?.categories?.reduce((acc, category) => {
						acc[category] = true;
						return acc;
					}, {}) || {},
			},
		},
	});

	// Available categories
	const categories = [
		"technology",
		"music",
		"business",
		"art",
		"sports",
		"food",
		"education",
		"charity",
	];

	useEffect(() => {
		// Set initial categories
		if (user?.preferences?.categories) {
			const categoriesObj = {};
			categories.forEach((category) => {
				categoriesObj[category] =
					user.preferences.categories.includes(category);
			});
			setValue("preferences.categories", categoriesObj);
		}
	}, [user, setValue]);

	const password = watch("password", "");

	const onSubmit = async (data) => {
		setIsLoading(true);
		try {
			await updateProfile(user._id || user.id, data);
		} catch (error) {
			console.error("Failed to update profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			// Preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);

			// Upload
			setIsLoading(true);
			try {
				console.log(user);
				await updateProfilePicture(user._id || user.id, file);
			} catch (error) {
				console.error("Failed to update profile picture:", error);
				setImagePreview(user?.profilePicture || null);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<div className="animate-fade-in">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					Profile Settings
				</h1>
				<p className="text-gray-600 dark:text-gray-300">
					Manage your account settings and preferences
				</p>
			</div>

			{/* Tabs */}
			<div className="border-b dark:border-dark-700 mb-8">
				<nav className="flex space-x-8">
					<button
						onClick={() => setActiveTab("profile")}
						className={`py-4 px-1 border-b-2 font-medium text-sm ${
							activeTab === "profile"
								? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
						}`}
					>
						Profile Information
					</button>
					<button
						onClick={() => setActiveTab("security")}
						className={`py-4 px-1 border-b-2 font-medium text-sm ${
							activeTab === "security"
								? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
						}`}
					>
						Security
					</button>
					<button
						onClick={() => setActiveTab("preferences")}
						className={`py-4 px-1 border-b-2 font-medium text-sm ${
							activeTab === "preferences"
								? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
						}`}
					>
						Preferences
					</button>
				</nav>
			</div>

			{/* Profile Form */}
			<form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
				{activeTab === "profile" && (
					<div className="space-y-6">
						{/* Profile Picture */}
						<div>
							<label className="label">Profile Picture</label>
							<div className="flex items-center space-x-6">
								<div className="relative h-24 w-24 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30">
									{imagePreview ? (
										<img
											src={imagePreview}
											alt={user?.name}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="h-full w-full flex items-center justify-center">
											<User
												size={32}
												className="text-primary-600 dark:text-primary-400"
											/>
										</div>
									)}
								</div>
								<div>
									<label
										htmlFor="profilePicture"
										className="btn btn-outline cursor-pointer"
									>
										Change Photo
										<input
											type="file"
											id="profilePicture"
											accept="image/jpeg,image/png,image/jpg"
											onChange={handleImageChange}
											className="hidden"
										/>
									</label>
									<p className="mt-1 text-sm text-gray-500">
										JPG, JPEG or PNG. Max 5MB.
									</p>
								</div>
							</div>
						</div>

						{/* Name */}
						<div>
							<label htmlFor="name" className="label">
								Full Name
							</label>
							<input
								type="text"
								id="name"
								className={`input ${
									errors.name
										? "border-error-500 focus:border-error-500 focus:ring-error-500"
										: ""
								}`}
								{...register("name", {
									required: "Name is required",
									minLength: {
										value: 2,
										message:
											"Name must be at least 2 characters",
									},
								})}
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-error-600 dark:text-error-400">
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Email */}
						<div>
							<label htmlFor="email" className="label">
								Email Address
							</label>
							<input
								type="email"
								id="email"
								className={`input ${
									errors.email
										? "border-error-500 focus:border-error-500 focus:ring-error-500"
										: ""
								}`}
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Invalid email address",
									},
								})}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-error-600 dark:text-error-400">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Bio */}
						<div>
							<label htmlFor="bio" className="label">
								Bio
							</label>
							<textarea
								id="bio"
								rows="4"
								className="input"
								placeholder="Tell us about yourself..."
								{...register("bio")}
							></textarea>
						</div>
					</div>
				)}

				{activeTab === "security" && (
					<div className="space-y-6">
						{/* Current Password */}
						<div>
							<label htmlFor="currentPassword" className="label">
								Current Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									id="currentPassword"
									className={`input pr-10 ${
										errors.currentPassword
											? "border-error-500 focus:border-error-500 focus:ring-error-500"
											: ""
									}`}
									{...register("currentPassword", {
										required:
											"Current password is required",
									})}
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400" />
									) : (
										<Eye className="h-5 w-5 text-gray-400" />
									)}
								</button>
							</div>
							{errors.currentPassword && (
								<p className="mt-1 text-sm text-error-600 dark:text-error-400">
									{errors.currentPassword.message}
								</p>
							)}
						</div>

						{/* New Password */}
						<div>
							<label htmlFor="password" className="label">
								New Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									className={`input pr-10 ${
										errors.password
											? "border-error-500 focus:border-error-500 focus:ring-error-500"
											: ""
									}`}
									{...register("password", {
										minLength: {
											value: 8,
											message:
												"Password must be at least 8 characters",
										},
										pattern: {
											value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
											message:
												"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
										},
									})}
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400" />
									) : (
										<Eye className="h-5 w-5 text-gray-400" />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="mt-1 text-sm text-error-600 dark:text-error-400">
									{errors.password.message}
								</p>
							)}
						</div>

						{/* Confirm New Password */}
						<div>
							<label htmlFor="confirmPassword" className="label">
								Confirm New Password
							</label>
							<input
								type={showPassword ? "text" : "password"}
								id="confirmPassword"
								className={`input ${
									errors.confirmPassword
										? "border-error-500 focus:border-error-500 focus:ring-error-500"
										: ""
								}`}
								{...register("confirmPassword", {
									validate: (value) =>
										value === password ||
										"Passwords do not match",
								})}
							/>
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-error-600 dark:text-error-400">
									{errors.confirmPassword.message}
								</p>
							)}
						</div>
					</div>
				)}

				{activeTab === "preferences" && (
					<div className="space-y-6">
						{/* Email Notifications */}
						<div>
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
								Email Notifications
							</h3>
							<div className="space-y-4">
								<div className="flex items-start">
									<div className="flex items-center h-5">
										<input
											type="checkbox"
											id="emailNotifications"
											className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:focus:ring-primary-800 dark:bg-dark-700"
											{...register(
												"preferences.emailNotifications"
											)}
										/>
									</div>
									<div className="ml-3">
										<label
											htmlFor="emailNotifications"
											className="text-sm font-medium text-gray-700 dark:text-gray-300"
										>
											Event Reminders
										</label>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Receive email notifications about
											upcoming events you've registered
											for
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Categories of Interest */}
						<div>
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
								Categories of Interest
							</h3>
							<div className="grid grid-cols-2 gap-4">
								{categories.map((category) => (
									<div
										key={category}
										className="flex items-center"
									>
										<input
											type="checkbox"
											id={category}
											className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:focus:ring-primary-800 dark:bg-dark-700"
											{...register(
												`preferences.categories.${category}`
											)}
										/>
										<label
											htmlFor={category}
											className="ml-2 text-sm text-gray-700 dark:text-gray-300"
										>
											{category.charAt(0).toUpperCase() +
												category.slice(1)}
										</label>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Save Button */}
				<div className="mt-8">
					<button
						type="submit"
						disabled={isLoading}
						className="btn btn-primary w-full sm:w-auto flex justify-center items-center"
					>
						{isLoading ? (
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
						) : (
							<>
								<Save size={16} className="mr-2" />
								Save Changes
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ProfilePage;
