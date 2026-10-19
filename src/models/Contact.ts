const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        subject: {
            type: String,
            enum: [
                "reservation",
                "my-payment",
                "support",
                "complaint",
                "other",
            ],
            default: "reservation",
            required: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["pending", "read", "answered"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);
const Contact =
    mongoose.models.Contact ||
    mongoose.model("Contact", contactSchema);

export default Contact;