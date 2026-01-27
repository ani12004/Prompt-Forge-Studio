"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    valueDisplay?: string | number
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, label, valueDisplay, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {(label || valueDisplay) && (
                    <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                        {label && <span>{label}</span>}
                        {valueDisplay && <span className="font-mono text-brand-purple">{valueDisplay}</span>}
                    </div>
                )}
                <div className="relative flex items-center w-full h-4 group">
                    {/* Track */}
                    <div className="absolute w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-purple rounded-full transition-all duration-100"
                            style={{ width: `${((Number(props.value) - Number(props.min || 0)) / (Number(props.max || 100) - Number(props.min || 0))) * 100}%` }}
                        />
                    </div>

                    {/* Native Input (Hidden but functional) */}
                    <input
                        type="range"
                        ref={ref}
                        className={cn(
                            "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
                            className
                        )}
                        {...props}
                    />

                    {/* Thumb Mockup (Follows visual logic if we wanted JS control, but for now relying on native input for interaction and simplified visual track) */}
                    {/* Note: Fully custom thumb tracking requires JS state synced to mouse. 
                        For simplicity and robustness, we'll use standard appearance-none input styling or just rely on the native input behavior being invisible on top of the visual track. 
                        Actually, improving the native input styling is better. */}

                    <style jsx>{`
                        input[type=range]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            height: 16px;
                            width: 16px;
                            border-radius: 50%;
                            background: white;
                            cursor: pointer;
                            margin-top: -6px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
                            box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
                            border: 2px solid rgba(124, 58, 237, 1);
                        }
                         input[type=range]::-moz-range-thumb {
                            height: 16px;
                            width: 16px;
                            border-radius: 50%;
                            background: white;
                            cursor: pointer;
                            border: 2px solid rgba(124, 58, 237, 1);
                             box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
                        }
                    `}</style>
                </div>
            </div>
        )
    }
)
Slider.displayName = "Slider"
