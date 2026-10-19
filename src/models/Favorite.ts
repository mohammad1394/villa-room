const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
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
    },
    {
        timestamps: true,
    }
);

favoriteSchema.index(
    { userId: 1, villaId: 1 },
    { unique: true }
);

const Favorite =
    mongoose.models.Favorite ||
    mongoose.model("Favorite", favoriteSchema);

export default Favorite;