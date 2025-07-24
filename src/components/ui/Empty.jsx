import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  type = "jobs", 
  onAction, 
  actionText = "Get Started",
  title,
  description 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "jobs":
        return {
          icon: "Briefcase",
          title: title || "No Jobs Found",
          description: description || "We couldn't find any job listings matching your search criteria. Try adjusting your filters or exploring different keywords.",
          actionText: "Browse All Jobs",
          gradient: "from-blue-400 to-purple-500",
        };
      case "applications":
        return {
          icon: "FileText",
          title: title || "No Applications Yet",
          description: description || "You haven't applied to any jobs yet. Start your career journey by exploring available opportunities and submitting applications.",
          actionText: "Find Jobs",
          gradient: "from-green-400 to-blue-500",
        };
      case "alerts":
        return {
          icon: "Bell",
          title: title || "No Job Alerts",
          description: description || "Stay ahead of the competition by setting up job alerts. Get notified when new opportunities matching your preferences become available.",
          actionText: "Create Alert",
          gradient: "from-purple-400 to-pink-500",
        };
      case "resumes":
        return {
          icon: "Upload",
          title: title || "No Resume Uploaded",
          description: description || "Upload your resume to quickly apply to jobs with one click. A well-formatted resume is your key to landing interviews.",
          actionText: "Upload Resume",
          gradient: "from-orange-400 to-red-500",
        };
      default:
        return {
          icon: "Search",
          title: title || "Nothing Here Yet",
          description: description || "This section is empty, but it won't be for long! Take action to get started.",
          actionText: actionText,
          gradient: "from-indigo-400 to-cyan-500",
        };
    }
  };

  const emptyContent = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className={`w-24 h-24 bg-gradient-to-br ${emptyContent.gradient} rounded-full flex items-center justify-center mb-8 shadow-xl animate-bounce-subtle`}>
        <ApperIcon 
          name={emptyContent.icon} 
          size={48} 
          className="text-white" 
        />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
        {emptyContent.title}
      </h3>
      
      <p className="text-gray-600 max-w-lg mb-8 leading-relaxed text-lg">
        {emptyContent.description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="btn-success flex items-center space-x-2 text-lg px-8 py-4 shadow-lg"
        >
          <ApperIcon name="Plus" size={20} />
          <span>{emptyContent.actionText}</span>
        </button>
      )}
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <ApperIcon name="Target" size={32} className="text-primary mb-3 mx-auto" />
          <h4 className="font-semibold text-gray-900 mb-2">Set Goals</h4>
          <p className="text-sm text-gray-600">Define your career objectives and target roles</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
          <ApperIcon name="Zap" size={32} className="text-accent mb-3 mx-auto" />
          <h4 className="font-semibold text-gray-900 mb-2">Take Action</h4>
          <p className="text-sm text-gray-600">Apply to relevant positions and network actively</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
          <ApperIcon name="TrendingUp" size={32} className="text-secondary mb-3 mx-auto" />
          <h4 className="font-semibold text-gray-900 mb-2">Track Progress</h4>
          <p className="text-sm text-gray-600">Monitor applications and follow up strategically</p>
        </div>
      </div>
    </div>
  );
};

export default Empty;