const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
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

        checkIn: {
            type: Date,
            required: true,
        },

        checkOut: {
            type: Date,
            required: true,
        },

        guests: {
            type: Number,
            required: true,
            min: 1,
        },

        nights: {
            type: Number,
            required: true,
            min: 1,
        },

        pricePerNight: {
            type: Number,
            required: true,
            min: 0,
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },

        serviceFee: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);
bookingSchema.index({
    villaId: 1,
    checkIn: 1,
    checkOut: 1,
});


const Booking =
    mongoose.models.Booking ||
    mongoose.model("Booking", bookingSchema);

export default Booking;