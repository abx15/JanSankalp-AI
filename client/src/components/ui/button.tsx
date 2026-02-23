import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-civic-accent text-white shadow-lg hover:bg-civic-accent-hover hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        destructive:
          "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:from-red-700 hover:to-pink-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        outline:
          "border-2 border-civic-primary bg-civic-background text-civic-primary shadow-md hover:bg-civic-primary/10 hover:border-civic-primary/30 hover:shadow-lg transform hover:scale-105 transition-all duration-200",
        secondary:
          "bg-civic-secondary text-white shadow-lg hover:bg-civic-primary hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        ghost: "bg-transparent text-civic-primary border border-civic-primary/20 hover:bg-civic-primary/10 hover:border-civic-primary/40 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200",
        link: "text-civic-secondary underline-offset-4 hover:underline hover:text-civic-primary transition-all duration-200",
      },
      size: {
        default: "h-11 px-6 py-3 text-base font-semibold shadow-lg",
        sm: "h-9 rounded-lg px-4 text-sm font-medium shadow-md",
        lg: "h-12 rounded-lg px-10 text-lg font-bold shadow-xl",
        icon: "h-12 w-12 rounded-lg shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
