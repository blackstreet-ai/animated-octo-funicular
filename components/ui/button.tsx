"use client";

import * as React from "react";

type ButtonVariant = "default" | "secondary" | "ghost" | "link" | "outline" | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const getButtonClasses = (variant: ButtonVariant = "default", size: ButtonSize = "default", className = "") => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    default: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-white hover:bg-secondary/90",
    ghost: "hover:bg-accent/10 hover:text-accent",
    link: "underline-offset-4 hover:underline text-primary",
    outline: "border border-input hover:bg-accent/10 hover:text-accent",
    destructive: "bg-error text-white hover:bg-error/90",
  }[variant];
  
  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  }[size];
  
  return `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={getButtonClasses(variant, size, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
