import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { resumeService } from "@/services/api/resumeService";

const ResumePage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const loadResumes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await resumeService.getAll();
      setResumes(data);
    } catch (err) {
      setError(err.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes("pdf")) {
      toast.error("Please upload a PDF file", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setUploading(true);
    
    try {
      // In a real app, you would upload to a file storage service
      const resumeData = {
        name: file.name,
        fileUrl: URL.createObjectURL(file), // Temporary URL for demo
        isDefault: resumes.length === 0 // First resume becomes default
      };

      const newResume = await resumeService.create(resumeData);
      setResumes(prev => [...prev, newResume]);
      
      toast.success("Resume uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to upload resume", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setUploading(false);
      event.target.value = ""; // Reset file input
    }
  };

  const handleSetDefault = async (resumeId) => {
    try {
      const updatedResumes = await resumeService.setDefault(resumeId);
      setResumes(updatedResumes);
      
      toast.success("Default resume updated", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to update default resume", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      await resumeService.delete(resumeId);
      setResumes(prev => prev.filter(resume => resume.Id !== resumeId));
      
      toast.success("Resume deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to delete resume", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadResumes} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-accent to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
                My Resume
              </h1>
              <p className="text-xl text-green-100">
                Manage your resumes and apply to jobs with one click
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0">
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                icon="Upload"
                loading={uploading}
                className="bg-white text-accent hover:bg-green-50"
              >
                Upload Resume
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tips Section */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
              <ApperIcon name="Lightbulb" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">
                Resume Tips for Success
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Check" size={16} className="text-green-600" />
                  <span>Keep it to 1-2 pages maximum</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Check" size={16} className="text-green-600" />
                  <span>Use action verbs and quantify achievements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Check" size={16} className="text-green-600" />
                  <span>Tailor your resume for each job application</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Check" size={16} className="text-green-600" />
                  <span>Include relevant keywords from job descriptions</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Upload Area */}
        <Card className="p-8 mb-8 text-center border-2 border-dashed border-gray-300 hover:border-accent transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
            {uploading ? (
              <ApperIcon name="Loader2" size={32} className="animate-spin" />
            ) : (
              <ApperIcon name="Upload" size={32} />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
            {uploading ? "Uploading..." : "Upload Your Resume"}
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your PDF file here, or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supported format: PDF (Maximum 5MB)
          </p>
        </Card>

        {/* Resumes List */}
        {resumes.length === 0 ? (
          <Empty
            type="resumes"
            onAction={() => fileInputRef.current?.click()}
            actionText="Upload Your First Resume"
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 font-display">
                Your Resumes ({resumes.length})
              </h2>
              <Button
                variant="ghost"
                onClick={loadResumes}
                icon="RefreshCw"
                size="sm"
              >
                Refresh
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {resumes.map((resume) => (
                <Card key={resume.Id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white">
                        <ApperIcon name="FileText" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 truncate font-display">
                          {resume.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Uploaded {new Date(resume.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {resume.isDefault && (
                      <Badge variant="success" className="flex items-center space-x-1">
                        <ApperIcon name="Star" size={14} />
                        <span>Default</span>
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(resume.fileUrl, "_blank")}
                        icon="Eye"
                      >
                        Preview
                      </Button>
                      
                      {!resume.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(resume.Id)}
                          icon="Star"
                        >
                          Set Default
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteResume(resume.Id)}
                      icon="Trash2"
                      className="text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {resumes.length > 0 && (
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white text-center">
                <ApperIcon name="FileText" size={32} className="mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{resumes.length}</div>
                <div className="text-blue-100 text-sm">Total Resumes</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white text-center">
                <ApperIcon name="Star" size={32} className="mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">
                  {resumes.filter(r => r.isDefault).length}
                </div>
                <div className="text-green-100 text-sm">Default Resume</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white text-center">
                <ApperIcon name="Download" size={32} className="mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">
                  {resumes.filter(r => r.uploadDate).length}
                </div>
                <div className="text-purple-100 text-sm">Ready to Use</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePage;