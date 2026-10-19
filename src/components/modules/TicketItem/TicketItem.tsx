export default function TicketItem({
                      icon,
                      label,
                      value,
                  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm"
            >
                {icon}
            </div>

            <div>
                <p className="text-[11px] text-gray-400">
                    {label}
                </p>

                <p className="mt-0.5 text-xs font-medium text-gray-700">
                    {value}
                </p>
            </div>
        </div>
    );
}