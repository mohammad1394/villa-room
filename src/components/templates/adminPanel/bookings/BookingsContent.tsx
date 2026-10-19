"use client";

import {useMemo, useState} from "react";
import {
    Ban,
    CalendarDays,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    Home,
    MoreHorizontal,
    Search, User,
    UserRound,
    WalletCards,
    XCircle,
} from "lucide-react";
import {BookingType} from "@/types/Booking";
import Booking from "@/models/Booking";
import {FilterBookings} from "@/components/templates/adminPanel/bookings/FilterBookings";
import {StateCard} from "@/components/modules/adminPanel/StateCard/StateCard";
import ChangeBookingStatusModal from "@/components/templates/adminPanel/bookings/ChangeBookingStatusModal";
import {showCustomToast} from "@/components/modules/layout/toast/toast";
import {useRouter} from "next/navigation";
import {formatPrice} from "@/utility/helper";






function BookingStatus({
                           status,
                       }: {
    status: BookingType["status"];
}) {
    const styles = {
        "confirmed": {
            wrapper: "bg-[#E9F8F2] text-[#159574]",
            dot: "bg-[#18B488]",
        },
        "pending": {
            wrapper: "bg-[#FFF5E5] text-[#D99620]",
            dot: "bg-[#E7A62D]",
        },
        "cancelled": {
            wrapper: "bg-[#FFF0F0] text-[#EF5350]",
            dot: "bg-[#EF5350]",
        },
        "completed": {
            wrapper: "bg-[#EAF3FF] text-[#397DD0]",
            dot: "bg-[#397DD0]",
        },
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium ${styles[status].wrapper}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${styles[status].dot}`}
            />

            {status}
        </span>
    );
}

export default function BookingsConten({bookings}: { bookings: BookingType[] }) {
    const [search, setSearch] = useState("");
    const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBooking, setSelectedBooking] = useState<BookingType | null>()
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    const router = useRouter();

    const confirmBookings = bookings.filter(booking => booking.status === "confirmed").length;
    const pendingBookings = bookings.filter(booking => booking.status === "pending").length;



    const filteredBookings = useMemo(() => {
        const value = search.toLowerCase();

        return bookings.filter(
            (booking) =>
                booking.guests === Number(value) ||
                booking.villaId.title.includes(value) ||
                booking.userId.phone.includes(value) ||
                booking._id.toString().includes(value)
        );
    }, [search , bookings]);

    const toggleBooking = (id: number) => {
        setSelectedBookings((prev) =>
            prev.includes(id)
                ? prev.filter((bookingId) => bookingId !== id)
                : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (
            selectedBookings.length === filteredBookings.length
        ) {
            setSelectedBookings([]);
        } else {
            setSelectedBookings(
                filteredBookings.map((booking) => Number(booking._id))
            );
        }
    };

    const handleChangeBookingStatus = async (status: BookingType["status"]) => {
        if (isStatusLoading) {
            showCustomToast(
                "خطا",
                "درخواست شما در حال پردازش است",
                "x",
                "error"
            );
            return;
        }


        if (!selectedBooking) {
            showCustomToast(
                "خطا",
                "رزروی برای ویرایش انتخاب نشده است",
                "x",
                "error"
            );
            return;
        }

        setIsStatusLoading(true);

        try {
            const response = await fetch(
                `/api/admin/bookings/${selectedBooking._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showCustomToast(
                    "خطا",
                    `${data.message}`,
                    "x",
                    "error"
                );
                return;
            }
            showCustomToast(
                "موفق",
                data.message || "تغییر وضعیت رزرو با موفقیت ویرایش شد.",
                "check",
                "success"
            );

            setOpenStatusModal(false);
            setSelectedBooking(null);

            router.refresh();




        } catch (error) {
            console.error("EDIT BOOKING STATUS ERROR:", error);

            showCustomToast(
                "خطا",
                "خطایی در ارتباط با سرور رخ داد.",
                "x",
                "error"
            );
        } finally {
            setIsStatusLoading(false);
        }
    };
    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#F8FAFC] p-4 font-[Vazirmatn] sm:p-5 lg:p-7"
        >
            <div className="mx-auto max-w-[1500px]">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[22px] font-extrabold text-[#172B3A]">
                            مدیریت رزروها
                        </h1>

                        <p className="mt-1 text-[12px] text-[#8B9AAA]">
                            مدیریت رزروها، وضعیت پرداخت و اطلاعات اقامت مهمانان
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

                    <StateCard
                        title="کل رزروها"
                        value= {bookings.length}
                        description="۱۲٪ بیشتر از ماه گذشته"
                        icon={CalendarDays}
                        iconClass="bg-[#EAF3FF] text-[#2474E8]"
                    />

                    <StateCard
                        title="رزروهای تایید شده"
                        value= {confirmBookings}
                        description="۸۳.۴٪ از کل رزروها"
                        icon={Check}
                        iconClass="bg-[#E9F8F3] text-[#139C78]"
                    />

                    <StateCard
                        title="در انتظار تایید"
                        value={pendingBookings}
                        description="۱۱.۱٪ از کل رزروها"
                        icon={Clock3}
                        iconClass="bg-[#FFF5E5] text-[#E7A62D]"
                    />

                    <StateCard
                        title="درآمد رزروها"
                        value= {28000000}
                        description="درآمد کل رزروهای ثبت شده"
                        icon={WalletCards}
                        iconClass="bg-[#F0EAFE] text-[#8159DD]"
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
                                placeholder="جستجو بر اساس نام مهمان، ویلا، شماره تلفن یا کد رزرو..."
                                className="h-11 w-full rounded-lg border border-[#E1E8EE] bg-white pr-10 pl-4 text-[12px] text-[#263D4F] outline-none placeholder:text-[#A7B3BE] focus:border-[#6F95AD]"
                            />
                        </div>

                        <FilterBookings
                            label="وضعیت رزرو"
                            value="همه"
                        />

                        <FilterBookings
                            label="پرداخت"
                            value="همه"
                        />

                        <FilterBookings
                            label="تاریخ"
                            value="همه"
                        />

                        <FilterBookings
                            label="مرتب‌سازی"
                            value="جدیدترین"
                        />

                    </div>
                </section>

                {/* Table */}
                <section
                    className="overflow-hidden rounded-xl border border-[#E5EBF0] bg-white shadow-[0_2px_12px_rgba(23,43,58,0.03)]">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1350px] border-collapse">

                            <thead>
                            <tr className="border-b border-[#EDF1F4] bg-[#FCFDFE] text-right">

                                <th className="w-[50px] px-4 py-4">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredBookings.length > 0 &&
                                            selectedBookings.length ===
                                            filteredBookings.length
                                        }
                                        onChange={toggleAll}
                                        className="h-4 w-4 accent-[#173B50]"
                                    />
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    کد رزرو
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    مهمان
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    ویلا
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    ورود
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    خروج
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    مهمانان
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    مبلغ
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

                            {filteredBookings.map((booking) => (
                                <tr
                                    key={booking._id}
                                    className="border-b border-[#F0F3F6] transition hover:bg-[#FBFCFD]"
                                >

                                    {/* Checkbox */}
                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedBookings.includes(
                                                Number(booking._id)
                                            )}
                                            onChange={() =>
                                                toggleBooking(
                                                    Number(booking._id)
                                                )
                                            }
                                            className="h-4 w-4 accent-[#173B50]"
                                        />
                                    </td>

                                    {/* Booking ID */}
                                    <td className="px-4 py-3">
                                        <span className="text-[11px] font-bold text-[#173B50]">
                                            #{booking._id}
                                        </span>
                                    </td>

                                    {/* Guest */}
                                    <td className="px-4 py-3">

                                        <div className="flex items-center gap-3">
                                            {booking.userId.avatar ? (
                                                <img
                                                    src={booking.userId.avatar}
                                                    alt={booking.userId.fullName}
                                                    className="h-9 w-9 rounded-full object-cover"
                                                />
                                            ) : (
                                                <User/>
                                            )}


                                            <div>
                                                <p className="text-[11px] font-bold text-[#253C4D]">
                                                    {booking.userId.fullName}
                                                </p>

                                                <p
                                                    dir="ltr"
                                                    className="mt-1 text-right text-[9px] text-[#A0ACB7]"
                                                >
                                                    {booking.userId.phone}
                                                </p>
                                            </div>

                                        </div>

                                    </td>

                                    {/* Villa */}
                                    <td className="px-4 py-3">

                                        <div className="max-w-[190px]">

                                            <p className="text-[11px] font-semibold text-[#334B5D]">
                                                {booking.villaId.title}
                                            </p>

                                            <div className="mt-1 flex items-center gap-1 text-[9px] text-[#9AA8B3]">
                                                <Home size={11}/>
                                                {booking.villaId.province}
                                            </div>

                                        </div>

                                    </td>

                                    {/* Check In */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays
                                                size={13}
                                                className="text-[#8EA0AF]"
                                            />

                                            <span className="text-[10px] text-[#657A8B]">
                                                {new Date(booking.checkIn).toLocaleDateString("fa-IR")}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Check Out */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays
                                                size={13}
                                                className="text-[#8EA0AF]"
                                            />

                                            <span className="text-[10px] text-[#657A8B]">
                                                {new Date(booking.checkOut).toLocaleDateString("fa-IR")}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[8px] text-[#A5B0BA]">
                                            {booking.nights} شب
                                        </p>
                                    </td>

                                    {/* Guests */}
                                    <td className="px-4 py-3">

                                        <div className="flex items-center gap-1.5 text-[10px] text-[#657A8B]">

                                            <UserRound size={13}/>

                                            <span>
                                                {booking.guests} نفر
                                            </span>

                                        </div>

                                    </td>

                                    {/* Amount */}
                                    <td className="px-4 py-3">

                                        <p className="text-[11px] font-bold text-[#263D4F]">
                                            {formatPrice(
                                                booking.totalPrice
                                            )}
                                        </p>

                                        <p className="mt-1 text-[8px] text-[#A5B0BA]">
                                            تومان
                                        </p>

                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                                        <BookingStatus
                                            status={booking.status}
                                        />
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">

                                        <div className="flex items-center justify-center gap-1.5">

                                            <button
                                                type="button"
                                                title="مشاهده رزرو"
                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4EAF0] text-[#657A8B] transition hover:bg-[#F4F7F9] hover:text-[#173B50]"
                                            >
                                                <Eye size={14}/>
                                            </button>

                                            <button
                                                type="button"
                                                title="تغییر وضعیت رزرو"
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setOpenStatusModal(true);
                                                }}
                                                className="flex h-8 items-center justify-center rounded-md border border-[#E4EAF0] px-3 text-[10px] text-black transition hover:bg-[#F4F7F9]"
                                            >
                                                تغییر وضعیت
                                            </button>


                                        </div>

                                    </td>

                                </tr>
                            ))}

                            </tbody>

                        </table>

                    </div>

                    {/* Pagination */}
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
                                از ۸۶۴ رزرو
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

                            <ChangeBookingStatusModal
                                bookingTitle={selectedBooking?.villaId.title || "عنوان رزرو یافت نشد"}
                                isOpen={openStatusModal}
                                onClose={() => setOpenStatusModal(false)}
                                onConfirm={handleChangeBookingStatus}
                                currentStatus={selectedBooking?.status || "pending"}
                                isLoading={isStatusLoading}
                            />
                        </div>

                    </div>

                </section>
            </div>
        </main>
    );
}