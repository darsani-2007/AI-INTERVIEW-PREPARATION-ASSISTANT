import React from "react";
import { User, Profile, Resume, Interview, ImprovementTask } from "../../types";
import { Card, CardHeader, CardTitle, CardDescription, Badge, Progress } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  FileText,
  HelpCircle,
  ListTodo,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Award,
  ChevronRight,
} from "lucide-react";

interface MainDashboardProps {
  user: User;
  profile: Profile | null;
  resume: Resume | null;
  interviews: Interview[];
  tasks: ImprovementTask[];
  onNavigateToInterview: () => void;
  onNavigateToResume: () => void;
  onNavigateToPractice: () => void;
  onNavigateToPlan: () => void;
  onNavigateToProfile: () => void;
  onViewInterviewReport: (interview: Interview) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  user,
  profile,
  resume,
  interviews,
  tasks,
  onNavigateToInterview,
  onNavigateToResume,
  onNavigateToPractice,
  onNavigateToPlan,
  onNavigateToProfile,
  onViewInterviewReport,
  onToggleTask,
}) => {
  // Compute Profile Completion dynamically
  const calculateProfileCompletion = () => {
    let score = 20; // user signup completed
    if (profile?.fullName) score += 10;
    if (profile?.phone) score += 10;
    if (profile?.college) score += 15;
    if (profile?.degree) score += 10;
    if (profile?.year) score += 5;
    if (profile?.skills && profile.skills.length > 0) score += 15;
    if (profile?.targetCompany) score += 5;
    if (resume) score += 10;
    return Math.min(100, score);
  };

  const profileCompletion = calculateProfileCompletion();

  // Compute average interview score or default to latest / baseline
  const interviewCount = interviews.length;
  const avgScore =
    interviewCount > 0
      ? Math.round(
          interviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / interviewCount
        )
      : resume?.resumeScore || 78;

  const displayName = profile?.fullName || user.fullName || "Student";
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 4 Core Sleek Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 shrink-0">
        {/* Profile Completion */}
        <div id="dash-card-profile-completion" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Profile Completion</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-slate-900">{profileCompletion}%</h3>
              <span className="text-green-600 text-xs font-medium mb-1">
                {profileCompletion >= 80 ? "Almost there!" : "In progress"}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <button
              onClick={onNavigateToProfile}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium mt-2 flex items-center gap-1 cursor-pointer"
            >
              {profileCompletion < 100 ? "Complete profile" : "View profile"}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Interview Score */}
        <div id="dash-card-interview-score" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Interview Score</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-slate-900">
                {avgScore} <span className="text-slate-400 text-lg font-normal">/ 100</span>
              </h3>
              <span className="text-blue-600 text-xs font-medium mb-1">+4.2%</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-end gap-1.5 h-6">
              <div className="h-2 flex-1 bg-slate-200 rounded-full" />
              <div className="h-3.5 flex-1 bg-slate-200 rounded-full" />
              <div className="h-4 flex-1 bg-blue-300 rounded-full" />
              <div className="h-6 flex-1 bg-blue-600 rounded-full" />
              <div className="h-5 flex-1 bg-blue-500 rounded-full" />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {interviewCount > 0 ? `${interviewCount} session${interviewCount > 1 ? "s" : ""} evaluated` : "Initial benchmark"}
            </p>
          </div>
        </div>

        {/* Sessions */}
        <div id="dash-card-interviews-completed" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sessions</p>
            <h3 className="text-2xl font-bold text-slate-900">{interviewCount}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-3">Interviews completed</p>
        </div>

        {/* Current Streak */}
        <div id="dash-card-current-streak" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Streak</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-slate-900">4 Days</h3>
              <span className="text-orange-500 text-xl">🔥</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Keep it up!</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Hero Section + Recent Interviews + Practice */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Sleek Next Step Hero Card */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center bg-gradient-to-br from-white via-white to-blue-50/40 relative overflow-hidden">
            <div className="max-w-xl">
              <div className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
                Next Step
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
                Simulate a technical interview for <span className="text-blue-600">{profile?.jobRole || "Data Analyst"}</span> role.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
                Personalized questions based on your technical skills, college background, and key competencies detected in your profile.
              </p>
              <div className="flex flex-wrap gap-3.5">
                <Button
                  id="dash-start-interview-btn"
                  variant="primary"
                  size="md"
                  onClick={onNavigateToInterview}
                  className="px-6 py-3 font-bold shadow-lg shadow-blue-200"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Start Mock Interview
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={onNavigateToProfile}
                  className="px-6 py-3 font-bold"
                >
                  Change Settings
                </Button>
              </div>
            </div>
          </section>

          {/* Recent Mock Interviews */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Recent Mock Interviews</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Review AI diagnostic reports, questions, and model answers</p>
              </div>
              <Button
                variant="subtle"
                size="sm"
                onClick={onNavigateToInterview}
              >
                New Interview
              </Button>
            </div>

            {interviews.length === 0 ? (
              <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/60">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">
                  No Mock Interviews Completed Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Take your first 10-question AI interview for {profile?.jobRole || "your target role"} to unlock personalized evaluation scores.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onNavigateToInterview}
                >
                  Start Your First Interview
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {interviews.slice(-3).reverse().map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                        {item.overallScore}%
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                            {item.jobRole} Interview
                          </h4>
                          <Badge variant="neutral" className="text-[10px]">
                            {item.difficulty}
                          </Badge>
                          <Badge variant="primary" className="text-[10px]">
                            {item.interviewType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          <span>Tech: {item.technicalScore}%</span>
                          <span>•</span>
                          <span>Comm: {item.communicationScore}%</span>
                          <span>•</span>
                          <span>
                            {new Date(item.completedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewInterviewReport(item)}
                      className="text-xs shrink-0 self-start sm:self-auto"
                    >
                      View Report
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Practice Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
              onClick={onNavigateToPractice}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <Badge variant="neutral">Curated Questions</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Practice Questions by Category
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Explore verified SQL, Python, Excel, Power BI, and HR questions with ideal model answers.
              </p>
              <div className="mt-3 text-xs font-semibold text-blue-600 flex items-center gap-1">
                Browse Questions <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
              onClick={onNavigateToResume}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                {resume ? (
                  <Badge variant="success">{resume.resumeScore} / 100 Score</Badge>
                ) : (
                  <Badge variant="warning">Action Needed</Badge>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Resume Intelligence
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {resume
                  ? `Uploaded: ${resume.fileName}. Discovered ${resume.analysis?.detectedSkills?.length || 0} skills.`
                  : "Upload your PDF or DOC resume for instant AI skill audit and suggestions."}
              </p>
              <div className="mt-3 text-xs font-semibold text-blue-600 flex items-center gap-1">
                {resume ? "View Full Analysis" : "Upload Resume"} <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Resume Analysis + Dark Growth Tasks */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Resume Score Card */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">Resume Score</h2>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                resume ? "bg-green-50 text-green-600 border border-green-200" : "bg-orange-50 text-orange-600 border border-orange-200"
              }`}>
                {resume ? `${resume.resumeScore}/100` : "Not Uploaded"}
              </span>
            </div>
            <div className="space-y-4 flex-1">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2.5">Detected Skills</p>
                <div className="flex flex-wrap gap-2">
                  {(resume?.analysis?.detectedSkills?.slice(0, 6) || profile?.skills?.slice(0, 6) || ["Python", "SQL", "Tableau", "Statistics"]).map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Areas to Improve</p>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
                  <div className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                    ⚠️
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {resume?.analysis?.recommendations?.[0] || "Add measurable outcomes and quantitative metrics to project descriptions."}
                  </p>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
                  <div className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                    ⚠️
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {resume?.analysis?.missingKeywords?.[0] ? `Missing high-impact role keyword: ${resume.analysis.missingKeywords[0]}` : "Align college projects with target role industry keywords."}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToResume}
              className="w-full py-3 mt-5 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-all cursor-pointer"
            >
              {resume ? "View Full Analysis" : "Upload Resume Now"}
            </button>
          </section>

          {/* Sleek Dark Accent Growth Task Card */}
          <section className="bg-[#0F172A] p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
            <h2 className="font-bold mb-4 flex items-center justify-between text-base">
              <span>Growth Task</span>
              <span
                onClick={onNavigateToPlan}
                className="text-xs text-slate-400 font-normal hover:text-white underline cursor-pointer transition-colors"
              >
                View All
              </span>
            </h2>
            <div className="space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id, !task.completed)}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id, !task.completed)}
                    className="w-5 h-5 rounded-md border-slate-500 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-medium leading-snug ${task.completed ? "line-through text-slate-400" : "text-white"}`}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Week {task.week} • {task.category}
                    </p>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-xs text-slate-400 py-3 text-center">No current growth tasks</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
