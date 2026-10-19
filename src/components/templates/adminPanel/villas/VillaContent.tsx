"use client";

import {useMemo, useState} from "react";
import {
    Ban,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Eye,
    Home,
    MapPin,
    MoreHorizontal,
    Plus,
    Search,
    Star,
    Users,
    XCircle,
} from "lucide-react";
import {VillaType} from "@/types/Villa";
import {useRouter} from "next/navigation";
import {StateCardVilla} from "@/components/modules/adminPanel/StateCard/StateCardVilla";
import {FilterButton} from "@/components/modules/adminPanel/FilterButton";
import BlockVillaModal from "@/components/templates/adminPanel/villas/BlockVillaModal";
import DeleteVillaModal from "@/components/templates/adminPanel/villas/DeleteVillaModal";
import EditVillaModal from "@/components/templates/adminPanel/villas/EditVillaModal";
import {showCustomToast} from "@/components/modules/layout/toast/toast";


export default function VillasPage({villas}: { villas: VillaType[] }) {
    const [search, setSearch] = useState("");
    const [selectedVillas, setSelectedVillas] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [blockModal, setBlockModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedVilla, setSelectedVilla] = useState<VillaType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openAddVilla, setOpenAddVilla] = useState(false);

    const router = useRouter();

    const filteredVillas = useMemo(() => {
        const value = search.toLowerCase();

        return villas.filter(
            (villa) =>
                villa.title.toLowerCase().includes(value) ||
                villa.city.toLowerCase().includes(value) ||
                villa.type.toLowerCase().includes(value)
        );
    }, [search]);

    const toggleVilla = (id: string) => {
        setSelectedVillas((prev) =>
            prev.includes(id)
                ? prev.filter((villaId) => villaId !== id)
                : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedVillas.length === filteredVillas.length) {
            setSelectedVillas([]);
        } else {
            setSelectedVillas(
                filteredVillas.map((villa) => villa._id)
            );
        }
    };

    const diffrentTime = (time: string) => {
        const diff = Date.now() - new Date(time).getTime()

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        return days;

    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fa-IR").format(price);
    };

    const bannedVilla = async (data: { reason: string; bannedUntil?: string | null; }) => {
        if (isLoading) {
            showCustomToast(
                "خطا",
                "درخواست شما در حال پردازش است",
                "x",
                "error"
            );
            return;
        }

        if (!data.reason.trim()) {
            showCustomToast(
                "خطا",
                "لطفاً علت مسدودی را وارد کنید",
                "x",
                "error"
            );
            return;
        }

        if (!selectedVilla) {
            showCustomToast(
                "خطا",
                "ویلایی انتخاب نشده است",
                "x",
                "error"
            );
            return;
        }

        setIsLoading(true);

        try {
            const banData = {
                reason: data.reason.trim(),
                bannedUntil: data.bannedUntil || null,
            };

            const response = await fetch(
                `/api/admin/villas/${selectedVilla._id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(banData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                showCustomToast(
                    "خطا",
                    result.message || "مسدود کردن ویلا انجام نشد",
                    "x",
                    "error"
                );

                return;
            }

            showCustomToast(
                "موفق",
                "ویلا با موفقیت مسدود شد",
                "check",
                "success"
            );

            setBlockModal(false);
            setSelectedVilla(null);

            router.refresh();

        } catch (error) {
            console.error("BAN VILLA ERROR:", error);

            showCustomToast(
                "خطا",
                "خطایی در ارتباط با سرور رخ داد",
                "x",
                "error"
            );

        } finally {
            setIsLoading(false);
        }
    };

    const handleEditVilla = async (formData: Partial<VillaType>) => {
        if (isLoading) {
            showCustomToast(
                "خطا",
                "درخواست شما در حال پردازش است",
                "x",
                "error"
            );
            return;
        }

        if (!selectedVilla) {
            showCustomToast(
                "خطا",
                "ویلایی برای ویرایش انتخاب نشده است",
                "x",
                "error"
            );
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/admin/villas/${selectedVilla._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showCustomToast(
                    "خطا",
                    data.message || "ویرایش ویلا انجام نشد.",
                    "x",
                    "error"
                );
                return;
            }

            showCustomToast(
                "موفق",
                data.message || "اطلاعات ویلا با موفقیت ویرایش شد.",
                "check",
                "success"
            );

            setEditModal(false);
            setSelectedVilla(null);

            router.refresh();

        } catch (error) {
            console.error("EDIT VILLA ERROR:", error);

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


    const villaTypeLabels = {
        forest: "جنگلی",
        beach: "ساحلی",
        pool: "استخردار",
        mountain: "کوهستانی",
    } as const;

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
                            مدیریت ویلاها
                        </h1>

                        <p className="mt-1 text-[12px] text-[#8B9AAA]">
                            مدیریت، ویرایش و کنترل وضعیت ویلاهای ثبت شده
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push("/admin-panel/villas/create-villa")}
                        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#173B50] px-5 text-[13px] font-semibold text-white transition hover:bg-[#102F42]"
                    >
                        <Plus size={17}/>
                        افزودن ویلا
                    </button>
                </div>

                {/* Stats */}
                <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

                    <StateCardVilla
                        title="کل ویلاها"
                        value="128"
                        description="۸٪ بیشتر از ماه گذشته"
                        icon={Home}
                        iconClass="bg-[#EAF3FF] text-[#2474E8]"
                    />

                    <StateCardVilla
                        title="ویلاهای فعال"
                        value="112"
                        description="۸۷.۵٪ از کل ویلاها"
                        icon={Check}
                        iconClass="bg-[#E9F8F3] text-[#139C78]"
                    />

                    <StateCardVilla
                        title="در انتظار تایید"
                        value="9"
                        description="۷٪ از کل ویلاها"
                        icon={XCircle}
                        iconClass="bg-[#FFF5E5] text-[#E7A62D]"
                    />

                    <StateCardVilla
                        title="غیرفعال"
                        value="7"
                        description="۵.۵٪ از کل ویلاها"
                        icon={Ban}
                        iconClass="bg-[#FFF0F0] text-[#EF5350]"
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
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="جستجو بر اساس نام ویلا، شهر یا نوع ویلا..."
                                className="h-11 w-full rounded-lg border border-[#E1E8EE] bg-white pr-10 pl-4 text-[12px] text-[#263D4F] outline-none placeholder:text-[#A7B3BE] focus:border-[#6F95AD]"
                            />
                        </div>

                        <FilterButton
                            label="نوع ویلا"
                            value="همه"
                        />

                        <FilterButton
                            label="وضعیت"
                            value="همه"
                        />

                        <FilterButton
                            label="شهر"
                            value="همه"
                        />

                        <FilterButton
                            label="مرتب‌سازی"
                            value="جدیدترین"
                        />

                    </div>
                </section>

                {/* Table */}
                <section
                    className="overflow-hidden rounded-xl border border-[#E5EBF0] bg-white shadow-[0_2px_12px_rgba(23,43,58,0.03)]">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1200px] border-collapse">

                            <thead>
                            <tr className="border-b border-[#EDF1F4] bg-[#FCFDFE] text-right">

                                <th className="w-[50px] px-4 py-4">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredVillas.length > 0 &&
                                            selectedVillas.length ===
                                            filteredVillas.length
                                        }
                                        onChange={toggleAll}
                                        className="h-4 w-4 accent-[#173B50]"
                                    />
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    ویلا
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    موقعیت
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    نوع
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    ظرفیت
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    قیمت هر شب
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    امتیاز
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    وضعیت
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    تاریخ ثبت
                                </th>

                                <th className="px-4 py-4 text-center text-[11px] font-semibold text-[#657A8B]">
                                    عملیات
                                </th>

                            </tr>
                            </thead>

                            <tbody>

                            {filteredVillas.map((villa) => (
                                <tr
                                    key={villa._id}
                                    className="border-b border-[#F0F3F6] transition hover:bg-[#FBFCFD]"
                                >

                                    {/* Checkbox */}
                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedVillas.includes(
                                                villa._id
                                            )}
                                            onChange={() =>
                                                toggleVilla(villa._id)
                                            }
                                            className="h-4 w-4 accent-[#173B50]"
                                        />
                                    </td>

                                    {/* Villa */}
                                    <td className="px-4 py-3">

                                        <div className="flex items-center gap-3">

                                            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                                                <img
                                                    src={villa.images[0]}
                                                    alt={villa.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[12px] font-bold text-[#253C4D]">
                                                    {villa.title}
                                                </p>

                                                <p className="mt-1 text-[9px] text-[#A0ACB7]">
                                                    #{villa._id}
                                                </p>
                                            </div>

                                        </div>

                                    </td>

                                    {/* Location */}
                                    <td className="px-4 py-3">

                                        <div className="flex items-center gap-1.5 text-[10px] text-[#718596]">
                                            <MapPin
                                                size={13}
                                                className="text-[#8EA0AF]"
                                            />

                                            {villa.city}
                                        </div>

                                    </td>

                                    {/* Type */}
                                    <td className="px-4 py-3">

                                        <span
                                            className="rounded-full bg-[#F0F4F7] px-3 py-1 text-[10px] font-medium text-[#53697A]">
                                            {villaTypeLabels[villa.type]}
                                        </span>

                                    </td>

                                    {/* Capacity */}
                                    <td className="px-4 py-3">

                                        <div className="flex items-center gap-2 text-[10px] text-[#657A8B]">

                                            <Users size={13}/>

                                            <span>
                                                {villa.capacity} نفر
                                            </span>

                                            <span className="text-[#C2CBD2]">
                                                |
                                            </span>

                                            <span>
                                                {villa.bedrooms} اتاق
                                            </span>

                                        </div>

                                    </td>

                                    {/* Price */}
                                    <td className="px-4 py-3">

                                        <div>
                                            <p className="text-[11px] font-bold text-[#263D4F]">
                                                {formatPrice(
                                                    villa.pricePerNight
                                                )}{" "}
                                                تومان
                                            </p>
                                        </div>

                                    </td>

                                    {/* Rating */}
                                    <td className="px-4 py-3">

                                        <div className="flex items-center gap-1.5">

                                            <Star
                                                size={14}
                                                fill="currentColor"
                                                className="text-[#F3B93F]"
                                            />

                                            <span className="text-[11px] font-semibold text-[#53697A]">
                                                {villa.rating}
                                            </span>

                                        </div>

                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">

                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium ${
                                                villa.isActive
                                                    ? "bg-[#E9F8F2] text-[#159574]"
                                                    : "bg-[#FFF0F0] text-[#EF5350]"
                                            }`}
                                        >

                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    villa.isActive
                                                        ? "bg-[#18B488]"
                                                        : "bg-[#EF5350]"
                                                }`}
                                            />

                                            {villa.isActive ? "قعال" : "غیر فعال"}

                                        </span>

                                    </td>

                                    {/* Date */}
                                    <td className="px-4 py-3">

                                        <p className="text-[12px] text-[#667C8D]">
                                            {new Date(villa.createdAt).toLocaleDateString("fa-IR")}
                                        </p>

                                        <p className="mt-0.5 text-[8px] text-[#A6B1BB]">
                                            روز پیش : {diffrentTime(villa.createdAt)}
                                        </p>

                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">

                                        <div className="flex items-center justify-center gap-1.5">

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    router.push(`/villas/${villa._id}`)
                                                }}
                                                title="مشاهده"
                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4EAF0] text-[#657A8B] transition hover:bg-[#F4F7F9] hover:text-[#173B50]"
                                            >
                                                <Eye size={14}/>
                                            </button>

                                            <button
                                                type="button"
                                                title="ویرایش"
                                                onClick={() => {
                                                    setSelectedVilla(villa);
                                                    setEditModal(true);
                                                }}
                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4EAF0] text-[#657A8B] transition hover:bg-[#F4F7F9] hover:text-[#173B50]"
                                            >
                                                <Edit3 size={14}/>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (villa.isActive) {
                                                        setSelectedVilla(villa);
                                                        setBlockModal(true);
                                                    }
                                                }}
                                                title={
                                                    villa.isActive
                                                        ? "غیرفعال کردن"
                                                        : "فعال کردن"
                                                }
                                                className={`flex h-8 w-8 items-center justify-center rounded-md border transition ${
                                                    villa.isActive
                                                        ? "border-[#F0E0E0] text-[#EF5350] hover:bg-[#FFF4F4]"
                                                        : "border-[#D9EEE7] text-[#159574] hover:bg-[#EFFAF6]"
                                                }`}


                                            >
                                                {villa.isActive ? (
                                                    <Ban size={14}/>
                                                ) : (
                                                    <Check size={14}/>
                                                )}
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            ))}

                            </tbody>

                        </table>

                    </div>

                    {/* Footer */}
                    <div
                        className="flex flex-col gap-4 border-t border-[#EDF1F4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <span className="text-[10px] text-[#8A9AA8]">
                                نمایش
                            </span>

                            <button
                                type="button"
                                className="flex h-8 min-w-[48px] items-center justify-center gap-2 rounded-md border border-[#E2E8ED] text-[10px] text-[#53697A]"
                            >
                                ۱۰
                                <ChevronDown size={12}/>
                            </button>

                            <span className="text-[10px] text-[#8A9AA8]">
                                از ۱۲۸ ویلا
                            </span>

                        </div>

                        <div className="flex items-center gap-1">

                            <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8ED] text-[#6C8191]"
                            >
                                <ChevronRight size={14}/>
                            </button>

                            {[1, 2, 3, 4, 5].map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                    className={`flex h-8 w-8 items-center justify-center rounded-md text-[10px] ${
                                        currentPage === page
                                            ? "bg-[#173B50] text-white"
                                            : "border border-[#E2E8ED] text-[#657A8B] hover:bg-[#F5F7F9]"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8ED] text-[#6C8191]"
                            >
                                <ChevronLeft size={14}/>
                            </button>
                        </div>

                    </div>

                </section>
                {/* Modals */}
                <EditVillaModal
                    isOpen={editModal}
                    villa={selectedVilla}
                    onClose={() => setEditModal(false)} onSubmit={handleEditVilla}
                    isLoading={isLoading}/>
                <DeleteVillaModal
                    isOpen={deleteModal}
                    villaTitle={selectedVilla?.title || ""}
                    onClose={() => setDeleteModal(false)}
                />
                <BlockVillaModal
                    isOpen={blockModal}
                    villaTitle={selectedVilla?.title || ""}
                    isBlocked={selectedVilla?.isActive === false} onClose={() => setBlockModal(false)}
                    onConfirm={bannedVilla}
                />
            </div>
        </main>
    )
        ;
}