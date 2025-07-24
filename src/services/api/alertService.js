export const alertService = {
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
          { field: { Name: "job_title_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "industries_c" } },
          { field: { Name: "salary_range_min_c" } },
          { field: { Name: "salary_range_max_c" } },
          { field: { Name: "frequency_c" } },
          { field: { Name: "is_active_c" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('job_alert_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const transformedAlerts = (response.data || []).map(alert => ({
        Id: alert.Id,
        name: alert.Name || '',
        filters: {
          jobTitle: alert.job_title_c || '',
          location: alert.location_c || '',
          industries: alert.industries_c ? alert.industries_c.split(',').map(i => i.trim()) : [],
          salaryRange: {
            min: alert.salary_range_min_c || 0,
            max: alert.salary_range_max_c || 0,
            label: alert.salary_range_min_c && alert.salary_range_max_c ? 
              `$${alert.salary_range_min_c.toLocaleString()} - $${alert.salary_range_max_c.toLocaleString()}` : ''
          }
        },
        frequency: alert.frequency_c || 'daily',
        isActive: alert.is_active_c || false
      }));

      return transformedAlerts;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching alerts:", error?.response?.data?.message);
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
          { field: { Name: "job_title_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "industries_c" } },
          { field: { Name: "salary_range_min_c" } },
          { field: { Name: "salary_range_max_c" } },
          { field: { Name: "frequency_c" } },
          { field: { Name: "is_active_c" } }
        ]
      };

      const response = await apperClient.getRecordById('job_alert_c', parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Alert not found");
      }

      const alert = response.data;
      return {
        Id: alert.Id,
        name: alert.Name || '',
        filters: {
          jobTitle: alert.job_title_c || '',
          location: alert.location_c || '',
          industries: alert.industries_c ? alert.industries_c.split(',').map(i => i.trim()) : [],
          salaryRange: {
            min: alert.salary_range_min_c || 0,
            max: alert.salary_range_max_c || 0,
            label: alert.salary_range_min_c && alert.salary_range_max_c ? 
              `$${alert.salary_range_min_c.toLocaleString()} - $${alert.salary_range_max_c.toLocaleString()}` : ''
          }
        },
        frequency: alert.frequency_c || 'daily',
        isActive: alert.is_active_c || false
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching alert with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(alert) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: alert.name || '',
          job_title_c: alert.filters?.jobTitle || '',
          location_c: alert.filters?.location || '',
          industries_c: Array.isArray(alert.filters?.industries) ? 
            alert.filters.industries.join(',') : (alert.filters?.industries || ''),
          salary_range_min_c: alert.filters?.salaryRange?.min || 0,
          salary_range_max_c: alert.filters?.salaryRange?.max || 0,
          frequency_c: alert.frequency || 'daily',
          is_active_c: alert.isActive !== undefined ? alert.isActive : true
        }]
      };

      const response = await apperClient.createRecord('job_alert_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create alert ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create alert");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const created = successfulRecord.data;
          return {
            Id: created.Id,
            name: created.Name || '',
            filters: {
              jobTitle: created.job_title_c || '',
              location: created.location_c || '',
              industries: created.industries_c ? created.industries_c.split(',').map(i => i.trim()) : [],
              salaryRange: {
                min: created.salary_range_min_c || 0,
                max: created.salary_range_max_c || 0,
                label: created.salary_range_min_c && created.salary_range_max_c ? 
                  `$${created.salary_range_min_c.toLocaleString()} - $${created.salary_range_max_c.toLocaleString()}` : ''
              }
            },
            frequency: created.frequency_c || 'daily',
            isActive: created.is_active_c || false
          };
        }
      }

      throw new Error("Failed to create alert");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating alert:", error?.response?.data?.message);
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
      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.filters?.jobTitle !== undefined) updateData.job_title_c = updates.filters.jobTitle;
      if (updates.filters?.location !== undefined) updateData.location_c = updates.filters.location;
      if (updates.filters?.industries !== undefined) {
        updateData.industries_c = Array.isArray(updates.filters.industries) ? 
          updates.filters.industries.join(',') : updates.filters.industries;
      }
      if (updates.filters?.salaryRange?.min !== undefined) updateData.salary_range_min_c = updates.filters.salaryRange.min;
      if (updates.filters?.salaryRange?.max !== undefined) updateData.salary_range_max_c = updates.filters.salaryRange.max;
      if (updates.frequency !== undefined) updateData.frequency_c = updates.frequency;
      if (updates.isActive !== undefined) updateData.is_active_c = updates.isActive;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('job_alert_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
if (failedRecords.length > 0) {
          console.error(`Failed to update alert ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          // Throw the specific error message from the API response
          const firstError = failedRecords[0];
          throw new Error(firstError.message || "Failed to update alert");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const updated = successfulRecord.data;
          return {
            Id: updated.Id,
            name: updated.Name || '',
            filters: {
              jobTitle: updated.job_title_c || '',
              location: updated.location_c || '',
              industries: updated.industries_c ? updated.industries_c.split(',').map(i => i.trim()) : [],
              salaryRange: {
                min: updated.salary_range_min_c || 0,
                max: updated.salary_range_max_c || 0,
                label: updated.salary_range_min_c && updated.salary_range_max_c ? 
                  `$${updated.salary_range_min_c.toLocaleString()} - $${updated.salary_range_max_c.toLocaleString()}` : ''
              }
            },
            frequency: updated.frequency_c || 'daily',
            isActive: updated.is_active_c || false
          };
        }
      }

      throw new Error("Failed to update alert");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating alert:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('job_alert_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete alert ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to delete alert");
        }

        return true;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting alert:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async toggleActive(id) {
    try {
      // First get the current alert to toggle its status
      const currentAlert = await this.getById(id);
      
      // Update with opposite status
      return await this.update(id, {
        isActive: !currentAlert.isActive
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling alert:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};