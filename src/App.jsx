import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import JobSearchPage from "@/components/pages/JobSearchPage";
import ApplicationsPage from "@/components/pages/ApplicationsPage";
import JobAlertsPage from "@/components/pages/JobAlertsPage";
import ResumePage from "@/components/pages/ResumePage";
import InterviewPrepPage from "@/components/pages/InterviewPrepPage";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main>
<Routes>
            <Route path="/" element={<JobSearchPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/alerts" element={<JobAlertsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/interview-prep" element={<InterviewPrepPage />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;