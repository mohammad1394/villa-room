import Booking from "@/models/Booking";
import {ChevronDown} from "lucide-react";

export function FilterBookings({
                          label,
                          value,
                      }: {
    label: string;
    value: string;
}) {
    return (
        <button
            type="button"
            className="flex h-11 min-w-[145px] items-center justify-between gap-4 rounded-lg border border-[#E1E8EE] bg-white px-4 text-[12px] text-[#53697A] transition hover:border-[#B9C9D6]"
        >
            <span>
                {label}:{" "}
                <span className="font-medium text-[#263D4F]">
                    {value}
                </span>
            </span>

            <ChevronDown size={14} />
        </button>
    );
}