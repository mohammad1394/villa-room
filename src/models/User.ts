
import mongoose from "mongoose";

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
            enum: ["User", "Admin", "SuperAdmin"],
            default: "User",
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

userSchema.index({ role: 1, status: 1 });

const User =
    mongoose.models.User ||
    mongoose.model("User", userSchema);

export default User;
