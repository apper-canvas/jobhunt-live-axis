export const interviewService = {
  // Get all interview questions
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "question_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "key_points_c" } },
          { field: { Name: "sample_answer_c" } },
          { field: { Name: "tips_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('interview_question_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const transformedQuestions = (response.data || []).map(question => ({
        Id: question.Id,
        question: question.question_c || '',
        category: question.category_c || 'general',
        difficulty: question.difficulty_c || 'beginner',
        keyPoints: question.key_points_c ? question.key_points_c.split('\n').filter(p => p.trim()) : [],
        sampleAnswer: question.sample_answer_c || '',
        tips: question.tips_c ? question.tips_c.split('\n').filter(t => t.trim()) : [],
        tags: question.Tags ? question.Tags.split(',').map(t => t.trim()).filter(t => t) : [],
        createdAt: question.created_at_c || new Date().toISOString(),
        updatedAt: question.updated_at_c
      }));

      return transformedQuestions;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching interview questions:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  // Get interview question by ID
  getById: async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid question ID');
    }

    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "question_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "key_points_c" } },
          { field: { Name: "sample_answer_c" } },
          { field: { Name: "tips_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };

      const response = await apperClient.getRecordById('interview_question_c', id, params);

      if (!response || !response.data) {
        throw new Error('Interview question not found');
      }

      const question = response.data;
      return {
        Id: question.Id,
        question: question.question_c || '',
        category: question.category_c || 'general',
        difficulty: question.difficulty_c || 'beginner',
        keyPoints: question.key_points_c ? question.key_points_c.split('\n').filter(p => p.trim()) : [],
        sampleAnswer: question.sample_answer_c || '',
        tips: question.tips_c ? question.tips_c.split('\n').filter(t => t.trim()) : [],
        tags: question.Tags ? question.Tags.split(',').map(t => t.trim()).filter(t => t) : [],
        createdAt: question.created_at_c || new Date().toISOString(),
        updatedAt: question.updated_at_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching interview question with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  // Get questions by category
  getByCategory: async (category) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "question_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "key_points_c" } },
          { field: { Name: "sample_answer_c" } },
          { field: { Name: "tips_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('interview_question_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedQuestions = (response.data || []).map(question => ({
        Id: question.Id,
        question: question.question_c || '',
        category: question.category_c || 'general',
        difficulty: question.difficulty_c || 'beginner',
        keyPoints: question.key_points_c ? question.key_points_c.split('\n').filter(p => p.trim()) : [],
        sampleAnswer: question.sample_answer_c || '',
        tips: question.tips_c ? question.tips_c.split('\n').filter(t => t.trim()) : [],
        tags: question.Tags ? question.Tags.split(',').map(t => t.trim()).filter(t => t) : [],
        createdAt: question.created_at_c || new Date().toISOString(),
        updatedAt: question.updated_at_c
      }));

      return transformedQuestions;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching questions by category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  // Get questions by difficulty
  getByDifficulty: async (difficulty) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "question_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "key_points_c" } },
          { field: { Name: "sample_answer_c" } },
          { field: { Name: "tips_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "difficulty_c",
            Operator: "EqualTo",
            Values: [difficulty]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('interview_question_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedQuestions = (response.data || []).map(question => ({
        Id: question.Id,
        question: question.question_c || '',
        category: question.category_c || 'general',
        difficulty: question.difficulty_c || 'beginner',
        keyPoints: question.key_points_c ? question.key_points_c.split('\n').filter(p => p.trim()) : [],
        sampleAnswer: question.sample_answer_c || '',
        tips: question.tips_c ? question.tips_c.split('\n').filter(t => t.trim()) : [],
        tags: question.Tags ? question.Tags.split(',').map(t => t.trim()).filter(t => t) : [],
        createdAt: question.created_at_c || new Date().toISOString(),
        updatedAt: question.updated_at_c
      }));

      return transformedQuestions;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching questions by difficulty:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  // Create new interview question
  create: async (questionData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: questionData.question || questionData.question_c || '',
          question_c: questionData.question || questionData.question_c || '',
          category_c: questionData.category || questionData.category_c || 'general',
          difficulty_c: questionData.difficulty || questionData.difficulty_c || 'beginner',
          key_points_c: Array.isArray(questionData.keyPoints) ? 
            questionData.keyPoints.join('\n') : (questionData.key_points_c || ''),
          sample_answer_c: questionData.sampleAnswer || questionData.sample_answer_c || '',
          tips_c: Array.isArray(questionData.tips) ? 
            questionData.tips.join('\n') : (questionData.tips_c || ''),
          Tags: Array.isArray(questionData.tags) ? 
            questionData.tags.join(',') : (questionData.Tags || ''),
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('interview_question_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create interview question ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create interview question");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const created = successfulRecord.data;
          return {
            Id: created.Id,
            question: created.question_c || '',
            category: created.category_c || 'general',
            difficulty: created.difficulty_c || 'beginner',
            keyPoints: created.key_points_c ? created.key_points_c.split('\n').filter(p => p.trim()) : [],
            sampleAnswer: created.sample_answer_c || '',
            tips: created.tips_c ? created.tips_c.split('\n').filter(t => t.trim()) : [],
            tags: created.Tags ? created.Tags.split(',').map(t => t.trim()).filter(t => t) : [],
            createdAt: created.created_at_c || new Date().toISOString()
          };
        }
      }

      throw new Error("Failed to create interview question");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating interview question:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  // Update interview question
  update: async (id, questionData) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid question ID');
    }

    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: id,
        updated_at_c: new Date().toISOString()
      };

      // Map UI fields to database fields for updates
      if (questionData.question !== undefined) {
        updateData.Name = questionData.question;
        updateData.question_c = questionData.question;
      }
      if (questionData.category !== undefined) updateData.category_c = questionData.category;
      if (questionData.difficulty !== undefined) updateData.difficulty_c = questionData.difficulty;
      if (questionData.keyPoints !== undefined) {
        updateData.key_points_c = Array.isArray(questionData.keyPoints) ? 
          questionData.keyPoints.join('\n') : questionData.keyPoints;
      }
      if (questionData.sampleAnswer !== undefined) updateData.sample_answer_c = questionData.sampleAnswer;
      if (questionData.tips !== undefined) {
        updateData.tips_c = Array.isArray(questionData.tips) ? 
          questionData.tips.join('\n') : questionData.tips;
      }
      if (questionData.tags !== undefined) {
        updateData.Tags = Array.isArray(questionData.tags) ? 
          questionData.tags.join(',') : questionData.tags;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('interview_question_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update interview question ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update interview question");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          const updated = successfulRecord.data;
          return {
            Id: updated.Id,
            question: updated.question_c || '',
            category: updated.category_c || 'general',
            difficulty: updated.difficulty_c || 'beginner',
            keyPoints: updated.key_points_c ? updated.key_points_c.split('\n').filter(p => p.trim()) : [],
            sampleAnswer: updated.sample_answer_c || '',
            tips: updated.tips_c ? updated.tips_c.split('\n').filter(t => t.trim()) : [],
            tags: updated.Tags ? updated.Tags.split(',').map(t => t.trim()).filter(t => t) : [],
            createdAt: updated.created_at_c || new Date().toISOString(),
            updatedAt: updated.updated_at_c
          };
        }
      }

      throw new Error("Failed to update interview question");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating interview question:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  // Delete interview question
  delete: async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid question ID');
    }

    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('interview_question_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete interview question ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to delete interview question");
        }

        return true;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting interview question:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  // Search questions
  search: async (searchTerm) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "question_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "key_points_c" } },
          { field: { Name: "sample_answer_c" } },
          { field: { Name: "tips_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "question_c",
                operator: "Contains",
                values: [searchTerm]
              }],
              operator: ""
            },
            {
              conditions: [{
                fieldName: "category_c",
                operator: "Contains",
                values: [searchTerm]
              }],
              operator: ""
            },
            {
              conditions: [{
                fieldName: "Tags",
                operator: "Contains",
                values: [searchTerm]
              }],
              operator: ""
            }
          ]
        }],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('interview_question_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedQuestions = (response.data || []).map(question => ({
        Id: question.Id,
        question: question.question_c || '',
        category: question.category_c || 'general',
        difficulty: question.difficulty_c || 'beginner',
        keyPoints: question.key_points_c ? question.key_points_c.split('\n').filter(p => p.trim()) : [],
        sampleAnswer: question.sample_answer_c || '',
        tips: question.tips_c ? question.tips_c.split('\n').filter(t => t.trim()) : [],
        tags: question.Tags ? question.Tags.split(',').map(t => t.trim()).filter(t => t) : [],
        createdAt: question.created_at_c || new Date().toISOString(),
        updatedAt: question.updated_at_c
      }));

      return transformedQuestions;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching interview questions:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};