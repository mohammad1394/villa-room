import mongoose, {Schema} from "mongoose";

const provinceSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        cities: [
            {
                type: String,
                trim: true,
            },
        ],

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Province =
    mongoose.models.Province ||
    mongoose.model("Province", provinceSchema);

export default Province;
