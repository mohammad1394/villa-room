import {ChevronDown} from "lucide-react";

export function FilterButton({
                          label,
                          value,
                          options,
                          onChange,
                      }: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}) {
    return (
        <div className="relative min-w-[160px]">

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-[#E1E8EE] bg-white px-4 pl-9 text-[11px] text-[#53697A] outline-none focus:border-[#6F95AD]"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {label}: {option}
                    </option>
                ))}
            </select>

            <ChevronDown
                size={14}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#8EA0AF]"
            />

        </div>
    );
}