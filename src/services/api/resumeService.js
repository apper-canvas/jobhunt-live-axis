import resumesData from "@/services/mockData/resumes.json";

let resumes = [...resumesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const resumeService = {
  async getAll() {
    await delay(300);
    return [...resumes];
  },

  async getById(id) {
    await delay(200);
    const resume = resumes.find(r => r.Id === parseInt(id));
    if (!resume) {
      throw new Error("Resume not found");
    }
    return { ...resume };
  },

  async create(resume) {
    await delay(500);
    const maxId = Math.max(...resumes.map(r => r.Id), 0);
    const newResume = {
      ...resume,
      Id: maxId + 1,
      uploadDate: new Date().toISOString()
    };
    resumes.push(newResume);
    return { ...newResume };
  },

  async update(id, updates) {
    await delay(300);
    const index = resumes.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Resume not found");
    }
    resumes[index] = { ...resumes[index], ...updates };
    return { ...resumes[index] };
  },

  async delete(id) {
    await delay(250);
    const index = resumes.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Resume not found");
    }
    resumes.splice(index, 1);
    return true;
  },

  async setDefault(id) {
    await delay(300);
    // Set all to false
    resumes.forEach(r => r.isDefault = false);
    // Set the specified one to true
    const resume = resumes.find(r => r.Id === parseInt(id));
    if (resume) {
      resume.isDefault = true;
    }
    return [...resumes];
  }
};