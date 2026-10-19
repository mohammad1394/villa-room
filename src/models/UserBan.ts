import Villa from "@/models/Villa";

const mongoose = require("mongoose");

const UserBanSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        bannedUntil: {
            type: Date,
            default: null,
        },
        bannedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
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

const UserBan = mongoose.models.UserBan || mongoose.model("UserBan", UserBanSchema);

export default UserBan;