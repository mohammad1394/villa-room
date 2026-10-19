"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { showCustomToast } from "@/components/modules/layout/toast/toast";

interface AddToWishListProps {
    villaId: string;
}

interface User {
    _id: string;
}

function AddToWishList({ villaId }: AddToWishListProps) {
    const [isExist, setIsExist] = useState(false);
    const [user, setUser] = useState<User | null>(null);



    const toggleFavorite = async () => {
        if (!user?._id) {
            showCustomToast(
                "خطا",
                "برای اضافه کردن به علاقه‌مندی‌ها ابتدا وارد سایت شوید",
                "x",
                "error"
            );

            return;
        }

        try {
            const res = await fetch("/api/favorite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    villaId,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsExist(data.isFavorite);

                showCustomToast(
                    data.isFavorite ? "موفق" : "موفق",
                    data.message,
                    data.isFavorite ? "check" : "x",
                    "success"
                );

                return;
            }

            showCustomToast(
                "خطا",
                data.message || "خطایی رخ داده است",
                "x",
                "error"
            );

        } catch (error) {
            console.error(error);

            showCustomToast(
                "خطا",
                "ارتباط با سرور برقرار نشد",
                "x",
                "error"
            );
        }
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                const authRes = await fetch("/api/auth/me");

                if (!authRes.ok) {
                    return;
                }

                const userData = await authRes.json();
                setUser(userData);

                const favoriteRes = await fetch("/api/favorite");

                if (!favoriteRes.ok) {
                    return;
                }

                const favorites = await favoriteRes.json();

                const wishItem = favorites.find(
                    (favorite: any) =>
                        favorite.villaId?._id?.toString() === villaId
                );

                setIsExist(!!wishItem);

            } catch (error) {
                console.error("Wishlist initialization error:", error);
            }
        };

        initialize();
    }, [villaId]);
    return (
        <button
            type="button"
            onClick={toggleFavorite}
            className="
                absolute
                left-[15px]
                top-[10px]
                z-10
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-white/90
                transition
                hover:scale-105
            "
        >
            <Heart
                size={20}
                fill={isExist ? "red" : "none"}
                className={isExist ? "text-red-500" : "text-gray-600"}
            />
        </button>
    );
}

export default AddToWishList;