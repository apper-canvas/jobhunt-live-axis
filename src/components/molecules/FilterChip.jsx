import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterChip = ({ 
  label, 
  onRemove, 
  variant = "outline",
  className 
}) => {
  return (
    <Badge
      variant={variant}
      className={cn(
        "flex items-center space-x-2 cursor-pointer hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full p-1 transition-colors"
      >
        <ApperIcon name="X" size={12} />
      </button>
    </Badge>
  );
};

export default FilterChip;