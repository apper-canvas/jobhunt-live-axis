import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  className, 
  variant = "default", 
  size = "md",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary to-secondary text-white",
    secondary: "bg-gradient-to-r from-secondary to-purple-600 text-white",
    success: "bg-gradient-to-r from-accent to-green-600 text-white",
    warning: "bg-gradient-to-r from-warning to-orange-600 text-white",
    error: "bg-gradient-to-r from-error to-red-600 text-white",
    outline: "border-2 border-gray-300 text-gray-700 bg-white",
    applied: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    reviewing: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
    interview: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    rejected: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;