"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    ChevronDown,
    MapPin,
    Home,
    Users,
    WalletCards,
    SlidersHorizontal,
    Grid2X2,
    List,
    Check,
} from "lucide-react";

type ViewMode = "grid" | "list";

type FilterType =
    | "location"
    | "villaType"
    | "guests"
    | "price"
    | "sort"
    | null;

type FilterButtonProps = {
    title: string;
    icon: React.ReactNode;
    value?: string;
    isOpen: boolean;
    onClick: () => void;
};

type FavoriteFilterProps = {
    villasCount: number;
    viewMode: ViewMode;
    setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
};

const locations = [
    "همه موقعیت‌ها",
    "مازندران",
    "گیلان",
    "ساری",
    "سوادکوه",
    "زیارم",
];

const villaTypes = [
    "همه نوع ویلا",
    "جنگلی",
    "ساحلی",
    "استخردار",
    "کوهستانی",
];

const guestOptions = [
    "همه",
    "۱ تا ۲ نفر",
    "۳ تا ۴ نفر",
    "۵ تا ۸ نفر",
    "بیشتر از ۸ نفر",
];

const priceOptions = [
    "همه قیمت‌ها",
    "زیر ۲ میلیون",
    "۲ تا ۵ میلیون",
    "۵ تا ۱۰ میلیون",
    "بیشتر از ۱۰ میلیون",
];

const sortOptions = [
    "جدیدترین",
    "ارزان‌ترین",
    "گران‌ترین",
    "بیشترین امتیاز",
];

function FilterButton({
                          title,
                          icon,
                          value,
                          isOpen,
                          onClick,
                      }: FilterButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex
                h-[42px]
                w-full
                min-w-[120px]
                items-center
                justify-between
                gap-2
                rounded-[8px]
                border
                bg-white
                px-3
                transition-all

                ${
                isOpen
                    ? "border-[#203140] shadow-sm"
                    : "border-[#D9E0E5] hover:border-[#BFC8CF]"
            }
            `}
        >
            <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-[#203140]">
                    {icon}
                </span>

                <div className="flex min-w-0 flex-col items-start">
                    <span className="text-[8px] leading-none text-[#8A949C]">
                        {title}
                    </span>

                    <span className="mt-1 max-w-[85px] truncate text-[10px] font-semibold leading-none text-[#172B3A]">
                        {value || title}
                    </span>
                </div>
            </div>

            <ChevronDown
                size={14}
                strokeWidth={1.8}
                className={`
                    shrink-0
                    text-[#172B3A]
                    transition-transform
                    ${isOpen ? "rotate-180" : ""}
                `}
            />
        </button>
    );
}

function Dropdown({
                      options,
                      value,
                      onChange,
                  }: {
    options: string[];
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div
            className="
                absolute
                right-0
                top-[calc(100%+6px)]
                z-50
                w-[190px]
                overflow-hidden
                rounded-[10px]
                border
                border-[#D9E0E5]
                bg-white
                p-1.5
                shadow-[0_8px_30px_rgba(23,43,58,0.12)]
            "
        >
            {options.map((option) => {
                const selected = option === value;

                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-[7px]
                            px-3
                            py-2.5
                            text-right
                            text-[11px]
                            transition

                            ${
                            selected
                                ? "bg-[#F5F7F8] font-semibold text-[#203140]"
                                : "text-[#66727D] hover:bg-[#F5F7F8]"
                        }
                        `}
                    >
                        <span>{option}</span>

                        {selected && (
                            <Check
                                size={14}
                                className="text-[#203140]"
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

function VillaFilter({
                            villasCount,
                            viewMode,
                            setViewMode,
                        }: FavoriteFilterProps) {
    const [openFilter, setOpenFilter] =
        useState<FilterType>(null);

    const [location, setLocation] =
        useState("همه موقعیت‌ها");

    const [villaType, setVillaType] =
        useState("همه نوع ویلا");

    const [guests, setGuests] =
        useState("همه");

    const [price, setPrice] =
        useState("همه قیمت‌ها");

    const [sort, setSort] =
        useState("جدیدترین");

    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                filterRef.current &&
                !filterRef.current.contains(
                    event.target as Node
                )
            ) {
                setOpenFilter(null);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const toggleFilter = (filter: FilterType) => {
        setOpenFilter((current) =>
            current === filter ? null : filter
        );
    };

    const handleFilterChange = (
        filter: FilterType,
        value: string
    ) => {
        if (filter === "location") {
            setLocation(value);
        }

        if (filter === "villaType") {
            setVillaType(value);
        }

        if (filter === "guests") {
            setGuests(value);
        }

        if (filter === "price") {
            setPrice(value);
        }

        if (filter === "sort") {
            setSort(value);
        }

        setOpenFilter(null);
    };

    return (
        <section
            ref={filterRef}
            dir="rtl"
            className="w-full py-5"
        >
            <div
                className="
                    flex
                    w-full
                    flex-wrap
                    items-center
                    gap-3
                "
            >
                {/* تعداد ویلا + Grid/List */}

                <div
                    className="
                        flex
                        h-[42px]
                        shrink-0
                        items-center
                        gap-2
                    "
                >
                    <span
                        className="
                            whitespace-nowrap
                            text-[12px]
                            font-semibold
                            text-[#172B3A]
                        "
                    >
                        {villasCount} ویلا
                    </span>

                    <div
                        className="
                            flex
                            h-[34px]
                            overflow-hidden
                            rounded-[8px]
                            border
                            border-[#D9E0E5]
                            bg-white
                        "
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setViewMode("grid")
                            }
                            aria-label="نمایش شبکه‌ای"
                            className={`
                                flex
                                w-[34px]
                                items-center
                                justify-center
                                transition

                                ${
                                viewMode === "grid"
                                    ? "bg-[#172B3A] text-white"
                                    : "text-[#66727D] hover:bg-[#F5F7F8]"
                            }
                            `}
                        >
                            <Grid2X2 size={15} />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setViewMode("list")
                            }
                            aria-label="نمایش لیستی"
                            className={`
                                flex
                                w-[34px]
                                items-center
                                justify-center
                                transition

                                ${
                                viewMode === "list"
                                    ? "bg-[#172B3A] text-white"
                                    : "text-[#66727D] hover:bg-[#F5F7F8]"
                            }
                            `}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* موقعیت */}

                <div className="relative w-[135px] shrink-0">
                    <FilterButton
                        title="موقعیت"
                        value={location}
                        icon={<MapPin size={16} />}
                        isOpen={
                            openFilter === "location"
                        }
                        onClick={() =>
                            toggleFilter("location")
                        }
                    />

                    {openFilter === "location" && (
                        <Dropdown
                            options={locations}
                            value={location}
                            onChange={(value) =>
                                handleFilterChange(
                                    "location",
                                    value
                                )
                            }
                        />
                    )}
                </div>

                {/* نوع ویلا */}

                <div className="relative w-[135px] shrink-0">
                    <FilterButton
                        title="نوع ویلا"
                        value={villaType}
                        icon={<Home size={16} />}
                        isOpen={
                            openFilter === "villaType"
                        }
                        onClick={() =>
                            toggleFilter("villaType")
                        }
                    />

                    {openFilter === "villaType" && (
                        <Dropdown
                            options={villaTypes}
                            value={villaType}
                            onChange={(value) =>
                                handleFilterChange(
                                    "villaType",
                                    value
                                )
                            }
                        />
                    )}
                </div>

                {/* تعداد نفرات */}

                <div className="relative w-[135px] shrink-0">
                    <FilterButton
                        title="تعداد نفرات"
                        value={guests}
                        icon={<Users size={16} />}
                        isOpen={
                            openFilter === "guests"
                        }
                        onClick={() =>
                            toggleFilter("guests")
                        }
                    />

                    {openFilter === "guests" && (
                        <Dropdown
                            options={guestOptions}
                            value={guests}
                            onChange={(value) =>
                                handleFilterChange(
                                    "guests",
                                    value
                                )
                            }
                        />
                    )}
                </div>

                {/* قیمت */}

                <div className="relative w-[135px] shrink-0">
                    <FilterButton
                        title="قیمت"
                        value={price}
                        icon={
                            <WalletCards size={16} />
                        }
                        isOpen={
                            openFilter === "price"
                        }
                        onClick={() =>
                            toggleFilter("price")
                        }
                    />

                    {openFilter === "price" && (
                        <Dropdown
                            options={priceOptions}
                            value={price}
                            onChange={(value) =>
                                handleFilterChange(
                                    "price",
                                    value
                                )
                            }
                        />
                    )}
                </div>

                {/* مرتب سازی */}

                <div
                    className="
                        relative
                        mr-auto
                        w-[150px]
                        shrink-0
                    "
                >
                    <FilterButton
                        title="مرتب‌سازی"
                        value={sort}
                        icon={
                            <SlidersHorizontal
                                size={16}
                            />
                        }
                        isOpen={
                            openFilter === "sort"
                        }
                        onClick={() =>
                            toggleFilter("sort")
                        }
                    />

                    {openFilter === "sort" && (
                        <Dropdown
                            options={sortOptions}
                            value={sort}
                            onChange={(value) =>
                                handleFilterChange(
                                    "sort",
                                    value
                                )
                            }
                        />
                    )}
                </div>
            </div>
        </section>
    );
}

export default VillaFilter;