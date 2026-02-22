import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        destructive:
          "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:from-red-700 hover:to-pink-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        outline:
          "border-2 border-gradient-to-r from-blue-500 to-purple-500 bg-gradient-to-r from-blue-50 to-purple-50 text-gradient-to-r from-blue-700 to-purple-700 shadow-md hover:from-blue-100 hover:to-purple-100 hover:shadow-lg transform hover:scale-105 transition-all duration-200",
        secondary:
          "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg hover:from-gray-700 hover:to-gray-800 hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        ghost: "bg-gradient-to-r from-transparent to-transparent text-gradient-to-r from-blue-600 to-purple-600 border border-blue-200 hover:from-blue-50 hover:to-purple-50 hover:border-blue-400 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200",
        link: "text-gradient-to-r from-blue-600 to-purple-600 underline-offset-4 hover:underline hover:from-blue-700 hover:to-purple-700 transition-all duration-200",
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
