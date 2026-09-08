import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  Profile,
  Resume,
  Interview,
  InterviewQuestionItem,
  ImprovementTask,
  InterviewEvaluationReport,
} from "../types";

const LOCAL_PROFILES_KEY = "ai_prep_profiles";
const LOCAL_RESUMES_KEY = "ai_prep_resumes";
const LOCAL_INTERVIEWS_KEY = "ai_prep_interviews";
const LOCAL_QUESTIONS_KEY = "ai_prep_questions";
const LOCAL_TASKS_KEY = "ai_prep_tasks";

const defaultInitialTasks: Omit<ImprovementTask, "id" | "userId" | "createdAt">[] = [
  {
    week: 1,
    weekTitle: "Improve SQL & Data Foundations",
    title: "Practice SQL JOINs and Aggregations",
    description: "Work through inner joins, left outer joins, and GROUP BY clauses with real datasets.",
    category: "Technical",
    completed: true,
  },
  {
    week: 1,
    weekTitle: "Improve SQL & Data Foundations",
    title: "Solve 10 SQL Interview Questions",
    description: "Complete practice questions on window functions, subqueries, and table manipulation.",
    category: "Technical",
    completed: false,
  },
  {
    week: 2,
    weekTitle: "Elevate Communication & Storytelling",
    title: "Craft & Rehearse 'Tell Me About Yourself'",
    description: "Write down your 90-second elevator pitch covering background, college projects, and enthusiasm.",
    category: "Communication",
    completed: false,
  },
  {
    week: 2,
    weekTitle: "Elevate Communication & Storytelling",
    title: "Prepare 2 Project Explanations using STAR Method",
    description: "Break down your major capstone project into Situation, Task, Action, and Measurable Result.",
    category: "Communication",
    completed: false,
  },
  {
    week: 2,
    weekTitle: "Elevate Communication & Storytelling",
    title: "Practice Standard HR & Behavioral Scenarios",
    description: "Prepare answers for handling conflict, tight deadlines, and learning new frameworks quickly.",
    category: "Communication",
    completed: false,
  },
  {
    week: 3,
    weekTitle: "Simulate Live Mock Interviews",
    title: "Complete 3 Full AI Mock Interviews",
    description: "Complete mock sessions in your target role across Easy, Medium, and Hard difficulty levels.",
    category: "Mock Interview",
    completed: false,
  },
  {
    week: 3,
    weekTitle: "Simulate Live Mock Interviews",
    title: "Review AI Evaluation Report and Weak Areas",
    description: "Study the improved sample answers and refine responses for questions where you scored below 75%.",
    category: "Mock Interview",
    completed: false,
  },
  {
    week: 4,
    weekTitle: "Polish Resume & Final Readiness",
    title: "Incorporate Suggested Resume Action Verbs",
    description: "Update project bullets with quantifiable metrics and replace passive phrasing.",
    category: "Resume",
    completed: false,
  },
];

export const dbService = {
  // PROFILE
  async getProfile(userId: string): Promise<Profile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (data && !error) {
          return {
            id: data.id,
            userId: data.user_id,
            fullName: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            college: data.college || "",
            degree: data.degree || "",
            year: data.year || "",
            jobRole: data.job_role || "Data Analyst",
            experienceLevel: data.experience_level || "Fresher",
            skills: Array.isArray(data.skills) ? data.skills : data.skills ? data.skills.split(",") : [],
            targetCompany: data.target_company || "",
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn("Supabase getProfile error:", err);
      }
    }

    const profilesStr = localStorage.getItem(LOCAL_PROFILES_KEY) || "[]";
    const profiles: Profile[] = JSON.parse(profilesStr);
    return profiles.find((p) => p.userId === userId) || null;
  },

  async saveProfile(profile: Partial<Profile> & { userId: string }): Promise<Profile> {
    const now = new Date().toISOString();
    const existing = await this.getProfile(profile.userId);

    const updated: Profile = {
      id: existing?.id || "prof_" + Math.random().toString(36).substring(2, 9),
      userId: profile.userId,
      fullName: profile.fullName ?? existing?.fullName ?? "",
      email: profile.email ?? existing?.email ?? "",
      phone: profile.phone ?? existing?.phone ?? "",
      college: profile.college ?? existing?.college ?? "",
      degree: profile.degree ?? existing?.degree ?? "",
      year: profile.year ?? existing?.year ?? "",
      jobRole: profile.jobRole ?? existing?.jobRole ?? "Data Analyst",
      experienceLevel: profile.experienceLevel ?? existing?.experienceLevel ?? "Fresher",
      skills: profile.skills ?? existing?.skills ?? ["Python", "SQL", "Excel", "Power BI"],
      targetCompany: profile.targetCompany ?? existing?.targetCompany ?? "Top Tech & Analytics Firms",
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("profiles").upsert({
          id: updated.id,
          user_id: updated.userId,
          full_name: updated.fullName,
          email: updated.email,
          phone: updated.phone,
          college: updated.college,
          degree: updated.degree,
          year: updated.year,
          job_role: updated.jobRole,
          experience_level: updated.experienceLevel,
          skills: updated.skills,
          target_company: updated.targetCompany,
          updated_at: updated.updatedAt,
        });
      } catch (err) {
        console.warn("Supabase upsert profile error:", err);
      }
    }

    const profilesStr = localStorage.getItem(LOCAL_PROFILES_KEY) || "[]";
    let profiles: Profile[] = JSON.parse(profilesStr);
    const idx = profiles.findIndex((p) => p.userId === profile.userId);
    if (idx >= 0) {
      profiles[idx] = updated;
    } else {
      profiles.push(updated);
    }
    localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(profiles));

    return updated;
  },

  // RESUMES
  async getLatestResume(userId: string): Promise<Resume | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          return {
            id: data.id,
            userId: data.user_id,
            fileName: data.file_name,
            fileUrl: data.file_url,
            resumeScore: data.resume_score,
            analysis: data.analysis,
            createdAt: data.created_at,
          };
        }
      } catch (err) {
        console.warn("Supabase getLatestResume error:", err);
      }
    }

    const resumesStr = localStorage.getItem(LOCAL_RESUMES_KEY) || "[]";
    const resumes: Resume[] = JSON.parse(resumesStr);
    const userResumes = resumes.filter((r) => r.userId === userId);
    return userResumes.length > 0 ? userResumes[userResumes.length - 1] : null;
  },

  async saveResume(resume: Omit<Resume, "id" | "createdAt">): Promise<Resume> {
    const now = new Date().toISOString();
    const newResume: Resume = {
      id: "res_" + Math.random().toString(36).substring(2, 9),
      userId: resume.userId,
      fileName: resume.fileName,
      fileSize: resume.fileSize,
      fileUrl: resume.fileUrl,
      resumeScore: resume.resumeScore,
      analysis: resume.analysis,
      createdAt: now,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("resumes").insert({
          id: newResume.id,
          user_id: newResume.userId,
          file_name: newResume.fileName,
          file_url: newResume.fileUrl,
          resume_score: newResume.resumeScore,
          analysis: newResume.analysis,
          created_at: newResume.createdAt,
        });
      } catch (err) {
        console.warn("Supabase saveResume error:", err);
      }
    }

    const resumesStr = localStorage.getItem(LOCAL_RESUMES_KEY) || "[]";
    const resumes: Resume[] = JSON.parse(resumesStr);
    resumes.push(newResume);
    localStorage.setItem(LOCAL_RESUMES_KEY, JSON.stringify(resumes));

    return newResume;
  },

  // INTERVIEWS
  async getUserInterviews(userId: string): Promise<Interview[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("interviews")
          .select("*")
          .eq("user_id", userId)
          .order("completed_at", { ascending: true });

        if (data && !error && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            userId: d.user_id,
            jobRole: d.job_role,
            difficulty: d.difficulty,
            interviewType: d.interview_type,
            overallScore: d.overall_score,
            technicalScore: d.technical_score,
            communicationScore: d.communication_score,
            confidenceScore: d.confidence_score,
            completedAt: d.completed_at,
            evaluation: d.evaluation,
          }));
        }
      } catch (err) {
        console.warn("Supabase getUserInterviews error:", err);
      }
    }

    const listStr = localStorage.getItem(LOCAL_INTERVIEWS_KEY) || "[]";
    const list: Interview[] = JSON.parse(listStr);
    return list.filter((i) => i.userId === userId);
  },

  async saveInterview(
    interviewData: Omit<Interview, "id" | "completedAt">,
    questions: Omit<InterviewQuestionItem, "id" | "interviewId">[]
  ): Promise<Interview> {
    const now = new Date().toISOString();
    const interviewId = "int_" + Math.random().toString(36).substring(2, 9);

    const savedInterview: Interview = {
      id: interviewId,
      userId: interviewData.userId,
      jobRole: interviewData.jobRole,
      difficulty: interviewData.difficulty,
      interviewType: interviewData.interviewType,
      overallScore: interviewData.overallScore,
      technicalScore: interviewData.technicalScore,
      communicationScore: interviewData.communicationScore,
      confidenceScore: interviewData.confidenceScore,
      relevanceScore: interviewData.relevanceScore,
      problemSolvingScore: interviewData.problemSolvingScore,
      completedAt: now,
      evaluation: interviewData.evaluation,
    };

    const savedQuestions: InterviewQuestionItem[] = questions.map((q) => ({
      id: "iq_" + Math.random().toString(36).substring(2, 9),
      interviewId,
      questionNumber: q.questionNumber,
      question: q.question,
      answer: q.answer,
      score: q.score,
      feedback: q.feedback,
      interviewerNote: q.interviewerNote,
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("interviews").insert({
          id: savedInterview.id,
          user_id: savedInterview.userId,
          job_role: savedInterview.jobRole,
          difficulty: savedInterview.difficulty,
          interview_type: savedInterview.interviewType,
          overall_score: savedInterview.overallScore,
          technical_score: savedInterview.technicalScore,
          communication_score: savedInterview.communicationScore,
          confidence_score: savedInterview.confidenceScore,
          completed_at: savedInterview.completedAt,
        });

        if (savedQuestions.length > 0) {
          await supabase.from("interview_questions").insert(
            savedQuestions.map((sq) => ({
              id: sq.id,
              interview_id: sq.interviewId,
              question: sq.question,
              answer: sq.answer,
              score: sq.score,
              feedback: sq.feedback,
            }))
          );
        }
      } catch (err) {
        console.warn("Supabase saveInterview error:", err);
      }
    }

    // Local storage
    const interviewsStr = localStorage.getItem(LOCAL_INTERVIEWS_KEY) || "[]";
    const interviews: Interview[] = JSON.parse(interviewsStr);
    interviews.push(savedInterview);
    localStorage.setItem(LOCAL_INTERVIEWS_KEY, JSON.stringify(interviews));

    const questionsStr = localStorage.getItem(LOCAL_QUESTIONS_KEY) || "[]";
    const allQuestions: InterviewQuestionItem[] = JSON.parse(questionsStr);
    allQuestions.push(...savedQuestions);
    localStorage.setItem(LOCAL_QUESTIONS_KEY, JSON.stringify(allQuestions));

    return savedInterview;
  },

  async getInterviewQuestions(interviewId: string): Promise<InterviewQuestionItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("interview_questions")
          .select("*")
          .eq("interview_id", interviewId);

        if (data && !error && data.length > 0) {
          return data.map((d, index) => ({
            id: d.id,
            interviewId: d.interview_id,
            questionNumber: index + 1,
            question: d.question,
            answer: d.answer,
            score: d.score,
            feedback: d.feedback,
          }));
        }
      } catch (err) {
        console.warn("Supabase getInterviewQuestions error:", err);
      }
    }

    const questionsStr = localStorage.getItem(LOCAL_QUESTIONS_KEY) || "[]";
    const questions: InterviewQuestionItem[] = JSON.parse(questionsStr);
    return questions.filter((q) => q.interviewId === interviewId);
  },

  // IMPROVEMENT TASKS
  async getTasks(userId: string): Promise<ImprovementTask[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("improvement_tasks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: true });

        if (data && !error && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            userId: d.user_id,
            week: 1,
            weekTitle: "Weekly Goals",
            title: d.title,
            description: d.description,
            category: d.category || "Technical",
            completed: Boolean(d.completed),
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn("Supabase getTasks error:", err);
      }
    }

    const tasksStr = localStorage.getItem(LOCAL_TASKS_KEY) || "[]";
    let tasks: ImprovementTask[] = JSON.parse(tasksStr);
    let userTasks = tasks.filter((t) => t.userId === userId);

    if (userTasks.length === 0) {
      // Seed default tasks for this user
      const now = new Date().toISOString();
      userTasks = defaultInitialTasks.map((t, idx) => ({
        ...t,
        id: `task_${userId}_${idx}_${Date.now()}`,
        userId,
        createdAt: now,
      }));
      tasks.push(...userTasks);
      localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
    }

    return userTasks;
  },

  async toggleTask(taskId: string, completed: boolean): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("improvement_tasks")
          .update({ completed })
          .eq("id", taskId);
      } catch (err) {
        console.warn("Supabase toggleTask error:", err);
      }
    }

    const tasksStr = localStorage.getItem(LOCAL_TASKS_KEY) || "[]";
    const tasks: ImprovementTask[] = JSON.parse(tasksStr);
    const target = tasks.find((t) => t.id === taskId);
    if (target) {
      target.completed = completed;
      localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
    }
  },

  async addTask(userId: string, task: { title: string; description: string; category: ImprovementTask["category"]; week?: number; weekTitle?: string }): Promise<ImprovementTask> {
    const newTask: ImprovementTask = {
      id: "task_" + Math.random().toString(36).substring(2, 9),
      userId,
      week: task.week || 1,
      weekTitle: task.weekTitle || "Custom Goals",
      title: task.title,
      description: task.description,
      category: task.category,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("improvement_tasks").insert({
          id: newTask.id,
          user_id: newTask.userId,
          title: newTask.title,
          description: newTask.description,
          category: newTask.category,
          completed: false,
          created_at: newTask.createdAt,
        });
      } catch (err) {
        console.warn("Supabase addTask error:", err);
      }
    }

    const tasksStr = localStorage.getItem(LOCAL_TASKS_KEY) || "[]";
    const tasks: ImprovementTask[] = JSON.parse(tasksStr);
    tasks.push(newTask);
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
    return newTask;
  },

  async getResume(userId: string): Promise<Resume | null> {
    return this.getLatestResume(userId);
  },

  async getInterviews(userId: string): Promise<Interview[]> {
    return this.getUserInterviews(userId);
  },

  async updateTask(userId: string, taskId: string, completed: boolean): Promise<ImprovementTask[]> {
    await this.toggleTask(taskId, completed);
    return this.getTasks(userId);
  },

  async saveTasks(userId: string, tasks: ImprovementTask[]): Promise<void> {
    const tasksStr = localStorage.getItem(LOCAL_TASKS_KEY) || "[]";
    const existing: ImprovementTask[] = JSON.parse(tasksStr);
    const otherUsersTasks = existing.filter((t) => t.userId !== userId);
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify([...otherUsersTasks, ...tasks]));
  },

  async deleteUser(userId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("profiles").delete().eq("user_id", userId);
        await supabase.from("resumes").delete().eq("user_id", userId);
        await supabase.from("interviews").delete().eq("user_id", userId);
        await supabase.from("improvement_tasks").delete().eq("user_id", userId);
      } catch (err) {
        console.warn("Supabase deleteUser error:", err);
      }
    }

    // Local storage clean
    const cleanStorage = (key: string, matchKey: string) => {
      const items = JSON.parse(localStorage.getItem(key) || "[]");
      const filtered = items.filter((item: any) => item[matchKey] !== userId);
      localStorage.setItem(key, JSON.stringify(filtered));
    };

    cleanStorage(LOCAL_PROFILES_KEY, "userId");
    cleanStorage(LOCAL_RESUMES_KEY, "userId");
    cleanStorage(LOCAL_INTERVIEWS_KEY, "userId");
    cleanStorage(LOCAL_TASKS_KEY, "userId");
    localStorage.removeItem("ai_prep_session");
  },
};
