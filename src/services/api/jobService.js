import jobsData from "@/services/mockData/jobs.json";

let jobs = [...jobsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const jobService = {
  async getAll(filters = {}) {
    await delay(300);
    
    let filteredJobs = [...jobs];
    
    // Apply filters
    if (filters.location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.jobTitle) {
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(filters.jobTitle.toLowerCase())
      );
    }
    
    if (filters.industries && filters.industries.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        filters.industries.includes(job.industry)
      );
    }
    
    if (filters.salaryRange) {
      filteredJobs = filteredJobs.filter(job => {
        if (!job.salary) return false;
        const jobMin = job.salary.min || job.salary.amount || 0;
        const jobMax = job.salary.max || job.salary.amount || Infinity;
        return jobMax >= filters.salaryRange.min && jobMin <= filters.salaryRange.max;
      });
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)
      );
    }
    
    return filteredJobs;
  },

  async getById(id) {
    await delay(200);
    const job = jobs.find(j => j.Id === parseInt(id));
    if (!job) {
      throw new Error("Job not found");
    }
    return { ...job };
  },

  async create(job) {
    await delay(400);
    const maxId = Math.max(...jobs.map(j => j.Id), 0);
    const newJob = {
      ...job,
      Id: maxId + 1,
      postedDate: new Date().toISOString()
    };
    jobs.push(newJob);
    return { ...newJob };
  },

  async update(id, updates) {
    await delay(300);
    const index = jobs.findIndex(j => j.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Job not found");
    }
    jobs[index] = { ...jobs[index], ...updates };
    return { ...jobs[index] };
  },

  async delete(id) {
    await delay(250);
    const index = jobs.findIndex(j => j.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Job not found");
    }
    jobs.splice(index, 1);
    return true;
  }
};