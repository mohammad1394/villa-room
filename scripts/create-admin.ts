
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User";

loadEnvConfig(process.cwd());

const createAdmin = async () => {
    try {
        const { MONGODB_URL, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } =
            process.env;

        if (
            !MONGODB_URL ||
            !ADMIN_NAME ||
            !ADMIN_EMAIL ||
            !ADMIN_PHONE ||
            !ADMIN_PASSWORD
        ) {
            throw new Error("Required environment variables are missing.");
        }

        if (ADMIN_PASSWORD.length < 8) {
            throw new Error("Password must be at least 8 characters.");
        }

        await mongoose.connect(MONGODB_URL);

        const existingAdmin = await User.findOne({
            role: "SuperAdmin",
        });

        if (existingAdmin) {
            throw new Error("A SuperAdmin already exists.");
        }

        const email = ADMIN_EMAIL.trim().toLowerCase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("This email is already registered.");
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

        await User.create({
            fullName: ADMIN_NAME.trim(),
            email,
            phone: ADMIN_PHONE.trim(),
            password: hashedPassword,
            role: "SuperAdmin",
            status: "active",
        });

        console.log("SuperAdmin created successfully!");
    } catch (error) {
        console.error(
            "Create admin error:",
            error instanceof Error ? error.message : error
        );

        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

createAdmin();
