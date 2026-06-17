import React, { useState } from "react";
import { UserProfile, EducationDetails, ResumeAnalysis } from "../types";
import { COMPREHENSIVE_SKILLS_POOL } from "../data";
import {
  User,
  GraduationCap,
  Sparkles,
  Search,
  Upload,
  ArrowRight,
  BrainCircuit,
  CheckCircle,
  FileCheck,
  AlertTriangle
} from "lucide-react";

interface OnboardingFlowProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  education: EducationDetails;
  setEducation: React.Dispatch<React.SetStateAction<EducationDetails>>;
  setResumeAnalysis: (analysis: ResumeAnalysis) => void;
  setEmployabilityScore: React.Dispatch<React.SetStateAction<number>>;
  onComplete: () => void;
}

type OnboardStep = "PROFILE" | "ACADEMICS" | "SKILLS" | "RESUME";

export default function OnboardingFlow({
  user,
  setUser,
  education,
  setEducation,
  setResumeAnalysis,
  setEmployabilityScore,
  onComplete
}: OnboardingFlowProps) {
  const [step, setStep] = useState<OnboardStep>("PROFILE");
  const [skillSearch, setSkillSearch] = useState("");
  
  // Resume upload state variables
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyticResult, setAnalyticResult] = useState<ResumeAnalysis | null>(null);

  // Profile forms update handler
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("ACADEMICS");
  };

  const handleAcademicsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("SKILLS");
  };

  const toggleSkill = (skill: string) => {
    setUser((prev) => {
      const isSelected = prev.skills.includes(skill);
      const newSkills = isSelected
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: newSkills };
    });
  };

  const filteredSkills = COMPREHENSIVE_SKILLS_POOL.filter((skill) =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  // Triggers real server API search
  const triggerResumeAIAnalysis = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/gemini/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await response.json();
      if (data && !data.error) {
        setAnalyticResult(data);
        setResumeAnalysis(data);
        setEmployabilityScore(data.score || 72);
      }
    } catch (err) {
      console.error("Failed to parse resume:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Skip resume and proceed with defaults
  const handleProceedToDashboard = () => {
    if (!analyticResult) {
      // Setup a standard default analysis if they skipped AI
      const mockResult: ResumeAnalysis = {
        score: 75,
        summary: "Profile synthesized successfully based on core skills and academic records. We recommend starting with algorithm exercises.",
        strengths: ["Highly technical selected skill nodes", "Strong academic GPA alignment", "Willingness to take behavioral evaluations"],
        weaknesses: ["Lacks verified coding track proofs", "Lacks active project portfolio records"],
        recommendedSkills: ["TypeScript", "System Design Patterns"],
        suggestedRoles: ["Full Stack Intern", "Software QA Associate"],
      };
      setResumeAnalysis(mockResult);
      setEmployabilityScore(75);
    }
    onComplete();
  };

  return (
    <div id="onboard-parent-container" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Steps Indicator Progress line */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-teal-600 font-mono uppercase tracking-wider">Onboarding Progress</p>
          <p className="text-xs font-bold text-slate-500 font-mono">
            {step === "PROFILE" && "Step 1 of 4: Candidate Setup"}
            {step === "ACADEMICS" && "Step 2 of 4: Academic Records"}
            {step === "SKILLS" && "Step 3 of 4: Skills Selection"}
            {step === "RESUME" && "Step 4 of 4: Cognitive Resume AI Analysis"}
          </p>
        </div>
        <div className="mt-2.5 flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`transition-all duration-500 bg-teal-500 ${
              step === "PROFILE" ? "w-1/4" : step === "ACADEMICS" ? "w-2/4" : step === "SKILLS" ? "w-3/4" : "w-full"
            }`}
          />
        </div>
      </div>

      {step === "PROFILE" && (
        <form onSubmit={handleProfileUpdate} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
          <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-4">
            <span className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Demographic & Contact Configuration</h3>
              <p className="text-xs text-slate-500">Provide basic profile details to customize your employability portal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">Full Candidate Name</label>
              <input
                type="text"
                required
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">Contact Email Node</label>
              <input
                type="email"
                required
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">Desired Experience Rank</label>
              <select
                value={user.experienceLevel}
                onChange={(e) => setUser({ ...user, experienceLevel: e.target.value as any })}
                className="mt-1 block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none"
              >
                <option value="Entry">Entry Level / Graduate Student</option>
                <option value="Mid">Mid Level (1-3 yrs experience)</option>
                <option value="Senior">Senior Level (3+ years experience)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">Profile Avatar Endpoint</label>
              <input
                type="text"
                value={user.avatarUrl}
                onChange={(e) => setUser({ ...user, avatarUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="mt-1 block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center space-x-1 rounded-lg bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-teal-700 ml-auto"
          >
            <span>Proceed to Academics</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {step === "ACADEMICS" && (
        <form onSubmit={handleAcademicsUpdate} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
          <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-4">
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Academic & Educational Records</h3>
              <p className="text-xs text-slate-500">Provide official records for our predictive metrics tracking model.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">College/University Name</label>
              <input
                type="text"
                required
                value={education.collegeName}
                onChange={(e) => setEducation({ ...education, collegeName: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none"
                placeholder="Massachusetts Institute of Technology"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">Degree Program</label>
              <input
                type="text"
                required
                value={education.degree}
                onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none"
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">Major / Specialization</label>
              <input
                type="text"
                required
                value={education.major}
                onChange={(e) => setEducation({ ...education, major: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none"
                placeholder="Computer Science Engineering"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">Cumulative CGPA (scale of 10.0)</label>
              <input
                type="text"
                required
                value={education.cgpa}
                onChange={(e) => setEducation({ ...education, cgpa: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none"
                placeholder="9.2"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">High School Marks Percentage (Grade 12)</label>
              <input
                type="text"
                required
                value={education.twelfthMarks}
                onChange={(e) => setEducation({ ...education, twelfthMarks: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none"
                placeholder="94%"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">Secondary Board Percentage (Grade 10)</label>
              <input
                type="text"
                required
                value={education.tenthMarks}
                onChange={(e) => setEducation({ ...education, tenthMarks: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none"
                placeholder="96%"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setStep("PROFILE")}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Back to Profile
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1 rounded-lg bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-teal-700"
            >
              <span>Verify and Go to Skills</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {step === "SKILLS" && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
          <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-4">
            <span className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <BrainCircuit className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Personal Employability Skills matrix</h3>
              <p className="text-xs text-slate-500">Pick the technologies and core competencies you want evaluated.</p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              placeholder="Filter specific technical, analytical, or behavioral skillsets..."
              className="block w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {filteredSkills.map((skill) => {
              const active = user.skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-2 text-left text-xs rounded-xl border transition-all cursor-pointer ${
                    active
                      ? "bg-teal-50 border-teal-500 text-teal-800 font-bold shadow-sm"
                      : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{skill}</span>
                    {active && <span className="h-2 w-2 rounded-full bg-teal-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-slate-55 bg-slate-100/50 p-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Selected Skill Nodes: <strong className="text-teal-600 font-black">{user.skills.length}</strong>
            </span>
            {user.skills.length === 0 && (
              <span className="text-[10px] text-amber-600 font-medium">Select at least 2 skill nodes to proceed.</span>
            )}
          </div>

          <div className="flex justify-between items-center border-t border-slate-100 pt-4">
            <button
              onClick={() => setStep("ACADEMICS")}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Back to Academic Records
            </button>
            <button
              onClick={() => setStep("RESUME")}
              disabled={user.skills.length < 2}
              className="flex items-center space-x-1 rounded-lg bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-teal-700 disabled:bg-slate-350 cursor-pointer"
            >
              <span>Onboard to Resume Upload</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === "RESUME" && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
          <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-4">
            <span className="p-2.5 bg-cyan-50 text-cyan-500 rounded-xl">
              <Upload className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Cloud AI Resume Parsing Analyzer</h3>
              <p className="text-xs text-slate-500">Provide your actual resume text or paste details code-blocks to parse immediate starting scores.</p>
            </div>
          </div>

          {/* Interactive Pasting Sandbox */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 font-mono">Pasted Resume Text / Cover Summary</label>
            <textarea
              rows={6}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="TONY CANDIDATE&#10;Skills: JavaScript, React, Web development, Machine learning basics.&#10;Education: BS in Computer Science, GPA 3.8&#10;Experience: Software developer intern at TechCorp - designed frontend API connections with robust error limits."
              className="mt-1.5 block w-full rounded-lg border border-slate-200 p-3 text-xs bg-slate-50/30 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
            />
          </div>

          <div className="flex space-x-3">
            <button
              id="btn-analyze-resume-ai"
              onClick={triggerResumeAIAnalysis}
              disabled={isAnalyzing || !resumeText.trim()}
              className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-indigo-800 px-5 py-3 text-xs font-bold text-white shadow-md active:scale-95 hover:from-teal-700 hover:to-indigo-900 disabled:from-teal-350 disabled:to-indigo-305 transition-all text-center cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isAnalyzing ? "Processing cognitive entities..." : "Validate with Gemini AI Engine"}</span>
            </button>
            <button
              onClick={handleProceedToDashboard}
              className="flex items-center space-x-1 rounded-lg border border-slate-200 hover:bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600"
            >
              <span>{analyticResult ? "Complete Onboarding" : "Skip/Bypass AI"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* AI Result Box */}
          {analyticResult && (
            <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-5 mt-4 space-y-4">
              <div className="flex items-center justify-between border-b border-teal-200/50 pb-2.5">
                <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm">
                  <FileCheck className="h-4 w-4" />
                  <span>Interactive AI Scorecard compiled!</span>
                </div>
                <span className="font-mono text-xs font-extrabold bg-teal-600 text-white p-1 px-2.5 rounded-full">
                  Starting score: {analyticResult.score} / 100
                </span>
              </div>
              
              <div className="text-xs space-y-2">
                <p className="text-slate-700 italic leading-relaxed">
                  <strong>AI Insights:</strong> "{analyticResult.summary}"
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <h5 className="font-bold text-teal-800 uppercase text-[10px] tracking-wider mb-1 flex items-center space-x-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Strengths:</span>
                    </h5>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 max-h-32 overflow-y-auto pl-1">
                      {analyticResult.strengths.map((st, idx) => (
                        <li key={idx} className="truncate">{st}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-amber-800 uppercase text-[10px] tracking-wider mb-1 flex items-center space-x-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Suggested Skills to target:</span>
                    </h5>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 max-h-32 overflow-y-auto pl-1">
                      {analyticResult.recommendedSkills.map((sk, idx) => (
                        <li key={idx} className="truncate">{sk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
