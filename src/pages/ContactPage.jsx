import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ContactPage = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm();

	const onSubmit = async (data) => {
		try {
			await axios.post(`${baseUrl}/api/contact`, data);

			// await new Promise(resolve => setTimeout(resolve, 1000));

			toast.success("Message sent successfully!");
			reset();
		} catch (error) {
			console.error("Failed to send message:", error);
			toast.error("Failed to send message. Please try again.");
		}
	};

	return (
		<div className="animate-fade-in">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-4xl md:text-5xl font-bold mb-6">
							Contact Us
						</h1>
						<p className="text-xl text-gray-100">
							Have questions? We'd love to hear from you. Send us
							a message and we'll respond as soon as possible.
						</p>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Contact Information */}
					<div>
						<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
							Get in Touch
						</h2>
						<div className="space-y-6">
							<div className="flex items-start">
								<div className="flex-shrink-0">
									<div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
										<Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
									</div>
								</div>
								<div className="ml-4">
									<h3 className="text-lg font-medium text-gray-900 dark:text-white">
										Email
									</h3>
									<p className="mt-1 text-gray-600 dark:text-gray-300">
										<a
											href="mailto:info@onlyplans.com"
											className="hover:text-primary-600 dark:hover:text-primary-400"
										>
											info@onlyplans.com
										</a>
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="flex-shrink-0">
									<div className="h-12 w-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
										<Phone className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
									</div>
								</div>
								<div className="ml-4">
									<h3 className="text-lg font-medium text-gray-900 dark:text-white">
										Phone
									</h3>
									<p className="mt-1 text-gray-600 dark:text-gray-300">
										<a
											href="tel:+1234567890"
											className="hover:text-primary-600 dark:hover:text-primary-400"
										>
											(123) 456-7890
										</a>
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="flex-shrink-0">
									<div className="h-12 w-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
										<MapPin className="h-6 w-6 text-accent-600 dark:text-accent-400" />
									</div>
								</div>
								<div className="ml-4">
									<h3 className="text-lg font-medium text-gray-900 dark:text-white">
										Office
									</h3>
									<p className="mt-1 text-gray-600 dark:text-gray-300">
										123 Event Street, Suite 100
										<br />
										San Francisco, CA 94103
									</p>
								</div>
							</div>
						</div>

						{/* Office Hours */}
						<div className="mt-12">
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
								Office Hours
							</h3>
							<div className="space-y-2 text-gray-600 dark:text-gray-300">
								<div className="flex justify-between">
									<span>Monday - Friday</span>
									<span>9:00 AM - 6:00 PM PST</span>
								</div>
								<div className="flex justify-between">
									<span>Saturday</span>
									<span>10:00 AM - 4:00 PM PST</span>
								</div>
								<div className="flex justify-between">
									<span>Sunday</span>
									<span>Closed</span>
								</div>
							</div>
						</div>
					</div>

					{/* Contact Form */}
					<div>
						<div className="card p-6">
							<h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
								Send us a Message
							</h2>
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<div>
									<label htmlFor="name" className="label">
										Name
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
										})}
									/>
									{errors.name && (
										<p className="mt-1 text-sm text-error-600 dark:text-error-400">
											{errors.name.message}
										</p>
									)}
								</div>

								<div>
									<label htmlFor="email" className="label">
										Email
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
												message:
													"Invalid email address",
											},
										})}
									/>
									{errors.email && (
										<p className="mt-1 text-sm text-error-600 dark:text-error-400">
											{errors.email.message}
										</p>
									)}
								</div>

								<div>
									<label htmlFor="subject" className="label">
										Subject
									</label>
									<input
										type="text"
										id="subject"
										className={`input ${
											errors.subject
												? "border-error-500 focus:border-error-500 focus:ring-error-500"
												: ""
										}`}
										{...register("subject", {
											required: "Subject is required",
										})}
									/>
									{errors.subject && (
										<p className="mt-1 text-sm text-error-600 dark:text-error-400">
											{errors.subject.message}
										</p>
									)}
								</div>

								<div>
									<label htmlFor="message" className="label">
										Message
									</label>
									<textarea
										id="message"
										rows="4"
										className={`input ${
											errors.message
												? "border-error-500 focus:border-error-500 focus:ring-error-500"
												: ""
										}`}
										{...register("message", {
											required: "Message is required",
											minLength: {
												value: 20,
												message:
													"Message must be at least 20 characters",
											},
										})}
									></textarea>
									{errors.message && (
										<p className="mt-1 text-sm text-error-600 dark:text-error-400">
											{errors.message.message}
										</p>
									)}
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className="btn btn-primary w-full flex justify-center items-center"
								>
									{isSubmitting ? (
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
									) : (
										<>
											<Send size={16} className="mr-2" />
											Send Message
										</>
									)}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* Map Section */}
			<div className="bg-gray-50 dark:bg-dark-900 py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-3xl mx-auto text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
							Visit Our Office
						</h2>
						<p className="text-gray-600 dark:text-gray-300">
							We're conveniently located in the heart of San
							Francisco's tech district.
						</p>
					</div>
					<div className="aspect-w-16 aspect-h-9 max-w-5xl mx-auto">
						<iframe
							title="Office Location"
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0637507774103!2d-122.39901548441547!3d37.78779997975559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807d2a70dd45%3A0xbe3d3c8c9895e4f5!2sSan%20Francisco%2C%20CA%2094103!5e0!3m2!1sen!2sus!4v1625234567890!5m2!1sen!2sus"
							width="100%"
							height="450"
							style={{ border: 0 }}
							allowFullScreen=""
							loading="lazy"
							className="rounded-lg shadow-lg"
						></iframe>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
