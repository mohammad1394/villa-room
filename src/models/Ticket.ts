import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        body: {
            type: String,
            required: true,
            trim: true,
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
            index: true,
        },

        subDepartment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubDepartment",
            required: true,
            index: true,
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        status: {
            type: String,
            enum: [
                "open",
                "pending",
                "answered",
                "closed",
            ],
            default: "open",
            index: true,
        },

        lastMessageAt: {
            type: Date,
            default: Date.now,
        },

        lastMessageBy: {
            type: String,
            enum: ["user", "support"],
        },

        closedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

ticketSchema.index({
    userId: 1,
    createdAt: -1,
});

ticketSchema.index({
    status: 1,
    createdAt: -1,
});

const Ticket =
    mongoose.models.Ticket ||
    mongoose.model("Ticket", ticketSchema);

export default Ticket;