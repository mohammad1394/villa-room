
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

declare module "axios" {
    interface InternalAxiosRequestConfig {
        _retry?: boolean;
    }
}

const api = axios.create({
    withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest: InternalAxiosRequestConfig | undefined =
            error.config;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/api/auth/refresh") ||
            originalRequest.url?.includes("/api/auth/login")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = axios
                    .post(
                        "/api/auth/refresh",
                        {},
                        {
                            withCredentials: true,
                        }
                    )
                    .then(() => undefined)
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            await refreshPromise;

            return api(originalRequest);
        } catch (refreshError) {
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }

            return Promise.reject(refreshError);
        }
    }
);

export default api;
