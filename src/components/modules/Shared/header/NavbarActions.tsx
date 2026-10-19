"use client"

import React, {useEffect, useState} from 'react';
import Link from "next/link";
import {ChevronDown, ChevronUp} from "lucide-react";
import DropDownMenu from "@/components/modules/Shared/header/DropDownMenu";


type User = {
    _id: string;
    fullName: string;
};

interface NavbarActionsProps {
    user: User | null;
}

function NavbarActions({user}: NavbarActionsProps) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex gap-2">
            {
                user ?
                    (

                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(!isOpen);
                                }}
                                className="flex h-[44px] w-[200px] items-center justify-between gap-2 rounded-[10px] border border-[var(--primary)] bg-white px-[16px] py-[24px] text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[#F5F7F8]"
                            >
                                <span className={"line-clamp-1"}>{user.fullName || "کاربر"}</span>

                                {isOpen ? <ChevronUp/> : <ChevronDown/>}

                            </button>
                            <DropDownMenu setIsOpen = {setIsOpen} isOpen={isOpen} user={user}/>

                        </>

                    )
                    :
                    (
                        <Link
                            href="/login"
                            className="hidden h-[44px] items-center justify-center rounded-[10px] border border-[var(--primary)] bg-white px-[16px] py-[24px] text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[#F5F7F8] md:flex"
                        >
                            ورود
                        </Link>

                    )

            }


            <Link
                href="/villas/register"
                className="hidden h-[44px] items-center justify-center rounded-[10px] bg-[var(--primary)] px-[16px] py-[24px] text-[13px] font-medium text-white transition-colors hover:bg-[#2D4658] md:flex"
            >
                رزرو ویلا
            </Link>
        </div>
    );
}

export default NavbarActions;