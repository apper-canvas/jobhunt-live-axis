import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { AuthContext } from "@/App";
import { jobService } from "@/services/api/jobService";
import { applicationService } from "@/services/api/applicationService";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [quickApplyLoading, setQuickApplyLoading] = useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const handleQuickApply = async () => {
    if (quickApplyLoading) return;
    
    setQuickApplyLoading(true);
    
    try {
      // Get the most recent job
      const jobs = await jobService.getAll();
      
      if (!jobs || jobs.length === 0) {
        toast.error("No jobs available for quick apply at the moment.", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const latestJob = jobs[0]; // Get the most recent job
      
      // Create application for the latest job
      await applicationService.create({
        jobId: latestJob.Id,
        resumeUsed: "Default Resume",
        notes: `Quick Apply to ${latestJob.title_c || latestJob.Name} at ${latestJob.company_c} through JobHunt Pro`
      });
      
      toast.success(`🚀 Quick Apply successful! Applied to ${latestJob.title_c || latestJob.Name} at ${latestJob.company_c}!`, {
        position: "top-right",
        autoClose: 5000,
      });
      
    } catch (error) {
      console.error("Quick Apply failed:", error);
      toast.error("❌ Quick Apply failed. Please try again or apply manually.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setQuickApplyLoading(false);
    }
  };
const navigation = [
    { name: "Job Search", href: "/", icon: "Search" },
    { name: "My Applications", href: "/applications", icon: "FileText" },
    { name: "Job Alerts", href: "/alerts", icon: "Bell" },
    { name: "My Resume", href: "/resume", icon: "Upload" },
    { name: "Interview Prep", href: "/interview-prep", icon: "BookOpen" },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Briefcase" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-display">
                JobHunt Pro
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Find Your Dream Career</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-100",
                  isActive(item.href)
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-700 hover:text-primary"
                )}
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
<div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="success" 
              icon="Zap"
              onClick={handleQuickApply}
              disabled={quickApplyLoading}
            >
              {quickApplyLoading ? "Applying..." : "Quick Apply"}
            </Button>
            <Button variant="secondary" icon="LogOut" onClick={logout}>
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
<div className="pt-4 border-t border-gray-200 mt-4 space-y-3">
              <Button 
                variant="success" 
                className="w-full" 
                icon="Zap"
                onClick={handleQuickApply}
                disabled={quickApplyLoading}
              >
                {quickApplyLoading ? "Applying..." : "Quick Apply"}
              </Button>
              <Button variant="secondary" className="w-full" icon="LogOut" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;