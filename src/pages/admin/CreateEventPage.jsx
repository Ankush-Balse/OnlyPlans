import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import EventForm from "../../components/EventForm";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const CreateEventPage = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (formData) => {
		setLoading(true);
		try {
			const { data } = await axios.post(
				`${baseUrl}/api/events`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			toast.success("Event created successfully");
			navigate(`/events/${data.data._id}`);
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to create event"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">
					Create New Event
				</h1>
				<p className="text-gray-600">
					Fill in the details below to create a new event.
				</p>
			</div>

			<div className="rounded-lg shadow-md p-6 dark:bg-dark-700">
				<EventForm onSubmit={handleSubmit} isLoading={loading} />
			</div>
		</div>
	);
};

export default CreateEventPage;
