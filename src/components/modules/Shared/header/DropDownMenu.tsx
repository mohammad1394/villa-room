import React from 'react';
import {Heart, LayoutDashboard, LogOut, ReceiptText, Train} from "lucide-react";
import {useRouter} from "next/navigation";

type User = {
    _id: string;
    fullName: string;
};

interface NavbarActionsProps {
    user: User | null;
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void;
}

function DropDownMenu({isOpen, setIsOpen ,  user}: NavbarActionsProps) {
    const router = useRouter();
    const handleNavigate = (path: string) => {

        setIsOpen(!isOpen);
        router.push(path)
    }
    return (
        <div
            className={`
               absolute right-0 top-[calc(100%+8px)] z-50
               w-[200px] overflow-hidden rounded-xl
               border border-gray-100 bg-white text-gray-700 shadow-xl
               transform transition-all duration-200 ease-out
                ${
                isOpen
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible -translate-y-2 scale-95 opacity-0"
            }
            `}
        >
            <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-[12px] text-gray-400">خوش آمدید</p>
                <p className="truncate text-[13px] font-medium text-gray-800">
                    {user?.fullName || "کاربر"}

                </p>
            </div>
            <button
                onClick={() => handleNavigate("/panel")}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-right text-[13px] transition-colors hover:bg-gray-50"
            >
                <LayoutDashboard size={18} className="text-gray-400"/>
                پنل کاربری
            </button>
            <button
                onClick={() => handleNavigate("/panel/my-booking")}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-right text-[13px] transition-colors hover:bg-gray-50"
            >
                <Train size={18} className="text-gray-400"/>
                رزرو من
            </button>
            <button
                onClick={() => handleNavigate("/panel/my-payment")}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-right text-[13px] transition-colors hover:bg-gray-50"
            >
                <ReceiptText size={18} className="text-gray-400"/>
                تراکنش های من
            </button>
            <button
                onClick={() => handleNavigate("/panel/wishlist")}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-right text-[13px] transition-colors hover:bg-gray-50"
            >
                <Heart size={18} className="text-gray-400"/>
                مورد علاقه
            </button>
            <button
                onClick={() => handleNavigate("/userPanel")}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-right text-[13px] transition-colors hover:bg-gray-50"
            >
                <LogOut size={18} className="text-gray-400"/>
                خروج
            </button>
        </div>
    );
}

export default DropDownMenu;