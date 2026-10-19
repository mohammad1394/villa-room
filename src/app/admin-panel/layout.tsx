import React from 'react';
import {getCurrentUser} from "@/utility/getCurrentUser";
import {redirect} from "next/navigation";
import AdminDashboardSidebar from "@/components/modules/adminPanel/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/modules/adminPanel/AdminDashboardHeader";
import {UserType} from "@/types/User";


export default async function Layout({children,}: {
    children: React.ReactNode
}) {

    const user : UserType = await getCurrentUser();

    if (!user || user.role !== "Admin") {
        return redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#f8f9fb]">
            <AdminDashboardSidebar />

            <div className="min-h-screen lg:mr-[280px]">
                <AdminDashboardHeader />

                <main className="w-[95%] mx-auto my-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
