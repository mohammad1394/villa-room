import mongoose from "mongoose";

const ticketMessageSchema = new mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
            required: true,
            index: true,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        senderRole: {
            type: String,
            enum: ["User", "Admin"],
            required: true,
        },

        body: {
            type: String,
            trim: true,
            default: "",
        },

        attachments: [
            {
                url: {
                    type: String,
                    required: true,
                },

                publicId: {
                    type: String,
                },

                name: {
                    type: String,
                    required: true,
                },

                size: {
                    type: Number,
                },

                type: {
                    type: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

ticketMessageSchema.index({
    ticketId: 1,
    createdAt: 1,
});

const TicketMessage =
    mongoose.models.TicketMessage ||
    mongoose.model("TicketMessage", ticketMessageSchema);

export default TicketMessage;