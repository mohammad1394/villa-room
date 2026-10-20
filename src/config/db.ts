const mongoose = require('mongoose');

const connectToDB = async () => {

    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB successfully!");



    } catch (err) {
        console.log("DB connection error:", err);
    }
};

export default connectToDB;