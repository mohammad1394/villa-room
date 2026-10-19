import { LucideIcon } from "lucide-react";
import {
    CalendarDays,
    Home,
    UserRound,
    WalletCards,
} from "lucide-react";

export type StatItem= {
    title: string;
    value: string;
    unit: string;
    percent: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    line: string;
};



export default function StatCard({icon , title , iconBg , value , unit , iconColor ,line , percent ,badgeBg } : StatItem ) {
    const Icon = icon;

    return (
        <div
            className="flex min-h-[170px] flex-col justify-between rounded-[12px] border border-[#e8edf2] bg-white p-5"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[14px] text-[#26364c]">
                        {title}
                    </p>

                    <p className="mt-3 text-[22px] font-bold text-[#17243a]">
                        {value}
                    </p>

                    <p className="mt-2 text-[12px] text-[#718096]">
                        {unit}
                    </p>
                </div>

                <div
                    className={`
                        flex
                        h-[54px]
                        w-[54px]
                        items-center
                        justify-center
                        rounded-[15px]
                        ${iconBg}
                    `}
                >
                    <Icon
                        size={26}
                        className={iconColor}
                    />
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span
                        className={`
                            rounded-full
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            ${badgeBg}
                            ${iconColor}
                        `}
                    >
                        {percent}
                    </span>

                    <span className="text-[10px] text-[#9aa4b2]">
                        نسبت به ماه قبل
                    </span>
                </div>

                <svg
                    viewBox="0 0 125 40"
                    className={`h-[35px] w-[100px] ${iconColor}`}
                >
                    <path
                        d={line}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>
            </div>
        </div>
    );
}