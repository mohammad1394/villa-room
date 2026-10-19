"use client";

import { useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    ReceiptText,
    Search,
    WalletCards,
    XCircle,
} from "lucide-react";


type TransactionStatus = "success" | "pending" | "failed" | "refunded";

type Transaction = {
    id: string;
    bookingId: string;
    villaName: string;
    amount: number;
    status: TransactionStatus;
    createdAt: string;
    method: string;
};

const transactions: Transaction[] = [
    {
        id: "TR-94821",
        bookingId: "BK-10482",
        villaName: "ویلای ساحلی آرامش",
        amount: 4850000,
        status: "success",
        createdAt: "امروز، ۱۰:۲۳",
        method: "پرداخت آنلاین",
    },
    {
        id: "TR-94820",
        bookingId: "BK-10476",
        villaName: "کلبه جنگلی رویایی",
        amount: 3200000,
        status: "pending",
        createdAt: "دیروز، ۱۸:۴۰",
        method: "پرداخت آنلاین",
    },
    {
        id: "TR-94791",
        bookingId: "BK-10451",
        villaName: "ویلای استخردار شمال",
        amount: 6100000,
        status: "refunded",
        createdAt: "۲۸ مرداد ۱۴۰۵",
        method: "بازگشت وجه",
    },
    {
        id: "TR-94765",
        bookingId: "BK-10432",
        villaName: "ویلا جنگلی سوادکوه",
        amount: 2750000,
        status: "failed",
        createdAt: "۲۳ مرداد ۱۴۰۵",
        method: "پرداخت آنلاین",
    },
];

const statusConfig = {
    success: {
        label: "موفق",
        className: "bg-green-50 text-green-600",
    },
    pending: {
        label: "در انتظار پرداخت",
        className: "bg-yellow-50 text-yellow-600",
    },
    failed: {
        label: "ناموفق",
        className: "bg-red-50 text-red-500",
    },
    refunded: {
        label: "بازگشت وجه",
        className: "bg-blue-50 text-blue-600",
    },
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
};

export default async function Page() {

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState<
        TransactionStatus | "all"
    >("all");

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const matchesSearch =
                transaction.villaName.includes(search) ||
                transaction.id
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                transaction.bookingId
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                transaction.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

    const successfulTransactions = transactions.filter(
        (transaction) => transaction.status === "success"
    );

    const totalPaid = successfulTransactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
    );

    const totalRefunded = transactions
        .filter((transaction) => transaction.status === "refunded")
        .reduce(
            (total, transaction) => total + transaction.amount,
            0
        );

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-7">
                <h1 className="text-xl font-bold text-[#17334d] sm:text-2xl">
                    تراکنش‌ها
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    تاریخچه پرداخت‌ها و تراکنش‌های مالی حساب خود را مشاهده
                    کنید.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {/* Total Paid */}
                <div className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400">
                                مجموع پرداخت موفق
                            </p>

                            <p className="mt-3 text-xl font-bold text-[#17334d]">
                                {formatPrice(totalPaid)}
                                <span className="mr-1 text-xs font-normal text-gray-400">
                                    تومان
                                </span>
                            </p>
                        </div>

                        <div className="flex h-[45px] w-[45px] items-center justify-center rounded-[12px] bg-[#f2f5f7] text-[#17334d]">
                            <WalletCards size={21} />
                        </div>
                    </div>
                </div>

                {/* Successful */}
                <div className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400">
                                تراکنش موفق
                            </p>

                            <p className="mt-3 text-2xl font-bold text-green-600">
                                {successfulTransactions.length}
                            </p>
                        </div>

                        <div className="flex h-[45px] w-[45px] items-center justify-center rounded-[12px] bg-green-50 text-green-600">
                            <CheckCircle2 size={21} />
                        </div>
                    </div>
                </div>

                {/* Refunded */}
                <div className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400">
                                مجموع بازگشت وجه
                            </p>

                            <p className="mt-3 text-xl font-bold text-blue-600">
                                {formatPrice(totalRefunded)}
                                <span className="mr-1 text-xs font-normal text-gray-400">
                                    تومان
                                </span>
                            </p>
                        </div>

                        <div className="flex h-[45px] w-[45px] items-center justify-center rounded-[12px] bg-blue-50 text-blue-600">
                            <ReceiptText size={21} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions */}
            <section className="mt-6 overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-[#17334d]">
                                تاریخچه تراکنش‌ها
                            </h2>

                            <p className="mt-2 text-xs text-gray-400">
                                لیست تمام پرداخت‌ها و تراکنش‌های شما
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            {/* Search */}
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="جستجوی تراکنش..."
                                    className="h-[42px] w-full rounded-[9px] border border-gray-200 bg-white pr-10 pl-4 text-xs text-[#17334d] outline-none transition placeholder:text-gray-400 focus:border-[#d9a13b] sm:w-[220px]"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value as
                                            | TransactionStatus
                                            | "all"
                                    )
                                }
                                className="h-[42px] rounded-[9px] border border-gray-200 bg-white px-4 text-xs text-[#566575] outline-none focus:border-[#d9a13b]"
                            >
                                <option value="all">
                                    همه وضعیت‌ها
                                </option>

                                <option value="success">
                                    موفق
                                </option>

                                <option value="pending">
                                    در انتظار پرداخت
                                </option>

                                <option value="failed">
                                    ناموفق
                                </option>

                                <option value="refunded">
                                    بازگشت وجه
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="divide-y divide-gray-100">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => {
                            const status =
                                statusConfig[transaction.status];

                            return (
                                <button
                                    key={transaction.id}
                                    type="button"
                                    className="flex w-full flex-col gap-4 px-5 py-5 text-right transition hover:bg-[#fafbfc] sm:px-7 lg:flex-row lg:items-center lg:justify-between"
                                >
                                    {/* Transaction Information */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[12px] bg-[#f2f5f7] text-[#17334d]">
                                            <CreditCard size={21} />
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-sm font-semibold text-[#17334d]">
                                                    {transaction.villaName}
                                                </h3>

                                                <span className="text-[11px] text-gray-400">
                                                    {transaction.id}
                                                </span>
                                            </div>

                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-400">
                                                <span>
                                                    رزرو:{" "}
                                                    {transaction.bookingId}
                                                </span>

                                                <span>
                                                    {transaction.createdAt}
                                                </span>

                                                <span>
                                                    {transaction.method}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transaction Amount */}
                                    <div className="flex items-center justify-between gap-5 lg:justify-end">
                                        <div className="text-left">
                                            <p className="text-[11px] text-gray-400">
                                                مبلغ تراکنش
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-[#17334d]">
                                                {formatPrice(
                                                    transaction.amount
                                                )}

                                                <span className="mr-1 text-[11px] font-normal text-gray-400">
                                                    تومان
                                                </span>
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
                            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f2f5f7] text-[#17334d]">
                                <ReceiptText size={26} />
                            </div>

                            <h3 className="mt-5 text-sm font-bold text-[#17334d]">
                                تراکنشی پیدا نشد
                            </h3>

                            <p className="mt-2 text-xs text-gray-400">
                                نتیجه‌ای مطابق با جستجوی شما پیدا نشد.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}