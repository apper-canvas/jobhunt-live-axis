import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const JobCard = ({ job, onApply, onViewDetails, isApplied = false }) => {
  const formatSalary = (salary) => {
    if (!salary) return "Salary not specified";
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }
    if (salary.amount) {
      return `$${salary.amount.toLocaleString()}`;
    }
    return "Competitive salary";
  };

const getCompanyInitials = (companyName) => {
    if (!companyName) return "NA";
    return companyName
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
<Card className="p-6 h-full flex flex-col">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
          {getCompanyInitials(job.company_c)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 truncate font-display">
            {job.title_c || 'Job Title Not Available'}
          </h3>
          <p className="text-gray-600 font-medium">{job.company_c || 'Company Not Specified'}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <ApperIcon name="MapPin" size={14} className="mr-1" />
            <span>{job.location_c || 'Location Not Specified'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
          {job.description_c || 'Job description not available'}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="DollarSign" size={16} className="mr-2 text-accent" />
            <span className="font-medium">
              {job.salary_min_c && job.salary_max_c 
                ? `$${job.salary_min_c.toLocaleString()} - $${job.salary_max_c.toLocaleString()}`
                : 'Competitive salary'
              }
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Clock" size={16} className="mr-2 text-secondary" />
            <span>
              Posted {job.posted_date_c 
                ? formatDistanceToNow(new Date(job.posted_date_c)) + ' ago'
                : 'recently'
              }
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Building2" size={16} className="mr-2 text-primary" />
            <Badge variant="outline" size="sm">{job.industry_c || 'Industry Not Specified'}</Badge>
          </div>
        </div>

        {job.requirements_c && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Key Requirements:</p>
            <div className="flex flex-wrap gap-1">
              {(() => {
                // Handle requirements as string, split by common delimiters
                const requirements = typeof job.requirements_c === 'string' 
                  ? job.requirements_c.split(/[,\n•-]/).map(req => req.trim()).filter(req => req)
                  : Array.isArray(job.requirements_c) 
                    ? job.requirements_c 
                    : [];
                
                return requirements.slice(0, 3).map((req, index) => (
                  <Badge key={index} variant="default" size="sm" className="text-xs">
                    {req}
                  </Badge>
                ));
              })()}
              {(() => {
                const requirements = typeof job.requirements_c === 'string' 
                  ? job.requirements_c.split(/[,\n•-]/).map(req => req.trim()).filter(req => req)
                  : Array.isArray(job.requirements_c) 
                    ? job.requirements_c 
                    : [];
                
                return requirements.length > 3 && (
                  <Badge variant="outline" size="sm" className="text-xs">
                    +{requirements.length - 3} more
                  </Badge>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(job)}
          icon="Eye"
        >
          View Details
        </Button>
        
        {isApplied ? (
          <Badge variant="success" className="flex items-center space-x-1">
            <ApperIcon name="Check" size={14} />
            <span>Applied</span>
          </Badge>
        ) : (
          <Button
            variant="success"
            size="sm"
            onClick={() => onApply(job)}
            icon="Send"
          >
            Quick Apply
          </Button>
        )}
      </div>
    </Card>
  );
};

export default JobCard;