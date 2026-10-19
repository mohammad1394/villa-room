import {Home} from "lucide-react";

export function StateCardVilla({
                      title,
                      value,
                      description,
                      icon: Icon,
                      iconClass,
                  }: {
    title: string;
    value: string;
    description: string;
    icon: typeof Home;
    iconClass: string;
}) {
    return (
        <div className="flex min-h-[118px] flex-1 items-center justify-between rounded-xl border border-[#E8EEF3] bg-white px-5 py-4 shadow-[0_2px_12px_rgba(23,43,58,0.03)]">
            <div className="flex h-full flex-col justify-between">
                <p className="text-[13px] font-medium text-[#52677A]">
                    {title}
                </p>

                <div>
                    <p className="text-[25px] font-extrabold text-[#172B3A]">
                        {value}
                    </p>

                    <p className="mt-1 text-[10px] text-[#9AAABA]">
                        {description}
                    </p>
                </div>
            </div>

            <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
            >
                <Icon size={21} strokeWidth={1.8} />
            </div>
        </div>
    );
}
