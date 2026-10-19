"use client";

import {useMemo, useState} from "react";
import {
    Ban,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Eye, Filter,
    MoreHorizontal,
    Search,
    ShieldCheck,
    ShieldOff, Trash, User,
    UserRound,
    Users,
    UserX,
} from "lucide-react";
import {UserType} from "@/types/User";
import {StatCardUsers} from "@/components/modules/adminPanel/StateCard/StateCartUsers";
import {FilterUsers} from "@/components/templates/adminPanel/users/FilterUsers";
import UserInfoModal from "@/components/templates/adminPanel/users/UserInfoModal";
import BanUserModal from "@/components/templates/adminPanel/users/BanUserModal";
import user from "@/models/User";
import UnbanUserModal from "@/components/templates/adminPanel/users/UnBanUserModal";



export default function UsersConent({users}: { users: UserType[] }) {

    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editUserModalOpen, setEditUserModalOpen] = useState(false);
    const [banUserModalOpen, setBannedUserModalOpen] = useState(false);
    const [unBannedUserModalOpen, setUnBannedUserModalOpen] = useState(false);

    const activeUserCount = () => {
        return users.filter(user => user.status === "active").length;
    };

    const adminUserCount = () => {
        return users.filter(user => user.role === "Admin").length;
    };

    const blockedUserCount = () => {
        return users.filter(user => user.status === "blocked").length;
    };



    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const value = search.toLowerCase();

            return (
                user.fullName.toLowerCase().includes(value) ||
                user.email.toLowerCase().includes(value) ||
                user.phone.includes(value)
            );
        });
    }, [users ,  search]);


    const toggleUser = (id: string) => {
        setSelectedUsers((prev) =>
            prev.includes(id)
                ? prev.filter((userId) => userId !== id)
                : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map((user) => user._id));
        }
    };


    const diffrentTime = (time : string) => {
        const diff = Date.now() - new Date(time).getTime()

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        return days;

    }

    const handleShowUser = (user: UserType) => {
        setSelectedUser(user);
        setEditUserModalOpen(true);
    };

    // const handleDeleteUser = async () => {
    //     const res = await fetch(`/api/user/${user._id}`, {
    //         method: "DELETE",
    //     })
    // }
    const handleBanUser = (user : UserType) =>  {
        setSelectedUser(user);
        setBannedUserModalOpen(true);
    }

    const handleUnBanUser= (user : UserType) =>  {
        setSelectedUser(user);
        setUnBannedUserModalOpen(true);
    }


    return (
        <main
            dir="rtl"
            className="min-h-screen w-full bg-[#F8FAFC] p-4 font-[Vazirmatn] sm:p-5"
        >
            <div className="mx-auto ">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[22px] font-extrabold text-[#172B3A]">
                            مدیریت کاربران
                        </h1>

                        <p className="mt-1 text-[12px] text-[#8B9AAA]">
                            مدیریت کاربران، نقش‌ها و وضعیت حساب‌ها
                        </p>
                    </div>

                    <button
                        type="button"
                        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#173B50] px-5 text-[13px] font-semibold text-white transition hover:bg-[#102F42]"
                    >
                        <span className="text-[18px] leading-none">+</span>
                        افزودن کاربر
                    </button>
                </div>

                {/* Stats */}
                <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCardUsers
                        title="کل کاربران"
                        value= {users.length}
                        description="۱۱۰٪ از ماه گذشته"
                        icon={Users}
                        iconClass="bg-[#EAF3FF] text-[#2474E8]"
                    />

                    <StatCardUsers
                        title="کاربران فعال"
                        value={activeUserCount()}
                        description="۹۴.۶٪ از کل کاربران"
                        icon={UserRound}
                        iconClass="bg-[#E9F8F3] text-[#139C78]"
                    />

                    <StatCardUsers
                        title="کاربران ادمین"
                        value={adminUserCount()}
                        description="۱.۲٪ از کل کاربران"
                        icon={ShieldCheck}
                        iconClass="bg-[#F0EAFE] text-[#8159DD]"
                    />

                    <StatCardUsers
                        title="کاربران مسدود شده"
                        value={blockedUserCount()}
                        description="۲.۳٪ از کل کاربران"
                        icon={UserX}
                        iconClass="bg-[#FFF0F0] text-[#EF5350]"
                    />
                </section>

                {/* Filters */}
                <section
                    className="mb-4 rounded-xl border border-[#E8EEF3] bg-white p-3 shadow-[0_2px_12px_rgba(23,43,58,0.03)]">
                    <div className="flex flex-col gap-3 xl:flex-row">

                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8EA0AF]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="جستجو بر اساس نام، ایمیل یا شماره تلفن..."
                                className="h-11 w-full rounded-lg border border-[#E1E8EE] bg-white pr-10 pl-4 text-[12px] text-[#263D4F] outline-none placeholder:text-[#A7B3BE] focus:border-[#6F95AD]"
                            />
                        </div>

                        <FilterUsers
                            label="نقش"
                            value="همه"
                        />

                        <FilterUsers
                            label="وضعیت"
                            value="همه"
                        />

                        <FilterUsers
                            label="مرتب‌سازی"
                            value="جدیدترین"
                        />
                    </div>
                </section>

                {/* Table */}
                <section
                    className="overflow-hidden rounded-xl border border-[#E5EBF0] bg-white shadow-[0_2px_12px_rgba(23,43,58,0.03)]">

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1050px] border-collapse">

                            <thead>
                            <tr className="border-b border-[#EDF1F4] bg-[#FCFDFE] text-right">
                                <th className="w-[50px] px-4 py-4">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredUsers.length > 0 &&
                                            selectedUsers.length ===
                                            filteredUsers.length
                                        }
                                        onChange={toggleAll}
                                        className="h-4 w-4 accent-[#173B50]"
                                    />
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    کاربر
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    ایمیل
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    شماره تلفن
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    نقش
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    وضعیت
                                </th>

                                <th className="px-4 py-4 text-[11px] font-semibold text-[#657A8B]">
                                    تاریخ عضویت
                                </th>

                                <th className="px-4 py-4 text-center text-[11px] font-semibold text-[#657A8B]">
                                    عملیات
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user._id}
                                    className="border-b border-[#F0F3F6] transition hover:bg-[#FBFCFD]"
                                >
                                    {/* Checkbox */}
                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes((user._id)
                                            )}
                                            onChange={() =>
                                                toggleUser(user._id)
                                            }
                                            className="h-4 w-4 accent-[#173B50]"
                                        />
                                    </td>

                                    {/* User */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {user?.avatar ?
                                                (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.fullName}
                                                        className="h-9 w-9 rounded-full object-cover"
                                                    />
                                                ) :
                                                (
                                                    <User/>
                                                )
                                            }

                                            <div>
                                                <p className="text-[12px] font-bold text-[#253C4D]">
                                                    {user.fullName}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="px-4 py-3 text-[10px] text-[#718596]">
                                        {user.email}
                                    </td>

                                    {/* Phone */}
                                    <td
                                        dir="ltr"
                                        className="px-4 py-3 text-right text-[10px] text-[#718596]"
                                    >
                                        {user.phone}
                                    </td>

                                    {/* Role */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-medium ${
                                                user.role === "Admin"
                                                    ? "bg-[#F0EAFE] text-[#7855D1]"
                                                    : "bg-[#EAF3FF] text-[#397DD0]"
                                            }`}
                                        >
                                            {user.role === "Admin" ?
                                                "ادمین"
                                                :
                                                "کاربر"}

                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium ${
                                                user.status === "active"
                                                    ? "bg-[#E9F8F2] text-[#159574]"
                                                    : "bg-[#FFF0F0] text-[#EF5350]"
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    user.status === "active"
                                                        ? "bg-[#18B488]"
                                                        : "bg-[#EF5350]"
                                                }`}
                                            />

                                            {user.status === "active" ? "فعال" : "مسدود"}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="px-4 py-3">
                                        <p className="text-[10px] text-[#667C8D]">
                                            {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                                        </p>

                                        <p className="mt-0.5 text-[8px] text-[#A6B1BB]">
                                            روز پیش :  {diffrentTime(user.createdAt)}
                                        </p>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1.5">

                                            <button
                                                title="حذف"
                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4EAF0] text-[#657A8B] transition hover:bg-[#F4F7F9] hover:text-[#173B50]"
                                            >
                                                <Trash size={14} color={"red"}/>
                                            </button>

                                            <button
                                                title="ویرایش"
                                                onClick={() => handleShowUser(user)}
                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4EAF0] text-[#657A8B] transition hover:bg-[#F4F7F9] hover:text-[#173B50]"
                                            >
                                                <Edit3 size={14}/>
                                            </button>



                                            <button
                                                title={
                                                    user.status === "active"
                                                        ? "مسدود کردن"
                                                        : "فعال کردن"
                                                }
                                                onClick={() => {
                                                    if (user.status === "active") {
                                                        handleBanUser(user);
                                                    }if(user.status === "blocked") handleUnBanUser(user);
                                                }}
                                                className={`flex h-8 w-8 items-center justify-center rounded-md border transition ${
                                                    user.status === "blocked"
                                                        ? "border-[#F0E0E0] text-[#EF5350] hover:bg-[#FFF4F4]"
                                                        : "border-[#D9EEE7] text-[#159574] hover:bg-[#EFFAF6]"
                                                }`}
                                            >
                                                {user.status === "blocked" ? (
                                                    <Ban size={14}/>
                                                ) : (
                                                    <Check size={14}/>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div
                        className="flex flex-col gap-4 border-t border-[#EDF1F4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

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
                                از ۵۰۹ کاربر
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


                        </div>
                    </div>
                </section>
            </div>


            <UserInfoModal user={selectedUser} isOpen={editUserModalOpen} onClose={() => setEditUserModalOpen(false)}/>
            <BanUserModal
                user={selectedUser}
                isOpen={banUserModalOpen}
                onClose={() => setBannedUserModalOpen(false)}
            />
            <UnbanUserModal user={selectedUser} isOpen={unBannedUserModalOpen} onClose={() => setUnBannedUserModalOpen(false)}/>
        </main>
    );
}