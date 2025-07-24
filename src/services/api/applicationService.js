import applicationsData from "@/services/mockData/applications.json";

let applications = [...applicationsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const applicationService = {
  async getAll() {
    await delay(300);
    return [...applications];
  },

  async getById(id) {
    await delay(200);
    const application = applications.find(a => a.Id === parseInt(id));
    if (!application) {
      throw new Error("Application not found");
    }
    return { ...application };
  },

  async create(application) {
    await delay(400);
    const maxId = Math.max(...applications.map(a => a.Id), 0);
    const newApplication = {
      ...application,
      Id: maxId + 1,
      appliedDate: new Date().toISOString(),
      status: "Applied"
    };
    applications.push(newApplication);
    return { ...newApplication };
  },

  async update(id, updates) {
    await delay(300);
    const index = applications.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Application not found");
    }
    applications[index] = { ...applications[index], ...updates };
    return { ...applications[index] };
  },

  async delete(id) {
    await delay(250);
    const index = applications.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Application not found");
    }
    applications.splice(index, 1);
    return true;
  },

  async getByJobId(jobId) {
    await delay(200);
    return applications.filter(a => a.jobId === parseInt(jobId));
  }
};