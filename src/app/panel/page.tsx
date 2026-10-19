import UserDashboardHeader from "@/components/modules/userPanel/UserDashboardHeader";
import DashboardVillaCard from "@/components/templates/panel/DashboardVillaCard";
import DashboardProfile from "@/components/templates/panel/DashboardProfile";
import DashboardStats from "@/components/templates/panel/DashboardStats";
import RecentMessages from "@/components/templates/panel/RecentMessages";
import RecentBookings from "@/components/templates/panel/RecentBookings";
import WelcomeSection from "@/components/templates/panel/WelcomeSection";
import {getCurrentUser} from "@/utility/getCurrentUser";
import {redirect} from "next/navigation";


export default async function DashboardPage() {

    const user = await getCurrentUser();

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#fafbfc]"
        >


            {/* Main */}
            <main
                className="
                    min-h-screen

                "
            >
                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1250px]
                        px-4

                        sm:px-6
                        lg:px-8
                    "
                >

                    {/* Welcome */}
                    <div className="mt-7">
                        <WelcomeSection name = {user.fullName}/>
                    </div>

                    {/* Hero */}
                    <div
                        className="
                            mt-6
                            grid
                            grid-cols-1
                            gap-4
                            xl:grid-cols-[1fr_1.7fr]
                        "
                    >
                        <DashboardProfile date = {user.createdAt} avatar = {user.avatar} name = {user.fullName}/>


                        <DashboardVillaCard />


                    </div>

                    {/* Stats */}
                    <div className="mt-5">
                        <DashboardStats />
                    </div>

                    {/* Bottom */}
                    <div
                        className="
                            mt-5
                            grid
                            grid-cols-1
                            gap-5
                            xl:grid-cols-[1.65fr_1fr]
                        "
                    >
                        <RecentBookings />

                        <RecentMessages />
                    </div>
                </div>
            </main>
        </div>
    );
}