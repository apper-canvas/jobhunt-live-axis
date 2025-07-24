import React from "react";
import ApplicationCard from "@/components/molecules/ApplicationCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ApplicationsList = ({ 
  applications, 
  jobs, 
  loading, 
  error, 
  onRetry, 
  onViewDetails,
  onWithdraw 
}) => {
  if (loading) {
    return <Loading type="list" />;
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

  if (!applications || applications.length === 0) {
    return (
      <Empty 
        type="applications"
        onAction={() => window.location.href = "/"}
        actionText="Find Jobs"
      />
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((application) => {
        const job = jobs.find(j => j.Id === application.jobId);
        if (!job) return null;
        
        return (
          <ApplicationCard
            key={application.Id}
            application={application}
            job={job}
onViewDetails={onViewDetails}
            onWithdraw={onWithdraw}
          />
        );
      })}
    </div>
  );
};

export default ApplicationsList;