"use client";

import React, {useState} from "react";
import Container from "@/components/modules/layout/container/Container";
import SideBarFilter from "@/components/templates/search/SideBarFilter";
import VillaListCard from "@/components/modules/villa/villacards/VillaListCard";
import {SlidersHorizontal, X} from "lucide-react";

function Page() {
    // const [showFilter, setShowFilter] = useState(false);

    return (
        <div className="min-h-screen bg-[#F5F7F8]">

            {/*<Container className="py-5 sm:py-7 lg:py-8">*/}

            {/*    /!* ================= HEADER ================= *!/*/}
            {/*    <div*/}
            {/*        className="*/}
            {/*            mb-6*/}
            {/*            flex*/}
            {/*            flex-col*/}
            {/*            gap-5*/}
            {/*            sm:mb-8*/}
            {/*            sm:flex-row*/}
            {/*            sm:items-center*/}
            {/*            sm:justify-between*/}
            {/*        "*/}
            {/*    >*/}

            {/*        /!* Title *!/*/}
            {/*        <div>*/}
            {/*            <h1*/}
            {/*                className="*/}
            {/*                    mb-2*/}
            {/*                    text-[24px]*/}
            {/*                    font-bold*/}
            {/*                    text-[var(--text-primary)]*/}
            {/*                    sm:text-[28px]*/}
            {/*                    lg:text-[32px]*/}
            {/*                "*/}
            {/*            >*/}
            {/*                نتایج جستجو*/}
            {/*            </h1>*/}

            {/*            <p*/}
            {/*                className="*/}
            {/*                    text-[13px]*/}
            {/*                    text-[var(--text-secondary)]*/}
            {/*                    sm:text-[14px]*/}
            {/*                "*/}
            {/*            >*/}
            {/*                ۵۲ مورد یافت شد*/}
            {/*            </p>*/}
            {/*        </div>*/}


            {/*        /!* Sort *!/*/}
            {/*        <div className="w-full sm:w-auto">*/}

            {/*            <select*/}
            {/*                defaultValue="popular"*/}
            {/*                className="*/}
            {/*                    h-[42px]*/}
            {/*                    w-full*/}
            {/*                    rounded-[10px]*/}
            {/*                    border*/}
            {/*                    border-[#E1E5E8]*/}
            {/*                    bg-white*/}
            {/*                    px-3*/}
            {/*                    text-[13px]*/}
            {/*                    text-[#45515B]*/}
            {/*                    outline-none*/}
            {/*                    transition*/}
            {/*                    focus:border-[#203140]*/}
            {/*                    sm:w-[180px]*/}
            {/*                "*/}
            {/*            >*/}
            {/*                <option value="popular">*/}
            {/*                    پربازدیدترین*/}
            {/*                </option>*/}

            {/*                <option value="cheap">*/}
            {/*                    ارزان‌ترین*/}
            {/*                </option>*/}

            {/*                <option value="expensive">*/}
            {/*                    گران‌ترین*/}
            {/*                </option>*/}

            {/*                <option value="rating">*/}
            {/*                    بالاترین امتیاز*/}
            {/*                </option>*/}

            {/*                <option value="newest">*/}
            {/*                    جدیدترین*/}
            {/*                </option>*/}
            {/*            </select>*/}

            {/*        </div>*/}

            {/*    </div>*/}


            {/*    /!* ================= MOBILE FILTER BUTTON ================= *!/*/}

            {/*    <button*/}
            {/*        onClick={() => setShowFilter(true)}*/}
            {/*        className="*/}
            {/*            mb-5*/}
            {/*            flex*/}
            {/*            h-[44px]*/}
            {/*            w-full*/}
            {/*            items-center*/}
            {/*            justify-center*/}
            {/*            gap-2*/}
            {/*            rounded-[10px]*/}
            {/*            border*/}
            {/*            border-[#E1E5E8]*/}
            {/*            bg-white*/}
            {/*            text-[13px]*/}
            {/*            font-medium*/}
            {/*            text-[#45515B]*/}
            {/*            transition*/}
            {/*            hover:bg-[#F9FAFB]*/}
            {/*            lg:hidden*/}
            {/*        "*/}
            {/*    >*/}
            {/*        <SlidersHorizontal size={17}/>*/}

            {/*        فیلترها*/}
            {/*    </button>*/}


            {/*    /!* ================= CONTENT ================= *!/*/}

            {/*    <div*/}
            {/*        className="*/}
            {/*            flex*/}
            {/*            flex-col*/}
            {/*            gap-6*/}
            {/*            lg:flex-row*/}
            {/*            lg:items-start*/}
            {/*            lg:gap-7*/}
            {/*            xl:gap-8*/}
            {/*        "*/}
            {/*    >*/}

            {/*        /!* ================= DESKTOP FILTER ================= *!/*/}

            {/*        <aside*/}
            {/*            className="*/}
            {/*                hidden*/}
            {/*                w-full*/}
            {/*                shrink-0*/}
            {/*                lg:block*/}
            {/*                lg:w-[250px]*/}
            {/*                xl:w-[280px]*/}
            {/*            "*/}
            {/*        >*/}
            {/*            <div className="lg:sticky lg:top-6">*/}
            {/*                <SideBarFilter/>*/}
            {/*            </div>*/}
            {/*        </aside>*/}


            {/*        /!* ================= VILLA CARDS ================= *!/*/}

            {/*        <main className="min-w-0 flex-1">*/}
            {/*            <VillaListCard />*/}
            {/*        </main>*/}

            {/*    </div>*/}

            {/*</Container>*/}


            {/* ================= MOBILE FILTER DRAWER ================= */}

            {/*{showFilter && (*/}
            {/*    <div*/}
            {/*        className="*/}
            {/*            fixed*/}
            {/*            inset-0*/}
            {/*            z-50*/}
            {/*            lg:hidden*/}
            {/*        "*/}
            {/*    >*/}

            {/*        /!* Overlay *!/*/}
            {/*        <div*/}
            {/*            onClick={() => setShowFilter(false)}*/}
            {/*            className="*/}
            {/*                absolute*/}
            {/*                inset-0*/}
            {/*                bg-black/40*/}
            {/*            "*/}
            {/*        />*/}


            {/*        /!* Drawer *!/*/}
            {/*        <div*/}
            {/*            className="*/}
            {/*                absolute*/}
            {/*                right-0*/}
            {/*                top-0*/}
            {/*                h-full*/}
            {/*                w-[90%]*/}
            {/*                max-w-[380px]*/}
            {/*                overflow-y-auto*/}
            {/*                bg-[#F5F7F8]*/}
            {/*                p-4*/}
            {/*                shadow-2xl*/}
            {/*                sm:w-[380px]*/}
            {/*            "*/}
            {/*        >*/}

            {/*            /!* Drawer Header *!/*/}
            {/*            <div*/}
            {/*                className="*/}
            {/*                    mb-4*/}
            {/*                    flex*/}
            {/*                    items-center*/}
            {/*                    justify-between*/}
            {/*                    rounded-[12px]*/}
            {/*                    bg-white*/}
            {/*                    p-4*/}
            {/*                "*/}
            {/*            >*/}
            {/*                <h2 className="text-[16px] font-bold text-[#172B3A]">*/}
            {/*                    فیلترها*/}
            {/*                </h2>*/}

            {/*                <button*/}
            {/*                    onClick={() => setShowFilter(false)}*/}
            {/*                    className="*/}
            {/*                        flex*/}
            {/*                        h-[36px]*/}
            {/*                        w-[36px]*/}
            {/*                        items-center*/}
            {/*                        justify-center*/}
            {/*                        rounded-full*/}
            {/*                        text-[#66727D]*/}
            {/*                        transition*/}
            {/*                        hover:bg-[#F1F3F5]*/}
            {/*                    "*/}
            {/*                >*/}
            {/*                    <X size={19}/>*/}
            {/*                </button>*/}
            {/*            </div>*/}


            {/*            /!* Filter *!/*/}
            {/*            <SideBarFilter/>*/}

            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

        </div>
    );
}

export default Page;