export const applicationService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "job_id_c" } },
          { field: { Name: "applied_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "resume_used_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [
          {
            fieldName: "applied_date_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('application_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const transformedApplications = (response.data || []).map(app => ({
        Id: app.Id,
        jobId: app.job_id_c?.Id || app.job_id_c || 0,
        appliedDate: app.applied_date_c || new Date().toISOString(),
        status: app.status_c || 'Applied',
        resumeUsed: app.resume_used_c || '',
        notes: app.notes_c || ''
      }));

      return transformedApplications;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching applications:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "job_id_c" } },
          { field: { Name: "applied_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "resume_used_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await apperClient.getRecordById('application_c', parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Application not found");
      }

      const app = response.data;
      return {
        Id: app.Id,
        jobId: app.job_id_c?.Id || app.job_id_c || 0,
        appliedDate: app.applied_date_c || new Date().toISOString(),
        status: app.status_c || 'Applied',
        resumeUsed: app.resume_used_c || '',
        notes: app.notes_c || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching application with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(application) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Application for Job ${application.jobId || application.job_id_c}`,
          job_id_c: parseInt(application.jobId || application.job_id_c || 0),
          applied_date_c: new Date().toISOString(),
          status_c: "Applied",
          resume_used_c: application.resumeUsed || application.resume_used_c || '',
          notes_c: application.notes || application.notes_c || ''
        }]
      };

      const response = await apperClient.createRecord('application_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create application ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create application");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const created = successfulRecord.data;
          return {
            Id: created.Id,
            jobId: created.job_id_c?.Id || created.job_id_c || 0,
            appliedDate: created.applied_date_c || new Date().toISOString(),
            status: created.status_c || 'Applied',
            resumeUsed: created.resume_used_c || '',
            notes: created.notes_c || ''
          };
        }
      }

      throw new Error("Failed to create application");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating application:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      // Map UI fields to database fields for updates
      if (updates.jobId !== undefined) updateData.job_id_c = parseInt(updates.jobId);
      if (updates.status !== undefined) updateData.status_c = updates.status;
      if (updates.resumeUsed !== undefined) updateData.resume_used_c = updates.resumeUsed;
      if (updates.notes !== undefined) updateData.notes_c = updates.notes;
      if (updates.appliedDate !== undefined) updateData.applied_date_c = updates.appliedDate;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('application_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update application ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update application");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const updated = successfulRecord.data;
          return {
            Id: updated.Id,
            jobId: updated.job_id_c?.Id || updated.job_id_c || 0,
            appliedDate: updated.applied_date_c || new Date().toISOString(),
            status: updated.status_c || 'Applied',
            resumeUsed: updated.resume_used_c || '',
            notes: updated.notes_c || ''
          };
        }
      }

      throw new Error("Failed to update application");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating application:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('application_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete application ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to delete application");
        }

        return true;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting application:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getByJobId(jobId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "job_id_c" } },
          { field: { Name: "applied_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "resume_used_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [
          {
            FieldName: "job_id_c",
            Operator: "EqualTo",
            Values: [parseInt(jobId)]
          }
        ],
        orderBy: [
          {
            fieldName: "applied_date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('application_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedApplications = (response.data || []).map(app => ({
        Id: app.Id,
        jobId: app.job_id_c?.Id || app.job_id_c || 0,
        appliedDate: app.applied_date_c || new Date().toISOString(),
        status: app.status_c || 'Applied',
        resumeUsed: app.resume_used_c || '',
        notes: app.notes_c || ''
      }));

      return transformedApplications;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching applications by job ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};