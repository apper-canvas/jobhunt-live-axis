import { useState, useEffect } from "react";
import { applicationService } from "@/services/api/applicationService";

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await applicationService.getAll();
      setApplications(data);
    } catch (err) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const addApplication = async (applicationData) => {
    try {
      const newApplication = await applicationService.create(applicationData);
      setApplications(prev => [...prev, newApplication]);
      return newApplication;
    } catch (err) {
      throw new Error(err.message || "Failed to create application");
    }
  };

  const updateApplication = async (id, updates) => {
    try {
      const updatedApplication = await applicationService.update(id, updates);
      setApplications(prev => 
        prev.map(app => app.Id === parseInt(id) ? updatedApplication : app)
      );
      return updatedApplication;
    } catch (err) {
      throw new Error(err.message || "Failed to update application");
    }
  };

  const deleteApplication = async (id) => {
    try {
      await applicationService.delete(id);
      setApplications(prev => prev.filter(app => app.Id !== parseInt(id)));
      return true;
    } catch (err) {
      throw new Error(err.message || "Failed to delete application");
    }
  };

  const refetch = () => loadApplications();

  return {
    applications,
    loading,
    error,
    refetch,
    addApplication,
    updateApplication,
    deleteApplication
  };
};