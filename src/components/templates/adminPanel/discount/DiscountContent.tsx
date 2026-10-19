"use client";

import {useMemo, useState} from "react";
import {
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit3,
    MoreHorizontal,
    Percent,
    Plus,
    Search,
    Tag,
    Trash2,
    XCircle,
} from "lucide-react";
import {DiscountStatus, DiscountType} from "@/types/Discount";
import {formatDate, formatNumber} from "@/utility/helper";

import CreateDiscountModal from "@/components/templates/adminPanel/discount/CreateDiscountModal";
import {VillaType} from "@/types/Villa";
import {showCustomToast} from "@/components/modules/layout/toast/toast";
import {useRouter} from "next/navigation";
import {StateCard} from "@/components/modules/adminPanel/StateCard/StateCard";

interface DiscountsPageProps {
    discounts: DiscountType[];
    villas: VillaType[]
}

const statusConfig: Record<DiscountStatus, { label: string; wrapper: string; dot: string; }> = {
    active: {
        label: "فعال",
        wrapper: "bg-[#E9F8F2] text-[#159574]",
        dot: "bg-[#18B488]",
    },
    expired: {
        label: "منقضی شده",
        wrapper: "bg-[#FFF0F0] text-[#EF5350]",
        dot: "bg-[#EF5350]",
    },
    finished: {
        label: "تمام شده",
        wrapper: "bg-[#FFF5E5] text-[#D99A24]",
        dot: "bg-[#E7A62D]",
    },
    inactive: {
        label: "غیرفعال",
        wrapper: "bg-[#F0F3F5] text-[#657A8B]",
        dot: "bg-[#8EA0AF]",
    },
};


export default function DiscountsPage({discounts, villas}: DiscountsPageProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"همه" | DiscountStatus>("همه");

    const [currentPage, setCurrentPage] = useState(1);
    const [openMenu, setOpenMenu] = useState<string | null>(
        null
    );

    const [openCreateDiscount, setOpenCreateDiscount] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();


    const itemsPerPage = 10;

    const filteredDiscounts = useMemo(() => {
        const value = search.toLowerCase().trim();

        return discounts.filter((discount) => {
            const status = discount.status

            const matchesSearch =
                discount.code
                    .toLowerCase()
                    .includes(value) ||
                discount.villaId?.title
                    ?.toLowerCase()
                    .includes(value);

            const matchesStatus =
                statusFilter === "همه" ||
                status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [discounts, search, statusFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredDiscounts.length / itemsPerPage
        )
    );

    const paginatedDiscounts = filteredDiscounts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const stats = useMemo(() => {
        let active = 0;
        let expired = 0;
        let finished = 0;

        discounts.forEach((discount) => {
            const status = discount.status;

            if (status === "active") {
                active++;
            }

            if (status === "expired") {
                expired++;
            }

            if (status === "finished") {
                finished++;
            }
        });

        return {
            total: discounts.length,
            active,
            expired,
            finished,
        };
    }, [discounts]);

    const handleCreateDiscount = async (onSubmit: {
        code: string;
        villaId: string;
        maxUse: number;
        expire: string;
        percent: number;
    }) => {
        if (isLoading) {
            showCustomToast(
                "خطا",
                "درخواست شما در حال پردازش است",
                "x",
                "error"
            );
            return;
        }

        if (!onSubmit.code || !onSubmit.code.trim()) {
            showCustomToast(
                "خطا",
                "کد تخفیف وارد نشده است!",
                "x",
                "error"
            );
            return;
        }

        if (!onSubmit.villaId) {
            showCustomToast(
                "خطا",
                "ویلایی انتخاب نشده است!",
                "x",
                "error"
            );
            return;
        }

        if (!onSubmit.maxUse || onSubmit.maxUse <= 0) {
            showCustomToast(
                "خطا",
                "تعداد استفاده‌های این کد تخفیف وارد نشده است!",
                "x",
                "error"
            );
            return;
        }

        const expireTime = new Date(onSubmit.expire).getTime();

        if (
            !onSubmit.expire ||
            Number.isNaN(expireTime) ||
            expireTime <= Date.now()
        ) {
            showCustomToast(
                "خطا",
                "زمان انقضای کد وارد شده صحیح نمی‌باشد!",
                "x",
                "error"
            );
            return;
        }

        if (
            !onSubmit.percent ||
            onSubmit.percent < 1 ||
            onSubmit.percent > 100
        ) {
            showCustomToast(
                "خطا",
                "درصد وارد شده برای کد تخفیف معتبر نمی‌باشد!",
                "x",
                "error"
            );
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/admin/discount", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(onSubmit),
            });

            const data = await res.json();

            if (!res.ok) {
                showCustomToast(
                    "خطا",
                    data.message || "ایجاد کد تخفیف با خطا مواجه شد.",
                    "x",
                    "error"
                );
                return;
            }

            showCustomToast(
                "موفق",
                data.message || "کد تخفیف با موفقیت ایجاد شد.",
                "check",
                "success"
            );

            setOpenCreateDiscount(false);

            router.refresh();
        } catch (error) {
            console.error("CREATE DISCOUNT ERROR:", error);

            showCustomToast(
                "خطا",
                "خطایی در ارتباط با سرور رخ داد.",
                "x",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };


    const handleEditDiscount = (
        discount: DiscountType
    ) => {
        console.log("Edit Discount:", discount);
    };

    const handleDeleteDiscount = (
        discount: DiscountType
    ) => {
        console.log("Delete Discount:", discount);
    };


    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#F8FAFC] p-4 font-[Vazirmatn] sm:p-5 lg:p-7"
        >
            <div className="mx-auto max-w-[1450px]">

                {/* Header */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-[22px] font-extrabold text-[#172B3A]">
                            مدیریت کدهای تخفیف
                        </h1>

                        <p className="mt-1 text-[12px] text-[#8B9AAA]">
                            مدیریت، ایجاد و کنترل کدهای تخفیف ویلاها
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setOpenCreateDiscount(true);
                        }}
                        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#173B50] px-5 text-[13px] font-semibold text-white transition hover:bg-[#102F42]"
                    >
                        <Plus size={17}/>

                        ایجاد کد تخفیف
                    </button>

                </div>


                {/* Stats */}

                <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

                    <StateCard
                        title="کل کدهای تخفیف"
                        value={stats.total}
                        description="تمام کدهای ثبت شده"
                        icon={Tag}
                        iconClass="bg-[#EAF3FF] text-[#2474E8]"
                    />

                    <StateCard
                        title="کدهای فعال"
                        value={stats.active}
                        description="کدهای قابل استفاده"
                        icon={CheckCircle2}
                        iconClass="bg-[#E9F8F3] text-[#139C78]"
                    />

                    <StateCard
                        title="منقضی شده"
                        value={stats.expired}
                        description="کدهای تاریخ گذشته"
                        icon={CalendarDays}
                        iconClass="bg-[#FFF0F0] text-[#EF5350]"
                    />

                    <StateCard
                        title="تمام شده"
                        value={stats.finished}
                        description="تکمیل ظرفیت استفاده"
                        icon={Percent}
                        iconClass="bg-[#FFF5E5] text-[#E7A62D]"
                    />

                </section>


                {/* Filters */}

                <section
                    className="mb-4 rounded-xl border border-[#E8EEF3] bg-white p-3 shadow-[0_2px_12px_rgba(23,43,58,0.03)]">

                    <div className="flex flex-col gap-3 xl:flex-row">

                        {/* Search */}

                        <div className="relative flex-1">

                            <Search
                                size={16}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8EA0AF]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="جستجو بر اساس کد تخفیف یا نام ویلا..."
                                className="h-11 w-full rounded-lg border border-[#E1E8EE] bg-white pr-10 pl-4 text-[12px] text-[#263D4F] outline-none placeholder:text-[#A7B3BE] focus:border-[#6F95AD]"
                            />

                        </div>


                        {/* Status */}

                        <div className="relative">

                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(
                                        e.target.value as
                                            | "همه"
                                            | DiscountStatus
                                    );

                                    setCurrentPage(1);
                                }}
                                className="h-11 min-w-[170px] appearance-none rounded-lg border border-[#E1E8EE] bg-white px-4 pl-10 text-[11px] text-[#53697A] outline-none focus:border-[#6F95AD]"
                            >
                                <option value="همه">
                                    همه وضعیت‌ها
                                </option>

                                <option value="active">
                                    فعال
                                </option>

                                <option value="expired">
                                    منقضی شده
                                </option>

                                <option value="finished">
                                    تمام شده
                                </option>

                                <option value="inactive">
                                    غیرفعال
                                </option>
                            </select>

                            <ChevronDown
                                size={13}
                                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#8EA0AF]"
                            />

                        </div>

                    </div>

                </section>


                {/* Table */}

                <section
                    className="overflow-hidden rounded-xl border border-[#E5EBF0] bg-white shadow-[0_2px_12px_rgba(23,43,58,0.03)]">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px] border-collapse">

                            <thead>

                            <tr className="border-b border-[#EDF1F4] bg-[#FCFDFE] text-right">

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    کد تخفیف
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    ویلا
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    درصد تخفیف
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    میزان استفاده
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    تاریخ انقضا
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    وضعیت
                                </th>

                                <th className="px-4 py-4 text-center text-[11px] font-semibold text-[#657A8B]">
                                    عملیات
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {paginatedDiscounts.map(
                                (discount) => {
                                    const status = discount.status;

                                    const config =
                                        statusConfig[status];

                                    const usagePercent =
                                        discount.maxUse > 0
                                            ? Math.min(
                                                (discount.uses /
                                                    discount.maxUse) *
                                                100,
                                                100
                                            )
                                            : 0;

                                    return (
                                        <tr
                                            key={discount._id}
                                            className="border-b border-[#F0F3F6] transition hover:bg-[#FBFCFD]"
                                        >

                                            {/* Code */}

                                            <td className="px-4 py-4">

                                                <div className="flex items-center gap-2">

                                                    <span
                                                        className="rounded-lg bg-[#F0F4F7] px-3 py-1.5 font-mono text-[11px] font-bold text-[#263D4F]">
                                                        {
                                                            discount.code
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* Villa */}

                                            <td className="px-4 py-4">

                                                <p className="max-w-[220px] truncate text-[11px] font-medium text-[#53697A]">
                                                    {discount
                                                            .villaId
                                                            ?.title ||
                                                        "همه ویلاها"}
                                                </p>

                                            </td>


                                            {/* Percent */}

                                            <td className="px-4 py-4">

                                                <span className="text-[12px] font-bold text-[#173B50]">
                                                    {
                                                        discount.percent
                                                    }
                                                    ٪
                                                </span>

                                            </td>


                                            {/* Usage */}

                                            <td className="px-4 py-4">

                                                <div className="w-[150px]">

                                                    <div className="mb-1.5 flex items-center justify-between">

                                                        <span className="text-[9px] text-[#8A9AA8]">
                                                            {formatNumber(
                                                                discount.uses
                                                            )}
                                                        </span>

                                                        <span className="text-[9px] text-[#A3AFB9]">
                                                            {formatNumber(
                                                                discount.maxUse
                                                            )}
                                                        </span>

                                                    </div>

                                                    <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF2F5]">

                                                        <div
                                                            className="h-full rounded-full bg-[#173B50]"
                                                            style={{
                                                                width: `${usagePercent}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            </td>


                                            {/* Expire */}

                                            <td className="px-4 py-4">

                                                <span className="text-[11px] text-[#667C8D]">
                                                    {formatDate(discount.expire)}
                                                </span>

                                            </td>


                                            {/* Status */}

                                            <td className="px-4 py-4">

                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium ${config.wrapper}`}
                                                >

                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                                                    />

                                                    {
                                                        config.label
                                                    }

                                                </span>

                                            </td>


                                            {/* Actions */}

                                            <td className="relative px-4 py-4">

                                                <div className="flex items-center justify-center">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setOpenMenu(
                                                                openMenu ===
                                                                discount._id
                                                                    ? null
                                                                    : discount._id
                                                            )
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4EAF0] text-[#657A8B] transition hover:bg-[#F4F7F9] hover:text-[#173B50]"
                                                    >
                                                        <MoreHorizontal
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                    {openMenu ===
                                                        discount._id && (
                                                            <div
                                                                className="absolute top-12 left-4 z-20 w-36 overflow-hidden rounded-lg border border-[#E5EBF0] bg-white p-1 shadow-lg">

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handleEditDiscount(
                                                                            discount
                                                                        );
                                                                        setOpenMenu(
                                                                            null
                                                                        );
                                                                    }}
                                                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-right text-[10px] text-[#53697A] transition hover:bg-[#F5F7F9]"
                                                                >
                                                                    <Edit3
                                                                        size={
                                                                            14
                                                                        }
                                                                    />

                                                                    ویرایش
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handleDeleteDiscount(
                                                                            discount
                                                                        );
                                                                        setOpenMenu(
                                                                            null
                                                                        );
                                                                    }}
                                                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-right text-[10px] text-[#EF5350] transition hover:bg-[#FFF4F4]"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            14
                                                                        }
                                                                    />

                                                                    حذف
                                                                </button>

                                                            </div>
                                                        )}

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                            </tbody>

                        </table>

                    </div>


                    {/* Empty */}

                    {paginatedDiscounts.length === 0 && (
                        <div className="py-16 text-center">

                            <Tag
                                size={30}
                                className="mx-auto text-[#C5CFD7]"
                            />

                            <p className="mt-3 text-[12px] font-medium text-[#657A8B]">
                                کد تخفیفی پیدا نشد
                            </p>

                            <p className="mt-1 text-[10px] text-[#A3AFB9]">
                                کد تخفیفی با این مشخصات وجود ندارد
                            </p>

                            <CreateDiscountModal isOpen={openCreateDiscount}
                                                 onClose={() => setOpenCreateDiscount(false)} villas={villas}
                                                 onSubmit={handleCreateDiscount}/>


                        </div>
                    )}


                    {/* Footer */}

                    <div
                        className="flex flex-col gap-4 border-t border-[#EDF1F4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <span className="text-[10px] text-[#8A9AA8]">
                                نمایش
                            </span>

                            <div
                                className="flex h-8 min-w-[48px] items-center justify-center gap-2 rounded-md border border-[#E2E8ED] text-[10px] text-[#53697A]">
                                {formatNumber(
                                    paginatedDiscounts.length
                                )}

                                <ChevronDown size={12}/>
                            </div>

                            <span className="text-[10px] text-[#8A9AA8]">
                                از{" "}
                                {formatNumber(
                                    filteredDiscounts.length
                                )}{" "}
                                کد
                            </span>

                        </div>


                        <div className="flex items-center gap-1">

                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(
                                            prev - 1,
                                            1
                                        )
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8ED] text-[#6C8191] transition hover:bg-[#F5F7F9] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={14}/>
                            </button>


                            {Array.from(
                                {
                                    length: totalPages,
                                },
                                (_, index) => index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(
                                            page
                                        )
                                    }
                                    className={`flex h-8 w-8 items-center justify-center rounded-md text-[10px] ${
                                        currentPage ===
                                        page
                                            ? "bg-[#173B50] text-white"
                                            : "border border-[#E2E8ED] text-[#657A8B] hover:bg-[#F5F7F9]"
                                    }`}
                                >
                                    {formatNumber(page)}
                                </button>
                            ))}


                            <button
                                type="button"
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(
                                            prev + 1,
                                            totalPages
                                        )
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8ED] text-[#6C8191] transition hover:bg-[#F5F7F9] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={14}/>
                            </button>

                        </div>

                    </div>

                </section>

            </div>
        </main>
    );
}
