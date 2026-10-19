const mongoose = require("mongoose");

const villaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ["forest", "beach", "pool", "mountain"],
            required: true,
        },

        province: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Province",
            required: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        images: {
            type: [String],
            default: [],
        },

        pricePerNight: {
            type: Number,
            required: true,
            min: 0,
        },

        capacity: {
            type: Number,
            required: true,
            min: 1,
        },

        bedrooms: {
            type: Number,
            min: 0,
            default: 0,
        },

        bathrooms: {
            type: Number,
            min: 0,
            default: 0,
        },

        amenities: {
            type: [String],
            default: [],
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },

        reviewsCount: {
            type: Number,
            min: 0,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Villa =
    mongoose.models.Villa ||
    mongoose.model("Villa", villaSchema);

export default Villa;