import {
    CheckCircle2,
    Clock3,
    MessageSquare,
    Search,
    Star,
} from "lucide-react";
import {getCurrentUser} from "@/utility/getCurrentUser";
import review from "@/models/Review";
import {ReviewType} from "@/types/Review";


const statusConfig = {
    published: {
        label: "منتشر شده",
        className: "bg-green-50 text-green-600",
    },
    pending: {
        label: "در انتظار بررسی",
        className: "bg-yellow-50 text-yellow-600",
    },
};

export default async function Page() {
    const user = await getCurrentUser();

    const userId = user._id;

    const reviews : ReviewType[] = await review.find({userId}).lean();


    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-7">
                <h1 className="text-xl font-bold text-[#17334d] sm:text-2xl">
                    کامنت‌های من
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    نظرات و امتیازهایی که برای ویلاهای رزرو شده ثبت کرده‌اید.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Total */}
                <div className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400">
                                مجموع نظرات
                            </p>

                            <p className="mt-3 text-2xl font-bold text-[#17334d]">
                                {reviews.length}
                            </p>
                        </div>

                        <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-[#f2f5f7] text-[#17334d]">
                            <MessageSquare size={21} />
                        </div>
                    </div>
                </div>

                {/* Published */}
                <div className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400">
                                منتشر شده
                            </p>

                            <p className="mt-3 text-2xl font-bold text-green-600">
                                3
                            </p>
                        </div>

                        <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-green-50 text-green-600">
                            <CheckCircle2 size={21} />
                        </div>
                    </div>
                </div>

                {/* Pending */}
                <div className="rounded-[14px] border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400">
                                در انتظار بررسی
                            </p>

                            <p className="mt-3 text-2xl font-bold text-yellow-600">
                               2
                            </p>
                        </div>

                        <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-yellow-50 text-yellow-600">
                            <Clock3 size={21} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <section className="mt-6 overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-[#17334d]">
                                لیست نظرات
                            </h2>

                            <p className="mt-2 text-xs text-gray-400">
                                تاریخچه کامنت‌هایی که ثبت کرده‌اید
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
                                    placeholder="جستجوی نظر..."
                                    className="h-[42px] w-full rounded-[9px] border border-gray-200 bg-white pr-10 pl-4 text-xs text-[#17334d] outline-none transition focus:border-[#d9a13b] sm:w-[220px]"
                                />
                            </div>

                            {/* Filter */}
                            <select
                                className="h-[42px] rounded-[9px] border border-gray-200 bg-white px-4 text-xs text-[#566575] outline-none focus:border-[#d9a13b]"
                            >
                                <option value="all">
                                    همه وضعیت‌ها
                                </option>

                                <option value="published">
                                    منتشر شده
                                </option>

                                <option value="pending">
                                    در انتظار بررسی
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="divide-y divide-gray-100">
                    {reviews.length > 0 ? (
                        reviews.map((review) => {
                            // const status =
                            //     statusConfig[review.status];

                            return (
                                <article
                                    key={review._id}
                                    className="px-5 py-6 sm:px-7"
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            {/* Top */}
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="text-sm font-bold text-[#17334d]">
                                                        {review.villaId.title}
                                                    </h3>

                                                    <p className="mt-2 text-[11px] text-gray-400">
                                                        {new Date(review.createdAt).toLocaleString("fa-IR")}
                                                    </p>
                                                </div>

                                                {/*<span*/}
                                                {/*    className={`rounded-[8px] px-3 py-2 text-[11px] font-medium ${status.className}`}*/}
                                                {/*>*/}
                                                {/*    {status.label}*/}
                                                {/*</span>*/}
                                            </div>

                                            {/* Rating */}
                                            <div className="mt-4 flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map(
                                                    (star) => (
                                                        <Star
                                                            key={star}
                                                            size={17}
                                                            fill={
                                                                star <=
                                                                review.rating
                                                                    ? "#f4b740"
                                                                    : "transparent"
                                                            }
                                                            className={
                                                                star <=
                                                                review.rating
                                                                    ? "text-[#f4b740]"
                                                                    : "text-gray-200"
                                                            }
                                                        />
                                                    )
                                                )}

                                                <span className="mr-2 text-xs text-gray-400">
                                                    {review.rating} از ۵
                                                </span>
                                            </div>

                                            {/* Comment */}
                                            <div className="mt-4 rounded-[12px] bg-[#f8f9fb] p-4">
                                                <p className="text-sm leading-7 text-[#566575]">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f2f5f7] text-[#17334d]">
                                <MessageSquare size={26} />
                            </div>

                            <h3 className="mt-5 text-sm font-bold text-[#17334d]">
                                نظری پیدا نشد
                            </h3>

                            <p className="mt-2 text-xs text-gray-400">
                                هنوز نظری مطابق با جستجوی شما وجود ندارد.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}