
import { hash, compare } from "bcryptjs";
import { createHash } from "crypto";
import { sign, verify } from "jsonwebtoken";

type TokenPayload = {
    userId: string;
};

export const hashPassword = async (password: string) => {
    return await hash(password, 12);
};

export const verifyPassword = async (
    password: string,
    hashedPassword: string
) => {
    return await compare(password, hashedPassword);
};

export const generateAccessToken = (data: TokenPayload) => {
    const secret = process.env.ACCESSSTOKENSECRETKEY;

    if (!secret) {
        throw new Error("ACCESSSTOKENSECRETKEY is not defined");
    }

    return sign(data, secret, {
        expiresIn: "15m",
    });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        const secret = process.env.ACCESSSTOKENSECRETKEY;

        if (!secret) {
            throw new Error("ACCESSSTOKENSECRETKEY is not defined");
        }

        const payload = verify(token, secret);

        if (
            typeof payload === "string" ||
            typeof payload.userId !== "string"
        ) {
            return null;
        }

        return {
            userId: payload.userId,
        };
    } catch {
        return null;
    }
};

export const generateRefreshToken = (data: TokenPayload) => {
    const secret = process.env.REFRESHTOKENSECRETKEY;

    if (!secret) {
        throw new Error("REFRESHTOKENSECRETKEY is not defined");
    }

    return sign(data, secret, {
        expiresIn: "15d",
    });
};

export const validateEmail = (email: string) => {
    const pattern =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return pattern.test(email);
};

export const validatePhone = (phone: string) => {
    const pattern =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    return pattern.test(phone);
};

export const validatePassword = (password: string) => {
    const pattern =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

    return pattern.test(password);
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
    try {
        const secret = process.env.REFRESHTOKENSECRETKEY;

        if (!secret) {
            throw new Error("REFRESHTOKENSECRETKEY is not defined");
        }

        const payload = verify(token, secret);

        if (
            typeof payload === "string" ||
            typeof payload.userId !== "string"
        ) {
            return null;
        }

        return {
            userId: payload.userId,
        };
    } catch {
        return null;
    }
};

/**
 * Refresh tokens are stored in the database only as a SHA-256 hash,
 * so a leaked database cannot be used to hijack sessions.
 */
export const hashToken = (token: string) =>
    createHash("sha256").update(token).digest("hex");

let dummyPasswordHash: Promise<string> | null = null;

// a real bcrypt hash (created once, lazily) used to keep login timing equal
// for unknown emails, so response time does not reveal whether an account exists
export const getDummyPasswordHash = () => {
    dummyPasswordHash ??= hash("dummy-password-for-timing", 12);
    return dummyPasswordHash;
};
