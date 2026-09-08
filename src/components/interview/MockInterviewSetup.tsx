import React, { useState } from "react";
import { User, Profile, Resume } from "../../types";
import { Card, CardHeader, CardTitle, CardDescription, Badge } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface MockInterviewSetupProps {
  user: User;
  profile: Profile | null;
  resume: Resume | null;
  onStartInterview: (config: {
    jobRole: string;
    difficulty: "Easy" | "Medium" | "Hard";
    interviewType: "Technical" | "HR" | "Behavioral" | "Mixed";
  }) => void;
  onNavigateToResume: () => void;
}

export const MockInterviewSetup: React.FC<MockInterviewSetupProps> = ({
  user,
  profile,
  resume,
  onStartInterview,
  onNavigateToResume,
}) => {
  const [jobRole, setJobRole] = useState(profile?.jobRole || "Data Analyst");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [interviewType, setInterviewType] = useState<
    "Technical" | "HR" | "Behavioral" | "Mixed"
  >("Technical");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartInterview({
      jobRole,
      difficulty,
      interviewType,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div className="text-center max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3.5 shadow-lg shadow-blue-200">
          <Brain className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          AI Mock Interview Setup
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Configure your 10-question simulated interview session tailored to your target role and difficulty.
        </p>
      </div>

      {/* Resume context indicator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
              <span>Resume Context:</span>
              {resume ? (
                <Badge variant="success">Loaded ({resume.fileName})</Badge>
              ) : (
                <Badge variant="neutral">Not Uploaded</Badge>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {resume
                ? "AI will personalize questions using your detected projects and skills."
                : "Upload a resume anytime to get hyper-targeted interview scenarios."}
            </p>
          </div>
        </div>
        {!resume && (
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToResume}
            className="text-xs shrink-0"
          >
            Upload Resume
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Interview Parameters</CardTitle>
              <CardDescription>
                Select the target specialization, difficulty level, and focus area
              </CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-5">
            {/* Job Role Dropdown */}
            <div>
              <label
                htmlFor="interview-job-role"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Target Job Role
              </label>
              <select
                id="interview-job-role"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="block w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="Data Analyst">Data Analyst</option>
                <option value="Software Developer">Software Developer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Web Developer">Web Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Difficulty Radio Cards */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "Easy",
                    title: "Easy",
                    desc: "Foundational definitions, standard concepts, and warm-ups.",
                  },
                  {
                    id: "Medium",
                    title: "Medium",
                    desc: "Practical problem solving, trade-offs, and project depth.",
                  },
                  {
                    id: "Hard",
                    title: "Hard",
                    desc: "Edge cases, performance tuning, and tough behavioral questions.",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDifficulty(item.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      difficulty === item.id
                        ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/30"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        {item.title}
                      </span>
                      {difficulty === item.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Type Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Interview Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "Technical", label: "Technical", badge: "Coding & Concepts" },
                  { id: "HR", label: "HR", badge: "Culture & Salary" },
                  { id: "Behavioral", label: "Behavioral", badge: "STAR Stories" },
                  { id: "Mixed", label: "Mixed", badge: "Full Placement Round" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInterviewType(type.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      interviewType === type.id
                        ? "border-blue-600 bg-blue-50/60 text-blue-900 font-semibold shadow-xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="text-xs font-medium">{type.label}</div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {type.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Readiness Checklist */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Interview Preparation Checklist
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc">
            <li>10 adaptive questions will be presented one at a time.</li>
            <li>Take time to structure your thoughts using the STAR method.</li>
            <li>Instant AI feedback is generated for each submitted response.</li>
            <li>A comprehensive diagnostic evaluation report is created upon completion.</li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <Button
            id="interview-start-btn"
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center text-base py-3.5 shadow-lg shadow-blue-200 font-bold"
          >
            Start Interview
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </form>
    </div>
  );
};
