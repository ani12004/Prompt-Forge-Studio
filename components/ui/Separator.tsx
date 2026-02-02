"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simple implementation without radix dependency to avoid install if not needed, 
// or standard div implementation if radix is not installed.
// Assuming we entered standard shadcn-like code, but I'll make it dependency-free for speed 
// unless I check package.json. User said "fix this", simple is better.

const Separator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(
    (
        { className, orientation = "horizontal", ...props },
        ref
    ) => (
        <div
            ref={ref}
            className={cn(
                "shrink-0 bg-border",
                orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                className
            )}
            {...props}
        />
    )
)
Separator.displayName = "Separator"

export { Separator }
