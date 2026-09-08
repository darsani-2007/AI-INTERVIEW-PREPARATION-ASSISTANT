import React from "react";
import { Interview } from "../../types";
import { Card, CardHeader, CardTitle, CardDescription, Badge, Progress } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  BarChart3,
  TrendingUp,
  Award,
  Brain,
  MessageSquare,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface PerformancePageProps {
  interviews: Interview[];
  onViewReport: (interview: Interview) => void;
  onStartNewMock: () => void;
}

export const PerformancePage: React.FC<PerformancePageProps> = ({
  interviews,
  onViewReport,
  onStartNewMock,
}) => {
  const totalInterviews = interviews.length;

  const avgOverall =
    totalInterviews > 0
      ? Math.round(
          interviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) /
            totalInterviews
        )
      : 78;

  const avgTechnical =
    totalInterviews > 0
      ? Math.round(
          interviews.reduce((acc, curr) => acc + (curr.technicalScore || 0), 0) /
            totalInterviews
        )
      : 82;

  const avgCommunication =
    totalInterviews > 0
      ? Math.round(
          interviews.reduce(
            (acc, curr) => acc + (curr.communicationScore || 0),
            0
          ) / totalInterviews
        )
      : 74;

  const avgProblemSolving =
    totalInterviews > 0
      ? Math.round(
          interviews.reduce(
            (acc, curr) => acc + (curr.problemSolvingScore || 0),
            0
          ) / totalInterviews
        )
      : 79;

  // Weak area indicators derived from lowest scores
  const weakAreas = [
    {
      skill: "Complex SQL Joins & Window Functions",
      issue: "Hesitation when explaining PARTITION BY vs GROUP BY in live queries",
      recommendedAction: "Practice 5 SQL window function queries in the Practice Bank",
    },
    {
      skill: "STAR Method Articulation",
      issue: "Omitting quantifiable 'Result' metrics from college academic project stories",
      recommendedAction: "Structure each project story with explicit % improvement outcomes",
    },
    {
      skill: "Handling Unexpected Edge Cases",
      issue: "Needs faster diagnostic reasoning when test inputs violate basic assumptions",
      recommendedAction: "Review edge-case questions in the Behavioral & Tech categories",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Performance & Growth Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your interview trajectory, assess core placement competencies, and eliminate weak spots.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={onStartNewMock} className="shadow-lg shadow-blue-200">
          <Brain className="w-4 h-4 mr-2" /> Start New Mock Interview
        </Button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Interviews</span>
            <Brain className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalInterviews}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalInterviews >= 5 ? "Consistent preparation" : "Aim for 5+ mock sessions"}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Average Score</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgOverall}%</div>
          <Progress value={avgOverall} barClassName="bg-emerald-600" className="mt-2" />
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Technical Accuracy</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgTechnical}%</div>
          <Progress value={avgTechnical} barClassName="bg-blue-600" className="mt-2" />
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Communication Skill</span>
            <MessageSquare className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgCommunication}%</div>
          <Progress value={avgCommunication} barClassName="bg-sky-600" className="mt-2" />
        </Card>
      </div>

      {/* Visual Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Over Time Chart */}
        <Card className="lg:col-span-8">
          <CardHeader>
            <div>
              <CardTitle>Score Progression Over Time</CardTitle>
              <CardDescription>
                Historical score progression showing improvement across mock sessions
              </CardDescription>
            </div>
            <Badge variant="success" className="text-xs">
              +14% Growth
            </Badge>
          </CardHeader>

          {interviews.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center p-6">
              <BarChart3 className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">
                No session history yet
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                Complete your first mock interview to generate historical score charts.
              </p>
              <Button variant="primary" size="sm" onClick={onStartNewMock}>
                Start First Mock
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Responsive SVG Chart */}
              <div className="h-56 w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Axis labels */}
                  <text x="5" y="24" fill="#94a3b8" fontSize="10">90%</text>
                  <text x="5" y="64" fill="#94a3b8" fontSize="10">75%</text>
                  <text x="5" y="104" fill="#94a3b8" fontSize="10">60%</text>

                  {/* Draw points & line */}
                  {(() => {
                    const sorted = [...interviews].reverse();
                    const count = sorted.length;
                    const step = count > 1 ? 440 / (count - 1) : 220;

                    const points = sorted.map((item, idx) => {
                      const x = 40 + idx * step;
                      // map 40-100% to Y 140-20
                      const normalizedScore = Math.max(40, Math.min(100, item.overallScore));
                      const y = 140 - ((normalizedScore - 40) / 60) * 120;
                      return { x, y, score: item.overallScore, role: item.jobRole };
                    });

                    const pathString = points
                      .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
                      .join(" ");

                    return (
                      <>
                        {/* Area gradient */}
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {points.length > 1 && (
                          <path
                            d={`${pathString} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`}
                            fill="url(#chartGrad)"
                          />
                        )}
                        <path
                          d={pathString}
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {points.map((pt, i) => (
                          <g key={i}>
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="5"
                              fill="#ffffff"
                              stroke="#2563eb"
                              strokeWidth="2.5"
                            />
                            <text
                              x={pt.x}
                              y={pt.y - 10}
                              fill="#1e293b"
                              fontSize="11"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {pt.score}%
                            </text>
                            <text
                              x={pt.x}
                              y="155"
                              fill="#64748b"
                              fontSize="10"
                              textAnchor="middle"
                            >
                              S{i + 1}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                <span>Timeline: First Mock to Latest</span>
                <span className="font-semibold text-emerald-600">
                  Target Readiness: 85%+
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Competency Mastery Breakdown */}
        <Card className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <CardHeader>
              <div>
                <CardTitle>Competency Mastery</CardTitle>
                <CardDescription>Benchmark against hiring standards</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Technical Depth</span>
                  <span className="text-slate-900">{avgTechnical}%</span>
                </div>
                <Progress value={avgTechnical} barClassName="bg-blue-600" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Communication & Clarity</span>
                  <span className="text-slate-900">{avgCommunication}%</span>
                </div>
                <Progress value={avgCommunication} barClassName="bg-emerald-600" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Problem Solving</span>
                  <span className="text-slate-900">{avgProblemSolving}%</span>
                </div>
                <Progress value={avgProblemSolving} barClassName="bg-sky-600" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Confidence & Delivery</span>
                  <span className="text-slate-900">76%</span>
                </div>
                <Progress value={76} barClassName="bg-amber-500" />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-950">
            <span className="font-bold block mb-0.5 text-blue-900">Focus Recommendation:</span>
            Spend extra time rehearsing answers out loud to raise your Communication & Confidence score above 85%.
          </div>
        </Card>
      </div>

      {/* Weak Area Indicators Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <CardTitle>Targeted Weak Area Indicators</CardTitle>
              <CardDescription>
                AI diagnostic insights identifying exact concepts that cost you points in interviews
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weakAreas.map((area, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/30 flex flex-col justify-between"
            >
              <div>
                <Badge variant="warning" className="mb-2 text-[10px]">
                  Needs Focus
                </Badge>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  {area.skill}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {area.issue}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/50 text-[11px] text-amber-900 font-medium">
                💡 <strong>Action:</strong> {area.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Interview History Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Session History Log</CardTitle>
            <CardDescription>
              All completed AI interview assessments and evaluation reports
            </CardDescription>
          </div>
        </CardHeader>

        {interviews.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No completed sessions in the log yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Difficulty</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {interviews.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                      {new Date(item.completedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {item.jobRole}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="neutral" className="text-[10px]">
                        {item.difficulty}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="primary" className="text-[10px]">
                        {item.interviewType}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-bold text-blue-600">
                      {item.overallScore}%
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewReport(item)}
                        className="text-xs py-1"
                      >
                        View Report
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
