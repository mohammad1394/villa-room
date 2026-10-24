import {AlertCircle} from "lucide-react";

export function Field({
                   id,
                   label,
                   error,
                   children,
                   className = "",
               }: {
    id: string;
    label: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={className}>
            <label
                htmlFor={`f-${id}`}
                className="mb-2 block text-xs font-semibold text-[var(--text-primary)]"
            >
                {label}

                <span className="mr-1 text-[#B42318]">
                    *
                </span>
            </label>

            {children}

            {error && (
                <p
                    id={`f-${id}-err`}
                    className="mt-1.5 flex items-center gap-1.5 text-xs text-[#B42318]"
                >
                    <AlertCircle size={13}/>
                    {error}
                </p>
            )}
        </div>
    );
}