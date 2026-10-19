import toast from "react-hot-toast";
import {
    Check,
    CircleAlert,
    LucideIcon,
    X
} from "lucide-react";

type ToastType = "success" | "error";
type ToastIcon = "check" | "alert" | "x";

export const showCustomToast = (
    title: string,
    description: string,
    icon: ToastIcon,
    type: ToastType
) => {

    const icons: Record<ToastIcon, LucideIcon> = {
        check: Check,
        alert: CircleAlert,
        x: X
    };

    const Icon = icons[icon];

    const isSuccess = type === "success";

    toast.custom(
        () => (
            <div
                className="w-[450px] rounded-xl bg-white p-5 shadow-lg"
                dir="rtl"
            >
                <div className="flex items-center gap-5">

                    <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${
                            isSuccess
                                ? "bg-green-50"
                                : "bg-red-50"
                        }`}
                    >
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                isSuccess
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }`}
                        >
                            <Icon className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-2 text-lg font-bold text-gray-900">
                            {title}
                        </h3>

                        <p className="text-sm leading-7 text-gray-700">
                            {description}
                        </p>
                    </div>



                </div>
            </div>
        ),
        {
            duration: 2000,
            position: "top-right",
        }
    );
};