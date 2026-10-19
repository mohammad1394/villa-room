"use client";

type BookingFilterProps = {
    activeFilter: string;
    onChange: (value: string) => void;
};

const filters = [
    { label: "همه رزروها", value: "all" },
    { label: "رزروهای فعال", value: "booked" },
    { label: "پایان یافته", value: "free" },
];

export default function BookingFilter({
                                          activeFilter,
                                          onChange,
                                      }: BookingFilterProps) {
    return (
        <div className="mb-6 flex w-full gap-2 overflow-x-auto border-b border-gray-200">
            {filters.map((filter) => {
                const active = activeFilter === filter.value;

                return (
                    <button
                        key={filter.value}
                        onClick={() => onChange(filter.value)}
                        className={`
                            relative
                            shrink-0
                            px-4
                            pb-3
                            text-sm
                            transition
                            ${
                            active
                                ? "font-bold text-[var(--primary)]"
                                : "text-gray-500 hover:text-gray-800"
                        }
                        `}
                    >
                        {filter.label}

                        {active && (
                            <span className="absolute bottom-[-1px] right-0 h-[2px] w-full rounded-full bg-[var(--primary)]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}