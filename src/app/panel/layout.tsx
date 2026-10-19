import React from 'react';

import UserDashboardSidebar from "@/components/modules/userPanel/UserDashboardSidebar";
import UserDashboardHeader from "@/components/modules/userPanel/UserDashboardHeader";
import {getCurrentUser} from "@/utility/getCurrentUser";
import {redirect} from "next/navigation";

export default async function Layout({children,}: {
    children: React.ReactNode
}) {

    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }
    return (
        <div className="min-h-screen bg-[#f8f9fb]">
            <UserDashboardSidebar />

            <div className="min-h-screen lg:mr-[280px]">
                <UserDashboardHeader />

                <main className="w-[95%] mx-auto my-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
