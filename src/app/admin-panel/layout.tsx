import React from 'react';
import AdminDashboardSidebar from "@/components/modules/adminPanel/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/modules/adminPanel/AdminDashboardHeader";
import {checkRole} from "@/utility/checkRole";
import {redirect} from "next/navigation";



export default async function Layout({children,}: {
    children: React.ReactNode
}) {

    const {response } = await checkRole(["Admin", "SuperAdmin"]);

    if (response) {
        return redirect("/")
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
