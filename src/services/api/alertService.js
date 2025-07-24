import alertsData from "@/services/mockData/jobAlerts.json";

let alerts = [...alertsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const alertService = {
  async getAll() {
    await delay(300);
    return [...alerts];
  },

  async getById(id) {
    await delay(200);
    const alert = alerts.find(a => a.Id === parseInt(id));
    if (!alert) {
      throw new Error("Alert not found");
    }
    return { ...alert };
  },

  async create(alert) {
    await delay(400);
    const maxId = Math.max(...alerts.map(a => a.Id), 0);
    const newAlert = {
      ...alert,
      Id: maxId + 1
    };
    alerts.push(newAlert);
    return { ...newAlert };
  },

  async update(id, updates) {
    await delay(300);
    const index = alerts.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Alert not found");
    }
    alerts[index] = { ...alerts[index], ...updates };
    return { ...alerts[index] };
  },

  async delete(id) {
    await delay(250);
    const index = alerts.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Alert not found");
    }
    alerts.splice(index, 1);
    return true;
  },

  async toggleActive(id) {
    await delay(300);
    const alert = alerts.find(a => a.Id === parseInt(id));
    if (alert) {
      alert.isActive = !alert.isActive;
    }
    return { ...alert };
  }
};