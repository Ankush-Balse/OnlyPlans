import mongoose from "mongoose";

const formFieldSchema = new mongoose.Schema({
	label: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: [
			"text",
			"number",
			"email",
			"select",
			"multiselect",
			"file",
			"date",
			"checkbox",
		],
		required: true,
	},
	required: {
		type: Boolean,
		default: false,
	},
	options: [
		{
			type: String,
		},
	],
	placeholder: String,
	validation: {
		min: Number,
		max: Number,
		pattern: String,
	},
});

const registrationSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	formData: {
		type: Map,
		of: mongoose.Schema.Types.Mixed,
	},
	status: {
		type: String,
		enum: ["pending", "approved", "rejected", "attended"],
		default: "pending",
	},
	submittedAt: {
		type: Date,
		default: Date.now,
	},
});

const reviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	comment: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const eventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please add a title"],
			trim: true,
			maxlength: [100, "Title cannot be more than 100 characters"],
		},
		description: {
			type: String,
			required: [true, "Please add a description"],
		},
		date: {
			type: Date,
			required: [true, "Please add a date"],
		},
		endDate: {
			type: Date,
		},
		location: {
			type: String,
			required: [true, "Please add a location"],
		},
		address: {
			type: String,
		},
		category: {
			type: String,
			required: [true, "Please add a category"],
		},
		image: {
			type: String,
		},
		maxAttendees: {
			type: Number,
		},
		price: {
			type: Number,
			default: 0,
		},
		tags: [String],
		schedule: [
			{
				date: String,
				items: [
					{
						time: String,
						title: String,
						description: String,
					},
				],
			},
		],
		speakers: [
			{
				name: String,
				title: String,
				bio: String,
				image: {
					type: String,
					default: null,
				},
			},
		],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		volunteers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		registrationForm: {
			fields: [formFieldSchema],
			lastUpdatedBy: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			lastUpdatedAt: Date,
		},
		registrations: [registrationSchema],
		reviews: [reviewSchema],
		status: {
			type: String,
			enum: ["draft", "published", "cancelled", "completed"],
			default: "draft",
		},
		statistics: {
			registeredCount: {
				type: Number,
				default: 0,
			},
			attendedCount: {
				type: Number,
				default: 0,
			},
			averageRating: {
				type: Number,
				default: 0,
			},
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// Update statistics when a new registration is added
eventSchema.pre("save", function (next) {
	if (this.isModified("registrations")) {
		this.statistics.registeredCount = this.registrations.length;
		this.statistics.attendedCount = this.registrations.filter(
			(r) => r.status === "attended"
		).length;
	}
	if (this.isModified("reviews")) {
		const totalRating = this.reviews.reduce(
			(acc, review) => acc + review.rating,
			0
		);
		this.statistics.averageRating = totalRating / this.reviews.length;
	}
	next();
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
