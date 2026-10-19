"use client";

import React from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Area,
    AreaChart,
} from "recharts";

const data = [
    { name: "فروردین", revenue: 250 },
    { name: "اردیبهشت", revenue: 400 },
    { name: "خرداد", revenue: 600 },
    { name: "تیر", revenue: 800 },
    { name: "مرداد", revenue: 500 },
    { name: "شهریور", revenue: 650 },
    { name: "مهر", revenue: 700 },
];

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const item = payload[0];

    return (
        <div
            dir="rtl"
            className="
                rounded-[8px]
                border
                border-[#e2e8f0]
                bg-white
                px-3
                py-2
                shadow-[0_4px_15px_rgba(0,0,0,0.08)]
            "
        >
            <p className="mb-1 text-[13px] font-medium text-[#334155]">
                {item.payload.name}
            </p>

            <p className="text-[13px] font-bold text-[#1e293b]">
                {item.value.toLocaleString("fa-IR")}M تومان
            </p>
        </div>
    );
}

export default function RevenueChart() {
    return (
        <div
            dir="rtl"
            className="
                w-full
                rounded-[12px]
                border
                border-[#edf0f5]
                bg-white
                p-5
            "
        >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <button
                    type="button"
                    className="
                        flex
                        h-[36px]
                        min-w-[96px]
                        items-center
                        justify-between
                        gap-3
                        rounded-[8px]
                        border
                        border-[#e2e8f0]
                        bg-white
                        px-3
                        text-[13px]
                        font-medium
                        text-[#334155]
                    "
                >
                    <span>ماهانه</span>

                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[#334155]"
                    >
                        <path
                            d="M6 9L12 15L18 9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            {/* Chart */}
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="revenueGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#5B7FF1"
                                    stopOpacity={0.18}
                                />

                                <stop
                                    offset="100%"
                                    stopColor="#5B7FF1"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        {/* Grid */}
                        <CartesianGrid
                            vertical={false}
                            stroke="#edf0f5"
                            strokeDasharray="0"
                        />

                        {/* X Axis */}
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#94a3b8",
                                fontSize: 12,
                            }}
                            tickMargin={14}
                        />

                        {/* Y Axis */}
                        <YAxis
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 1000]}
                            ticks={[0, 200, 400, 600, 800, 1000]}
                            tickFormatter={(value) =>
                                value === 0
                                    ? "۰"
                                    : `${value.toLocaleString("fa-IR")}M`
                            }
                            tick={{
                                fill: "#94a3b8",
                                fontSize: 11,
                            }}
                            width={48}
                        />

                        {/* Tooltip */}
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                                stroke: "#cbd5e1",
                                strokeDasharray: "4 4",
                            }}
                        />

                        {/* Area */}
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="none"
                            fill="url(#revenueGradient)"
                        />

                        {/* Line */}
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#5B7FF1"
                            strokeWidth={2}
                            dot={{
                                r: 4,
                                fill: "#5B7FF1",
                                stroke: "#ffffff",
                                strokeWidth: 2,
                            }}
                            activeDot={{
                                r: 5,
                                fill: "#5B7FF1",
                                stroke: "#ffffff",
                                strokeWidth: 2,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}