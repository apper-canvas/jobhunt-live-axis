import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow, format } from "date-fns";

const ApplicationCard = ({ application, job, onViewDetails, onWithdraw }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "applied": return "applied";
      case "reviewing": return "reviewing";
      case "interview": return "interview";
      case "rejected": return "rejected";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "applied": return "Send";
      case "reviewing": return "Eye";
      case "interview": return "Calendar";
      case "rejected": return "X";
      default: return "Clock";
    }
  };

const getCompanyInitials = (companyName) => {
    if (!companyName || typeof companyName !== 'string') {
      return "NA";
    }
    return companyName
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {getCompanyInitials(job.company)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 truncate font-display">
              {job.title}
            </h3>
            <p className="text-gray-600 font-medium">{job.company}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <ApperIcon name="MapPin" size={14} className="mr-1" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        
        <Badge 
          variant={getStatusColor(application.status)} 
          className="flex items-center space-x-1"
        >
          <ApperIcon name={getStatusIcon(application.status)} size={14} />
          <span>{application.status}</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Calendar" size={16} className="mr-2 text-primary" />
          <div>
            <span className="block font-medium">Applied</span>
            <span>{format(new Date(application.appliedDate), "MMM dd, yyyy")}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="FileText" size={16} className="mr-2 text-accent" />
          <div>
            <span className="block font-medium">Resume Used</span>
            <span>{application.resumeUsed || "Default Resume"}</span>
          </div>
        </div>
      </div>

      {application.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
          <p className="text-sm text-gray-600">{application.notes}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Applied {formatDistanceToNow(new Date(application.appliedDate))} ago
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(job)}
            icon="Eye"
          >
            View Job
          </Button>
          
          {application.status.toLowerCase() === "applied" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWithdraw(application.Id)}
              icon="Trash2"
            >
              Withdraw
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ApplicationCard;