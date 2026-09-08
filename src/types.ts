export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  year: string;
  jobRole: string;
  experienceLevel: string;
  skills: string[];
  targetCompany: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileSize?: string;
  fileUrl?: string;
  resumeScore: number;
  analysis: ResumeAnalysis;
  createdAt: string;
}

export interface ResumeAnalysis {
  detectedSkills: string[];
  detectedProjects: string[];
  education: string;
  experience: string;
  strengths: string[];
  missingSkills: string[];
  suggestedImprovements: string[];
}

export interface Interview {
  id: string;
  userId: string;
  jobRole: string;
  difficulty: "Easy" | "Medium" | "Hard";
  interviewType: "Technical" | "HR" | "Behavioral" | "Mixed";
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  relevanceScore?: number;
  problemSolvingScore?: number;
  completedAt: string;
  evaluation?: InterviewEvaluationReport;
  strengths?: string[];
  weaknesses?: string[];
  betterAnswer?: {
    question: string;
    yourAnswer: string;
    suggestedAnswer: string;
    tip: string;
  };
  aiRecommendation?: string;
}

export interface InterviewQuestionItem {
  id: string;
  interviewId: string;
  questionNumber: number;
  question: string;
  answer: string;
  score?: number;
  feedback?: string;
  interviewerNote?: string;
}

export interface InterviewEvaluationReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  relevanceScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  betterAnswers: {
    question: string;
    candidateAnswer: string;
    improvedAnswer: string;
    improvementTip: string;
  }[];
  aiRecommendation: string;
}

export interface ImprovementTask {
  id: string;
  userId: string;
  week: number;
  weekTitle?: string;
  title: string;
  description: string;
  category: "Technical" | "Communication" | "Mock Interview" | "Resume" | string;
  completed: boolean;
  createdAt?: string;
}

export interface PracticeQuestion {
  id: string;
  category: "Python" | "SQL" | "Excel" | "Power BI" | "Machine Learning" | "HR" | "Behavioral" | string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  idealAnswer: string;
  keyPoints: string[];
  targetRoles: string[];
}
