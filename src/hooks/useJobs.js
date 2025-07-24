import { useState, useEffect } from "react";
import { jobService } from "@/services/api/jobService";

export const useJobs = (filters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadJobs = async (searchFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const data = await jobService.getAll(searchFilters);
      setJobs(data);
    } catch (err) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs(filters);
  }, []);

  const refetch = () => loadJobs(filters);

  return {
    jobs,
    loading,
    error,
    refetch,
    searchJobs: loadJobs
  };
};