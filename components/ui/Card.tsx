import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition-all duration-300",
    {
        variants: {
            variant: {
                static: "hover:bg-white/10",
                feature: "hover:-translate-y-1 hover:border-brand-purple/50 hover:bg-white/10 hover:shadow-glow",
                interactive: "cursor-pointer hover:scale-[1.02] hover:bg-white/10",
            },
        },
        defaultVariants: {
            variant: "static",
        },
    }
)

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> { }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(cardVariants({ variant, className }))}
                {...props}
            />
        )
    }
)
Card.displayName = "Card"

export { Card, cardVariants }
