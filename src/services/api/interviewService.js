import mockInterviewQuestions from '@/services/mockData/mockInterviewQuestions.json';

// In-memory storage for runtime modifications
let questionsData = [...mockInterviewQuestions];
let nextId = Math.max(...mockInterviewQuestions.map(q => q.Id)) + 1;

export const interviewService = {
  // Get all interview questions
  getAll: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...questionsData];
  },

  // Get interview question by ID
  getById: async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid question ID');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    const question = questionsData.find(q => q.Id === id);
    
    if (!question) {
      throw new Error('Interview question not found');
    }
    
    return { ...question };
  },

  // Get questions by category
  getByCategory: async (category) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return questionsData.filter(q => q.category === category).map(q => ({ ...q }));
  },

  // Get questions by difficulty
  getByDifficulty: async (difficulty) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return questionsData.filter(q => q.difficulty === difficulty).map(q => ({ ...q }));
  },

  // Create new interview question
  create: async (questionData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newQuestion = {
      Id: nextId++,
      question: questionData.question || '',
      category: questionData.category || 'general',
      difficulty: questionData.difficulty || 'beginner',
      keyPoints: questionData.keyPoints || [],
      sampleAnswer: questionData.sampleAnswer || '',
      tips: questionData.tips || [],
      tags: questionData.tags || [],
      createdAt: new Date().toISOString()
    };
    
    questionsData.push(newQuestion);
    return { ...newQuestion };
  },

  // Update interview question
  update: async (id, questionData) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid question ID');
    }
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = questionsData.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error('Interview question not found');
    }
    
    const updatedQuestion = {
      ...questionsData[index],
      ...questionData,
      Id: id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };
    
    questionsData[index] = updatedQuestion;
    return { ...updatedQuestion };
  },

  // Delete interview question
  delete: async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid question ID');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = questionsData.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error('Interview question not found');
    }
    
    const deletedQuestion = questionsData.splice(index, 1)[0];
    return { ...deletedQuestion };
  },

  // Search questions
  search: async (searchTerm) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const term = searchTerm.toLowerCase();
    return questionsData
      .filter(q => 
        q.question.toLowerCase().includes(term) ||
        q.category.toLowerCase().includes(term) ||
        q.tags.some(tag => tag.toLowerCase().includes(term))
      )
      .map(q => ({ ...q }));
  }
};