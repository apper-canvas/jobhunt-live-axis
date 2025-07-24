import React from 'react';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';

const JobDetailsModal = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  const formatSalary = (min, max) => {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    return 'Competitive salary';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  const daysLeft = getDaysUntilDeadline(job.application_deadline_c);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                {job.title_c}
              </h2>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <ApperIcon name="Building2" size={16} className="mr-2" />
                  <span className="font-medium">{job.company_c}</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="MapPin" size={16} className="mr-2" />
                  <span>{job.location_c}</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Factory" size={16} className="mr-2" />
                  <span>{job.industry_c}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon="X"
              className="ml-4"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-lg text-white">
              <div className="flex items-center mb-2">
                <ApperIcon name="DollarSign" size={20} className="mr-2" />
                <h3 className="font-semibold">Salary Range</h3>
              </div>
              <p className="text-lg font-bold">
                {formatSalary(job.salary_min_c, job.salary_max_c)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent to-green-600 p-4 rounded-lg text-white">
              <div className="flex items-center mb-2">
                <ApperIcon name="Calendar" size={20} className="mr-2" />
                <h3 className="font-semibold">Posted</h3>
              </div>
              <p className="text-lg font-bold">
                {job.posted_date_c ? formatDistanceToNow(new Date(job.posted_date_c), { addSuffix: true }) : 'Recently'}
              </p>
            </div>
          </div>

          {/* Application Deadline */}
          {job.application_deadline_c && (
            <div className={`p-4 rounded-lg border-l-4 ${
              daysLeft && daysLeft > 0 
                ? daysLeft > 7 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-yellow-50 border-yellow-500'
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-center">
                <ApperIcon 
                  name="Clock" 
                  size={20} 
                  className={`mr-3 ${
                    daysLeft && daysLeft > 0 
                      ? daysLeft > 7 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                      : 'text-red-600'
                  }`} 
                />
                <div>
                  <h3 className="font-semibold text-gray-900">Application Deadline</h3>
                  <p className="text-gray-700">
                    {formatDate(job.application_deadline_c)}
                    {daysLeft !== null && (
                      <span className="ml-2 font-medium">
                        {daysLeft > 0 ? `(${daysLeft} days remaining)` : '(Deadline passed)'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Job Description */}
          {job.description_c && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-display flex items-center">
                <ApperIcon name="FileText" size={20} className="mr-2" />
                Job Description
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description_c}
                </p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements_c && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-display flex items-center">
                <ApperIcon name="CheckCircle" size={20} className="mr-2" />
                Requirements
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.requirements_c}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {job.Tags && job.Tags.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-display flex items-center">
                <ApperIcon name="Tag" size={20} className="mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.Tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="order-2 sm:order-1"
            >
              Close
            </Button>
            <Button
              variant="primary"
              icon="Send"
              className="order-1 sm:order-2"
              onClick={() => {
                // This will be handled by the parent component's apply logic
                onClose();
              }}
            >
              Quick Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;