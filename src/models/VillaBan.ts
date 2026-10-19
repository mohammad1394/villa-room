import mongoose from "mongoose";
import Villa from "@/models/Villa";


const VillaBanSchema = new mongoose.Schema(
    {
        villaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Villa",
            required: true,
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

const VillaBan =
    mongoose.models.VillaBan ||
    mongoose.model("VillaBan", VillaBanSchema);

export default VillaBan;