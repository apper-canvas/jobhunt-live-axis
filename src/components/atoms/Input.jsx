import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({ 
  className, 
  type = "text",
  icon,
  iconPosition = "left",
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 bg-white";
  const errorStyles = error ? "border-error focus:border-error" : "border-gray-200 focus:border-primary";
  const iconPadding = icon ? (iconPosition === "left" ? "pl-12" : "pr-12") : "";

  return (
    <div className="relative">
      {icon && (
        <div className={cn(
          "absolute top-1/2 transform -translate-y-1/2 text-gray-400",
          iconPosition === "left" ? "left-4" : "right-4"
        )}>
          <ApperIcon name={icon} size={18} />
        </div>
      )}
      
      <input
        type={type}
        className={cn(
          baseStyles,
          errorStyles,
          iconPadding,
          className
        )}
        ref={ref}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;