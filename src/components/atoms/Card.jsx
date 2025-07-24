import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  hover = true,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-200";
  const hoverStyles = hover ? "hover:shadow-xl hover:scale-[1.02]" : "";

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;