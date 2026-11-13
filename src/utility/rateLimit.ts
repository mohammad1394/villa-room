import { NextRequest, NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };

const globalWithBuckets = globalThis as typeof globalThis & {
    _rateLimitBuckets?: Map<string, Bucket>;
};

const buckets: Map<string, Bucket> =
    globalWithBuckets._rateLimitBuckets ??
    (globalWithBuckets._rateLimitBuckets = new Map());

const getClientIp = (req: NextRequest) => {
    const forwarded = req.headers.get("x-forwarded-for");

    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    return req.headers.get("x-real-ip") ?? "unknown";
};

type Options = {
    /** name of the endpoint, used in the bucket key */
    key: string;
    /** max requests per window */
    limit: number;
    /** window length in seconds */
    windowSeconds: number;
};

/**
 * Simple fixed-window, in-memory rate limiter keyed by client IP.
 * Returns a 429 response when the limit is exceeded, otherwise null.
 *
 * Note: state lives in the memory of one server instance. On serverless
 * platforms (Vercel) each instance has its own counters, so this is a basic
 * protection only. For strict limits use a shared store (e.g. Upstash Redis).
 */
export const rateLimit = (
    req: NextRequest,
    { key, limit, windowSeconds }: Options
): NextResponse | null => {
    const now = Date.now();
    const bucketKey = `${key}:${getClientIp(req)}`;

    if (buckets.size > 5000) {
        for (const [k, b] of buckets) {
            if (b.resetAt <= now) buckets.delete(k);
        }
    }

    const bucket = buckets.get(bucketKey);

    if (!bucket || bucket.resetAt <= now) {
        buckets.set(bucketKey, {
            count: 1,
            resetAt: now + windowSeconds * 1000,
        });
        return null;
    }

    bucket.count += 1;

    if (bucket.count > limit) {
        const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);

        return NextResponse.json(
            { message: "تعداد درخواست‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید." },
            {
                status: 429,
                headers: { "Retry-After": String(retryAfter) },
            }
        );
    }

    return null;
};
