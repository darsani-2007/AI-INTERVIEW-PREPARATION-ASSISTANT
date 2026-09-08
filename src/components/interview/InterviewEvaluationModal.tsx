import React from "react";
import { Interview } from "../../types";
import { Modal, Card, CardHeader, CardTitle, Badge, Progress } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

interface InterviewEvaluationModalProps {
  interview: Interview | null;
  isOpen: boolean;
  onClose: () => void;
  onStartNewSession?: () => void;
}

export const InterviewEvaluationModal: React.FC<InterviewEvaluationModalProps> = ({
  interview,
  isOpen,
  onClose,
  onStartNewSession,
}) => {
  if (!interview) return null;

  const breakdownMetrics = [
    { label: "Technical Knowledge", score: interview.technicalScore || 82, color: "bg-blue-600" },
    { label: "Communication", score: interview.communicationScore || 74, color: "bg-emerald-600" },
    { label: "Confidence", score: interview.confidenceScore || 76, color: "bg-amber-600" },
    { label: "Relevance", score: interview.relevanceScore || 81, color: "bg-blue-500" },
    { label: "Problem Solving", score: interview.problemSolvingScore || 79, color: "bg-indigo-600" },
  ];

  const strengthsList = interview.strengths || interview.evaluation?.strengths || [
    "Good understanding of core concepts and definitions",
    "Clear, structured communication throughout the session",
    "Effectively referenced relevant college projects",
  ];

  const weaknessesList = interview.weaknesses || interview.evaluation?.weaknesses || [
    "Need more quantitative metrics in project descriptions",
    "Review advanced query optimization and exception scenarios",
  ];

  const betterAnswerModel = interview.betterAnswer || (interview.evaluation?.betterAnswers?.[0] ? {
    question: interview.evaluation.betterAnswers[0].question,
    yourAnswer: interview.evaluation.betterAnswers[0].candidateAnswer,
    suggestedAnswer: interview.evaluation.betterAnswers[0].improvedAnswer,
    tip: interview.evaluation.betterAnswers[0].improvementTip,
  } : null);

  const recommendationText = interview.aiRecommendation || interview.evaluation?.aiRecommendation || "Spend 30 minutes in the Curated Practice Bank on targeted questions and rehearse project summaries using the STAR framework.";

  return (
    <Modal
      id="interview-report-modal"
      isOpen={isOpen}
      onClose={onClose}
      title={`${interview.jobRole} Interview Evaluation Report`}
      description={`Completed on ${new Date(interview.completedAt).toLocaleDateString()} • ${interview.difficulty} • ${interview.interviewType}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 text-slate-900">
        {/* Overall Score Header */}
        <div className="bg-[#0F172A] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-200">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-blue-500/50 flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-black">{interview.overallScore}</span>
              <span className="text-[10px] text-blue-300 font-semibold uppercase">/ 100</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Overall Interview Score</h3>
                <Badge variant={interview.overallScore >= 80 ? "success" : "warning"} className="text-xs">
                  {interview.overallScore >= 80 ? "Campus Ready" : "Target Practice Needed"}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
                Evaluated across 10 interview questions based on market technical benchmarks for {interview.jobRole}.
              </p>
            </div>
          </div>

          {onStartNewSession && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onStartNewSession();
              }}
              className="shrink-0 text-xs shadow-lg shadow-blue-500/25"
            >
              Start New Mock
            </Button>
          )}
        </div>

        {/* Breakdown of Skills */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <CardTitle>Competency Breakdown</CardTitle>
            </div>
          </CardHeader>
          <div className="space-y-3.5">
            {breakdownMetrics.map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>{metric.label}</span>
                  <span className="font-bold text-slate-900">{metric.score}%</span>
                </div>
                <Progress value={metric.score} barClassName={metric.color} />
              </div>
            ))}
          </div>
        </Card>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <Card className="border-emerald-100 bg-emerald-50/20">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Observed Strengths
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {strengthsList.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Weaknesses */}
          <Card className="border-rose-100 bg-rose-50/20">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-950 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Areas That Need Improvement
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {weaknessesList.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Better Answer Transformation */}
        {betterAnswerModel && (
          <Card className="border-indigo-100 bg-indigo-50/20">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Better Answer Model & Optimization
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-700 block mb-1">
                  Question Targeted:
                </span>
                <p className="text-slate-800 italic">
                  "{betterAnswerModel.question}"
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="font-semibold text-slate-700 block mb-1">
                  Your Answer:
                </span>
                <p className="text-slate-600">
                  {betterAnswerModel.yourAnswer}
                </p>
              </div>

              <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-lg">
                <span className="font-bold text-indigo-900 block mb-1">
                  💡 AI Suggested Answer:
                </span>
                <p className="text-indigo-950 leading-relaxed font-medium">
                  "{betterAnswerModel.suggestedAnswer}"
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Tip for Improvement: </span>
                  <span>{betterAnswerModel.tip}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* AI Recommendation */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Brain className="w-4 h-4 text-indigo-600" />
            AI Recommendation for Your Next Session
          </div>
          <p className="leading-relaxed">{recommendationText}</p>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};
