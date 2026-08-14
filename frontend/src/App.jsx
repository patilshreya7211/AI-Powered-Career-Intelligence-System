import { Routes, Route } from "react-router-dom";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

// ==========================================
// USER PAGES
// ==========================================

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Resume from "./pages/Resume";
import MyResumes from "./pages/MyResumes";
import AnalyzeResume from "./pages/AnalyzeResume";

import Skills from "./pages/Skills";
import Education from "./pages/Education";

import CareerRecommendation from "./pages/CareerRecommendation";
import CareerRoadmap from "./pages/CareerRoadmap";
import PlacementReadiness from "./pages/PlacementReadiness";
import ATSAnalysis from "./pages/ATSAnalysis";
import SkillGap from "./pages/SkillGap";
import JobRecommendation from "./pages/JobRecommendation";

import LearningResources from "./pages/LearningResources";
import DashboardAnalytics from "./pages/DashboardAnalytics";

import ResumeBuilder from "./pages/ResumeBuilder";
import ResumePreview from "./pages/ResumePreview";

import AICareerAssistance from "./pages/AICareerAssistance";

// ==========================================
// ADMIN
// ==========================================

import AdminDashboard from "./pages/AdminDashboard";

// ==========================================
// PROTECTED ROUTE
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
          ===================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />


      {/* =====================================================
          USER DASHBOARD
          Student / Job Seeker
          ===================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          ADMIN DASHBOARD
          ===================================================== */}

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["Admin", "admin"]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          USER PROFILE
          ===================================================== */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <Profile />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          SKILLS
          ===================================================== */}

      <Route
        path="/skills"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <Skills />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          EDUCATION
          ===================================================== */}

      <Route
        path="/education"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <Education />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          RESUME UPLOAD
          ===================================================== */}

      <Route
        path="/resume"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <Resume />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          MY RESUMES
          ===================================================== */}

      <Route
        path="/my-resumes"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <MyResumes />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          RESUME ANALYSIS
          ===================================================== */}

      <Route
        path="/analyze/:resumeId"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <AnalyzeResume />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          RESUME BUILDER
          ===================================================== */}

      <Route
        path="/resume-builder"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          RESUME PREVIEW
          ===================================================== */}

      <Route
        path="/resume-preview"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <ResumePreview />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          CAREER RECOMMENDATION
          ===================================================== */}

      <Route
        path="/career-recommendation"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <CareerRecommendation />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          CAREER ROADMAP
          ===================================================== */}

      <Route
        path="/career-roadmap"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <CareerRoadmap />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          PLACEMENT READINESS
          ===================================================== */}

      <Route
        path="/placement-readiness"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <PlacementReadiness />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          ATS ANALYSIS
          ===================================================== */}

      <Route
        path="/ats"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <ATSAnalysis />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          SKILL GAP
          ===================================================== */}

      <Route
        path="/skill-gap"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <SkillGap />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          JOB RECOMMENDATION
          ===================================================== */}

      <Route
        path="/job-recommendation"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <JobRecommendation />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          LEARNING RESOURCES
          ===================================================== */}

      <Route
        path="/learning-resources"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <LearningResources />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          DASHBOARD ANALYTICS
          ===================================================== */}

      <Route
        path="/dashboard-analytics"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <DashboardAnalytics />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          AI CAREER ASSISTANCE
          ===================================================== */}

      <Route
        path="/ai-career-assistance"
        element={
          <ProtectedRoute
            allowedRoles={["Student", "student", "Job Seeker", "job seeker"]}
          >
            <AICareerAssistance />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;