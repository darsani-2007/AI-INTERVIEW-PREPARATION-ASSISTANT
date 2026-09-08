import React, { useState, useEffect } from "react";
import { User, Profile, Resume, Interview, ImprovementTask } from "./types";
import { authService } from "./services/auth";
import { dbService } from "./services/db";

// Layout & UI
import { Sidebar, NavigationTab } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { LogoutConfirmModal } from "./components/layout/LogoutConfirmModal";

// Views
import { LandingPage } from "./components/landing/LandingPage";
import { SignupPage } from "./components/auth/SignupPage";
import { LoginPage } from "./components/auth/LoginPage";
import { MainDashboard } from "./components/dashboard/MainDashboard";
import { ProfilePage } from "./components/profile/ProfilePage";
import { ResumePage } from "./components/resume/ResumePage";
import { MockInterviewSetup } from "./components/interview/MockInterviewSetup";
import { MockInterviewChat } from "./components/interview/MockInterviewChat";
import { InterviewEvaluationModal } from "./components/interview/InterviewEvaluationModal";
import { PracticeQuestionsPage } from "./components/practice/PracticeQuestionsPage";
import { PerformancePage } from "./components/performance/PerformancePage";
import { ImprovementPlanPage } from "./components/plan/ImprovementPlanPage";
import { SettingsPage } from "./components/settings/SettingsPage";

export default function App() {
  // Authentication & User State
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [tasks, setTasks] = useState<ImprovementTask[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Unauthenticated Navigation View: 'landing' | 'signup' | 'login'
  const [authView, setAuthView] = useState<"landing" | "signup" | "login">("landing");

  // Authenticated Navigation Tab
  const [currentTab, setCurrentTab] = useState<NavigationTab>("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Active Mock Interview Configuration State
  const [activeInterviewConfig, setActiveInterviewConfig] = useState<{
    jobRole: string;
    difficulty: "Easy" | "Medium" | "Hard";
    interviewType: "Technical" | "HR" | "Behavioral" | "Mixed";
  } | null>(null);

  // Selected Interview Evaluation Report Modal
  const [selectedReportInterview, setSelectedReportInterview] = useState<Interview | null>(null);

  // Logout Confirmation Modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const sessionUser = await authService.getCurrentSession();
        if (sessionUser) {
          setUser(sessionUser);
          await loadUserData(sessionUser.id);
        }
      } catch (err) {
        console.error("Session initialization error:", err);
      } finally {
        setIsLoadingSession(false);
      }
    };

    initSession();
  }, []);

  // Load all user data from dbService
  const loadUserData = async (userId: string) => {
    try {
      const [userProfile, userResume, userInterviews, userTasks] =
        await Promise.all([
          dbService.getProfile(userId),
          dbService.getResume(userId),
          dbService.getInterviews(userId),
          dbService.getTasks(userId),
        ]);

      setProfile(userProfile);
      setResume(userResume);
      setInterviews(userInterviews);
      setTasks(userTasks);
    } catch (err) {
      console.error("Failed loading user data", err);
    }
  };

  // Auth Handlers
  const handleAuthSuccess = async () => {
    setIsLoadingSession(true);
    const sessionUser = await authService.getCurrentSession();
    if (sessionUser) {
      setUser(sessionUser);
      await loadUserData(sessionUser.id);
      setCurrentTab("dashboard");
    }
    setIsLoadingSession(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
    setResume(null);
    setInterviews([]);
    setTasks([]);
    setIsLogoutModalOpen(false);
    setAuthView("landing");
  };

  const handleAccountDeleted = async () => {
    setUser(null);
    setProfile(null);
    setResume(null);
    setInterviews([]);
    setTasks([]);
    setAuthView("landing");
  };

  // Task Checkbox Toggle Handler
  const handleToggleTask = async (taskId: string, completed: boolean) => {
    if (!user) return;
    try {
      const updated = await dbService.updateTask(user.id, taskId, completed);
      setTasks(updated);
    } catch (err) {
      console.error("Failed updating task", err);
    }
  };

  // Loading Splash Screen
  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse mb-3">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
        <p className="text-xs font-semibold text-slate-700">
          Loading AI Interview Preparation Assistant...
        </p>
      </div>
    );
  }

  // If Not Authenticated, render Landing, Signup, or Login
  if (!user) {
    if (authView === "signup") {
      return (
        <SignupPage
          onSuccess={handleAuthSuccess}
          onNavigateToLogin={() => setAuthView("login")}
          onNavigateToLanding={() => setAuthView("landing")}
        />
      );
    }

    if (authView === "login") {
      return (
        <LoginPage
          onSuccess={handleAuthSuccess}
          onNavigateToSignup={() => setAuthView("signup")}
          onNavigateToLanding={() => setAuthView("landing")}
        />
      );
    }

    return (
      <LandingPage
        onNavigateToSignup={() => setAuthView("signup")}
        onNavigateToLogin={() => setAuthView("login")}
      />
    );
  }

  // Authenticated Student App Shell
  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] font-sans flex flex-col lg:flex-row selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          // If navigating to interview tab from sidebar, reset active config to start fresh setup
          if (tab === "interview" && currentTab !== "interview") {
            setActiveInterviewConfig(null);
          }
          setCurrentTab(tab);
        }}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#F1F5F9]">
        <Header
          user={user}
          profile={profile}
          streakDays={4}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onNavigateToProfile={() => setCurrentTab("profile")}
          onNavigateToSettings={() => setCurrentTab("settings")}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Dashboard Tab */}
          {currentTab === "dashboard" && (
            <MainDashboard
              user={user}
              profile={profile}
              resume={resume}
              interviews={interviews}
              tasks={tasks}
              onNavigateToInterview={() => {
                setActiveInterviewConfig(null);
                setCurrentTab("interview");
              }}
              onNavigateToResume={() => setCurrentTab("resume")}
              onNavigateToPractice={() => setCurrentTab("practice")}
              onNavigateToPlan={() => setCurrentTab("plan")}
              onNavigateToProfile={() => setCurrentTab("profile")}
              onViewInterviewReport={(item) => setSelectedReportInterview(item)}
              onToggleTask={handleToggleTask}
            />
          )}

          {/* Profile Setup Tab */}
          {currentTab === "profile" && (
            <ProfilePage
              user={user}
              profile={profile}
              onProfileUpdated={(updated) => setProfile(updated)}
            />
          )}

          {/* Resume Analysis Tab */}
          {currentTab === "resume" && (
            <ResumePage
              user={user}
              profile={profile}
              currentResume={resume}
              onResumeSaved={(saved) => setResume(saved)}
              onNavigateToInterview={() => {
                setActiveInterviewConfig(null);
                setCurrentTab("interview");
              }}
            />
          )}

          {/* AI Mock Interview Tab */}
          {currentTab === "interview" && (
            <>
              {activeInterviewConfig ? (
                <MockInterviewChat
                  user={user}
                  profile={profile}
                  resume={resume}
                  config={activeInterviewConfig}
                  onFinishInterview={(completedInterview) => {
                    setInterviews((prev) => [...prev, completedInterview]);
                    setActiveInterviewConfig(null);
                    setSelectedReportInterview(completedInterview);
                  }}
                  onExitInterview={() => setActiveInterviewConfig(null)}
                />
              ) : (
                <MockInterviewSetup
                  user={user}
                  profile={profile}
                  resume={resume}
                  onStartInterview={(config) => setActiveInterviewConfig(config)}
                  onNavigateToResume={() => setCurrentTab("resume")}
                />
              )}
            </>
          )}

          {/* Practice Questions Bank */}
          {currentTab === "practice" && <PracticeQuestionsPage />}

          {/* Performance Tracking Tab */}
          {currentTab === "performance" && (
            <PerformancePage
              interviews={interviews}
              onViewReport={(item) => setSelectedReportInterview(item)}
              onStartNewMock={() => {
                setActiveInterviewConfig(null);
                setCurrentTab("interview");
              }}
            />
          )}

          {/* Improvement Plan Tab */}
          {currentTab === "plan" && (
            <ImprovementPlanPage
              tasks={tasks}
              profile={profile}
              userId={user.id}
              onToggleTask={handleToggleTask}
              onRefreshTasks={() => loadUserData(user.id)}
            />
          )}

          {/* Settings Tab */}
          {currentTab === "settings" && (
            <SettingsPage
              user={user}
              profile={profile}
              onProfileUpdated={(updated) => setProfile(updated)}
              onLogout={() => setIsLogoutModalOpen(true)}
              onAccountDeleted={handleAccountDeleted}
            />
          )}
        </main>
      </div>

      {/* Global Interview Evaluation Report Modal */}
      <InterviewEvaluationModal
        interview={selectedReportInterview}
        isOpen={!!selectedReportInterview}
        onClose={() => setSelectedReportInterview(null)}
        onStartNewSession={() => {
          setSelectedReportInterview(null);
          setActiveInterviewConfig(null);
          setCurrentTab("interview");
        }}
      />

      {/* Global Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleLogout}
      />
    </div>
  );
}
