
import mongoose from "mongoose";
import connectToDB from "@/config/db";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utility/auth";
import UserModel from "@/models/User";

export async function getCurrentUser() {
    await connectToDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    const tokenPayload = verifyAccessToken(token);

    if (
        !tokenPayload ||
        !mongoose.isValidObjectId(tokenPayload.userId)
    ) {
        return null;
    }

    const user = await UserModel.findOne({
        _id: tokenPayload.userId,
        status: "active",
    })
        .select("-password -refreshToken -__v")
        .lean();

    return user;
}
