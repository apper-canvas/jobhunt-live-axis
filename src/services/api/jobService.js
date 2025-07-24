export const jobService = {
  async getAll(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "salary_min_c" } },
          { field: { Name: "salary_max_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "requirements_c" } },
          { field: { Name: "posted_date_c" } },
          { field: { Name: "application_deadline_c" } }
        ],
        where: [],
        orderBy: [
          {
            fieldName: "posted_date_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      // Apply filters
      if (filters.location) {
        params.where.push({
          FieldName: "location_c",
          Operator: "Contains",
          Values: [filters.location]
        });
      }

      if (filters.jobTitle) {
        params.where.push({
          FieldName: "title_c",
          Operator: "Contains",
          Values: [filters.jobTitle]
        });
      }

      if (filters.industries && filters.industries.length > 0) {
        params.where.push({
          FieldName: "industry_c",
          Operator: "ExactMatch",
          Values: filters.industries
        });
      }

      if (filters.searchTerm) {
        params.whereGroups = [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "title_c",
                operator: "Contains",
                values: [filters.searchTerm]
              }],
              operator: ""
            },
            {
              conditions: [{
                fieldName: "company_c",
                operator: "Contains",
                values: [filters.searchTerm]
              }],
              operator: ""
            },
            {
              conditions: [{
                fieldName: "description_c",
                operator: "Contains",
                values: [filters.searchTerm]
              }],
              operator: ""
            }
          ]
        }];
      }

      const response = await apperClient.fetchRecords('job_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const transformedJobs = (response.data || []).map(job => ({
        Id: job.Id,
        title: job.title_c || '',
        company: job.company_c || '',
        location: job.location_c || '',
        industry: job.industry_c || '',
        salary: {
          min: job.salary_min_c || 0,
          max: job.salary_max_c || 0
        },
        description: job.description_c || '',
        requirements: job.requirements_c ? job.requirements_c.split(',').map(r => r.trim()) : [],
        postedDate: job.posted_date_c || new Date().toISOString(),
        applicationDeadline: job.application_deadline_c || new Date().toISOString()
      }));

      return transformedJobs;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching jobs:", error?.response?.data?.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "salary_min_c" } },
          { field: { Name: "salary_max_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "requirements_c" } },
          { field: { Name: "posted_date_c" } },
          { field: { Name: "application_deadline_c" } }
        ]
      };

      const response = await apperClient.getRecordById('job_c', parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Job not found");
      }

      const job = response.data;
      return {
        Id: job.Id,
        title: job.title_c || '',
        company: job.company_c || '',
        location: job.location_c || '',
        industry: job.industry_c || '',
        salary: {
          min: job.salary_min_c || 0,
          max: job.salary_max_c || 0
        },
        description: job.description_c || '',
        requirements: job.requirements_c ? job.requirements_c.split(',').map(r => r.trim()) : [],
        postedDate: job.posted_date_c || new Date().toISOString(),
        applicationDeadline: job.application_deadline_c || new Date().toISOString()
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching job with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(job) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: job.title || job.title_c || '',
          title_c: job.title || job.title_c || '',
          company_c: job.company || job.company_c || '',
          location_c: job.location || job.location_c || '',
          industry_c: job.industry || job.industry_c || '',
          salary_min_c: job.salary?.min || job.salary_min_c || 0,
          salary_max_c: job.salary?.max || job.salary_max_c || 0,
          description_c: job.description || job.description_c || '',
          requirements_c: Array.isArray(job.requirements) ? job.requirements.join(', ') : (job.requirements_c || ''),
          posted_date_c: new Date().toISOString(),
          application_deadline_c: job.applicationDeadline || job.application_deadline_c || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }]
      };

      const response = await apperClient.createRecord('job_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create job ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create job");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const created = successfulRecord.data;
          return {
            Id: created.Id,
            title: created.title_c || '',
            company: created.company_c || '',
            location: created.location_c || '',
            industry: created.industry_c || '',
            salary: {
              min: created.salary_min_c || 0,
              max: created.salary_max_c || 0
            },
            description: created.description_c || '',
            requirements: created.requirements_c ? created.requirements_c.split(',').map(r => r.trim()) : [],
            postedDate: created.posted_date_c || new Date().toISOString(),
            applicationDeadline: created.application_deadline_c || new Date().toISOString()
          };
        }
      }

      throw new Error("Failed to create job");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating job:", error?.response?.data?.message);
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
      if (updates.title !== undefined) updateData.title_c = updates.title;
      if (updates.company !== undefined) updateData.company_c = updates.company;
      if (updates.location !== undefined) updateData.location_c = updates.location;
      if (updates.industry !== undefined) updateData.industry_c = updates.industry;
      if (updates.salary?.min !== undefined) updateData.salary_min_c = updates.salary.min;
      if (updates.salary?.max !== undefined) updateData.salary_max_c = updates.salary.max;
      if (updates.description !== undefined) updateData.description_c = updates.description;
      if (updates.requirements !== undefined) {
        updateData.requirements_c = Array.isArray(updates.requirements) ? 
          updates.requirements.join(', ') : updates.requirements;
      }
      if (updates.applicationDeadline !== undefined) updateData.application_deadline_c = updates.applicationDeadline;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('job_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update job ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update job");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const updated = successfulRecord.data;
          return {
            Id: updated.Id,
            title: updated.title_c || '',
            company: updated.company_c || '',
            location: updated.location_c || '',
            industry: updated.industry_c || '',
            salary: {
              min: updated.salary_min_c || 0,
              max: updated.salary_max_c || 0
            },
            description: updated.description_c || '',
            requirements: updated.requirements_c ? updated.requirements_c.split(',').map(r => r.trim()) : [],
            postedDate: updated.posted_date_c || new Date().toISOString(),
            applicationDeadline: updated.application_deadline_c || new Date().toISOString()
          };
        }
      }

      throw new Error("Failed to update job");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating job:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('job_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete job ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to delete job");
        }

        return true;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting job:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};