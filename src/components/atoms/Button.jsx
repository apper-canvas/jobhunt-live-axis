import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-primary",
    secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-primary",
    success: "bg-gradient-to-r from-accent to-green-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-accent",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] focus:ring-gray-300",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-error",
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm rounded-md",
    md: "px-6 py-3 text-base rounded-lg",
    lg: "px-8 py-4 text-lg rounded-xl",
  };
  
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSizes[size]} 
          className="animate-spin mr-2" 
        />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="mr-2" 
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="ml-2" 
        />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;