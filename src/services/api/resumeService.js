export const resumeService = {
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
          { field: { Name: "upload_date_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "is_default_c" } }
        ],
        orderBy: [
          {
            fieldName: "upload_date_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('resume_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const transformedResumes = (response.data || []).map(resume => ({
        Id: resume.Id,
        name: resume.Name || '',
        uploadDate: resume.upload_date_c || new Date().toISOString(),
        fileUrl: resume.file_url_c || '',
        isDefault: resume.is_default_c || false
      }));

      return transformedResumes;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching resumes:", error?.response?.data?.message);
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
          { field: { Name: "upload_date_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "is_default_c" } }
        ]
      };

      const response = await apperClient.getRecordById('resume_c', parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Resume not found");
      }

      const resume = response.data;
      return {
        Id: resume.Id,
        name: resume.Name || '',
        uploadDate: resume.upload_date_c || new Date().toISOString(),
        fileUrl: resume.file_url_c || '',
        isDefault: resume.is_default_c || false
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching resume with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(resume) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: resume.name || '',
          upload_date_c: new Date().toISOString(),
          file_url_c: resume.fileUrl || resume.file_url_c || '',
          is_default_c: resume.isDefault || resume.is_default_c || false
        }]
      };

      const response = await apperClient.createRecord('resume_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create resume ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create resume");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const created = successfulRecord.data;
          return {
            Id: created.Id,
            name: created.Name || '',
            uploadDate: created.upload_date_c || new Date().toISOString(),
            fileUrl: created.file_url_c || '',
            isDefault: created.is_default_c || false
          };
        }
      }

      throw new Error("Failed to create resume");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating resume:", error?.response?.data?.message);
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
      if (updates.fileUrl !== undefined) updateData.file_url_c = updates.fileUrl;
      if (updates.isDefault !== undefined) updateData.is_default_c = updates.isDefault;
      if (updates.uploadDate !== undefined) updateData.upload_date_c = updates.uploadDate;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('resume_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update resume ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update resume");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const updated = successfulRecord.data;
          return {
            Id: updated.Id,
            name: updated.Name || '',
            uploadDate: updated.upload_date_c || new Date().toISOString(),
            fileUrl: updated.file_url_c || '',
            isDefault: updated.is_default_c || false
          };
        }
      }

      throw new Error("Failed to update resume");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating resume:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('resume_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete resume ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to delete resume");
        }

        return true;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting resume:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async setDefault(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First, get all resumes to set them to non-default
      const allResumes = await this.getAll();
      
      // Update all resumes to set is_default_c to false, then set the target one to true
      const updatePromises = allResumes.map(resume => {
        const updateData = {
          Id: resume.Id,
          is_default_c: resume.Id === parseInt(id)
        };

        const params = {
          records: [updateData]
        };

        return apperClient.updateRecord('resume_c', params);
      });

      await Promise.all(updatePromises);

      // Return updated list
      return await this.getAll();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error setting default resume:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};