import React, { useState, useRef } from "react";
import { User, Profile, Resume, ResumeAnalysis } from "../../types";
import { Card, CardHeader, CardTitle, CardDescription, Badge, Progress } from "../ui/Card";
import { Button } from "../ui/Button";
import { aiService } from "../../services/ai";
import { dbService } from "../../services/db";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Award,
  Layers,
  FolderGit2,
  GraduationCap,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

interface ResumePageProps {
  user: User;
  profile: Profile | null;
  currentResume: Resume | null;
  onResumeSaved: (resume: Resume) => void;
  onNavigateToInterview: () => void;
}

export const ResumePage: React.FC<ResumePageProps> = ({
  user,
  profile,
  currentResume,
  onResumeSaved,
  onNavigateToInterview,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const allowedExtensions = [".pdf", ".doc", ".docx"];

  const handleValidateFile = (file: File): boolean => {
    setErrorMessage(null);
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidExt = allowedExtensions.includes(ext);

    if (!isValidExt && !allowedTypes.includes(file.type)) {
      setErrorMessage("Please upload a valid PDF, DOC, or DOCX resume file.");
      return false;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size exceeds 10MB. Please upload a smaller file.");
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (handleValidateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (handleValidateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleProcessUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);
    setStatusMessage("Uploading Resume securely...");

    try {
      // Simulate file reader / text extraction
      const fileName = selectedFile.name;
      const fileSize = `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`;

      let extractedSampleText = "";
      try {
        const text = await selectedFile.text();
        extractedSampleText = text.slice(0, 10000);
      } catch {
        extractedSampleText = `Candidate Resume file ${fileName} for ${profile?.jobRole || "Tech Role"}.`;
      }

      setIsUploading(false);
      setIsAnalyzing(true);
      setStatusMessage("Analyzing Resume with Gemini AI...");

      const analysisResult = await aiService.analyzeResume({
        resumeText: extractedSampleText,
        fileName,
        targetRole: profile?.jobRole || "Data Analyst",
        skills: profile?.skills || ["Python", "SQL", "Excel"],
      });

      const savedResume = await dbService.saveResume({
        userId: user.id,
        fileName,
        fileSize,
        resumeScore: analysisResult.resumeScore,
        analysis: analysisResult.analysis,
      });

      onResumeSaved(savedResume);
      setSelectedFile(null);
      setStatusMessage("Resume analysis complete!");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Unable to upload or analyze the file. Please check the file and try again."
      );
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const resumeToShow = currentResume;

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Resume Upload & AI Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload your resume (PDF, DOC, DOCX) to receive an objective score, skill audit, and recommendations.
          </p>
        </div>
        {resumeToShow && (
          <Button
            variant="primary"
            size="md"
            onClick={onNavigateToInterview}
            className="self-start sm:self-auto shadow-lg shadow-blue-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Interview Based on Resume
          </Button>
        )}
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2 animate-in fade-in">
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Box */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              {resumeToShow ? "Replace or Update Resume" : "Upload Resume"}
            </CardTitle>
            <CardDescription>
              Supported formats: PDF, DOC, DOCX (Max size: 10MB)
            </CardDescription>
          </div>
          {resumeToShow && (
            <Badge variant="success">
              Active: {resumeToShow.fileName}
            </Badge>
          )}
        </CardHeader>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50/50"
              : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <UploadCloud className="w-7 h-7" />
          </div>

          <p className="text-sm font-bold text-slate-800">
            {selectedFile ? selectedFile.name : "Click to select or drag & drop your resume"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {selectedFile
              ? `Selected size: ${(selectedFile.size / 1024).toFixed(1)} KB`
              : "PDF, DOC, or DOCX up to 10MB"}
          </p>

          {selectedFile && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button
                id="resume-upload-submit-btn"
                variant="primary"
                size="sm"
                isLoading={isUploading || isAnalyzing}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProcessUpload();
                }}
              >
                {isUploading
                  ? "Uploading Resume..."
                  : isAnalyzing
                  ? "Analyzing Resume..."
                  : "Upload & Analyze Resume"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* AI Resume Analysis Section */}
      {resumeToShow && resumeToShow.analysis && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Score Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-blue-600"
                  style={{
                    clipPath: `polygon(50% 50%, -50% -50%, ${resumeToShow.resumeScore}% -50%, ${resumeToShow.resumeScore}% 150%)`,
                  }}
                />
                <div className="text-center">
                  <span className="text-xl font-extrabold text-slate-900 block leading-none">
                    {resumeToShow.resumeScore}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    / 100
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Resume Evaluation Score
                  </h3>
                  <Badge variant={resumeToShow.resumeScore >= 80 ? "success" : "warning"}>
                    {resumeToShow.resumeScore >= 80 ? "Placement Ready" : "Improvements Needed"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluated for <strong>{profile?.jobRole || "Your Target Role"}</strong> based on market benchmarks and technical skills.
                </p>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-3">
                  <span>File: {resumeToShow.fileName}</span>
                  <span>•</span>
                  <span>Analyzed: {new Date(resumeToShow.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Replace Resume
            </Button>
          </div>

          {/* Strengths & Areas to Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="border-emerald-100 bg-emerald-50/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-emerald-950">Resume Strengths</CardTitle>
                    <CardDescription>What hiring managers will love</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <ul className="space-y-2.5">
                {resumeToShow.analysis.strengths.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Areas to Improve */}
            <Card className="border-amber-100 bg-amber-50/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-amber-950">Areas to Improve</CardTitle>
                    <CardDescription>Actionable fixes to score 90%+</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <ul className="space-y-2.5">
                {resumeToShow.analysis.suggestedImprovements.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2.5">
                    <TrendingUp className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Skills Audit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detected Skills */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <CardTitle>Skills Detected in Resume</CardTitle>
                </div>
              </CardHeader>
              <div className="flex flex-wrap gap-2">
                {resumeToShow.analysis.detectedSkills.map((skill, i) => (
                  <Badge key={i} variant="primary" className="py-1 px-3">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Missing Skills */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <CardTitle>High-Demand Missing Skills</CardTitle>
                </div>
              </CardHeader>
              <div className="flex flex-wrap gap-2">
                {resumeToShow.analysis.missingSkills.map((skill, i) => (
                  <Badge key={i} variant="danger" className="py-1 px-3">
                    + {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Projects, Education & Experience Detected */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 mb-2">
                <FolderGit2 className="w-4 h-4 text-blue-600" />
                Projects Detected
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {resumeToShow.analysis.detectedProjects.map((p, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="truncate">{p}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 mb-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Education Extracted
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {resumeToShow.analysis.education}
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 mb-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Experience Summary
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {resumeToShow.analysis.experience}
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
