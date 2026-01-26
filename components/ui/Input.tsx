import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, id, ...props }, ref) => {
        const inputId = id || React.useId()

        return (
            <div className="relative group">
                <input
                    type={type}
                    id={inputId}
                    className={cn(
                        "peer block w-full rounded-xl border border-white/10 bg-white/5 px-4 pb-2 pt-6 text-sm text-white focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple disabled:cursor-not-allowed disabled:opacity-50 transition-all placeholder-transparent",
                        className
                    )}
                    placeholder={label}
                    ref={ref}
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className="pointer-events-none absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-sm text-gray-400 duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-brand-purple"
                >
                    {label}
                </label>
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
