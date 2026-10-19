import mongoose from "mongoose";

const subDepartmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
    }
);

const SubDepartment =
    mongoose.models.SubDepartment ||
    mongoose.model("SubDepartment", subDepartmentSchema);

export default SubDepartment;