import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        method: {
            type: String,
            enum: ["mock", "zarinpal", "stripe"],
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "success", "failed", "refunded"],
            default: "pending",
        },

        transactionId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Payment =
    mongoose.models.Payment ||
    mongoose.model("Payment", paymentSchema);

module.exports = Payment;