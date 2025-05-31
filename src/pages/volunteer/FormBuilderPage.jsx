import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Trash2,
	Plus,
	ArrowLeft,
	Save,
	Download,
	Type,
	Hash,
	Mail,
	Calendar,
	FileText,
	List,
	CheckSquare,
	File,
	AlertCircle,
	Move,
	Copy,
	MoveUp,
	MoveDown,
	Phone,
	Link as LinkIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";

const fieldTypes = [
	{ id: "text", label: "Text Input", icon: <Type size={16} /> },
	{ id: "number", label: "Number Input", icon: <Hash size={16} /> },
	{ id: "email", label: "Email Input", icon: <Mail size={16} /> },
	{ id: "date", label: "Date Input", icon: <Calendar size={16} /> },
	{ id: "textarea", label: "Textarea", icon: <FileText size={16} /> },
	{ id: "select", label: "Dropdown", icon: <List size={16} /> },
	{ id: "radio", label: "Radio Buttons", icon: <CheckSquare size={16} /> },
	{ id: "checkbox", label: "Checkboxes", icon: <CheckSquare size={16} /> },
	{ id: "file", label: "File Upload", icon: <File size={16} /> },
	{ id: "phone", label: "Phone", icon: <Phone size={16} /> },
	{ id: "url", label: "URL", icon: <LinkIcon size={16} /> },
];

const FormBuilderPage = () => {
	const { eventId } = useParams();
	const navigate = useNavigate();
	const { user, isVolunteer } = useAuth();
	const [formTitle, setFormTitle] = useState("Event Registration Form");
	const [formDescription, setFormDescription] = useState("");
	const [fields, setFields] = useState([]);
	const [event, setEvent] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [activeField, setActiveField] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [draggedField, setDraggedField] = useState(null);

	useEffect(() => {
		const fetchEventAndForm = async () => {
			setIsLoading(true);

			try {
				const eventResponse = await axios.get(
					`${baseUrl}/api/events/${eventId}`
				);
				setEvent(eventResponse.data.data);

				if (eventId !== "new") {
					// Try to get existing form
					try {
						const formResponse = await axios.get(
							`${baseUrl}/api/forms/event/${eventId}`
						);
						setFormTitle(formResponse.data.data.title);
						setFormDescription(formResponse.data.data.description);
						setFields(formResponse.data.data.fields);
					} catch (error) {
						console.error("No existing form found:", error);
						// If no form exists, start with empty fields
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Failed to load event data");
			} finally {
				setIsLoading(false);
			}
		};

		if (user && isVolunteer) {
			fetchEventAndForm();
		}
	}, [user, isVolunteer, eventId]);

	const addField = (type) => {
		const newField = {
			id: `field_${Date.now()}`,
			type,
			label: `New ${
				fieldTypes.find((f) => f.id === type)?.label || "Field"
			}`,
			placeholder: "",
			required: false,
			options: type === "select" ? ["Option 1"] : undefined,
		};

		if (type === "select" || type === "radio" || type === "checkbox") {
			newField.options = [
				{ label: "Option 1", value: "option_1" },
				{ label: "Option 2", value: "option_2" },
			];
		}

		setFields([...fields, newField]);
		setActiveField(newField.id);
	};

	const updateField = (id, updates) => {
		setFields(
			fields.map((field) =>
				field.id === id ? { ...field, ...updates } : field
			)
		);
	};

	const removeField = (id) => {
		setFields(fields.filter((field) => field.id !== id));
		if (activeField === id) {
			setActiveField(null);
		}
	};

	const moveField = (id, direction) => {
		const index = fields.findIndex((field) => field.id === id);
		if (
			(direction === "up" && index === 0) ||
			(direction === "down" && index === fields.length - 1)
		) {
			return;
		}

		const newFields = [...fields];
		const newIndex = direction === "up" ? index - 1 : index + 1;

		// Swap the fields
		[newFields[index], newFields[newIndex]] = [
			newFields[newIndex],
			newFields[index],
		];

		setFields(newFields);
	};

	const handleDragStart = (e, id) => {
		setIsDragging(true);
		setDraggedField(id);
	};

	const handleDragOver = (e, id) => {
		e.preventDefault();
		e.stopPropagation();

		if (id !== draggedField) {
			const draggedIndex = fields.findIndex(
				(field) => field.id === draggedField
			);
			const targetIndex = fields.findIndex((field) => field.id === id);

			if (draggedIndex !== -1 && targetIndex !== -1) {
				const newFields = [...fields];
				const [movedField] = newFields.splice(draggedIndex, 1);
				newFields.splice(targetIndex, 0, movedField);
				setFields(newFields);
			}
		}
	};

	const handleDragEnd = () => {
		setIsDragging(false);
		setDraggedField(null);
	};

	const duplicateField = (id) => {
		const fieldToDuplicate = fields.find((field) => field.id === id);
		if (!fieldToDuplicate) return;

		const duplicatedField = {
			...fieldToDuplicate,
			id: `field_${Date.now()}`,
		};

		const index = fields.findIndex((field) => field.id === id);
		const newFields = [...fields];
		newFields.splice(index + 1, 0, duplicatedField);

		setFields(newFields);
		setActiveField(duplicatedField.id);
	};

	const saveForm = async () => {
		setIsSaving(true);

		try {
			// Validate form data
			if (!formTitle.trim()) {
				toast.error("Please provide a form title");
				setIsSaving(false);
				return;
			}

			if (fields.length === 0) {
				toast.error("Please add at least one field to the form");
				setIsSaving(false);
				return;
			}

			const formData = {
				eventId: event._id,
				title: formTitle,
				description: formDescription,
				fields,
			};

			if (event.status === "draft") {
				// Create new form
				await axios.post(`${baseUrl}/api/forms`, formData);
			} else {
				// Update existing form
				await axios.put(`${baseUrl}/api/forms/${event._id}`, formData);
			}

			toast.success("Form saved successfully");
		} catch (error) {
			console.error("Error saving form:", error);
			toast.error("Failed to save form");
		}
		setIsSaving(false);
	};

	const exportResponses = async () => {
		window.location.href = `${baseUrl}/api/forms/${event._id}/export`;
		toast.success("Export started. The file will download shortly.");
	};

	// Render field settings based on active field
	const renderFieldSettings = () => {
		if (!activeField) return null;

		const field = fields.find((f) => f.id === activeField);
		if (!field) return null;

		return (
			<div className="animate-fade-in">
				<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
					Field Settings
				</h3>

				<div className="space-y-4">
					{/* Label */}
					<div>
						<label className="label">Field Label</label>
						<input
							type="text"
							value={field.label}
							onChange={(e) =>
								updateField(field.id, { label: e.target.value })
							}
							className="input"
						/>
					</div>

					{/* Placeholder */}
					{[
						"text",
						"number",
						"email",
						"date",
						"textarea",
						"select",
					].includes(field.type) && (
						<div>
							<label className="label">Placeholder</label>
							<input
								type="text"
								value={field.placeholder || ""}
								onChange={(e) =>
									updateField(field.id, {
										placeholder: e.target.value,
									})
								}
								className="input"
							/>
						</div>
					)}

					{/* Options for select, radio, checkbox */}
					{["select", "radio", "checkbox"].includes(field.type) && (
						<div>
							<label className="label">Options</label>
							<div className="space-y-2">
								{field.options?.map((option, index) => (
									<div
										key={index}
										className="flex items-center gap-2"
									>
										<input
											type="text"
											value={option.label}
											onChange={(e) => {
												const newOptions = [
													...field.options,
												];
												newOptions[index].label =
													e.target.value;
												newOptions[index].value =
													e.target.value
														.toLowerCase()
														.replace(/\s+/g, "_");
												updateField(field.id, {
													options: newOptions,
												});
											}}
											className="input"
											placeholder={`Option ${index + 1}`}
										/>
										<button
											onClick={() => {
												const newOptions =
													field.options.filter(
														(_, i) => i !== index
													);
												updateField(field.id, {
													options: newOptions,
												});
											}}
											className="p-2 text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
											aria-label="Remove option"
										>
											<Trash2 size={16} />
										</button>
									</div>
								))}
								<button
									onClick={() => {
										const newOptions = [
											...(field.options || []),
											{
												label: `Option ${
													(field.options?.length ||
														0) + 1
												}`,
												value: `option_${
													(field.options?.length ||
														0) + 1
												}`,
											},
										];
										updateField(field.id, {
											options: newOptions,
										});
									}}
									className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
								>
									+ Add Option
								</button>
							</div>
						</div>
					)}

					{/* Required toggle */}
					<div className="flex items-center">
						<input
							id="required"
							type="checkbox"
							checked={field.required}
							onChange={(e) =>
								updateField(field.id, {
									required: e.target.checked,
								})
							}
							className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:focus:ring-primary-800 dark:bg-dark-700"
						/>
						<label
							htmlFor="required"
							className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
						>
							Required field
						</label>
					</div>

					{/* Advanced settings could go here */}

					{/* Actions */}
					<div className="pt-4 flex justify-between border-t dark:border-dark-600">
						<button
							onClick={() => removeField(field.id)}
							className="text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300 text-sm font-medium flex items-center"
						>
							<Trash2 size={16} className="mr-1" />
							Delete Field
						</button>
						<button
							onClick={() => duplicateField(field.id)}
							className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center"
						>
							<Copy size={16} className="mr-1" />
							Duplicate
						</button>
					</div>
				</div>
			</div>
		);
	};

	// Render form preview
	const renderFormPreview = () => {
		if (fields.length === 0) {
			return (
				<div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
					<AlertCircle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
					<h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
						No fields added
					</h3>
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Get started by adding a field from the left panel
					</p>
				</div>
			);
		}

		return (
			<div className="space-y-6">
				{fields.map((field, index) => (
					<div
						key={field.id}
						className={`p-4 border rounded-lg transition-all ${
							activeField === field.id
								? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20"
								: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
						} ${isDragging ? "cursor-grabbing" : "cursor-pointer"}`}
						onClick={() => setActiveField(field.id)}
						draggable
						onDragStart={(e) => handleDragStart(e, field.id)}
						onDragOver={(e) => handleDragOver(e, field.id)}
						onDragEnd={handleDragEnd}
					>
						<div className="flex justify-between items-start mb-2">
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								{field.label}
								{field.required && (
									<span className="text-error-500 ml-1">
										*
									</span>
								)}
							</label>
							<div className="flex items-center space-x-1">
								<button
									onClick={(e) => {
										e.stopPropagation();
										duplicateField(field.id);
									}}
									className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
									aria-label="Duplicate field"
								>
									<Copy size={16} />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										moveField(field.id, "up");
									}}
									disabled={index === 0}
									className={`p-1 ${
										index === 0
											? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
											: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
									}`}
									aria-label="Move up"
								>
									<MoveUp size={16} />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										moveField(field.id, "down");
									}}
									disabled={index === fields.length - 1}
									className={`p-1 ${
										index === fields.length - 1
											? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
											: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
									}`}
									aria-label="Move down"
								>
									<MoveDown size={16} />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										removeField(field.id);
									}}
									className="p-1 text-gray-500 hover:text-error-600 dark:text-gray-400 dark:hover:text-error-500"
									aria-label="Remove field"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>

						{/* Render appropriate field type */}
						{field.type === "text" && (
							<input
								type="text"
								className="input mt-1"
								placeholder={field.placeholder}
								disabled
							/>
						)}
						{field.type === "number" && (
							<input
								type="number"
								className="input mt-1"
								placeholder={field.placeholder}
								disabled
							/>
						)}
						{field.type === "email" && (
							<input
								type="email"
								className="input mt-1"
								placeholder={field.placeholder}
								disabled
							/>
						)}
						{field.type === "date" && (
							<input
								type="date"
								className="input mt-1"
								disabled
							/>
						)}
						{field.type === "textarea" && (
							<textarea
								className="input mt-1"
								placeholder={field.placeholder}
								rows="3"
								disabled
							></textarea>
						)}
						{field.type === "select" && (
							<select className="input mt-1" disabled>
								<option value="">
									{field.placeholder || "Select an option"}
								</option>
								{field.options?.map((option, i) => (
									<option key={i} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						)}
						{field.type === "radio" && (
							<div className="mt-2 space-y-2">
								{field.options?.map((option, i) => (
									<div key={i} className="flex items-center">
										<input
											type="radio"
											name={field.id}
											value={option.value}
											disabled
											className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-dark-700"
										/>
										<label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
											{option.label}
										</label>
									</div>
								))}
							</div>
						)}
						{field.type === "checkbox" && (
							<div className="mt-2 space-y-2">
								{field.options?.map((option, i) => (
									<div key={i} className="flex items-center">
										<input
											type="checkbox"
											value={option.value}
											disabled
											className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-dark-700"
										/>
										<label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
											{option.label}
										</label>
									</div>
								))}
							</div>
						)}
						{field.type === "file" && (
							<input
								type="file"
								className="block w-full text-sm text-gray-500 dark:text-gray-400 mt-1
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary-50 file:text-primary-700
                dark:file:bg-primary-900/30 dark:file:text-primary-400
                hover:file:bg-primary-100 dark:hover:file:bg-primary-900/40"
								disabled
							/>
						)}
					</div>
				))}
			</div>
		);
	};

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
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="animate-fade-in">
			{/* Header */}
			<div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
				<div>
					<button
						onClick={() => navigate("/volunteer/events")}
						className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-2"
					>
						<ArrowLeft size={16} className="mr-1" />
						Back to Events
					</button>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Form Builder
					</h1>
					<p className="text-gray-600 dark:text-gray-300 mt-1">
						{event?.title && `Creating form for: ${event.title}`}
					</p>
				</div>

				<div className="flex gap-2 mt-4 md:mt-0">
					{eventId !== "new" && (
						<button
							onClick={exportResponses}
							className="btn btn-outline flex items-center"
						>
							<Download size={16} className="mr-2" />
							Export Responses
						</button>
					)}
					<button
						onClick={saveForm}
						disabled={isSaving}
						className="btn btn-primary flex items-center"
					>
						{isSaving ? (
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
						) : (
							<>
								<Save size={16} className="mr-2" />
								Save Form
							</>
						)}
					</button>
				</div>
			</div>

			{/* Form Title and Description */}
			<div className="card p-6 mb-8">
				<div className="space-y-4">
					<div>
						<label htmlFor="formTitle" className="label">
							Form Title
						</label>
						<input
							type="text"
							id="formTitle"
							value={formTitle}
							onChange={(e) => setFormTitle(e.target.value)}
							className="input"
							placeholder="Enter form title..."
						/>
					</div>
					<div>
						<label htmlFor="formDescription" className="label">
							Form Description
						</label>
						<textarea
							id="formDescription"
							value={formDescription}
							onChange={(e) => setFormDescription(e.target.value)}
							className="input"
							rows="3"
							placeholder="Enter form description..."
						/>
					</div>
				</div>
			</div>

			{/* Form Builder UI */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Left sidebar - Field types */}
				<div className="lg:col-span-3">
					<div className="card p-4 lg:sticky lg:top-24">
						<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
							Field Types
						</h3>
						<div className="space-y-2">
							{fieldTypes.map((type) => (
								<button
									key={type.id}
									onClick={() => addField(type.id)}
									className="w-full text-left px-4 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700 transition-colors"
								>
									<div className="w-6 h-6 mr-2 flex items-center justify-center text-primary-600 dark:text-primary-400">
										{type.icon}
									</div>
									<span>{type.label}</span>
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Middle - Form preview */}
				<div className="lg:col-span-5">
					<div className="card p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Form Preview
							</h3>
							<div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
								<Move size={16} className="mr-1" />
								Drag to reorder
							</div>
						</div>
						{renderFormPreview()}
					</div>
				</div>

				{/* Right sidebar - Field settings */}
				<div className="lg:col-span-4">
					<div className="card p-6 lg:sticky lg:top-24">
						{activeField ? (
							renderFieldSettings()
						) : (
							<div className="text-center py-8">
								<h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
									Field Settings
								</h3>
								<p className="text-gray-500 dark:text-gray-400">
									Select a field to edit its properties
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FormBuilderPage;
