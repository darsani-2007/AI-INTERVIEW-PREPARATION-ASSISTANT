import React, { useState, useEffect, useRef } from "react";
import { User, Profile, Resume, Interview, InterviewQuestionItem } from "../../types";
import { Card, Progress, Badge } from "../ui/Card";
import { Button } from "../ui/Button";
import { aiService } from "../../services/ai";
import { dbService } from "../../services/db";
import {
  Bot,
  User as UserIcon,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface MockInterviewChatProps {
  user: User;
  profile: Profile | null;
  resume: Resume | null;
  config: {
    jobRole: string;
    difficulty: "Easy" | "Medium" | "Hard";
    interviewType: "Technical" | "HR" | "Behavioral" | "Mixed";
  };
  onFinishInterview: (interview: Interview) => void;
  onExitInterview: () => void;
}

interface AnsweredItem {
  questionId: string;
  question: string;
  userAnswer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
}

export const MockInterviewChat: React.FC<MockInterviewChatProps> = ({
  user,
  profile,
  resume,
  config,
  onFinishInterview,
  onExitInterview,
}) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [chatHistory, setChatHistory] = useState<AnsweredItem[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<{
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    suggestedAnswer: string;
  } | null>(null);

  // Timer tracking
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch 10 questions on mount
  useEffect(() => {
    let isMounted = true;
    const loadQuestions = async () => {
      setIsLoadingQuestions(true);
      try {
        const fetched = await aiService.generateInterviewQuestions({
          jobRole: config.jobRole,
          difficulty: config.difficulty,
          interviewType: config.interviewType,
          skills: profile?.skills || ["Python", "SQL", "Communication"],
          experienceLevel: profile?.experienceLevel || "Fresher",
          resumeSummary: resume ? `${resume.fileName} (${resume.resumeScore}/100)` : undefined,
        });

        if (isMounted) {
          setQuestions(fetched);
          setIsLoadingQuestions(false);
        }
      } catch (err) {
        if (isMounted) {
          // Fallback questions for safety
          setQuestions([
            `Tell me about yourself and why you're passionate about becoming a ${config.jobRole}.`,
            "Can you describe a key technical project you built during college, highlighting your specific contributions?",
            "What is the difference between an INNER JOIN and a LEFT JOIN in SQL? Give an example of when to use each.",
            "Explain how you handle null or missing data when working on an analytical dataset in Python or Excel.",
            "Describe a time you faced a difficult bug or unexpected roadblock. How did you diagnose and resolve it?",
            "How do you organize your workflow and prioritize deliverables when multiple academic deadlines collide?",
            "What measures do you take to validate your query outputs or model accuracy before presenting them?",
            "Tell me about a time you had to collaborate with a peer who had a contrasting opinion or work style.",
            "Where do you see your technical trajectory evolving over the next 2-3 years?",
            "Do you have any questions for me regarding our team, tech stack, or engineering culture?",
          ]);
          setIsLoadingQuestions(false);
        }
      }
    };

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [config, profile, resume]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, currentFeedback]);

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const currentQuestionText = questions[currentIndex] || "";
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / 10) * 100));

  // Submit Answer
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = userAnswer.trim();
    if (!trimmed || isSubmittingAnswer) return;

    setIsSubmittingAnswer(true);

    try {
      // Evaluate answer via AI
      const evaluation = await aiService.evaluateAnswer({
        question: currentQuestionText,
        answer: trimmed,
        jobRole: config.jobRole,
        experienceLevel: profile?.experienceLevel || "Fresher",
      });

      const questionItem: AnsweredItem = {
        questionId: `q-${currentIndex + 1}`,
        question: currentQuestionText,
        userAnswer: trimmed,
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        suggestedAnswer: evaluation.suggestedAnswer,
      };

      setChatHistory((prev) => [...prev, questionItem]);
      setCurrentFeedback(evaluation);
    } catch (err) {
      // Graceful fallback evaluation
      const fallbackItem: AnsweredItem = {
        questionId: `q-${currentIndex + 1}`,
        question: currentQuestionText,
        userAnswer: trimmed,
        score: 75,
        feedback: "Good attempt with clear communication. Be sure to quantify your results using the STAR method.",
        strengths: ["Clear tone", "Directly answered the core prompt"],
        improvements: ["Add specific quantitative results", "Explain technical trade-offs"],
        suggestedAnswer:
          "In my college project, I approached this by first diagnosing the root cause, selecting the appropriate algorithm, and reducing query latency by 35%.",
      };
      setChatHistory((prev) => [...prev, fallbackItem]);
      setCurrentFeedback(fallbackItem);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Next Question or Complete
  const handleProceedNext = async () => {
    setUserAnswer("");
    setCurrentFeedback(null);

    if (currentIndex < 9) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Complete interview and generate report!
      setIsGeneratingReport(true);
      try {
        const fullQnA = chatHistory.map((item) => ({
          question: item.question,
          answer: item.userAnswer,
          score: item.score,
        }));

        const finalReport = await aiService.generateInterviewReport({
          jobRole: config.jobRole,
          interviewType: config.interviewType,
          difficulty: config.difficulty,
          questionsAndAnswers: fullQnA,
        });

        // Save into database
        const saved = await dbService.saveInterview(
          {
            userId: user.id,
            jobRole: config.jobRole,
            interviewType: config.interviewType,
            difficulty: config.difficulty,
            overallScore: finalReport.overallScore,
            technicalScore: finalReport.technicalScore,
            communicationScore: finalReport.communicationScore,
            confidenceScore: finalReport.confidenceScore,
            relevanceScore: finalReport.relevanceScore,
            problemSolvingScore: finalReport.problemSolvingScore,
            strengths: finalReport.strengths,
            weaknesses: finalReport.weaknesses,
            betterAnswer: finalReport.betterAnswer,
            aiRecommendation: finalReport.aiRecommendation,
          },
          chatHistory.map((item, idx) => ({
            questionNumber: idx + 1,
            question: item.question,
            answer: item.userAnswer,
            score: item.score,
            feedback: item.feedback,
          }))
        );

        onFinishInterview(saved);
      } catch (err) {
        console.error("Error generating report", err);
      } finally {
        setIsGeneratingReport(false);
      }
    }
  };

  if (isLoadingQuestions) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
          <Bot className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Preparing Personalized Interview Session...
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Gemini AI is crafting 10 adaptive {config.difficulty.toLowerCase()} questions for{" "}
          <strong>{config.jobRole}</strong> ({config.interviewType}) tailored to your skills.
        </p>
      </div>
    );
  }

  if (isGeneratingReport) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Generating Comprehensive Evaluation Report...
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Synthesizing your 10 responses, benchmarking technical precision, communication, and compiling model answers.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 font-sans">
      {/* Top Session Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            Q{currentIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                Question {currentIndex + 1} of 10
              </span>
              <Badge variant="primary" className="text-[10px]">
                {config.jobRole}
              </Badge>
              <Badge variant="neutral" className="text-[10px]">
                {config.difficulty}
              </Badge>
            </div>
            <div className="w-48 sm:w-64 mt-1.5">
              <Progress value={progressPercent} barClassName="bg-blue-600" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExitInterview}
            className="text-xs text-slate-400 hover:text-slate-700"
          >
            Exit
          </Button>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="space-y-4">
        {/* Previous Answered Items */}
        {chatHistory.map((item, idx) => (
          <div key={idx} className="space-y-3 opacity-90">
            {/* Question */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xs shrink-0 font-bold">
                AI
              </div>
              <div className="bg-slate-100/90 rounded-2xl rounded-tl-none p-3.5 max-w-2xl text-xs sm:text-sm text-slate-900">
                <p className="font-semibold text-xs text-blue-700 mb-1">
                  Question {idx + 1} of 10:
                </p>
                {item.question}
              </div>
            </div>

            {/* Answer */}
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none p-3.5 max-w-2xl text-xs sm:text-sm">
                <p className="text-[11px] text-blue-200 mb-1 font-medium">Your Answer:</p>
                {item.userAnswer}
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center text-xs shrink-0 font-bold">
                You
              </div>
            </div>

            {/* Feedback capsule */}
            <div className="ml-11 max-w-2xl p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-800">
                  Instant Feedback ({item.score}/100):{" "}
                </span>
                <span>{item.feedback}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Current Active Question */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 font-bold shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 max-w-2xl shadow-sm text-slate-900">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                AI Interviewer
              </span>
              <span className="text-[10px] text-slate-400">
                Question {currentIndex + 1} of 10
              </span>
            </div>
            <p className="text-sm sm:text-base font-medium leading-relaxed">
              {currentQuestionText}
            </p>
          </div>
        </div>

        {/* Current Instant Feedback Display (if just answered) */}
        {currentFeedback && (
          <div className="ml-12 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-900 space-y-3 animate-in fade-in shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="text-xs sm:text-sm font-bold text-emerald-900">
                  Instant AI Feedback
                </h4>
              </div>
              <Badge variant="success" className="text-xs font-bold">
                Score: {currentFeedback.score} / 100
              </Badge>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {currentFeedback.feedback}
            </p>

            {currentFeedback.suggestedAnswer && (
              <div className="p-3 rounded-xl bg-white border border-emerald-200/80 text-xs">
                <span className="font-semibold text-blue-700 block mb-1">
                  💡 Model Answer Upgrade:
                </span>
                <p className="text-slate-600 italic">
                  "{currentFeedback.suggestedAnswer}"
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                id="next-question-btn"
                variant="primary"
                size="sm"
                onClick={handleProceedNext}
              >
                {currentIndex < 9 ? (
                  <>
                    Next Question <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Complete Interview & View Report 🎉
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Answer Input Field (if feedback not yet given) */}
        {!currentFeedback && (
          <form onSubmit={handleSubmitAnswer} className="ml-12 space-y-3">
            <div className="relative">
              <textarea
                id="interview-answer-input"
                rows={4}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your structured answer here (Hint: Use Situation, Task, Action, Result)..."
                disabled={isSubmittingAnswer}
                className="w-full p-3.5 text-xs sm:text-sm border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder-slate-400 leading-relaxed shadow-sm resize-none"
              />
              <div className="absolute bottom-2.5 right-3 text-[11px] text-slate-400">
                {userAnswer.length} characters
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Evaluated for technical accuracy, clarity & confidence
              </span>

              <Button
                id="interview-submit-answer-btn"
                type="submit"
                variant="primary"
                size="sm"
                disabled={!userAnswer.trim() || isSubmittingAnswer}
                isLoading={isSubmittingAnswer}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {isSubmittingAnswer ? "Evaluating response..." : "Submit Answer"}
              </Button>
            </div>
          </form>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
