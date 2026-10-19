import React from 'react';
import {LucideIcon, RotateCcwClock} from "lucide-react";

type Props = {
    title: string,
    description: string,
    Icon: LucideIcon;
}
function WhyUsCard({title , description , Icon} : Props) {
    return (
        <div className={" h-[150px] w-full rounded-[16px] shadow-me flex flex-col items-center justify-center gap-5"}>
            <div>
                <Icon
                    size={32}
                    strokeWidth={1.8}
                    className="text-[#22A06B]"
                />
            </div>
            <div className={"flex flex-col items-center gap-2"}>
                <p className={"text-"}>
                    {title}
                </p>
                <p className={"text-gray-600 text-[11px] lg:text-[13px]"}>
                    {description}
                </p>
            </div>
        </div>
    );
}

export default WhyUsCard;