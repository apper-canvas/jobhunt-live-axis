import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { alertService } from "@/services/api/alertService";

const JobAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    location: "",
    industries: [],
    frequency: "daily"
  });

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "Marketing",
    "Engineering", "Sales", "Design", "Operations", "Legal"
  ];

  const loadAlerts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await alertService.getAll();
      setAlerts(data);
    } catch (err) {
      setError(err.message || "Failed to load job alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Please enter an alert name", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const alertData = {
        name: formData.name,
        filters: {
          jobTitle: formData.jobTitle,
          location: formData.location,
          industries: formData.industries
        },
        frequency: formData.frequency,
        isActive: true
      };

      const newAlert = await alertService.create(alertData);
      setAlerts(prev => [...prev, newAlert]);
      setShowCreateForm(false);
      setFormData({
        name: "",
        jobTitle: "",
        location: "",
        industries: [],
        frequency: "daily"
      });
      
      toast.success("Job alert created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to create job alert", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleToggleAlert = async (alertId, currentStatus) => {
    try {
      const updatedAlert = await alertService.toggleActive(alertId);
      setAlerts(prev => 
        prev.map(alert => alert.Id === alertId ? updatedAlert : alert)
      );
      
      toast.success(
        `Alert ${updatedAlert.isActive ? "activated" : "deactivated"}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } catch (err) {
      toast.error("Failed to update alert", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm("Are you sure you want to delete this job alert?")) {
      return;
    }

    try {
      await alertService.delete(alertId);
      setAlerts(prev => prev.filter(alert => alert.Id !== alertId));
      
      toast.success("Job alert deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to delete job alert", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleIndustryToggle = (industry) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAlerts} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-secondary to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
                Job Alerts
              </h1>
              <p className="text-xl text-purple-100">
                Stay ahead with personalized job notifications
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0">
              <Button
                variant="secondary"
                onClick={() => setShowCreateForm(true)}
                icon="Plus"
                className="bg-white text-secondary hover:bg-purple-50"
              >
                Create New Alert
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white text-center">
            <ApperIcon name="Bell" size={32} className="mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{alerts.length}</div>
            <div className="text-purple-100 text-sm">Total Alerts</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white text-center">
            <ApperIcon name="CheckCircle" size={32} className="mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {alerts.filter(alert => alert.isActive).length}
            </div>
            <div className="text-green-100 text-sm">Active Alerts</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white text-center">
            <ApperIcon name="Clock" size={32} className="mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">
              {alerts.filter(alert => alert.frequency === "daily").length}
            </div>
            <div className="text-blue-100 text-sm">Daily Alerts</div>
          </div>
        </div>

        {/* Create Alert Form */}
{showCreateForm && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateForm(false)}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 font-display">
                    Create New Job Alert
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleCreateAlert} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alert Name
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Senior Developer Jobs"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <Input
                        value={formData.jobTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., San Francisco, Remote"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                        className="input-field"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Industries (Select multiple)
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {industries.map((industry) => (
                        <label
                          key={industry}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.industries.includes(industry)}
                            onChange={() => handleIndustryToggle(industry)}
                            className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                          />
                          <span className="text-sm text-gray-700">{industry}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="success" icon="Plus">
                      Create Alert
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Alerts List */}
        {alerts.length === 0 ? (
          <Empty
            type="alerts"
            onAction={() => setShowCreateForm(true)}
            actionText="Create Your First Alert"
          />
        ) : (
          <div className="space-y-6">
            {alerts.map((alert) => (
              <Card key={alert.Id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 font-display">
                        {alert.name}
                      </h3>
                      <Badge 
                        variant={alert.isActive ? "success" : "outline"}
                        className="flex items-center space-x-1"
                      >
                        <ApperIcon 
                          name={alert.isActive ? "CheckCircle" : "Pause"} 
                          size={14} 
                        />
                        <span>{alert.isActive ? "Active" : "Paused"}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {alert.filters.jobTitle && (
                        <div className="flex items-center text-sm text-gray-600">
                          <ApperIcon name="Briefcase" size={16} className="mr-2 text-primary" />
                          <span><strong>Title:</strong> {alert.filters.jobTitle}</span>
                        </div>
                      )}
                      
                      {alert.filters.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <ApperIcon name="MapPin" size={16} className="mr-2 text-accent" />
                          <span><strong>Location:</strong> {alert.filters.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Clock" size={16} className="mr-2 text-secondary" />
                        <span><strong>Frequency:</strong> {alert.frequency}</span>
                      </div>
                    </div>
                    
                    {alert.filters.industries && alert.filters.industries.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Industries:</p>
                        <div className="flex flex-wrap gap-2">
                          {alert.filters.industries.map((industry) => (
                            <Badge key={industry} variant="outline" size="sm">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant={alert.isActive ? "outline" : "success"}
                      onClick={() => handleToggleAlert(alert.Id, alert.isActive)}
                      icon={alert.isActive ? "Pause" : "Play"}
                    >
                      {alert.isActive ? "Pause" : "Activate"}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAlert(alert.Id)}
                      icon="Trash2"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAlertsPage;