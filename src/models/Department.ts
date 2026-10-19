const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
    }
})

const Department = mongoose.models.Department ||mongoose.model('Department', departmentSchema);

export default Department;