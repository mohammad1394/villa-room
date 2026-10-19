import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        villaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Villa",
            default: null,
        },

        maxUse: {
            type: Number,
            required: true,
            min: 1,
        },

        uses: {
            type: Number,
            default: 0,
            min: 0,
        },

        expire: {
            type: Date,
            required: true,
        },

        percent: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },
        status : {
            type: String,
            enum : ["active" , "expired" , "finished" , "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const Discount =
    mongoose.models.Discount ||
    mongoose.model("Discount", discountSchema);

export default Discount;