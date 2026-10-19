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
    Search,
    Star,
    User,
    XCircle,
} from "lucide-react";
import {ReviewType} from "@/types/Review";
import {formatDate} from "@/utility/helper";
import {useRouter} from "next/navigation";
import {showCustomToast} from "@/components/modules/layout/toast/toast";




type CommentStatus = "pending" | "approved" | "rejected";

function CommentStatusBadge({status}: { status: CommentStatus }) {
    const config = {
        pending: {
            label: "در حال بررسی",
            wrapper: "bg-[#FFF5E5] text-[#D99620]",
            dot: "bg-[#E7A62D]",
        },

        approved: {
            label: "تأیید شده",
            wrapper: "bg-[#E9F8F2] text-[#159574]",
            dot: "bg-[#18B488]",
        },

        rejected: {
            label: "رد شده",
            wrapper: "bg-[#FFF0F0] text-[#EF5350]",
            dot: "bg-[#EF5350]",
        },
    };

    const item = config[status];

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium ${item.wrapper}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${item.dot}`}
            />

            {item.label}
        </span>
    );
}

function Rating({
    rating,
}: {
    rating: number;
}) {
    return (
        <div className="flex items-center gap-1">
            <Star
                size={13}
                className="fill-[#E7A62D] text-[#E7A62D]"
            />

            <span className="text-[10px] font-semibold text-[#53697A]">
                {rating}
            </span>
        </div>
    );
}

function FilterButton({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 min-w-[150px] appearance-none rounded-lg border border-[#E1E8EE] bg-white px-4 pl-9 text-[11px] text-[#53697A] outline-none focus:border-[#6F95AD]"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {label}: {option}
                    </option>
                ))}
            </select>

            <ChevronDown
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA0AF]"
            />
        </div>
    );
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconClass,
}: {
    title: string;
    value: number;
    description: string;
    icon: typeof MessageSquare;
    iconClass: string;
}) {
    return (
        <div className="rounded-xl border border-[#E5EBF0] bg-white p-4 shadow-[0_2px_12px_rgba(23,43,58,0.03)]">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-medium text-[#657A8B]">
                        {title}
                    </p>

                    <p className="mt-1 text-[22px] font-extrabold text-[#173B50]">
                        {value}
                    </p>

                    <p className="mt-1 text-[9px] text-[#A0ACB7]">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
                >
                    <Icon size={19}/>
                </div>
            </div>
        </div>
    );
}

export default function ReviewsContent({
    comments,
}: {
    comments: ReviewType[];
}) {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("همه");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedComment, setSelectedComment] =
        useState<ReviewType | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const itemsPerPage = 10;

    const totalComments = comments.length;

    const approvedComments = comments.filter(
        (comment) => comment.status === "approved"
    ).length;

    const pendingComments = comments.filter(
        (comment) => comment.status === "pending"
    ).length;

    const rejectedComments = comments.filter(
        (comment) => comment.status === "rejected"
    ).length;

    const filteredComments = useMemo(() => {
        const value = search.toLowerCase().trim();

        return comments.filter((comment) => {
            const matchesSearch =
                !value ||
                comment._id.toLowerCase().includes(value) ||
                comment.userId.fullName
                    .toLowerCase()
                    .includes(value) ||
                comment.userId.phone.includes(value) ||
                comment.villaId.title
                    .toLowerCase()
                    .includes(value) ||
                comment.comment.toLowerCase().includes(value);

            const matchesStatus =
                statusFilter === "همه" ||
                (statusFilter === "در حال بررسی" &&
                    comment.status === "pending") ||
                (statusFilter === "تأیید شده" &&
                    comment.status === "approved") ||
                (statusFilter === "رد شده" &&
                    comment.status === "rejected");

            return matchesSearch && matchesStatus;
        });
    }, [comments, search, statusFilter]);

    const totalPages = Math.ceil(
        filteredComments.length / itemsPerPage
    );

    const paginatedComments = filteredComments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);
    };

    const handleChangeStatus = async (
        comment: ReviewType,
        status: CommentStatus
    ) => {
        if (isLoading) {
            showCustomToast(
                "خطا",
                "درخواست شما در حال پردازش است",
                "x",
                "error"
            );

            return;
        }

        setIsLoading(true);



        try {
            const response = await fetch(`/api/admin/reviews/${comment._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status
                    }),
                },


            );

            const data = await response.json();

            if (!response.ok) {
                showCustomToast(
                    "خطا",
                    data.message || "تغییر وضعیت نظر انجام نشد.",
                    "x",
                    "error"
                );

                return;
            }

            showCustomToast(
                "موفق",
                data.message || "وضعیت نظر با موفقیت تغییر کرد.",
                "check",
                "success"
            );

            setSelectedComment(null);

            router.refresh();
        } catch (error) {
            console.error(
                "CHANGE REVIEW STATUS ERROR:",
                error
            );

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
                        مدیریت نظرات
                    </h1>

                    <p className="mt-1 text-[12px] text-[#8B9AAA]">
                        مدیریت و بررسی نظرات ثبت شده کاربران
                    </p>
                </div>

                {/* Stats */}

                <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="کل نظرات"
                        value={totalComments}
                        description="تعداد کل نظرات"
                        icon={MessageSquare}
                        iconClass="bg-[#EAF3FF] text-[#2474E8]"
                    />

                    <StatCard
                        title="نظرات در انتظار"
                        value={pendingComments}
                        description="نیازمند بررسی مدیر"
                        icon={Clock3}
                        iconClass="bg-[#FFF5E5] text-[#E7A62D]"
                    />

                    <StatCard
                        title="تأیید شده"
                        value={approvedComments}
                        description="نظرات منتشر شده"
                        icon={Check}
                        iconClass="bg-[#E9F8F2] text-[#159574]"
                    />

                    <StatCard
                        title="رد شده"
                        value={rejectedComments}
                        description="نظرات رد شده"
                        icon={XCircle}
                        iconClass="bg-[#FFF0F0] text-[#EF5350]"
                    />

                </section>

                {/* Filters */}

                <section className="mb-4 rounded-xl border border-[#E8EEF3] bg-white p-3 shadow-[0_2px_12px_rgba(23,43,58,0.03)]">

                    <div className="flex flex-col gap-3 xl:flex-row">

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
                                placeholder="جستجو بر اساس کد نظر، نام کاربر، ویلا، متن نظر یا شماره تلفن..."
                                className="h-11 w-full rounded-lg border border-[#E1E8EE] bg-white pr-10 pl-4 text-[12px] text-[#263D4F] outline-none placeholder:text-[#A7B3BE] focus:border-[#6F95AD]"
                            />

                        </div>

                        <FilterButton
                            label="وضعیت"
                            value={statusFilter}
                            options={[
                                "همه",
                                "در حال بررسی",
                                "تأیید شده",
                                "رد شده",
                            ]}
                            onChange={(value) => {
                                setStatusFilter(value);
                                setCurrentPage(1);
                            }}
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
                                    کد نظر
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    کاربر
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    ویلا
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    نظر
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    امتیاز
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    وضعیت
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    تاریخ
                                </th>

                                <th className="px-4 py-4 text-center text-[11px] font-semibold text-[#657A8B]">
                                    عملیات
                                </th>

                            </tr>
                            </thead>

                            <tbody>

                            {paginatedComments.map((comment) => (
                                <tr
                                    key={comment._id}
                                    className="border-b border-[#F0F3F6] transition hover:bg-[#FBFCFD]"
                                >

                                    {/* ID */}

                                    <td className="px-4 py-4">

                                        <span className="text-[11px] font-bold text-[#173B50]">
                                            #{comment._id.slice(-6)}
                                        </span>

                                        <p className="mt-1 text-[8px] text-[#A5B0BA]">
                                            {formatDate(comment.createdAt)}
                                        </p>

                                    </td>

                                    {/* User */}

                                    <td className="px-4 py-3">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3F7] text-[#60798A]">

                                                {comment.userId.avatar ? (
                                                    <img
                                                        src={comment.userId.avatar}
                                                        alt={comment.userId.fullName}
                                                        className="h-9 w-9 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User size={16}/>
                                                )}

                                            </div>

                                            <div>

                                                <p className="text-[11px] font-bold text-[#253C4D]">
                                                    {comment.userId.fullName}
                                                </p>

                                                <p
                                                    dir="ltr"
                                                    className="mt-1 text-right text-[9px] text-[#A0ACB7]"
                                                >
                                                    {comment.userId.phone}
                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    {/* Villa */}

                                    <td className="max-w-[220px] px-4 py-3">

                                        <p className="truncate text-[11px] font-semibold text-[#334B5D]">
                                            {comment.villaId.title}
                                        </p>

                                    </td>

                                    {/* Comment */}

                                    <td className="max-w-[280px] px-4 py-3">

                                        <p className="truncate text-[10px] text-[#657A8B]">
                                            {comment.comment}
                                        </p>

                                    </td>

                                    {/* Rating */}

                                    <td className="px-4 py-3">
                                        <Rating
                                            rating={comment.rating}
                                        />
                                    </td>

                                    {/* Status */}

                                    <td className="px-4 py-3">

                                        <CommentStatusBadge
                                            status={comment.status}
                                        />

                                    </td>

                                    {/* Date */}

                                    <td className="px-4 py-3">

                                        <span className="text-[9px] text-[#8A9AA8]">
                                            {formatDate(comment.createdAt)}
                                        </span>

                                    </td>

                                    {/* Actions */}

                                    <td className="px-4 py-3">

                                        <div className="flex items-center justify-center gap-1.5">

                                            <button
                                                type="button"
                                                title="مشاهده نظر"
                                                onClick={() =>
                                                    setSelectedComment(
                                                        comment
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4EAF0] text-[#657A8B] transition hover:bg-[#F4F7F9] hover:text-[#173B50]"
                                            >
                                                <Eye size={14}/>
                                            </button>

                                            {comment.status !== "approved" && (
                                                <button
                                                    type="button"
                                                    title="تأیید نظر"
                                                    onClick={() =>
                                                        handleChangeStatus(
                                                            comment,
                                                            "approved"
                                                        )
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4EAF0] text-[#159574] transition hover:bg-[#E9F8F2]"
                                                >
                                                    <Check size={14}/>
                                                </button>
                                            )}

                                            {comment.status !== "rejected" && (
                                                <button
                                                    type="button"
                                                    title="رد نظر"
                                                    onClick={() =>
                                                        handleChangeStatus(
                                                            comment,
                                                            "rejected"
                                                        )
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4EAF0] text-[#EF5350] transition hover:bg-[#FFF0F0]"
                                                >
                                                    <XCircle size={14}/>
                                                </button>
                                            )}

                                        </div>

                                    </td>

                                </tr>
                            ))}

                            {paginatedComments.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-16 text-center"
                                    >
                                        <MessageSquare
                                            size={36}
                                            className="mx-auto mb-3 text-[#C7D0D8]"
                                        />

                                        <p className="text-[11px] text-[#8A9AA8]">
                                            نظری پیدا نشد
                                        </p>
                                    </td>
                                </tr>
                            )}

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
                                از {filteredComments.length} نظر
                            </span>

                        </div>

                        <div className="flex items-center gap-1">

                            <button
                                type="button"
                                onClick={() =>
                                    changePage(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8ED] text-[#6C8191] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={14}/>
                            </button>

                            {Array.from(
                                {
                                    length: Math.min(
                                        totalPages,
                                        5
                                    ),
                                },
                                (_, index) => index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        changePage(page)
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
                                onClick={() =>
                                    changePage(currentPage + 1)
                                }
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8ED] text-[#6C8191] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={14}/>
                            </button>

                        </div>

                    </div>

                </section>

                {/* View Modal */}

                {selectedComment && (
                    <CommentViewModal
                        comment={selectedComment}
                        onClose={() => setSelectedComment(null)}
                        onChangeStatus={handleChangeStatus}
                        isLoading={isLoading}
                    />
                )}

            </div>
        </main>
    );
}

function CommentViewModal({comment, onClose, onChangeStatus, isLoading }: {
    comment: ReviewType;
    onClose: () => void;
    onChangeStatus: (comment: ReviewType, status: CommentStatus) => void;
    isLoading: boolean; }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div
                dir="rtl"
                className="w-full max-w-lg rounded-xl border border-[#E5EBF0] bg-white shadow-[0_10px_40px_rgba(23,43,58,0.12)]"
            >

                {/* Header */}

                <div className="flex items-center justify-between border-b border-[#EDF1F4] px-5 py-4">

                    <div>
                        <h2 className="text-[14px] font-bold text-[#173B50]">
                            جزئیات نظر
                        </h2>

                        <p className="mt-1 text-[10px] text-[#8A9AA8]">
                            مشاهده اطلاعات کامل نظر کاربر
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4EAF0] text-[#657A8B] transition hover:bg-[#F4F7F9]"
                    >
                        <XCircle size={16}/>
                    </button>

                </div>

                {/* Content */}

                <div className="space-y-5 p-5">

                    {/* User */}

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF3F7] text-[#60798A]">

                            {comment.userId.avatar ? (
                                <img
                                    src={comment.userId.avatar}
                                    alt={comment.userId.fullName}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <User size={17}/>
                            )}

                        </div>

                        <div>

                            <p className="text-[12px] font-bold text-[#253C4D]">
                                {comment.userId.fullName}
                            </p>

                            <p
                                dir="ltr"
                                className="mt-1 text-right text-[9px] text-[#A0ACB7]"
                            >
                                {comment.userId.phone}
                            </p>

                        </div>

                    </div>

                    {/* Villa */}

                    <div className="rounded-lg bg-[#F8FAFC] p-3">

                        <p className="mb-1 text-[9px] text-[#9AA8B3]">
                            ویلا
                        </p>

                        <p className="text-[11px] font-semibold text-[#334B5D]">
                            {comment.villaId.title}
                        </p>

                    </div>

                    {/* Rating */}

                    <div className="flex items-center justify-between">

                        <span className="text-[11px] font-semibold text-[#53697A]">
                            امتیاز
                        </span>

                        <div className="flex items-center gap-1">

                            {Array.from(
                                {length: 5},
                                (_, index) => (
                                    <Star
                                        key={index}
                                        size={15}
                                        className={
                                            index <
                                            comment.rating
                                                ? "fill-[#E7A62D] text-[#E7A62D]"
                                                : "text-[#D5DDE3]"
                                        }
                                    />
                                )
                            )}

                        </div>

                    </div>

                    {/* Comment */}

                    <div>

                        <p className="mb-2 text-[11px] font-semibold text-[#53697A]">
                            متن نظر
                        </p>

                        <div className="rounded-lg border border-[#E8EEF3] bg-[#FCFDFE] p-4 text-[11px] leading-7 text-[#657A8B]">
                            {comment.comment}
                        </div>

                    </div>

                     Status

                    <CommentStatusBadge
                        status={comment.status}
                    />

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-2 border-t border-[#EDF1F4] px-5 py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-[#E2E8ED] px-4 py-2 text-[10px] text-[#657A8B] transition hover:bg-[#F5F7F9]"
                    >
                        بستن
                    </button>

                    {comment.status !== "approved" && (
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() =>
                                onChangeStatus(
                                    comment,
                                    "approved"
                                )
                            }
                            className="rounded-md bg-[#173B50] px-4 py-2 text-[10px] text-white transition hover:bg-[#214A61] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            تأیید نظر
                        </button>
                    )}

                    {comment.status !== "rejected" && (
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() =>
                                onChangeStatus(
                                    comment,
                                    "rejected"
                                )
                            }
                            className="rounded-md border border-[#F0D4D4] bg-[#FFF0F0] px-4 py-2 text-[10px] text-[#EF5350] transition hover:bg-[#FFE5E5] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            رد نظر
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}

