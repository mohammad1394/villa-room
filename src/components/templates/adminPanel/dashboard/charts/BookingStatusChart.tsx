"use client";

import React from "react";
import { Cell, Pie, PieChart } from "recharts";

const data = [
    {
        name: "تکمیل شده",
        value: 148,
        color: "#3CB371",
    },
    {
        name: "تایید شده",
        value: 46,
        color: "#3FA9F5",
    },
    {
        name: "در انتظار پرداخت",
        value: 31,
        color: "#F5AA3C",
    },
    {
        name: "لغو شده",
        value: 22,
        color: "#EF4B3A",
    },
];

export default function BookingStatusChart() {

    const total = data.reduce((sum, item) => sum + item.value, 0);

    const toPersianNumber = (number: number) => {
        return new Intl.NumberFormat("fa-IR").format(number);
    };

    return (
        <div
            className="
                flex
                w-full
                min-h-[360px]
                items-center
                justify-between
                rounded-[14px]
                border
                border-[#E9EDF2]
                bg-white
                px-8
                py-6
            "
            dir="rtl"
        >
            {/* عنوان و Legend */}
            <div className="flex flex-1 flex-col">

                {/* Title */}
                <h2 className="mb-8 text-[16px] font-bold text-[#172B4D]">
                    وضعیت رزروها
                </h2>

                {/* Legend */}
                <div className="flex flex-col gap-5">
                    {data.map((entry) => {
                        const percentage = (entry.value / total) * 100;

                        return (
                            <div
                                key={entry.name}
                                className="flex items-start justify-between"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Color Dot */}
                                    <span
                                        className="mt-[5px] h-[9px] w-[9px] shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: entry.color,
                                        }}
                                    />

                                    {/* Text */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[13px] font-medium text-[#344563]">
                                            {entry.name}
                                        </span>

                                        <span className="text-[12px] text-[#8993A4]">
                                            {toPersianNumber(entry.value)}{" "}
                                            (
                                            {toPersianNumber(
                                                Number(percentage.toFixed(1))
                                            )}
                                            ٪)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Donut Chart */}
            <div className="relative h-[280px] w-[280px] shrink-0">
                <PieChart
                    width={280}
                    height={280}
                >
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={78}
                        outerRadius={108}
                        paddingAngle={1}
                        startAngle={90}
                        endAngle={-270}
                        stroke="#ffffff"
                        strokeWidth={2}
                        isAnimationActive
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                            />
                        ))}
                    </Pie>
                </PieChart>

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        flex
                        flex-col
                        items-center
                        justify-center
                    "
                >
                    <span className="text-[20px] font-bold text-[#172B4D]">
                        {toPersianNumber(total)}
                    </span>

                    <span className="mt-1 text-[12px] font-medium text-[#344563]">
                        رزرو
                    </span>
                </div>
            </div>
        </div>
    );
}