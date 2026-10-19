export function StateCardTickets({
                      title,
                      value,
                      description,
                      icon: Icon,
                      iconClass,
                  }: {
    title: string;
    value: number;
    description: string;
    icon: React.ElementType;
    iconClass: string;
}) {
    return (
        <div className="rounded-xl border border-[#E8EEF3] bg-white p-4 shadow-[0_2px_12px_rgba(23,43,58,0.03)]">

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-[11px] font-medium text-[#7C8E9D]">
                        {title}
                    </p>

                    <p className="mt-2 text-[22px] font-extrabold text-[#173B50]">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
                >
                    <Icon size={18}/>
                </div>

            </div>

            <p className="mt-3 text-[9px] text-[#9AA8B3]">
                {description}
            </p>

        </div>
    );
}