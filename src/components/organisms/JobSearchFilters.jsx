import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import FilterChip from "@/components/molecules/FilterChip";

const JobSearchFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Marketing",
    "Engineering", "Sales", "Design", "Operations", "Legal"
  ];

  const jobTypes = [
    "Full-time", "Part-time", "Contract", "Freelance", "Internship"
  ];

  const salaryRanges = [
    { label: "Under $50K", min: 0, max: 50000 },
    { label: "$50K - $75K", min: 50000, max: 75000 },
    { label: "$75K - $100K", min: 75000, max: 100000 },
    { label: "$100K - $150K", min: 100000, max: 150000 },
    { label: "$150K+", min: 150000, max: 999999 },
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleArrayFilterToggle = (key, value) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    handleFilterChange(key, newValues);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.jobTitle) count++;
    if (filters.industries?.length) count += filters.industries.length;
    if (filters.jobTypes?.length) count += filters.jobTypes.length;
    if (filters.salaryRange) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="p-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold text-gray-900 font-display">Filters</h3>
          {activeFiltersCount > 0 && (
            <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
              {activeFiltersCount}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              icon="X"
            >
              Clear All
            </Button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <ApperIcon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={20} />
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.location && (
              <FilterChip
                label={`Location: ${filters.location}`}
                onRemove={() => handleFilterChange("location", "")}
              />
            )}
            {filters.jobTitle && (
              <FilterChip
                label={`Title: ${filters.jobTitle}`}
                onRemove={() => handleFilterChange("jobTitle", "")}
              />
            )}
            {filters.industries?.map((industry) => (
              <FilterChip
                key={industry}
                label={industry}
                onRemove={() => handleArrayFilterToggle("industries", industry)}
              />
            ))}
            {filters.jobTypes?.map((type) => (
              <FilterChip
                key={type}
                label={type}
                onRemove={() => handleArrayFilterToggle("jobTypes", type)}
              />
            ))}
            {filters.salaryRange && (
              <FilterChip
                label={filters.salaryRange.label}
                onRemove={() => handleFilterChange("salaryRange", null)}
              />
            )}
          </div>
        </div>
      )}

      {/* Filter Content */}
      <div className={`space-y-6 ${isCollapsed ? "hidden lg:block" : ""}`}>
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Location
          </label>
          <Input
            placeholder="e.g., New York, Remote, California"
            value={filters.location || ""}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            icon="MapPin"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Job Title
          </label>
          <Input
            placeholder="e.g., Software Engineer, Marketing Manager"
            value={filters.jobTitle || ""}
            onChange={(e) => handleFilterChange("jobTitle", e.target.value)}
            icon="Briefcase"
          />
        </div>

        {/* Industries */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Industry
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {industries.map((industry) => (
              <label key={industry} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={filters.industries?.includes(industry) || false}
                  onChange={() => handleArrayFilterToggle("industries", industry)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{industry}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Job Type
          </label>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={filters.jobTypes?.includes(type) || false}
                  onChange={() => handleArrayFilterToggle("jobTypes", type)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Salary Range
          </label>
          <div className="space-y-2">
            {salaryRanges.map((range) => (
              <label key={range.label} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="radio"
                  name="salaryRange"
                  checked={filters.salaryRange?.label === range.label}
                  onChange={() => handleFilterChange("salaryRange", range)}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JobSearchFilters;