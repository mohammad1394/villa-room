
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/utility/getCurrentUser";

type Role = "User" | "Admin" | "SuperAdmin";

type CheckRoleResult =
    | {
    user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
    response: null;
}
    | {
    user: null;
    response: NextResponse;
};

export const checkRole = async (
    allowedRoles: Role[]
): Promise<CheckRoleResult> => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return {
            user: null,
            response: NextResponse.json(
                { message: "ابتدا وارد حساب کاربری خود شوید." },
                { status: 401 }
            ),
        };
    }

    if (currentUser.status !== "active") {
        return {
            user: null,
            response: NextResponse.json(
                { message: "حساب کاربری شما مسدود شده است." },
                { status: 403 }
            ),
        };
    }

    if (!allowedRoles.includes(currentUser.role as Role)) {
        return {
            user: null,
            response: NextResponse.json(
                { message: "شما اجازه انجام این عملیات را ندارید." },
                { status: 403 }
            ),
        };
    }

    return {
        user: currentUser,
        response: null,
    };
};
