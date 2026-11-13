import mongoose from "mongoose";

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
    _mongooseCache?: MongooseCache;
};

const cache: MongooseCache =
    globalWithMongoose._mongooseCache ??
    (globalWithMongoose._mongooseCache = { conn: null, promise: null });

/**
 * Connects to MongoDB once per server instance and reuses the connection
 * (also across hot reloads in development and concurrent requests).
 */
const connectToDB = async () => {
    if (cache.conn && mongoose.connection.readyState === 1) {
        return cache.conn;
    }

    const url = process.env.MONGODB_URL;

    if (!url) {
        throw new Error("MONGODB_URL is not defined");
    }

    if (!cache.promise) {
        cache.promise = mongoose
            .connect(url, { bufferCommands: false })
            .catch((error) => {
                // allow a retry on the next request
                cache.promise = null;
                throw error;
            });
    }

    cache.conn = await cache.promise;
    return cache.conn;
};

export default connectToDB;
