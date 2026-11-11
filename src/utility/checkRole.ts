
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/utility/getCurrentUser";

type Role = "User" | "Admin" | "SuperAdmin";

export const checkRole = async (allowedRoles: Role[]) => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json(
            { message: "ابتدا وارد حساب کاربری خود شوید." },
            { status: 401 }
        );
    }

    if (currentUser.status !== "active") {
        return NextResponse.json(
            { message: "حساب کاربری شما مسدود شده است." },
            { status: 403 }
        );
    }

    if (!allowedRoles.includes(currentUser.role as Role)) {
        return NextResponse.json(
            { message: "شما اجازه انجام این عملیات را ندارید." },
            { status: 403 }
        );
    }


    return currentUser;
};
