import React from "react";
import JobCard from "@/components/molecules/JobCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const JobGrid = ({ 
  jobs, 
  loading, 
  error, 
  onRetry, 
  onApply, 
  onViewDetails,
  appliedJobs = []
}) => {
  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={onRetry}
        type="loading"
      />
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Empty 
        type="jobs"
        onAction={() => window.location.reload()}
        actionText="Refresh Search"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.Id}
          job={job}
          onApply={onApply}
          onViewDetails={onViewDetails}
          isApplied={appliedJobs.includes(job.Id)}
        />
      ))}
    </div>
  );
};

export default JobGrid;