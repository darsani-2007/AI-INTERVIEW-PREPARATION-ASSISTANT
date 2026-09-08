import React from "react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Card";
import {
  Brain,
  FileText,
  MessageSquare,
  Zap,
  TrendingUp,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Users,
  Target,
} from "lucide-react";

interface LandingPageProps {
  onNavigateToSignup: () => void;
  onNavigateToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToSignup,
  onNavigateToLogin,
}) => {
  const features = [
    {
      icon: <Target className="w-5 h-5 text-blue-600" />,
      title: "Personalized Interview Questions",
      description:
        "Questions dynamically generated to match your target role, college degree, experience level, and listed skills.",
    },
    {
      icon: <Brain className="w-5 h-5 text-blue-600" />,
      title: "AI Mock Interview",
      description:
        "Realistic multi-turn simulated technical, HR, and behavioral interviews that respond to your actual answers in real time.",
    },
    {
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      title: "Resume Analysis",
      description:
        "Instant score out of 100, detected skill matches, academic project evaluations, and specific recommendations to improve your resume.",
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      title: "Instant AI Feedback",
      description:
        "Receive rapid feedback on response clarity, technical precision, structure (STAR method), and missing keywords.",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      title: "Performance Tracking",
      description:
        "Measure your progress across multiple sessions with historical score charts, technical vs. communication breakdown, and streaks.",
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-blue-600" />,
      title: "Personalized Improvement Plan",
      description:
        "Structured weekly milestones designed to eliminate weak spots in SQL, coding, system design, and behavioral storytelling.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Build Your Student Profile",
      desc: "Select your degree, target role (Data Analyst, Developer, ML Engineer), and upload your resume for automatic skill extraction.",
    },
    {
      step: "02",
      title: "Launch an AI Mock Session",
      desc: "Engage in an authentic 10-question chat interview with dynamic follow-ups adapted to your real-time replies.",
    },
    {
      step: "03",
      title: "Inspect Deep Evaluation Reports",
      desc: "Get score breakdowns, personalized strengths & weaknesses, and model answers showing how to upgrade weak responses.",
    },
    {
      step: "04",
      title: "Execute Your Improvement Plan",
      desc: "Complete weekly focused exercises and watch your interview readiness score climb towards 90%+.",
    },
  ];

  const benefits = [
    {
      title: "Crafted for Freshers & Students",
      desc: "Addresses the exact barrier fresh graduates face: turning academic coursework into compelling interview proof.",
    },
    {
      title: "Eliminate Interview Anxiety",
      desc: "Familiarize yourself with difficult questions in a low-pressure environment before sitting in front of hiring managers.",
    },
    {
      title: "Comprehensive Role Coverage",
      desc: "Full coverage across Data Analytics, Software Engineering, Web Development, and campus placement behavioral rounds.",
    },
    {
      title: "Measurable Growth",
      desc: "Track quantitative metrics from your first interview attempt (e.g. 55%) to placement-ready mastery (85%+).",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                AI Interview Prep
              </span>
              <span className="text-[10px] block text-blue-600 font-semibold tracking-wider uppercase -mt-1">
                Assistant for Students
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              id="landing-login-btn"
              variant="ghost"
              size="sm"
              onClick={onNavigateToLogin}
            >
              Login
            </Button>
            <Button
              id="landing-get-started-nav-btn"
              variant="primary"
              size="sm"
              onClick={onNavigateToSignup}
              className="shadow-sm"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Empowering College Students & Freshers for Top Campus Placements
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            AI Interview Preparation <br className="hidden sm:inline" />
            <span className="text-blue-600">Assistant</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            "Prepare smarter. Practice better. Crack your interview with confidence."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Button
              id="landing-hero-signup-btn"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-3.5 shadow-lg shadow-blue-600/20"
              onClick={onNavigateToSignup}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              id="landing-hero-login-btn"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-3.5 bg-white shadow-xs"
              onClick={onNavigateToLogin}
            >
              Login to Account
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-14 pt-8 border-t border-slate-200/70 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">10,000+</div>
              <div className="text-xs text-slate-500 mt-1">Practice Questions</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">92%</div>
              <div className="text-xs text-slate-500 mt-1">Student Confidence Boost</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">Real-Time</div>
              <div className="text-xs text-slate-500 mt-1">Gemini AI Feedback</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">100%</div>
              <div className="text-xs text-slate-500 mt-1">Personalized Roadmaps</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="primary" className="mb-3">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
              Everything You Need to Ace Your Placement Rounds
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              A complete end-to-end interview companion with intelligent resume diagnosis, adaptive mock chat, and actionable progress roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="neutral" className="mb-3">
              Step-by-Step Workflow
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              From resume audit to realistic mock evaluation in four simple, guided steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between shadow-xs hover:border-blue-300 transition-all"
              >
                <div>
                  <span className="text-3xl font-black text-blue-100 block mb-2">
                    {s.step}
                  </span>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Validated Workflow
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <Badge variant="success" className="mb-3">
                Placement Success
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl leading-tight">
                Designed Specifically to Help Freshers Stand Out
              </h2>
              <p className="text-slate-600 mt-4 text-base leading-relaxed">
                Most graduates struggle not because of technical capability, but because they fail to articulate their project experiences and answer behavioral questions with structured confidence.
              </p>
              <div className="mt-6">
                <Button
                  id="landing-benefits-cta"
                  variant="primary"
                  onClick={onNavigateToSignup}
                  className="shadow-lg shadow-blue-200"
                >
                  Start Practicing Today
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:border-slate-300 transition-all"
                >
                  <h4 className="text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Dark Navy Sleek Theme) */}
      <footer className="mt-auto bg-[#0F172A] text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Brain className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight text-base">
                AI Interview Preparation Assistant
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <button onClick={onNavigateToSignup} className="hover:text-white transition-colors cursor-pointer">
                Signup
              </button>
              <button onClick={onNavigateToLogin} className="hover:text-white transition-colors cursor-pointer">
                Login
              </button>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-500">Built for College Placements & Freshers</span>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} AI Interview Preparation Assistant. All rights reserved.</p>
            <p>Empowered by Google Gemini AI & Supabase.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
