import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  type = "general" 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Issue",
          description: "Unable to connect to our servers. Please check your internet connection and try again.",
        };
      case "notfound":
        return {
          icon: "SearchX",
          title: "No Results Found",
          description: "We couldn't find any job listings matching your criteria. Try adjusting your filters or search terms.",
        };
      case "loading":
        return {
          icon: "AlertCircle",
          title: "Loading Failed",
          description: "We encountered an issue while loading your data. This might be a temporary problem.",
        };
      default:
        return {
          icon: "AlertTriangle",
          title: "Oops! Something went wrong",
          description: message || "An unexpected error occurred. Our team has been notified and is working on a fix.",
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon 
          name={errorContent.icon} 
          size={40} 
          className="text-error" 
        />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
        {errorContent.title}
      </h3>
      
      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
        {errorContent.description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" size={18} />
            <span>Try Again</span>
          </button>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className="btn-secondary flex items-center space-x-2"
        >
          <ApperIcon name="RotateCcw" size={18} />
          <span>Refresh Page</span>
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">
          Still having trouble? Contact our support team at{" "}
          <a 
            href="mailto:support@jobhuntpro.com" 
            className="text-primary hover:text-secondary font-medium transition-colors"
          >
            support@jobhuntpro.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Error;