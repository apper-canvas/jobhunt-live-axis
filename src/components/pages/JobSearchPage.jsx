import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import JobSearchFilters from "@/components/organisms/JobSearchFilters";
import JobGrid from "@/components/organisms/JobGrid";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useJobs } from "@/hooks/useJobs";
import { useApplications } from "@/hooks/useApplications";

const JobSearchPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const { jobs, loading, error, searchJobs } = useJobs();
  const { applications, addApplication } = useApplications();

  // Get applied job IDs
  const appliedJobIds = applications.map(app => app.jobId);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const searchFilters = { ...filters, searchTerm: term };
    searchJobs(searchFilters);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    const searchFilters = { ...newFilters, searchTerm };
    searchJobs(searchFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    const searchFilters = { searchTerm };
    searchJobs(searchFilters);
  };

const handleApply = async (job) => {
    try {
      await addApplication({
        jobId: job.Id,
        resumeUsed: "Default Resume",
        notes: `Applied to ${job.title} at ${job.company} through JobHunt Pro`
      });
      
      toast.success(`🎉 Successfully applied to ${job.title} at ${job.company}!`, {
        position: "top-right",
        autoClose: 4000,
      });
    } catch (err) {
      console.error("Application submission error:", err);
      toast.error(`❌ Failed to submit application for ${job.title}. Please try again.`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleViewDetails = (job) => {
    // Display comprehensive job details through enhanced toast notifications
    const salaryInfo = job.salary?.min && job.salary?.max 
      ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
      : "Competitive salary";
    
    const requirements = job.requirements && job.requirements.length > 0 
      ? job.requirements.slice(0, 5).join(", ") + (job.requirements.length > 5 ? "..." : "")
      : "Requirements not specified";

    // Job overview
    toast.info(`🏢 ${job.title} at ${job.company}\n📍 ${job.location} • 🏭 ${job.industry}\n💰 ${salaryInfo}`, {
      position: "top-right",
      autoClose: 6000,
    });

    // Job description and requirements
    setTimeout(() => {
      toast.success(`📋 Job Description:\n${job.description?.substring(0, 200)}${job.description?.length > 200 ? "..." : ""}\n\n🎯 Key Requirements:\n${requirements}`, {
        position: "top-right",
        autoClose: 8000,
      });
    }, 500);

    // Application deadline
    if (job.applicationDeadline) {
      setTimeout(() => {
        const deadline = new Date(job.applicationDeadline);
        const timeUntilDeadline = deadline.getTime() - new Date().getTime();
        const daysLeft = Math.ceil(timeUntilDeadline / (1000 * 60 * 60 * 24));
        
        toast.warning(`⏰ Application Deadline: ${deadline.toLocaleDateString()}\n${daysLeft > 0 ? `${daysLeft} days remaining` : "Deadline passed"}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }, 1000);
    }
  };

  const handleRetry = () => {
    searchJobs({ ...filters, searchTerm });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">
              Find Your Dream Job
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Discover amazing opportunities from top companies and kickstart your career journey today
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for jobs, companies, or keywords..."
              className="mb-6"
            />
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <span className="text-blue-200">Popular searches:</span>
              {["Software Engineer", "Product Manager", "Data Scientist", "UX Designer"].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors backdrop-blur-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-display">
              {searchTerm ? `Results for "${searchTerm}"` : "All Jobs"}
            </h2>
            <p className="text-gray-600">
              {loading ? "Searching..." : `${jobs.length} opportunities found`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={showFilters ? "EyeOff" : "Filter"}
              className="lg:hidden"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate("/alerts")}
              icon="Bell"
            >
              Job Alerts
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-24">
              <JobSearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Job Results */}
          <div className="lg:col-span-3">
            <JobGrid
              jobs={jobs}
              loading={loading}
              error={error}
              onRetry={handleRetry}
              onApply={handleApply}
              onViewDetails={handleViewDetails}
              appliedJobs={appliedJobIds}
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {!loading && !error && jobs.length > 0 && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-xl text-white">
                <ApperIcon name="Briefcase" size={32} className="mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{jobs.length}</div>
                <div className="text-blue-100">Active Jobs</div>
              </div>
              
              <div className="bg-gradient-to-br from-accent to-green-600 p-6 rounded-xl text-white">
                <ApperIcon name="Building2" size={32} className="mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">
                  {new Set(jobs.map(job => job.company)).size}
                </div>
                <div className="text-green-100">Companies</div>
              </div>
              
              <div className="bg-gradient-to-br from-secondary to-purple-600 p-6 rounded-xl text-white">
                <ApperIcon name="MapPin" size={32} className="mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">
                  {new Set(jobs.map(job => job.location)).size}
                </div>
                <div className="text-purple-100">Locations</div>
              </div>
              
              <div className="bg-gradient-to-br from-warning to-orange-600 p-6 rounded-xl text-white">
                <ApperIcon name="Users" size={32} className="mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{appliedJobIds.length}</div>
                <div className="text-orange-100">Applications</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearchPage;