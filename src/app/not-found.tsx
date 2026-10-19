import React from 'react';
import Image from "next/image";
import Link from "next/link";

function NotFound() {
    return (
        <div
            dir="rtl"
            className="relative min-h-screen bg-[var(--surface-secondary)]"
        >
            <div
                className="m-3 grid min-h-[650px]  overflow-hidden rounded-xl  lg:m-8"
            >
                <div
                    className="relative  w-full bg-white p-5 sm:p-8 lg:p-[48px]"
                >
                    <div className={"hidden lg:flex absolute bottom-0 left-0 "}>
                        <Image
                            src={"/assets/notfoundimage.png"}
                            alt={""} width={500} height={500} className={"h-[400px] w-full"} />
                    </div>

                    <div className={"flex flex-col gap-[20px] h-full justify-center items-center w-full lg:w-[50%] "}>
                        <p className={"text-[72px] lg:text-[120px] text-[var(--text-primary)] font-extrabold"}>
                            404
                        </p>
                        <p className={"text-[28px] lg:text-[32px] text-[var(--text-primary)] font-bold"}>
                            صفحه مورد نظر یافت نشد
                        </p>
                        <p className={"text-[16pxpx] text-[var(--text-primary)] text-center w-full lg:w-[500px]"}>
                            متاسفانه صفحه ایی که به دنبال آن هستید وجود ندارد یا ممکن است آدرس ان تغییر کرده باشه
                        </p>

                        <div className={"flex flex-col md:flex-row items-center justify-center  gap-5 mt-5"}>
                            <Link
                                href="/login"
                                className="flex h-[48px] tex w-[200px] items-center justify-center rounded-[10px] border border-[var(--primary)] bg-white px-[16px] py-[24px] text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[#F5F7F8] md:flex"
                            >
                               مشاهده ویلا ها
                            </Link>


                            <Link
                                href="/villas/register"

                                className="flex h-[48px] w-[200px] items-center justify-center rounded-[10px] bg-[var(--primary)] px-[16px] py-[24px] text-[13px] font-medium text-white transition-colors hover:bg-[#2D4658] "
                            >
                                رزرو ویلا
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;