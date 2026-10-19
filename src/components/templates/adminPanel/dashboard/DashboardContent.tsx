import {
    CalendarDays,
    Home,
    UserRound,
    WalletCards,
} from "lucide-react";
import BookingStatusChart from "@/components/templates/adminPanel/dashboard/charts/BookingStatusChart";
import RevenueChart from "@/components/templates/adminPanel/dashboard/charts/RevenueChart";
import {BookingType} from "@/types/Booking";
import RecentBookings from "@/components/templates/adminPanel/dashboard/RecentBookings";
import StatCard, {StatItem} from "@/components/modules/adminPanel/StateCard/StateCartDashboard";

type DashboardProps = {
    villaCount: number,
    userCount: number,
    bookings: BookingType[]
}


export default function DashboardContent({villaCount, userCount, bookings}: DashboardProps) {


    const stats: StatItem[] = [
        {
            title: "تعداد ویلاها",
            value: `${villaCount}`,
            unit: "ویلا",
            percent: "+۵.۳٪",
            icon: Home,
            iconBg: "bg-[#f4efff]",
            iconColor: "text-[#7c4dff]",
            badgeBg: "bg-[#f4efff]",
            line: "M0 35 L18 23 L35 32 L52 16 L70 28 L88 10 L105 22 L125 4",
        },
        {
            title: "کاربران جدید",
            value: `${userCount}`,
            unit: "کاربر",
            percent: "+۱۵.۷٪",
            icon: UserRound,
            iconBg: "bg-[#fff5e8]",
            iconColor: "text-[#ff921f]",
            badgeBg: "bg-[#fff5e8]",
            line: "M0 35 L18 34 L30 24 L42 30 L56 16 L72 26 L88 10 L104 18 L125 2",
        },
        {
            title: "کل رزروها",
            value: `${bookings.length}`,
            unit: "رزرو",
            percent: "+۸.۳٪",
            icon: CalendarDays,
            iconBg: "bg-[#edf5ff]",
            iconColor: "text-[#2675ef]",
            badgeBg: "bg-[#edf5ff]",
            line: "M0 36 L18 24 L35 34 L52 18 L70 27 L88 13 L104 23 L116 5 L125 5",
        },
        {
            title: "کل درآمد",
            value: "۲,۴۸۵,۶۰۰,۰۰۰",
            unit: "تومان",
            percent: "+۱۲.۵٪",
            icon: WalletCards,
            iconBg: "bg-[#edf9f3]",
            iconColor: "text-[#20a66a]",
            badgeBg: "bg-[#edf9f3]",
            line: "M0 37 L18 28 L32 32 L48 18 L64 27 L82 15 L99 28 L110 17 L125 7",
        },
    ];

    return (
        <main
            dir="rtl"
            className="min-h-[calc(100vh-100px)] bg-[#fcfdff] p-6 lg:p-8"
        >
            Stats
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <StatCard
                        key={item.title}
                        {...item}
                    />
                ))}
            </section>

            {/* Charts */}
            <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr]">

                <BookingStatusChart/>

                <RevenueChart/>
            </section>

            {/* Bookings */}
            <section className="mt-5">
                <RecentBookings bookings={JSON.parse(JSON.stringify(bookings))}/>
            </section>
        </main>
    );
}