
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
}

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ?? {
    conn: null,
    promise: null,
};

global.mongooseCache = cached;

const connectToDB = async () => {
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).catch((error) => {
            cached.promise = null;
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log("Connected to DB successfully!");
        return cached.conn;
    } catch (error) {
        console.error("DB connection error:", error);
        throw error;
    }
};

export default connectToDB;





























// const mongoose = require('mongoose');
//
// const connectToDB = async () => {
//     try {
//         if (mongoose.connection.readyState === 1) {
//             return;
//         }
//         if (!process.env.MONGODB_URI) {
//             throw new Error("MONGODB_URI is not defined");
//         }
//
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("Connected to DB successfully!");
//
//
//
//     } catch (err) {
//         console.log("DB connection error:", err);
//     }
// };
//
// export default connectToDB;