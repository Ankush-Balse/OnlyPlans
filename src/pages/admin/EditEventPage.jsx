import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import EventForm from "../../components/EventForm";

const EditEventPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetchEvent();
	}, [id]);

	const fetchEvent = async () => {
		try {
			const { data } = await axios.get(`/api/events/${id}`);
			setEvent(data.data);
		} catch (error) {
			toast.error("Failed to fetch event");
			navigate("/admin");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (formData) => {
		setSaving(true);
		try {
			await axios.put(`/api/events/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			toast.success("Event updated successfully");
			navigate(`/events/${id}`);
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to update event"
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
				<p className="text-gray-600">Update the event details below.</p>
			</div>

			<div className="rounded-lg shadow-md p-6 dark:bg-dark-700">
				<EventForm
					event={event}
					onSubmit={handleSubmit}
					isLoading={saving}
				/>
			</div>
		</div>
	);
};

export default EditEventPage;
