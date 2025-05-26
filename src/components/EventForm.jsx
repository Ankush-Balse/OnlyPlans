import { useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import {
	Calendar,
	MapPin,
	Users,
	Tag,
	Upload,
	Plus,
	X,
	Loader,
	Clock,
	DollarSign,
	ListChecks,
	User,
	FileText,
} from "lucide-react";

const EventForm = ({ event, onSubmit, isLoading }) => {
	const [tags, setTags] = useState(event?.tags || []);
	const [tagInput, setTagInput] = useState("");
	const [imagePreview, setImagePreview] = useState(event?.image || null);
	const [speakers, setSpeakers] = useState(event?.speakers || []);
	const [speakerImagePreviews, setSpeakerImagePreviews] = useState({});
	const [scheduleItems, setScheduleItems] = useState(
		event?.schedule || [
			{ date: "", items: [{ time: "", title: "", description: "" }] },
		]
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({
		defaultValues: {
			title: event?.title || "",
			description: event?.description || "",
			date: event?.date
				? new Date(event.date).toISOString().split("T")[0]
				: "",
			time: event?.date
				? new Date(event.date).toISOString().split("T")[1].slice(0, 5)
				: "",
			endDate: event?.endDate
				? new Date(event.endDate).toISOString().split("T")[0]
				: "",
			endTime: event?.endDate
				? new Date(event.endDate)
						.toISOString()
						.split("T")[1]
						.slice(0, 5)
				: "",
			location: event?.location || "",
			address: event?.address || "",
			category: event?.category || "",
			maxAttendees: event?.maxAttendees || "",
			price: event?.price || 0,
			status: event?.status || "draft",
			image: "",
		},
	});

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleTagAdd = (e) => {
		e.preventDefault();
		if (tagInput.trim() && !tags.includes(tagInput.trim())) {
			setTags([...tags, tagInput.trim()]);
			setTagInput("");
		}
	};

	const handleTagRemove = (tagToRemove) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleSpeakerAdd = () => {
		setSpeakers([
			...speakers,
			{ name: "", title: "", bio: "", image: null },
		]);
	};

	const handleSpeakerRemove = (index) => {
		setSpeakers(speakers.filter((_, i) => i !== index));
	};

	const handleSpeakerChange = (index, field, value) => {
		const newSpeakers = [...speakers];
		newSpeakers[index][field] = value;
		setSpeakers(newSpeakers);
	};

	const handleSpeakerImageChange = (index, e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setSpeakerImagePreviews((prev) => ({
					...prev,
					[index]: reader.result,
				}));
				const newSpeakers = [...speakers];
				newSpeakers[index].imageFile = file;
				setSpeakers(newSpeakers);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleScheduleAdd = () => {
		setScheduleItems([
			...scheduleItems,
			{ date: "", items: [{ time: "", title: "", description: "" }] },
		]);
	};

	const handleScheduleRemove = (index) => {
		setScheduleItems(scheduleItems.filter((_, i) => i !== index));
	};

	const handleScheduleItemAdd = (dayIndex) => {
		const newSchedule = [...scheduleItems];
		newSchedule[dayIndex].items.push({
			time: "",
			title: "",
			description: "",
		});
		setScheduleItems(newSchedule);
	};

	const handleScheduleItemRemove = (dayIndex, itemIndex) => {
		const newSchedule = [...scheduleItems];
		newSchedule[dayIndex].items = newSchedule[dayIndex].items.filter(
			(_, i) => i !== itemIndex
		);
		setScheduleItems(newSchedule);
	};

	const handleScheduleChange = (dayIndex, itemIndex, field, value) => {
		const newSchedule = [...scheduleItems];
		if (field === "date") {
			newSchedule[dayIndex].date = value;
		} else {
			newSchedule[dayIndex].items[itemIndex][field] = value;
		}
		setScheduleItems(newSchedule);
	};

	const onFormSubmit = (data) => {
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("description", data.description);
		formData.append("date", `${data.date}T${data.time}`);
		formData.append(
			"endDate",
			data.endDate ? `${data.endDate}T${data.endTime}` : ""
		);
		formData.append("location", data.location);
		formData.append("address", data.address);
		formData.append("category", data.category);
		formData.append("maxAttendees", data.maxAttendees);
		formData.append("price", data.price);
		formData.append("status", data.status);
		formData.append("tags", JSON.stringify(tags));

		if (data.image[0]) {
			formData.append("image", data.image[0]);
		}

		const speakerInfo = [],
			speakerImageIndices = [];

		speakers.forEach((speaker, index) => {
			speakerInfo.push({
				name: speaker.name,
				title: speaker.title,
				bio: speaker.bio,
			});
			// if (speaker.imageFile) {
			// 	speakerImages.push(speaker.imageFile);
			// } else if (speaker.image) {
			// 	speakerImages.push(speaker.image);
			// }
			if (speaker.imageFile) {
				speakerImageIndices.push(index);
				formData.append(`speakerImages`, speaker.imageFile);
			} else if (speaker.image) {
				speakerImageIndices.push(index);
				formData.append(`speakerImages`, speaker.image);
			}
		});

		formData.append("speakers", JSON.stringify(speakerInfo));
		formData.append(
			"speakerImageIndices",
			JSON.stringify(speakerImageIndices)
		);
		// formData.append("speakerImages", speakersImages);

		// speakers.forEach((speaker) => {
		// 	if (speaker.imageFile) {
		// 		formData.append(`speakerImages`, speaker.imageFile);
		// 	} else if (speaker.image) {
		// 		formData.append(`speakerImages`, speaker.image);
		// 	}
		// });

		// speakers.forEach((speaker, index) => {
		// 	formData.append(`speakers[${index}][name]`, speaker.name);
		// 	formData.append(`speakers[${index}][title]`, speaker.title);
		// 	formData.append(`speakers[${index}][bio]`, speaker.bio);
		// 	if (speaker.imageFile) {
		// 		formData.append(`speakers[${index}][image]`, speaker.imageFile);
		// 	} else if (speaker.image) {
		// 		formData.append(`speakers[${index}][image]`, speaker.image);
		// 	}
		// });

		formData.append("schedule", JSON.stringify(scheduleItems));

		onSubmit(formData);
	};

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

	return (
		<form
			onSubmit={handleSubmit(onFormSubmit)}
			className="space-y-6 dark:bg-dark-700"
		>
			{/* Image Upload */}
			<div>
				<label className="label">Event Image</label>
				<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md bg-white dark:bg-dark-800">
					<div className="space-y-1 text-center">
						{imagePreview ? (
							<div className="relative">
								<img
									src={imagePreview}
									alt="Preview"
									className="mx-auto h-32 w-auto"
								/>
								<button
									type="button"
									onClick={() => {
										setImagePreview(null);
									}}
									className="absolute top-0 right-0 bg-error-500 text-white p-1 rounded-full hover:bg-error-600 dark:bg-error-600 dark:hover:bg-error-700"
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						) : (
							<Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
						)}
						<div className="flex text-sm text-gray-600 dark:text-gray-400">
							<label
								htmlFor="image"
								className="relative cursor-pointer bg-white dark:bg-dark-800 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
							>
								<span>Upload a file</span>
								<input
									id="image"
									type="file"
									className="sr-only"
									accept="image/*"
									{...register("image")}
									onChange={handleImageChange}
								/>
							</label>
							<p className="pl-1">or drag and drop</p>
						</div>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							PNG, JPG, GIF up to 5MB
						</p>
					</div>
				</div>
			</div>

			{/* Basic Information */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Title */}
				<div className="md:col-span-2">
					<label className="label">Event Title</label>
					<input
						type="text"
						{...register("title", {
							required: "Title is required",
							maxLength: {
								value: 100,
								message:
									"Title cannot be more than 100 characters",
							},
						})}
						className="input"
					/>
					{errors.title && (
						<p className="error-message">{errors.title.message}</p>
					)}
				</div>

				{/* Category */}
				<div>
					<label className="label">Category</label>
					<select
						{...register("category", {
							required: "Category is required",
						})}
						className="input"
					>
						<option value="">Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category.charAt(0).toUpperCase() +
									category.slice(1)}
							</option>
						))}
					</select>
					{errors.category && (
						<p className="error-message">
							{errors.category.message}
						</p>
					)}
				</div>

				{/* Status */}
				<div>
					<label className="label">Status</label>
					<select {...register("status")} className="input">
						<option value="draft">Draft</option>
						<option value="published">Published</option>
						<option value="cancelled">Cancelled</option>
						<option value="completed">Completed</option>
					</select>
				</div>

				{/* Start Date and Time */}
				<div>
					<label className="label">Start Date</label>
					<div className="relative">
						<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
						<input
							type="date"
							{...register("date", {
								required: "Start date is required",
							})}
							className="input pl-10"
						/>
					</div>
					{errors.date && (
						<p className="error-message">{errors.date.message}</p>
					)}
				</div>

				<div>
					<label className="label">Start Time</label>
					<div className="relative">
						<Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
						<input
							type="time"
							{...register("time", {
								required: "Start time is required",
							})}
							className="input pl-10"
						/>
					</div>
					{errors.time && (
						<p className="error-message">{errors.time.message}</p>
					)}
				</div>

				{/* End Date and Time */}
				<div>
					<label className="label">End Date</label>
					<div className="relative">
						<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
						<input
							type="date"
							{...register("endDate")}
							className="input pl-10"
						/>
					</div>
				</div>

				<div>
					<label className="label">End Time</label>
					<div className="relative">
						<Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
						<input
							type="time"
							{...register("endTime")}
							className="input pl-10"
						/>
					</div>
				</div>

				{/* Location */}
				<div>
					<label className="label">Location</label>
					<div className="relative">
						<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
						<input
							type="text"
							{...register("location", {
								required: "Location is required",
							})}
							className="input pl-10"
							placeholder="Event venue or location"
						/>
					</div>
					{errors.location && (
						<p className="error-message">
							{errors.location.message}
						</p>
					)}
				</div>

				{/* Address */}
				<div>
					<label className="label">Full Address</label>
					<div className="relative">
						<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
						<input
							type="text"
							{...register("address")}
							className="input pl-10"
							placeholder="Detailed address"
						/>
					</div>
				</div>

				{/* Capacity */}
				<div>
					<label className="label">Maximum Attendees</label>
					<div className="relative">
						<Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
						<input
							type="number"
							{...register("maxAttendees", {
								min: {
									value: 1,
									message: "Capacity must be at least 1",
								},
							})}
							className="input pl-10"
							placeholder="Maximum number of attendees"
						/>
					</div>
					{errors.maxAttendees && (
						<p className="error-message">
							{errors.maxAttendees.message}
						</p>
					)}
				</div>

				{/* Price */}
				<div>
					<label className="label">Price</label>
					<div className="relative">
						<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
						<input
							type="number"
							step="0.01"
							{...register("price")}
							className="input pl-10"
							placeholder="0.00 for free events"
						/>
					</div>
				</div>
			</div>

			{/* Description */}
			<div>
				<label className="label">Description</label>
				<textarea
					{...register("description", {
						required: "Description is required",
					})}
					rows="4"
					className="input"
					placeholder="Describe your event..."
				/>
				{errors.description && (
					<p className="error-message">
						{errors.description.message}
					</p>
				)}
			</div>

			{/* Tags */}
			<div>
				<label className="label">Tags</label>
				<div className="space-y-2">
					<div className="flex flex-wrap gap-2">
						{tags.map((tag, index) => (
							<span
								key={index}
								className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full text-sm flex items-center"
							>
								<Tag className="w-3 h-3 mr-1" />
								{tag}
								<button
									type="button"
									onClick={() => handleTagRemove(tag)}
									className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
								>
									<X className="w-3 h-3" />
								</button>
							</span>
						))}
					</div>
					<div className="flex">
						<div className="relative flex-1">
							<Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
							<input
								type="text"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								className="input pl-10"
								placeholder="Add a tag"
							/>
						</div>
						<button
							type="button"
							onClick={handleTagAdd}
							className="ml-2 btn btn-primary"
						>
							<Plus className="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>

			{/* Speakers */}
			<div>
				<div className="flex justify-between items-center mb-4">
					<label className="label mb-0">Speakers</label>
					<button
						type="button"
						onClick={handleSpeakerAdd}
						className="btn btn-outline btn-sm"
					>
						<Plus className="h-4 w-4 mr-1" />
						Add Speaker
					</button>
				</div>
				<div className="space-y-4">
					{speakers.map((speaker, index) => (
						<div key={index} className="card p-4">
							<div className="flex justify-between items-start mb-4">
								<h4 className="text-lg font-medium text-gray-900 dark:text-white">
									Speaker {index + 1}
								</h4>
								<button
									type="button"
									onClick={() => handleSpeakerRemove(index)}
									className="text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="md:col-span-2">
									<div className="flex items-center space-x-4">
										<div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
											{speakerImagePreviews[index] ||
											speaker.image ? (
												<img
													src={
														speakerImagePreviews[
															index
														] || speaker.image
													}
													alt={`${
														speaker.name ||
														"Speaker"
													} preview`}
													className="h-full w-full object-cover"
												/>
											) : (
												<User className="h-full w-full p-4 text-gray-400 dark:text-gray-500" />
											)}
										</div>
										<div>
											<label className="btn btn-outline btn-sm cursor-pointer">
												<Upload className="h-4 w-4 mr-1" />
												Upload Photo
												<input
													type="file"
													className="hidden"
													accept="image/*"
													onChange={(e) =>
														handleSpeakerImageChange(
															index,
															e
														)
													}
												/>
											</label>
										</div>
									</div>
								</div>
								<div>
									<label className="label">Name</label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
										<input
											type="text"
											value={speaker.name}
											onChange={(e) =>
												handleSpeakerChange(
													index,
													"name",
													e.target.value
												)
											}
											className="input pl-10"
											placeholder="Speaker name"
										/>
									</div>
								</div>
								<div>
									<label className="label">Title</label>
									<input
										type="text"
										value={speaker.title}
										onChange={(e) =>
											handleSpeakerChange(
												index,
												"title",
												e.target.value
											)
										}
										className="input"
										placeholder="Speaker title or role"
									/>
								</div>
								<div className="md:col-span-2">
									<label className="label">Bio</label>
									<textarea
										value={speaker.bio}
										onChange={(e) =>
											handleSpeakerChange(
												index,
												"bio",
												e.target.value
											)
										}
										className="input"
										rows="3"
										placeholder="Speaker bio"
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Schedule */}
			<div>
				<div className="flex justify-between items-center mb-4">
					<label className="label mb-0">Schedule</label>
					<button
						type="button"
						onClick={handleScheduleAdd}
						className="btn btn-outline btn-sm"
					>
						<Plus className="h-4 w-4 mr-1" />
						Add Day
					</button>
				</div>
				<div className="space-y-4">
					{scheduleItems.map((day, dayIndex) => (
						<div key={dayIndex} className="card p-4">
							<div className="flex justify-between items-start mb-4">
								<div className="flex-1">
									<label className="label">Date</label>
									<input
										type="date"
										value={day.date}
										onChange={(e) =>
											handleScheduleChange(
												dayIndex,
												null,
												"date",
												e.target.value
											)
										}
										className="input"
									/>
								</div>
								<button
									type="button"
									onClick={() =>
										handleScheduleRemove(dayIndex)
									}
									className="mt-8 ml-2 text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<div className="space-y-4">
								{day.items.map((item, itemIndex) => (
									<div
										key={itemIndex}
										className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
									>
										<div className="md:col-span-2">
											<label className="label">
												Time
											</label>
											<input
												type="time"
												value={item.time}
												onChange={(e) =>
													handleScheduleChange(
														dayIndex,
														itemIndex,
														"time",
														e.target.value
													)
												}
												className="input"
											/>
										</div>
										<div className="md:col-span-4">
											<label className="label">
												Title
											</label>
											<input
												type="text"
												value={item.title}
												onChange={(e) =>
													handleScheduleChange(
														dayIndex,
														itemIndex,
														"title",
														e.target.value
													)
												}
												className="input"
												placeholder="Session title"
											/>
										</div>
										<div className="md:col-span-5">
											<label className="label">
												Description
											</label>
											<input
												type="text"
												value={item.description}
												onChange={(e) =>
													handleScheduleChange(
														dayIndex,
														itemIndex,
														"description",
														e.target.value
													)
												}
												className="input"
												placeholder="Session description"
											/>
										</div>
										<div className="md:col-span-1 flex justify-end">
											<button
												type="button"
												onClick={() =>
													handleScheduleItemRemove(
														dayIndex,
														itemIndex
													)
												}
												className="mt-8 text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300"
												disabled={
													day.items.length === 1
												}
											>
												<X className="h-5 w-5" />
											</button>
										</div>
									</div>
								))}
								<button
									type="button"
									onClick={() =>
										handleScheduleItemAdd(dayIndex)
									}
									className="btn btn-outline btn-sm"
								>
									<Plus className="h-4 w-4 mr-1" />
									Add Session
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Submit Button */}
			<div className="flex justify-end">
				<button
					type="submit"
					disabled={isLoading}
					className="btn btn-primary"
				>
					{isLoading ? (
						<>
							<Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
							Saving...
						</>
					) : (
						"Save Event"
					)}
				</button>
			</div>
		</form>
	);
};

EventForm.propTypes = {
	event: PropTypes.shape({
		title: PropTypes.string,
		description: PropTypes.string,
		date: PropTypes.string,
		endDate: PropTypes.string,
		location: PropTypes.string,
		address: PropTypes.string,
		category: PropTypes.string,
		image: PropTypes.string,
		maxAttendees: PropTypes.number,
		price: PropTypes.number,
		tags: PropTypes.arrayOf(PropTypes.string),
		status: PropTypes.string,
		speakers: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string,
				title: PropTypes.string,
				bio: PropTypes.string,
				image: PropTypes.string,
			})
		),
		schedule: PropTypes.arrayOf(
			PropTypes.shape({
				date: PropTypes.string,
				items: PropTypes.arrayOf(
					PropTypes.shape({
						time: PropTypes.string,
						title: PropTypes.string,
						description: PropTypes.string,
					})
				),
			})
		),
	}),
	onSubmit: PropTypes.func.isRequired,
	isLoading: PropTypes.bool,
};

export default EventForm;
