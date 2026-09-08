import React, { useState, useEffect } from "react";
import { User, Profile } from "../../types";
import { Card, CardHeader, CardTitle, CardDescription, Badge, Progress } from "../ui/Card";
import { Button } from "../ui/Button";
import { dbService } from "../../services/db";
import {
  User as UserIcon,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Layers,
  Building2,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";

interface ProfilePageProps {
  user: User;
  profile: Profile | null;
  onProfileUpdated: (updated: Profile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  profile,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(profile?.fullName || user.fullName || "");
  const [email] = useState(profile?.email || user.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [college, setCollege] = useState(profile?.college || "");
  const [degree, setDegree] = useState(profile?.degree || "");
  const [year, setYear] = useState(profile?.year || "Final Year");
  const [jobRole, setJobRole] = useState(profile?.jobRole || "Data Analyst");
  const [experienceLevel, setExperienceLevel] = useState(profile?.experienceLevel || "Fresher");
  const [skills, setSkills] = useState<string[]>(
    profile?.skills || ["Python", "SQL", "Excel", "Power BI"]
  );
  const [skillInput, setSkillInput] = useState("");
  const [targetCompany, setTargetCompany] = useState(profile?.targetCompany || "");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || user.fullName || "");
      setPhone(profile.phone || "");
      setCollege(profile.college || "");
      setDegree(profile.degree || "");
      setYear(profile.year || "Final Year");
      setJobRole(profile.jobRole || "Data Analyst");
      setExperienceLevel(profile.experienceLevel || "Fresher");
      if (profile.skills && profile.skills.length > 0) {
        setSkills(profile.skills);
      }
      setTargetCompany(profile.targetCompany || "");
    }
  }, [profile, user]);

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleQuickAddSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    setIsLoading(true);
    try {
      const updated = await dbService.saveProfile({
        userId: user.id,
        fullName: fullName.trim(),
        email,
        phone: phone.trim(),
        college: college.trim(),
        degree: degree.trim(),
        year,
        jobRole,
        experienceLevel,
        skills,
        targetCompany: targetCompany.trim(),
      });

      onProfileUpdated(updated);
      setSuccessMessage("Profile saved successfully to your database!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || "Something went wrong while saving your profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickSkillsSuggestions = [
    "Python",
    "SQL",
    "Excel",
    "Power BI",
    "Tableau",
    "JavaScript",
    "React",
    "Pandas",
    "Machine Learning",
    "Git",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          My Profile Setup
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your academic background and target job preferences to personalize mock interviews.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal & Contact Details */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Personal & Contact Details</CardTitle>
              <CardDescription>
                Your primary identity used across your student account
              </CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="profile-fullname"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="profile-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="block w-full pl-10 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Email Address (Authenticated)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  disabled
                  className="block w-full pl-10 pr-3.5 py-2 text-sm border border-slate-200 bg-slate-50 text-slate-500 rounded-xl cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="block w-full pl-10 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-target-company"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Target Company
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  id="profile-target-company"
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Google, Amazon, Deloitte, TCS"
                  className="block w-full pl-10 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Academic Profile */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Academic Background</CardTitle>
              <CardDescription>
                College degree and graduation status for campus recruitment rounds
              </CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="profile-college"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                College / University Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <input
                  id="profile-college"
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Stanford / State University"
                  className="block w-full pl-10 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profile-degree"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Degree / Major
              </label>
              <input
                id="profile-degree"
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className="block w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="profile-year"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Year of Study
              </label>
              <select
                id="profile-year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="block w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Target Job Role & Skills */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Target Role & Skill Portfolio</CardTitle>
              <CardDescription>
                AI will calibrate difficulty and technical questions to match these specifications
              </CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="profile-job-role"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Target Job Role
              </label>
              <select
                id="profile-job-role"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="block w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="Data Analyst">Data Analyst</option>
                <option value="Software Developer">Software Developer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Web Developer">Web Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="profile-experience-level"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Experience Level
              </label>
              <select
                id="profile-experience-level"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="block w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                <option value="Fresher">Fresher</option>
                <option value="Internship Experience">Internship Experience</option>
                <option value="0 - 1 Year">0 - 1 Year</option>
                <option value="1 - 2 Years">1 - 2 Years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Skills (e.g. Python, SQL, Excel, Power BI)
            </label>

            {/* Current Skills Tags */}
            <div className="flex flex-wrap gap-2 mb-3 min-h-[36px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              {skills.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No skills added yet</span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-blue-900 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Add Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a skill and press Enter or Add..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSkill()}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>

            {/* Quick Add Suggestions */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-500 font-medium mr-1">Popular for {jobRole}:</span>
              {quickSkillsSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleQuickAddSkill(suggestion)}
                  disabled={skills.includes(suggestion)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    skills.includes(suggestion)
                      ? "bg-slate-100 text-slate-400 cursor-default"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 cursor-pointer"
                  }`}
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            id="profile-save-btn"
            type="submit"
            variant="primary"
            size="md"
            className="px-8 shadow-lg shadow-blue-200"
            isLoading={isLoading}
          >
            {isLoading ? "Saving Profile..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
};
