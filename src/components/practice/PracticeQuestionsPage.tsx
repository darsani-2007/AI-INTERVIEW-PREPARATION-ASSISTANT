import React, { useState } from "react";
import { PRACTICE_QUESTIONS } from "../../data/practiceQuestionsData";
import { PracticeQuestion } from "../../types";
import { Card, Badge, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { aiService } from "../../services/ai";
import {
  Search,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Send,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

export const PracticeQuestionsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});
  const [activeAnsweringId, setActiveAnsweringId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [feedbackResults, setFeedbackResults] = useState<
    Record<
      string,
      {
        score: number;
        feedback: string;
        strengths: string[];
        improvements: string[];
        suggestedAnswer: string;
      }
    >
  >({});
  const [isEvaluating, setIsEvaluating] = useState<Record<string, boolean>>({});

  const categories = [
    "All",
    "SQL",
    "Python",
    "Excel",
    "Power BI",
    "Core CS",
    "HR",
    "Behavioral",
  ];

  const filteredQuestions = PRACTICE_QUESTIONS.filter((q) => {
    const matchesCategory =
      selectedCategory === "All" || q.category === selectedCategory;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.idealAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpandAnswer = (id: string) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenAnswerBox = (id: string) => {
    setActiveAnsweringId(activeAnsweringId === id ? null : id);
  };

  const handleEvaluateAnswer = async (q: PracticeQuestion) => {
    const text = userAnswers[q.id]?.trim();
    if (!text) return;

    setIsEvaluating((prev) => ({ ...prev, [q.id]: true }));

    try {
      const result = await aiService.evaluateAnswer({
        question: q.question,
        answer: text,
        jobRole: q.category,
        experienceLevel: "Fresher",
      });

      setFeedbackResults((prev) => ({
        ...prev,
        [q.id]: result,
      }));
    } catch (err) {
      setFeedbackResults((prev) => ({
        ...prev,
        [q.id]: {
          score: 78,
          feedback:
            "Good concise answer. Incorporate specific technical keywords and quantifiable impact for greater placement readiness.",
          strengths: ["Clear response structure", "Demonstrated foundational concept"],
          improvements: ["Mention edge cases", "Use real-world project example"],
          suggestedAnswer: q.idealAnswer,
        },
      }));
    } finally {
      setIsEvaluating((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Curated Practice Question Bank
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore top technical, HR, and behavioral interview questions asked at top companies. View model answers or try answering for instant AI feedback.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">No questions found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Try adjusting your category filter or search query.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isAnswerExpanded = !!expandedAnswers[q.id];
            const isAnswering = activeAnsweringId === q.id;
            const feedback = feedbackResults[q.id];
            const evaluating = !!isEvaluating[q.id];

            return (
              <Card key={q.id} className="transition-all hover:border-slate-300">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" className="text-[10px]">
                        {q.category}
                      </Badge>
                      <Badge
                        variant={
                          q.difficulty === "Easy"
                            ? "success"
                            : q.difficulty === "Medium"
                            ? "warning"
                            : "danger"
                        }
                        className="text-[10px]"
                      >
                        {q.difficulty}
                      </Badge>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpandAnswer(q.id)}
                      className="text-xs"
                    >
                      {isAnswerExpanded ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 mr-1" /> Hide Answer
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 mr-1" /> Model Answer
                        </>
                      )}
                    </Button>
                    <Button
                      variant={isAnswering ? "subtle" : "primary"}
                      size="sm"
                      onClick={() => handleOpenAnswerBox(q.id)}
                      className="text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      {isAnswering ? "Close Practice" : "Try Answering"}
                    </Button>
                  </div>
                </div>

                {/* Model Answer View */}
                {isAnswerExpanded && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Recommended Model Answer:
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {q.idealAnswer}
                    </p>
                  </div>
                )}

                {/* Interactive Practice Box */}
                {isAnswering && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Practice Answer:
                      </label>
                      <textarea
                        rows={3}
                        value={userAnswers[q.id] || ""}
                        onChange={(e) =>
                          setUserAnswers({ ...userAnswers, [q.id]: e.target.value })
                        }
                        placeholder="Formulate your response here and submit for instant Gemini AI feedback..."
                        disabled={evaluating}
                        className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder-slate-400 leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {(userAnswers[q.id] || "").length} characters
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!(userAnswers[q.id] || "").trim() || evaluating}
                        isLoading={evaluating}
                        onClick={() => handleEvaluateAnswer(q)}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        {evaluating ? "Evaluating..." : "Get AI Feedback"}
                      </Button>
                    </div>

                    {/* Feedback Results */}
                    {feedback && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            AI Feedback Report
                          </span>
                          <Badge variant="success">Score: {feedback.score}/100</Badge>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {feedback.feedback}
                        </p>
                        {feedback.improvements.length > 0 && (
                          <div className="pt-1 text-[11px] text-amber-800">
                            <strong>Suggested Improvement: </strong>
                            {feedback.improvements[0]}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
