import React from 'react';
import WhyUsCard from "@/components/modules/whyuscard/WhyUsCard";
import Container from "@/components/modules/layout/container/Container";
import {
    House,
    BadgeCheck,
    Headphones,
    FileText,
} from "lucide-react";
function WhyUs() {
    const features = [
        {
            title: "تنوع بالای ویلاها",
            description: "از بین صدها ویلای متنوع، بهترین گزینه را انتخاب کنید",
            icon: House,
        },
        {
            title: "رزرو آسان و سریع",
            description: "در چند مرحله ساده ویلای مورد نظر خود را رزرو کنید",
            icon: BadgeCheck,
        },
        {
            title: "پشتیبانی ۲۴ ساعته",
            description: "ما همیشه کنار شما هستیم",
            icon: Headphones,
        },
        {
            title: "قیمت‌های شفاف",
            description: "بدون هزینه‌های پنهان، قیمت نهایی را مشاهده کنید",
            icon: FileText,
        },
    ];
    return (
            <div className={"w-full mx-auto"}>
                <div>
                    <h2 className={"text-[20px] font-bold"}>چرا ویلا روم؟</h2>
                </div>
                <div className={"grid grid-cols-1 md:grid-cols-2   lg:grid-cols-4 gap-[24px] mx-auto mt-[32px]"}>
                    {
                        features.map((item) => (
                            <WhyUsCard key={item.title} title={item.title} description={item.description} Icon = {item.icon}/>
                        ))
                    }
                </div>
            </div>
    );
}

export default WhyUs;