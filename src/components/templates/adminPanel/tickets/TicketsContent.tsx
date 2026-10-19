"use client";

import {useMemo, useState} from "react";
import {
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    MessageSquare,
    MoreHorizontal,
    Search,
    User,
    XCircle,
    AlertTriangle,
} from "lucide-react";
import {TicketType} from "@/types/Ticket";
import {formatDate} from "@/utility/helper";
import {useRouter} from "next/navigation";
import ChangeBookingStatusModal from "@/components/templates/adminPanel/bookings/ChangeBookingStatusModal";
import ChangeTicketStatusModal from "@/components/templates/adminPanel/tickets/ChangeTicketStatusModal";
import {BookingType} from "@/types/Booking";
import {showCustomToast} from "@/components/modules/layout/toast/toast";
import {StateCardTickets} from "@/components/modules/adminPanel/StateCard/StateCardTickets";
import {FilterButton} from "@/components/templates/adminPanel/tickets/FilterTickets";

function TicketStatus({status}: {status: TicketType["status"]}) {
    const config = {
        open: {
            label: "باز",
            wrapper: "bg-[#FFF0F0] text-[#EF5350]",
            dot: "bg-[#EF5350]",
        },
        pending: {
            label: "در حال بررسی",
            wrapper: "bg-[#FFF5E5] text-[#D99620]",
            dot: "bg-[#E7A62D]",
        },
        answered: {
            label: "پاسخ داده شده",
            wrapper: "bg-[#E9F8F2] text-[#159574]",
            dot: "bg-[#18B488]",
        },
        closed: {
            label: "بسته شده",
            wrapper: "bg-[#EAF3FF] text-[#397DD0]",
            dot: "bg-[#397DD0]",
        },
    };

    const item = config[status];

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium ${item.wrapper}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
            {item.label}
        </span>
    );
}

function TicketPriority({priority}: {priority: TicketType["priority"]}) {
    const config = {
        low: {
            label: "کم",
            className: "text-[#159574]",
        },
        medium: {
            label: "متوسط",
            className: "text-[#D99620]",
        },
        high: {
            label: "زیاد",
            className: "text-[#EF5350]",
        },
    };

    const item = config[priority];

    return (
        <span className={`text-[10px] font-semibold ${item.className}`}>
            {item.label}
        </span>
    );
}

export default function TicketsContent({tickets} : {tickets : TicketType[]}) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("همه");
    const [priorityFilter, setPriorityFilter] = useState("همه");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState<TicketType | null>();
    const [openChangeTicketStatusModal, setOpenChangeTicketStatusModal] = useState(false);
    const [isLoading , setIsLoading] = useState(false);

    const openTickets = tickets.filter(ticket => ticket.status === "open").length;
    const closedTickets = tickets.filter(ticket => ticket.status === "closed").length;
    const pendingTickets = tickets.filter(ticket => ticket.status === "pending").length;






    const router = useRouter();

    const filteredTickets = useMemo(() => {
        const value = search.toLowerCase();

        return tickets.filter((ticket ) => {
            const matchesSearch =
                ticket._id.toLowerCase().includes(value) ||
                ticket.userId.fullName.toLowerCase().includes(value) ||
                ticket.userId.phone.includes(value);

            const matchesStatus =
                statusFilter === "همه" ||
                (statusFilter === "باز" && ticket.status === "open") ||
                (statusFilter === "در حال بررسی" &&
                    ticket.status === "pending") ||
                (statusFilter === "بسته شده" &&
                    ticket.status === "closed");

            const matchesPriority =
                priorityFilter === "همه" ||
                (priorityFilter === "کم" &&
                    ticket.priority === "low") ||
                (priorityFilter === "متوسط" &&
                    ticket.priority === "medium") ||
                (priorityFilter === "زیاد" &&
                    ticket.priority === "high")

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });
    }, [tickets ,search, statusFilter, priorityFilter]);

    const handleChangeTicketStatus = async (status: TicketType["status"]) => {
        if (isLoading) {
            showCustomToast(
                "خطا",
                "درخواست شما در حال پردازش است",
                "x",
                "error"
            );
            return;
        }


        if (!selectedTicket) {
            showCustomToast(
                "خطا",
                "رزروی برای ویرایش انتخاب نشده است",
                "x",
                "error"
            );
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/admin/tickets/${selectedTicket._id}`,
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
                data.message || "تغییر وضعیت تیکت با موفقیت ویرایش شد.",
                "check",
                "success"
            );

            setOpenChangeTicketStatusModal(false);
            setSelectedTicket(null);

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
            setIsLoading(false);
        }
    };



    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#F8FAFC] p-4 font-[Vazirmatn] sm:p-5 lg:p-7"
        >
            <div className="mx-auto max-w-[1500px]">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-[22px] font-extrabold text-[#172B3A]">
                        مدیریت تیکت‌ها
                    </h1>

                    <p className="mt-1 text-[12px] text-[#8B9AAA]">
                        مدیریت درخواست‌ها و پیام‌های کاربران
                    </p>
                </div>

                {/* Stats */}
                <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

                    <StateCardTickets
                        title="کل تیکت‌ها"
                        value={tickets.length}
                        description="تعداد کل درخواست‌ها"
                        icon={MessageSquare}
                        iconClass="bg-[#EAF3FF] text-[#2474E8]"
                    />

                    <StateCardTickets
                        title="تیکت‌های باز"
                        value={openTickets}
                        description="نیازمند پاسخ مدیر"
                        icon={AlertTriangle}
                        iconClass="bg-[#FFF0F0] text-[#EF5350]"
                    />

                    <StateCardTickets
                        title="در حال بررسی"
                        value={pendingTickets}
                        description="در حال پیگیری"
                        icon={Clock3}
                        iconClass="bg-[#FFF5E5] text-[#E7A62D]"
                    />

                    <StateCardTickets
                        title="بسته شده"
                        value={closedTickets}
                        description="تیکت‌های حل شده"
                        icon={Check}
                        iconClass="bg-[#E9F8F2] text-[#159574]"
                    />

                </section>

                {/* Filters */}
                <section className="mb-4 rounded-xl border border-[#E8EEF3] bg-white p-3 shadow-[0_2px_12px_rgba(23,43,58,0.03)]">

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
                                placeholder="جستجو بر اساس کد تیکت، نام کاربر، موضوع یا شماره تلفن..."
                                className="h-11 w-full rounded-lg border border-[#E1E8EE] bg-white pr-10 pl-4 text-[12px] text-[#263D4F] outline-none placeholder:text-[#A7B3BE] focus:border-[#6F95AD]"
                            />
                        </div>

                        <FilterButton
                            label="وضعیت"
                            value={statusFilter}
                            options={[
                                "همه",
                                "باز",
                                "در حال بررسی",
                                "پاسخ داده شده",
                                "بسته شده",
                            ]}
                            onChange={setStatusFilter}
                        />

                        <FilterButton
                            label="اولویت"
                            value={priorityFilter}
                            options={[
                                "همه",
                                "کم",
                                "متوسط",
                                "زیاد",
                                "فوری",
                            ]}
                            onChange={setPriorityFilter}
                        />

                    </div>
                </section>

                {/* Table */}
                <section className="overflow-hidden rounded-xl border border-[#E5EBF0] bg-white shadow-[0_2px_12px_rgba(23,43,58,0.03)]">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1200px] border-collapse">

                            <thead>
                            <tr className="border-b border-[#EDF1F4] bg-[#FCFDFE] text-right">

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    کد تیکت
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    کاربر
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    موضوع
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    دسته‌بندی
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    اولویت
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

                            {filteredTickets.map((ticket) => (
                                <tr
                                    key={ticket._id}
                                    className="border-b border-[#F0F3F6] transition hover:bg-[#FBFCFD]"
                                >

                                    {/* ID */}
                                    <td className="px-4 py-4">
                                        <span className="text-[11px] font-bold text-[#173B50]">
                                            #{ticket._id}
                                        </span>

                                        <p className="mt-1 text-[8px] text-[#A5B0BA]">
                                            {formatDate(ticket.createdAt)}
                                        </p>
                                    </td>

                                    {/* User */}
                                    <td className="px-4 py-3">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3F7] text-[#60798A]">
                                                {ticket.userId.avatar ? (
                                                    <img
                                                        src={ticket.userId.avatar}
                                                        alt={ticket.userId.fullName}
                                                        className="h-9 w-9 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User size={16}/>
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-[11px] font-bold text-[#253C4D]">
                                                    {ticket.userId.fullName}
                                                </p>

                                                <p
                                                    dir="ltr"
                                                    className="mt-1 text-right text-[9px] text-[#A0ACB7]"
                                                >
                                                    {ticket.userId.phone}
                                                </p>
                                            </div>

                                        </div>

                                    </td>

                                    {/* Subject */}
                                    <td className="max-w-[260px] px-4 py-3">

                                        <p className="truncate text-[11px] font-semibold text-[#334B5D]">
                                            {ticket.title}
                                        </p>

                                        <p className="mt-1 truncate text-[9px] text-[#9AA8B3]">
                                            {formatDate(ticket.lastMessageAt || "تاریخ اخرین پیام یافت نشد")}
                                        </p>

                                    </td>

                                    {/* Category */}
                                    <td className="px-4 py-3">
                                        <span className="rounded-md bg-[#F4F7F9] px-2.5 py-1.5 text-[9px] text-[#657A8B]">
                                            {ticket.department.title}
                                        </span>
                                    </td>

                                    {/* Priority */}
                                    <td className="px-4 py-3">
                                        <TicketPriority
                                            priority={ticket.priority}
                                        />
                                    </td>


                                    {/* Status */}
                                    <td className="px-4 py-3">
                                        <TicketStatus
                                            status={ticket.status}
                                        />
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">

                                        <div className="flex items-center justify-center gap-1.5">

                                            <button
                                                type="button"
                                                title="مشاهده تیکت"
                                                onClick={() => {router.push(`/admin-panel/tickets/${ticket._id}`)}}
                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4EAF0] text-[#657A8B] transition hover:bg-[#F4F7F9] hover:text-[#173B50]"
                                            >
                                                <Eye size={14}/>
                                            </button>

                                            <button
                                                type="button"
                                                title="تغییر وضعیت"
                                                onClick={() => {
                                                    setSelectedTicket(ticket);
                                                    setOpenChangeTicketStatusModal(true)
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
                    <div className="flex flex-col gap-4 border-t border-[#EDF1F4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

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
                                از ۲۴۸ تیکت
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
                                    onClick={() => setCurrentPage(page)}
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

                            <ChangeTicketStatusModal
                                ticketTitle={selectedTicket?.title || "عنوان تیکت یافت نشد"}
                                currentStatus={selectedTicket?.status || "pending"}
                                isOpen={openChangeTicketStatusModal}
                                onClose={() => setOpenChangeTicketStatusModal(false)}
                                onConfirm={handleChangeTicketStatus}
                            />

                        </div>

                    </div>

                </section>

            </div>
        </main>
    );
}


