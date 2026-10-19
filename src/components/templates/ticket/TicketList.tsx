"use client";
import {
    CheckCircle2,
    Clock3,
    Headphones,
    MessageSquare,
    Plus,
    Search,
    Send,
    Ticket,

} from "lucide-react";
import Link from "next/link";
import {TicketType} from "@/types/Ticket";
import {useMemo, useState} from "react";

const statusConfig = {
    open: {
        label: "باز",
        className: "bg-blue-50 text-blue-600",
    },
    pending: {
        label: "در حال بررسی",
        className: "bg-yellow-50 text-yellow-600",
    },
    closed: {
        label: "بسته شده",
        className: "bg-green-50 text-green-600",
    },
};
type TicketListProps = {
    tickets: TicketType[];
};


function TicketList({tickets}: TicketListProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed" | "pending">("all");

    const openTickets = tickets.filter(
        ticket => ticket.status === "open"
    ).length;

    const pendingTickets = tickets.filter(
        ticket => ticket.status === "pending"
    ).length;

    const closedTickets = tickets.filter(
        ticket => ticket.status === "closed"
    ).length;


    const filteredTickets = useMemo(() => {
        const searchValue = search.trim();



        return tickets.filter((ticket: TicketType) => {
            const matchesSeach =
                !searchValue
                || ticket.title.includes(searchValue)
                || ticket.body.includes(searchValue);

            const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;

            return matchesStatus && matchesSeach;
        })

    }, [tickets, search, statusFilter]);


    return (
        <div>
            {/* Header */}
            <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <h1 className="text-xl font-bold text-[#17334d] sm:text-2xl">
                        تیکت‌های پشتیبانی
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        درخواست‌ها و پیام‌های خود را با تیم پشتیبانی ویلاروم
                        پیگیری کنید.
                    </p>
                </div>

                <Link
                    href={"/panel/tickets/create-ticket"}
                    className="flex h-[48px] items-center justify-center gap-2 rounded-[10px] bg-[#17334d] px-5 text-sm font-medium text-white transition hover:bg-[#0c2438]"
                >
                    <Plus size={18}/>
                    ثبت تیکت جدید
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* All */}
                <div className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400">
                                مجموع تیکت‌ها
                            </p>

                            <p className="mt-3 text-2xl font-bold text-[#17334d]">
                                {tickets.length}
                            </p>
                        </div>

                        <div
                            className="flex h-[45px] w-[45px] items-center justify-center rounded-[12px] bg-[#f2f5f7] text-[#17334d]">
                            <Ticket size={21}/>
                        </div>
                    </div>
                </div>

                {/* Pending */}
                <div className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400">
                                نیازمند پاسخ
                            </p>

                            <p className="mt-3 text-2xl font-bold text-yellow-600">
                                {openTickets + pendingTickets}
                            </p>
                        </div>

                        <div
                            className="flex h-[45px] w-[45px] items-center justify-center rounded-[12px] bg-yellow-50 text-yellow-600">
                            <Clock3 size={21}/>
                        </div>
                    </div>
                </div>

                {/* Closed */}
                <div className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400">
                                تیکت‌های بسته شده
                            </p>

                            <p className="mt-3 text-2xl font-bold text-green-600">
                                {closedTickets}
                            </p>
                        </div>

                        <div
                            className="flex h-[45px] w-[45px] items-center justify-center rounded-[12px] bg-green-50 text-green-600">
                            <CheckCircle2 size={21}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tickets */}
            <section className="mt-6 overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm">
                {/* Section Header */}
                <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-[#17334d]">
                                لیست تیکت‌ها
                            </h2>

                            <p className="mt-2 text-xs text-gray-400">
                                تاریخچه درخواست‌های پشتیبانی شما
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            {/* Search */}

                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="جستجوی تیکت..."
                                    className="h-[42px] w-full rounded-[9px] border border-gray-200 bg-white pr-10 pl-4 text-xs text-[#17334d] transition outline-none placeholder:text-gray-400 focus:border-[#d9a13b] sm:w-[220px]"
                                />
                            </div>
                            {/* Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value as "all" | "open" | "closed" | "pending"
                                    )
                                }
                                className="h-[42px] rounded-[9px] border border-gray-200 bg-white px-4 text-xs text-[#566575] outline-none focus:border-[#d9a13b]"
                            >
                                <option value="all">
                                    همه وضعیت‌ها
                                </option>

                                <option value="open">
                                    باز
                                </option>

                                <option value="pending">
                                    در حال بررسی
                                </option>

                                <option value="closed">
                                    بسته شده
                                </option>
                            </select>


                        </div>
                    </div>
                </div>

                {/* Tickets List */}
                <div className="divide-y divide-gray-100">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map((ticket: TicketType) => {
                            const status =
                                statusConfig[ticket.status];

                            return (
                                <button
                                    key={ticket._id}
                                    type="button"
                                    className="flex w-full flex-col gap-4 px-5 py-5 text-right transition hover:bg-[#fafbfc] sm:px-7 lg:flex-row lg:items-center lg:justify-between"
                                >
                                    {/* Ticket.ts Info */}
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[12px] bg-[#f2f5f7] text-[#17334d]">
                                            <MessageSquare size={20}/>
                                        </div>

                                        <div>
                                            <div className="flex flex-col flex-wrap items-center gap-2">
                                                <Link href={`/panel/tickets/answer/${ticket._id}`}>
                                                    <h3 className="text-sm font-semibold text-[#17334d]">
                                                        عنوان تیکت : {ticket.title}
                                                    </h3>
                                                </Link>


                                                <span className="text-[11px] text-gray-400">
                                                    بخش مربوط : {ticket.department.title}
                                                </span>
                                            </div>

                                            <div
                                                className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-400">
                                                <span>
                                                    ایجاد:{" "}
                                                    {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center justify-between gap-4 lg:justify-end">
                                        <div className="text-left">
                                            <p className="text-[11px] text-gray-400">
                                                آخرین بروزرسانی
                                            </p>

                                            <p className="mt-1 text-xs text-[#566575]">
                                                {new Date(ticket.updatedAt).toLocaleDateString("fa-IR")}
                                            </p>
                                        </div>

                                        <span
                                            className={`whitespace-nowrap rounded-[8px] px-3 py-2 text-[11px] font-medium ${status.className}`}
                                        >
                                            {status.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                            <div
                                className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f2f5f7] text-[#17334d]">
                                <Headphones size={26}/>
                            </div>

                            <h3 className="mt-5 text-sm font-bold text-[#17334d]">
                                تیکتی پیدا نشد
                            </h3>

                            <p className="mt-2 text-xs text-gray-400">
                                نتیجه‌ای مطابق با جستجوی شما پیدا نشد.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Support CTA */}
            <section
                className="mt-6 flex flex-col justify-between gap-5 rounded-[16px] bg-[#17334d] p-5 sm:flex-row sm:items-center sm:p-7">
                <div className="flex items-start gap-4">
                    <div
                        className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px] bg-white/10 text-white">
                        <Headphones size={22}/>
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-white">
                            نیاز به کمک دارید؟
                        </h2>

                        <p className="mt-2 text-xs leading-6 text-gray-300">
                            تیم پشتیبانی ویلاروم آماده پاسخگویی به سوالات
                            شماست.
                        </p>
                    </div>
                </div>

                <Link
                    href={"/panel/tickets/create-ticket"}
                    className="flex h-[45px] shrink-0 items-center justify-center gap-2 rounded-[10px] bg-white px-5 text-xs font-medium text-[#17334d] transition hover:bg-gray-100"
                >
                    <Send size={16}/>
                    ثبت درخواست جدید
                </Link>
            </section>
        </div>
    );
}

export default TicketList;