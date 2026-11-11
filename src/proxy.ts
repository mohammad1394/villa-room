
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/utility/auth";

function redirectToLogin(req: NextRequest) {
    const response = NextResponse.redirect(
        new URL("/login", req.url)
    );

    response.cookies.delete("token");
    response.cookies.delete("refreshToken");

    return response;
}

function serviceUnavailable() {
    return new NextResponse(
        "در حال حاضر امکان بررسی نشست کاربر وجود ندارد. لطفاً دوباره تلاش کنید.",
        { status: 503 }
    );
}

export default async function proxy(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (token && verifyAccessToken(token)) {
        return NextResponse.next();
    }

    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
        return redirectToLogin(req);
    }

    try {
        const refreshResponse = await fetch(
            new URL("/api/auth/refresh", req.url),
            {
                method: "POST",
                headers: {
                    Cookie: `refreshToken=${refreshToken}`,
                },
                cache: "no-store",
            }
        );

        if (refreshResponse.status === 401) {
            return redirectToLogin(req);
        }

        if (!refreshResponse.ok) {
            return serviceUnavailable();
        }

        const cookieHeaders = refreshResponse.headers.getSetCookie();

        const response = NextResponse.next();

        const updatedCookies = new Set<string>();

        for (const cookie of cookieHeaders) {
            const [cookiePair] = cookie.split(";");
            const separatorIndex = cookiePair.indexOf("=");

            if (separatorIndex === -1) continue;

            const name = cookiePair.slice(0, separatorIndex);
            const value = cookiePair.slice(separatorIndex + 1);

            if (name !== "token" && name !== "refreshToken") {
                continue;
            }

            response.cookies.set(name, value, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge:
                    name === "token"
                        ? 15 * 60
                        : 15 * 24 * 60 * 60,
            });

            updatedCookies.add(name);
        }

        if (!updatedCookies.has("token")) {
            return serviceUnavailable();
        }

        return response;
    } catch (error) {
        console.error("Proxy refresh error:", error);
        return serviceUnavailable();
    }
}

export const config = {
    matcher: ["/panel/:path*"],
};
