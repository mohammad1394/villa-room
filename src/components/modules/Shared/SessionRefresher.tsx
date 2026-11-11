
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

let sessionInitialization: Promise<{
    authenticated: boolean;
    refreshed: boolean;
}> | null = null;

function initializeSession() {
    if (!sessionInitialization) {
        sessionInitialization = (async () => {
            try {
                const meResponse = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                if (meResponse.ok) {
                    return {
                        authenticated: true,
                        refreshed: false,
                    };
                }

                if (meResponse.status !== 401) {
                    return {
                        authenticated: false,
                        refreshed: false,
                    };
                }

                const refreshResponse = await fetch(
                    "/api/auth/refresh",
                    {
                        method: "POST",
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                return {
                    authenticated: refreshResponse.ok,
                    refreshed: refreshResponse.ok,
                };
            } catch {
                return {
                    authenticated: false,
                    refreshed: false,
                };
            }
        })().finally(() => {
            sessionInitialization = null;
        });
    }

    return sessionInitialization;
}

export default function SessionRefresher() {
    const router = useRouter();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        let active = true;

        async function startSession() {
            const result = await initializeSession();

            if (!active) return;

            if (result.refreshed) {
                router.refresh();
            }

            if (!result.authenticated) return;

            interval = setInterval(async () => {
                try {
                    const response = await fetch(
                        "/api/auth/refresh",
                        {
                            method: "POST",
                            credentials: "include",
                            cache: "no-store",
                        }
                    );

                    if (response.status === 401) {
                        if (interval) {
                            clearInterval(interval);
                        }

                        router.refresh();
                    }
                } catch (error) {
                    console.error(
                        "Session refresh error:",
                        error
                    );
                }
            }, 10 * 60 * 1000);
        }

        void startSession();

        return () => {
            active = false;

            if (interval) {
                clearInterval(interval);
            }
        };
    }, [router]);

    return null;
}
