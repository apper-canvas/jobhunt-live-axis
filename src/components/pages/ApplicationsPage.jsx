import React, { useState } from "react";
import { toast } from "react-toastify";
import ApplicationsList from "@/components/organisms/ApplicationsList";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useApplications } from "@/hooks/useApplications";
import { useJobs } from "@/hooks/useJobs";

const ApplicationsPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const { applications, loading, error, refetch, updateApplication, deleteApplication } = useApplications();
  const { jobs } = useJobs();

  const statusOptions = [
    { value: "all", label: "All Applications", count: applications.length },
    { value: "applied", label: "Applied", count: applications.filter(app => app.status === "Applied").length },
    { value: "reviewing", label: "Reviewing", count: applications.filter(app => app.status === "Reviewing").length },
    { value: "interview", label: "Interview", count: applications.filter(app => app.status === "Interview").length },
    { value: "rejected", label: "Rejected", count: applications.filter(app => app.status === "Rejected").length },
  ];

  const filteredApplications = statusFilter === "all" 
    ? applications 
    : applications.filter(app => app.status.toLowerCase() === statusFilter);

  const handleViewDetails = (job) => {
    toast.info("Job details view would open here", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) {
      return;
    }

    try {
      await deleteApplication(applicationId);
      toast.success("Application withdrawn successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to withdraw application", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const getStatusStats = () => {
    const stats = applications.reduce((acc, app) => {
      acc[app.status.toLowerCase()] = (acc[app.status.toLowerCase()] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: applications.length,
      applied: stats.applied || 0,
      reviewing: stats.reviewing || 0,
      interview: stats.interview || 0,
      rejected: stats.rejected || 0,
    };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
                My Applications
              </h1>
              <p className="text-xl text-blue-100">
                Track your job applications and stay organized
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0">
              <Button
                variant="secondary"
                onClick={() => window.location.href = "/"}
                icon="Search"
                className="bg-white text-primary hover:bg-blue-50"
              >
                Find More Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white text-center">
            <ApperIcon name="FileText" size={32} className="mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-blue-100 text-sm">Total Applications</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-xl text-white text-center">
            <ApperIcon name="Send" size={32} className="mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{stats.applied}</div>
            <div className="text-yellow-100 text-sm">Applied</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white text-center">
            <ApperIcon name="Eye" size={32} className="mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{stats.reviewing}</div>
            <div className="text-purple-100 text-sm">Under Review</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white text-center">
            <ApperIcon name="Calendar" size={32} className="mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{stats.interview}</div>
            <div className="text-green-100 text-sm">Interview</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white text-center">
            <ApperIcon name="X" size={32} className="mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{stats.rejected}</div>
            <div className="text-red-100 text-sm">Rejected</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-display">
              Filter Applications
            </h2>
            <Button
              variant="ghost"
              onClick={refetch}
              icon="RefreshCw"
              size="sm"
            >
              Refresh
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  statusFilter === option.value
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{option.label}</span>
                <Badge 
                  variant={statusFilter === option.value ? "outline" : "default"}
                  size="sm"
                  className={statusFilter === option.value ? "bg-white text-primary" : ""}
                >
                  {option.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <ApplicationsList
          applications={filteredApplications}
          jobs={jobs}
          loading={loading}
          error={error}
          onRetry={refetch}
          onViewDetails={handleViewDetails}
          onWithdraw={handleWithdraw}
        />
      </div>
    </div>
  );
};

export default ApplicationsPage;