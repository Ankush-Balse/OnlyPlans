import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
	Calendar,
	Clock,
	MapPin,
	Users,
	Tag,
	ChevronLeft,
	Share2,
	Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import axios from "axios";

const EventDetailsPage = () => {
	const { id } = useParams();
	const { user } = useAuth();
	const [event, setEvent] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRegistering, setIsRegistering] = useState(false);
	const [isRegistered, setIsRegistered] = useState(false);
	const [showRegistrationForm, setShowRegistrationForm] = useState(false);
	const [formData, setFormData] = useState({});
	const [formErrors, setFormErrors] = useState([]);
	const [activeTab, setActiveTab] = useState("details");
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		const fetchEvent = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(`/api/events/${id}`);
				setEvent(response.data.data);
				if (response.data.data.status === "published") {
					const formResponse = await axios.get(
						`/api/forms/event/${id}`
					);
					setEvent({
						...event,
						registrationForm: formResponse.data.data,
					});
				}

				// Check if user is already registered
				if (user && response.data.data.registrations) {
					const registered = response.data.data.registrations.some(
						(reg) => reg.user === (user._id || user.id)
					);
					setIsRegistered(registered);
				}

				setIsLoading(false);
			} catch (error) {
				console.error("Failed to fetch event:", error);
				toast.error("Failed to fetch event details");
				setIsLoading(false);
			}
		};

		fetchEvent();
	}, [id, user]);

	const handleRegistrationClick = () => {
		if (!user) {
			toast.error("Please log in to register for events");
			return;
		}
		setShowRegistrationForm(true);
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setFormErrors([]);
		setIsRegistering(true);

		try {
			const response = await axios.post(
				`/api/events/${id}/register`,
				{ formData },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);

			setIsRegistered(true);
			setShowRegistrationForm(false);
			toast.success(
				response.data.message ||
					"Successfully registered for the event!"
			);

			// Update event data to reflect new registration
			setEvent((prev) => ({
				...prev,
				registrations: [
					...prev.registrations,
					response.data.data.registration,
				],
				attendeeCount: (prev.attendeeCount || 0) + 1,
			}));
		} catch (error) {
			console.error("Registration error:", error);
			if (error.response?.data?.errors) {
				setFormErrors(error.response.data.errors);
			} else {
				toast.error(
					error.response?.data?.message ||
						"Failed to register for event"
				);
			}
		} finally {
			setIsRegistering(false);
		}
	};

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// Registration Form Modal Component
	const RegistrationForm = () => {
		const [localFormData, setLocalFormData] = useState({});
		const [fileUploads, setFileUploads] = useState({});

		const handleLocalInputChange = (field, value) => {
			setLocalFormData((prev) => ({
				...prev,
				[field]: value,
			}));
		};

		const handleFileChange = async (field, e) => {
			const file = e.target.files[0];
			if (file) {
				setFileUploads(prev => ({
					...prev,
					[field]: file
				}));
				// Store the file name in localFormData
				setLocalFormData(prev => ({
					...prev,
					[field]: file.name
				}));
			}
		};

		const handleCheckboxChange = (field, value, isChecked) => {
			setLocalFormData(prev => {
				const currentValues = prev[field] || [];
				if (isChecked) {
					return {
						...prev,
						[field]: [...currentValues, value]
					};
				} else {
					return {
						...prev,
						[field]: currentValues.filter(v => v !== value)
					};
				}
			});
		};

		const handleSubmit = async (e) => {
			e.preventDefault();
			
			// Create FormData to handle file uploads
			const formDataToSubmit = new FormData();
			
			// Add regular form data
			Object.keys(localFormData).forEach(key => {
				if (Array.isArray(localFormData[key])) {
					// Handle arrays (like checkbox groups)
					formDataToSubmit.append(key, JSON.stringify(localFormData[key]));
				} else {
					formDataToSubmit.append(key, localFormData[key]);
				}
			});

			// Add file uploads
			Object.keys(fileUploads).forEach(key => {
				formDataToSubmit.append(key, fileUploads[key]);
			});

			// Update parent formData state
			setFormData(formDataToSubmit);
			// Call the parent submit handler
			handleFormSubmit(e);
		};

		const renderField = (field) => {
			switch (field.type) {
				case "text":
				case "email":
				case "number":
				case "date":
				case "phone":
				case "url":
					return (
						<input
							type={field.type}
							value={localFormData[field.label] || ""}
							onChange={(e) => handleLocalInputChange(field.label, e.target.value)}
							placeholder={field.placeholder}
							className="input"
							required={field.required}
						/>
					);

				case "textarea":
					return (
						<textarea
							value={localFormData[field.label] || ""}
							onChange={(e) => handleLocalInputChange(field.label, e.target.value)}
							placeholder={field.placeholder}
							className="input"
							required={field.required}
							rows="3"
						/>
					);

				case "select":
					return (
						<select
							value={localFormData[field.label] || ""}
							onChange={(e) => handleLocalInputChange(field.label, e.target.value)}
							className="input"
							required={field.required}
						>
							<option value="">{field.placeholder || "Select an option"}</option>
							{field.options.map((option, optIndex) => (
								<option key={optIndex} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					);

				case "radio":
					return (
						<div className="space-y-2">
							{field.options.map((option, optIndex) => (
								<div key={optIndex} className="flex items-center">
									<input
										type="radio"
										id={`${field.label}-${option.value}`}
										name={field.label}
										value={option.value}
										checked={localFormData[field.label] === option.value}
										onChange={(e) => handleLocalInputChange(field.label, e.target.value)}
										className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-dark-700"
										required={field.required && optIndex === 0}
									/>
									<label
										htmlFor={`${field.label}-${option.value}`}
										className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
									>
										{option.label}
									</label>
								</div>
							))}
						</div>
					);

				case "checkbox":
					return (
						<div className="space-y-2">
							{field.options.map((option, optIndex) => (
								<div key={optIndex} className="flex items-center">
									<input
										type="checkbox"
										id={`${field.label}-${option.value}`}
										value={option.value}
										checked={localFormData[field.label]?.includes(option.value) || false}
										onChange={(e) => handleCheckboxChange(field.label, option.value, e.target.checked)}
										className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-dark-700"
									/>
									<label
										htmlFor={`${field.label}-${option.value}`}
										className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
									>
										{option.label}
									</label>
								</div>
							))}
						</div>
					);

				case "file":
					return (
						<div>
							<input
								type="file"
								onChange={(e) => handleFileChange(field.label, e)}
								className="block w-full text-sm text-gray-500 dark:text-gray-400
									file:mr-4 file:py-2 file:px-4
									file:rounded-md file:border-0
									file:text-sm file:font-medium
									file:bg-primary-50 file:text-primary-700
									dark:file:bg-primary-900/30 dark:file:text-primary-400
									hover:file:bg-primary-100 dark:hover:file:bg-primary-900/40"
								required={field.required}
							/>
							{fileUploads[field.label] && (
								<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
									Selected file: {fileUploads[field.label].name}
								</p>
							)}
						</div>
					);

				default:
					return null;
			}
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4">
					<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
						Registration Form
					</h2>

					{formErrors.length > 0 && (
						<div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
							<ul className="list-disc list-inside">
								{formErrors.map((error, index) => (
									<li key={index}>{error}</li>
								))}
							</ul>
						</div>
					)}

					<form onSubmit={handleSubmit}>
						{event.registrationForm.fields.map((field, index) => (
							<div key={index} className="mb-4">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									{field.label}
									{field.required && (
										<span className="text-red-500">*</span>
									)}
								</label>
								{renderField(field)}
							</div>
						))}

						<div className="flex justify-end gap-2 mt-6">
							<button
								type="button"
								onClick={() => setShowRegistrationForm(false)}
								className="btn btn-outline"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={isRegistering}
							>
								{isRegistering ? (
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
								) : (
									"Submit Registration"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	const toggleFavorite = () => {
		setIsFavorite(!isFavorite);
		toast.success(
			isFavorite ? "Removed from favorites" : "Added to favorites"
		);
	};

	const shareEvent = () => {
		if (navigator.share) {
			navigator
				.share({
					title: event?.title,
					text: event?.description,
					url: window.location.href,
				})
				.then(() => console.log("Successful share"))
				.catch((error) => console.log("Error sharing", error));
		} else {
			// Fallback
			navigator.clipboard.writeText(window.location.href);
			toast.success("Link copied to clipboard!");
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-dark-800">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	if (!event) {
		return (
			<div className="container mx-auto px-4 py-12 text-center">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Event Not Found
				</h2>
				<p className="text-gray-600 dark:text-gray-300 mb-6">
					The event you're looking for doesn't exist or has been
					removed.
				</p>
				<Link to="/events" className="btn btn-primary">
					Browse Events
				</Link>
			</div>
		);
	}

	return (
		<div className="bg-gray-50 dark:bg-dark-800 animate-fade-in">
			{/* Event Hero */}
			<div className="relative bg-gray-900 text-white">
				{/* Hero Image */}
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 bg-black opacity-60 z-10"></div>
					<img
						src={event.image}
						alt={event.title}
						className="w-full h-full object-cover"
					/>
				</div>

				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-20">
					<div className="max-w-4xl">
						<Link
							to="/events"
							className="inline-flex items-center text-gray-200 hover:text-white mb-6 transition-colors"
						>
							<ChevronLeft size={16} className="mr-1" />
							Back to Events
						</Link>
						<div className="flex items-center gap-2 mb-4">
							<span
								className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium bg-primary-700 text-white`}
							>
								{event.category}
							</span>
							<span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-0.5 text-sm font-medium text-white">
								{event.price === 0 || event.price === undefined
									? "Free"
									: `$${event.price}`}
							</span>
						</div>

						<h1 className="text-4xl md:text-5xl font-bold mb-4">
							{event.title}
						</h1>

						<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-200">
							<div className="flex items-center">
								<Calendar
									size={18}
									className="mr-2 text-primary-400"
								/>
								<span>
									{new Date(event.date).toLocaleDateString(
										"en-US",
										{
											weekday: "long",
											year: "numeric",
											month: "long",
											day: "numeric",
										}
									)}
									{event.endDate && (
										<>
											{" "}
											-{" "}
											{new Date(
												event.endDate
											).toLocaleDateString("en-US", {
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</>
									)}
								</span>
							</div>

							<div className="flex items-center">
								<MapPin
									size={18}
									className="mr-2 text-primary-400"
								/>
								<span>{event.location}</span>
							</div>

							{event.duration && (
								<div className="flex items-center">
									<Clock
										size={18}
										className="mr-2 text-primary-400"
									/>
									<span>{event.duration}</span>
								</div>
							)}

							{event.attendeeCount !== undefined && (
								<div className="flex items-center">
									<Users
										size={18}
										className="mr-2 text-primary-400"
									/>
									<span>
										{event.attendeeCount} registered
									</span>
								</div>
							)}
						</div>

						<div className="mt-8 flex flex-wrap gap-3">
							<button
								onClick={handleRegistrationClick}
								className={`btn ${
									isRegistered
										? "bg-green-600 hover:bg-green-700"
										: "bg-primary-600 hover:bg-primary-700"
								} text-white`}
								disabled={
									isRegistering ||
									isRegistered ||
									event.status !== "published"
								}
							>
								{isRegistering ? (
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
								) : isRegistered ? (
									"Registered ✓"
								) : event.status !== "published" ? (
									"Registration Not Open"
								) : (
									"Register Now"
								)}
							</button>

							<button
								onClick={toggleFavorite}
								className={`btn ${
									isFavorite
										? "bg-accent-600 hover:bg-accent-700 text-white"
										: "bg-white/10 hover:bg-white/20 text-white"
								}`}
							>
								<Heart
									size={18}
									className="mr-2"
									fill={isFavorite ? "currentColor" : "none"}
								/>
								{isFavorite ? "Favorited" : "Add to Favorites"}
							</button>

							<button
								onClick={shareEvent}
								className="btn bg-white/10 hover:bg-white/20 text-white"
							>
								<Share2 size={18} className="mr-2" />
								Share
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Event Content */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Main Content */}
					<div className="lg:w-2/3">
						{/* Tabs */}
						<div className="border-b dark:border-dark-700 mb-6">
							<nav className="flex space-x-8">
								<button
									onClick={() => setActiveTab("details")}
									className={`py-4 px-1 border-b-2 font-medium text-sm ${
										activeTab === "details"
											? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
											: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
									}`}
								>
									Details
								</button>
								{event.schedule?.length > 0 && (
									<button
										onClick={() => setActiveTab("schedule")}
										className={`py-4 px-1 border-b-2 font-medium text-sm ${
											activeTab === "schedule"
												? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
												: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
										}`}
									>
										Schedule
									</button>
								)}
								{event.speakers?.length > 0 && (
									<button
										onClick={() => setActiveTab("speakers")}
										className={`py-4 px-1 border-b-2 font-medium text-sm ${
											activeTab === "speakers"
												? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
												: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
										}`}
									>
										Speakers
									</button>
								)}
							</nav>
						</div>

						{/* Tab Content */}
						<div className="prose prose-lg max-w-none dark:prose-invert">
							{activeTab === "details" && (
								<div className="animate-fade-in">
									<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
										About This Event
									</h2>
									<div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
										{event.description}
									</div>

									{/* Tags */}
									{event.tags?.length > 0 && (
										<div className="mt-8 flex flex-wrap gap-2">
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mr-2">
												<Tag
													size={18}
													className="mr-2"
												/>
												Tags:
											</h3>
											{event.tags.map((tag, index) => (
												<span
													key={index}
													className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
												>
													{tag}
												</span>
											))}
										</div>
									)}
								</div>
							)}

							{activeTab === "schedule" &&
								event.schedule?.length > 0 && (
									<div className="animate-fade-in">
										<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
											Event Schedule
										</h2>

										<div className="space-y-8">
											{event.schedule.map(
												(day, dayIndex) => (
													<div
														key={dayIndex}
														className="border-l-4 border-primary-500 pl-4 dark:border-primary-700"
													>
														<h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
															{day.date}
														</h3>
														<div className="space-y-4">
															{day.items.map(
																(
																	item,
																	itemIndex
																) => (
																	<div
																		key={
																			itemIndex
																		}
																		className="bg-white dark:bg-dark-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
																	>
																		<p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
																			{
																				item.time
																			}
																		</p>
																		<p className="text-lg font-medium text-gray-900 dark:text-white">
																			{
																				item.title
																			}
																		</p>
																		{item.description && (
																			<p className="text-gray-600 dark:text-gray-300 mt-1">
																				{
																					item.description
																				}
																			</p>
																		)}
																	</div>
																)
															)}
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}

							{activeTab === "speakers" &&
								event.speakers?.length > 0 && (
									<div className="animate-fade-in">
										<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
											Speakers
										</h2>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{event.speakers.map(
												(speaker, index) => (
													<div
														key={index}
														className="flex bg-white dark:bg-dark-700 rounded-lg overflow-hidden shadow-sm"
													>
														<div className="w-1/3">
															<img
																src={
																	speaker.image
																}
																alt={
																	speaker.name
																}
																className="w-full h-full object-cover"
															/>
														</div>
														<div className="w-2/3 p-4">
															<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
																{speaker.name}
															</h3>
															<p className="text-primary-600 dark:text-primary-400 text-sm mb-2">
																{speaker.title}
															</p>
															<p className="text-gray-600 dark:text-gray-300 text-sm">
																{speaker.bio}
															</p>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}
						</div>
					</div>

					{/* Sidebar */}
					<div className="lg:w-1/3">
						<div className="bg-white dark:bg-dark-700 rounded-lg shadow-md p-6 sticky top-24">
							<h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
								Event Details
							</h3>

							<div className="space-y-4 mb-6">
								<div className="flex items-start">
									<Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 mr-3" />
									<div>
										<h4 className="font-medium text-gray-900 dark:text-white">
											Date & Time
										</h4>
										<p className="text-gray-600 dark:text-gray-300">
											{new Date(
												event.date
											).toLocaleDateString("en-US", {
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
											{event.endDate && (
												<>
													{" "}
													- <br />
													{new Date(
														event.endDate
													).toLocaleDateString(
														"en-US",
														{
															weekday: "long",
															year: "numeric",
															month: "long",
															day: "numeric",
														}
													)}
												</>
											)}
										</p>
									</div>
								</div>

								<div className="flex items-start">
									<MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 mr-3" />
									<div>
										<h4 className="font-medium text-gray-900 dark:text-white">
											Location
										</h4>
										<p className="text-gray-600 dark:text-gray-300">
											{event.location}
										</p>
										{event.address && (
											<p className="text-gray-500 dark:text-gray-400 text-sm">
												{event.address}
											</p>
										)}
									</div>
								</div>

								{event.organizer && (
									<div className="flex items-start">
										<Users className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 mr-3" />
										<div>
											<h4 className="font-medium text-gray-900 dark:text-white">
												Organizer
											</h4>
											<p className="text-gray-600 dark:text-gray-300">
												{event.organizer}
											</p>
										</div>
									</div>
								)}

								{event.maxAttendees && (
									<div className="mt-4">
										<h4 className="font-medium text-gray-900 dark:text-white mb-2">
											Registration Status
										</h4>
										<div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2.5 mb-1">
											<div
												className="bg-primary-600 h-2.5 rounded-full"
												style={{
													width: `${
														(event.attendeeCount /
															event.maxAttendees) *
														100
													}%`,
												}}
											></div>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-300">
											{event.attendeeCount} /{" "}
											{event.maxAttendees} spots filled
										</p>
									</div>
								)}
							</div>

							<button
								onClick={handleRegistrationClick}
								className={`w-full btn ${
									isRegistered
										? "bg-green-600 hover:bg-green-700 text-white"
										: "btn-primary"
								}`}
								disabled={isRegistering || isRegistered}
							>
								{isRegistering ? (
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
								) : isRegistered ? (
									"Registered ✓"
								) : (
									"Register Now"
								)}
							</button>

							<button
								onClick={toggleFavorite}
								className={`w-full btn ${
									isFavorite
										? "bg-white text-accent-600 border border-accent-600 hover:bg-accent-50"
										: "btn-outline"
								}`}
							>
								<Heart
									size={18}
									className="mr-2"
									fill={isFavorite ? "currentColor" : "none"}
								/>
								{isFavorite ? "Favorited" : "Add to Favorites"}
							</button>
						</div>
					</div>
				</div>

				{/* Similar Events */}
				{/* This would be populated by an API call in a real implementation */}
			</div>

			{/* Add the registration form modal */}
			{showRegistrationForm && <RegistrationForm />}
		</div>
	);
};

export default EventDetailsPage;
