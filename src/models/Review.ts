const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        villaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Villa",
            required: true,
        },

        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

reviewSchema.index(
    { userId: 1, bookingId: 1 },
    { unique: true }
);

const Review =
    mongoose.models.Review ||
    mongoose.model("Review", reviewSchema);

export default Review;