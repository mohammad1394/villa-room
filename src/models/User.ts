const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "blocked"],
            default: "active",
        },

        role: {
            type: String,
            enum: ["user", "Admin"],
            default: "user",
        },

        avatar: {
            type: String,
            default: null,
        },

        refreshToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const User =
    mongoose.models.User ||
    mongoose.model("User", userSchema);

export default User;