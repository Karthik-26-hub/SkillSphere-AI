import React, { useState, useEffect, useRef } from "react";
import { UserProfile, SkillScore, ActiveProject, Certification, InternshipTracker, BadgeMock, EducationDetails, ResumeAnalysis } from "./types";
import { 
  INITIAL_SKILL_SCORES, 
  MOCK_NOTIFICATIONS, 
  BAD_INITIAL_BADGES, 
  INITIAL_PROJECT_MOCKS, 
  INITIAL_CERT_MOCKS, 
  INITIAL_INTERNSHIP_MOCKS,
  LEADERS_LIST
} from "./data";

import Navbar from "./components/Navbar";
import AuthLayout from "./components/AuthLayout";
import OnboardingFlow from "./components/OnboardingFlow";
import DashboardOverview from "./components/DashboardOverview";
import AssessmentSuite from "./components/AssessmentSuite";
import CareerRoadmap from "./components/CareerRoadmap";
import PortfolioManager from "./components/PortfolioManager";
import RecruiterPortal from "./components/RecruiterPortal";
import AdminPanel from "./components/AdminPanel";
import AiChatbot from "./components/AiChatbot";
import SettingsComponent from "./components/Settings";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "./firebase";

import { 
  BarChart3, 
  Compass, 
  GitBranch, 
  Briefcase, 
  FolderGit2, 
  CheckCircle, 
  GraduationCap,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Sparkles,
  UserCheck,
  Award,
  Activity,
  User,
  Sliders,
  FileText
} from "lucide-react";

type ActivePortal = "AUTH" | "ONBOARDING" | "STUDENT" | "RECRUITER" | "ADMIN";
type StudentSubTab = "HOME" | "SCORECARD" | "PROFILE" | "SETTINGS";

export default function App() {
  
  // Real-time globally synchronized state
  const [activePortal, setActivePortal] = useState<ActivePortal>("AUTH");
  const [studentTab, setStudentTab] = useState<StudentSubTab>("HOME");

  // Nested Student Sub-Selector States
  const [scorecardSubTab, setScorecardSubTab] = useState<"STATS" | "ASSESSMENTS" | "ROADMAP">("STATS");
  const [profileSubTab, setProfileSubTab] = useState<"SUMMARY" | "CREDENTIALS">("SUMMARY");

  // Profile status state
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "tony6250584@gmail.com",
    collegeName: "National Institute of Science & Technology",
    degree: "Bachelor of Technology",
    graduationYear: "2027",
    cgpa: "8.8 CGPA",
    experienceLevel: "Entry",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&fit=crop&q=80",
    skills: ["React", "JavaScript", "Python"],
  });

  const [education, setEducation] = useState<EducationDetails>({
    collegeName: "National Institute of Science & Technology",
    degree: "Bachelor of Technology",
    graduationYear: "2027",
    cgpa: "8.8 CGPA",
    major: "Software Engineering",
    twelfthMarks: "92%",
    tenthMarks: "95%"
  });

  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>({
    score: 75,
    summary: "The candidate's profile demonstrates an operational understanding of JavaScript, React, and Python interfaces.",
    strengths: ["Strong engineering core", "Symmetric algorithm analysis metrics"],
    weaknesses: ["Missing containerization pipelines knowledge", "Low systems telemetry index"],
    recommendedSkills: ["Docker", "Kubernetes", "AWS Architecture"],
    suggestedRoles: ["Software Architect Apprentice", "Systems Developer Analyst"]
  });

  // Stateful metric stores that components dynamically override
  const [employabilityScore, setEmployabilityScore] = useState<number>(72);
  const [skillScores, setSkillScores] = useState<SkillScore[]>(INITIAL_SKILL_SCORES);
  const [projects, setProjects] = useState<ActiveProject[]>(INITIAL_PROJECT_MOCKS);
  const [certifications, setCertifications] = useState<Certification[]>(INITIAL_CERT_MOCKS);
  const [internships, setInternships] = useState<InternshipTracker[]>(INITIAL_INTERNSHIP_MOCKS);
  const [badges, setBadges] = useState<BadgeMock[]>(BAD_INITIAL_BADGES);

  // Notifications drawer control
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Firebase loaded state locks to prevent initial state overwrite
  const isLoadedFromFirebase = useRef(false);

  // General sync write back to the dynamic Firestore document
  const writeBackToFirestore = async (overrideData?: any) => {
    if (!user.email || !isLoadedFromFirebase.current) return;
    try {
      const docRef = doc(db, "users", user.email);
      const payload = {
        email: user.email,
        name: user.name || "Default Candidate",
        collegeName: user.collegeName,
        degree: user.degree,
        graduationYear: user.graduationYear,
        cgpa: user.cgpa,
        experienceLevel: user.experienceLevel,
        avatarUrl: user.avatarUrl,
        skills: user.skills,
        employabilityScore,
        education,
        resumeAnalysis,
        skillScores,
        projects,
        certifications,
        internships,
        badges,
        notifications,
        updatedAt: new Date().toISOString(),
        ...overrideData
      };
      await setDoc(docRef, payload);
      console.log("State written back to Firestore successfully for:", user.email);
    } catch (error) {
      console.warn("Failed to write state back to Firestore:", error);
    }
  };

  // Real-time synchronization subscription hook
  useEffect(() => {
    if (activePortal === "AUTH" || !user.email) {
      isLoadedFromFirebase.current = false;
      return;
    }

    const docRef = doc(db, "users", user.email);
    console.log("Connecting real-time Firebase subscription node for candidate profile:", user.email);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Real-time Firestore user payload fetched:", data);
        
        // Temporarily disarm write back to reject echoes
        isLoadedFromFirebase.current = false;

        // Distribute data back to localized react state managers
        if (data.name !== undefined) {
          setUser(prev => ({
            ...prev,
            name: data.name,
            email: data.email || prev.email,
            collegeName: data.collegeName || prev.collegeName,
            degree: data.degree || prev.degree,
            graduationYear: data.graduationYear || prev.graduationYear,
            cgpa: data.cgpa || prev.cgpa,
            experienceLevel: data.experienceLevel || prev.experienceLevel,
            avatarUrl: data.avatarUrl || prev.avatarUrl,
            skills: data.skills || prev.skills
          }));
        }

        if (data.education) setEducation(data.education);
        if (data.resumeAnalysis !== undefined) setResumeAnalysis(data.resumeAnalysis);
        if (data.employabilityScore !== undefined) setEmployabilityScore(data.employabilityScore);
        if (data.skillScores) setSkillScores(data.skillScores);
        if (data.projects) setProjects(data.projects);
        if (data.certifications) setCertifications(data.certifications);
        if (data.internships) setInternships(data.internships);
        if (data.badges) setBadges(data.badges);
        if (data.notifications) setNotifications(data.notifications);

        // Safely arm write back after updates complete
        setTimeout(() => {
          isLoadedFromFirebase.current = true;
        }, 150);
      } else {
        // Document doesn't exist yet! Let's instantiate it with existing client details
        console.log("No remote config found, seeding real-time data instance for candidate:", user.email);
        const payload = {
          email: user.email,
          name: user.name || "Default Candidate",
          collegeName: user.collegeName,
          degree: user.degree,
          graduationYear: user.graduationYear,
          cgpa: user.cgpa,
          experienceLevel: user.experienceLevel,
          avatarUrl: user.avatarUrl,
          skills: user.skills,
          employabilityScore,
          education,
          resumeAnalysis,
          skillScores,
          projects,
          certifications,
          internships,
          badges,
          notifications,
          updatedAt: new Date().toISOString(),
        };

        setDoc(docRef, payload)
          .then(() => {
            isLoadedFromFirebase.current = true;
          })
          .catch((err) => {
            console.error("Failed to seed user document in Firestore on demand:", err);
            isLoadedFromFirebase.current = true; // safe recover
          });
      }
    }, (error) => {
      if (error instanceof Error && (error.message.includes("offline") || error.message.includes("Could not reach Cloud Firestore"))) {
        console.warn("Real-time Firebase listener operating in offline mode: using cached storage nodes.", error);
      } else {
        console.warn("Real-time listener permission/offline failure:", error);
        try {
          handleFirestoreError(error, OperationType.GET, "users/" + user.email);
        } catch (errInfo) {
          console.warn("Asynchronous Firestore sync error bound:", errInfo);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user.email, activePortal]);

  // Debounced Auto-Persistence Writeback
  useEffect(() => {
    if (!isLoadedFromFirebase.current) return;

    const timer = setTimeout(() => {
      writeBackToFirestore();
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    user,
    education,
    resumeAnalysis,
    employabilityScore,
    skillScores,
    projects,
    certifications,
    internships,
    badges,
    notifications
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      
      {/* Dynamic Navigation Bar (Loaded unless we are on Auth page) */}
      {activePortal !== "AUTH" && (
        <Navbar 
          activePortal={activePortal} 
          setActivePortal={setActivePortal} 
          user={user} 
          employabilityScore={employabilityScore} 
        />
      )}

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 pb-20">
        
        {/* Portal Switcher Routers */}
        {activePortal === "AUTH" && (
          <AuthLayout 
            onAuthSuccess={(userData) => {
              setUser(prev => ({ 
                ...prev, 
                name: userData.name,
                email: userData.email 
              }));
              // Go to onboarding next
              setActivePortal("ONBOARDING");
            }} 
          />
        )}

        {activePortal === "ONBOARDING" && (
          <OnboardingFlow 
            user={user}
            setUser={setUser}
            education={education}
            setEducation={setEducation}
            setResumeAnalysis={setResumeAnalysis}
            setEmployabilityScore={setEmployabilityScore}
            onComplete={() => {
              setActivePortal("STUDENT");
              setStudentTab("HOME");
            }}
          />
        )}

        {activePortal === "STUDENT" && (
          <div className="space-y-6 pb-24">
            
            {/* 1. HOME tab view */}
            {studentTab === "HOME" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="font-display text-2xl font-black text-slate-900">
                      Welcome Back, {user.name || "Student Candidate"}!
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Your cognitive profile evaluation is synchronized live. Target path: <strong className="text-teal-700">{user.collegeName ? "Software Systems Architect" : "Candidate"}</strong>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-fit">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-500 px-2">Weekly Goal met:</span>
                    <span className="text-[10px] font-bold text-white bg-teal-600 p-1 px-2 rounded-lg font-mono">100% Verified</span>
                  </div>
                </div>

                <DashboardOverview 
                  user={user} 
                  resumeAnalysis={resumeAnalysis}
                  skillScores={skillScores}
                  badges={badges}
                  leaderboard={LEADERS_LIST}
                  employabilityScore={employabilityScore}
                  setPage={(pageName) => {
                    if (pageName === "assessment") {
                      setStudentTab("SCORECARD");
                      setScorecardSubTab("ASSESSMENTS");
                    } else if (pageName === "roadmap") {
                      setStudentTab("SCORECARD");
                      setScorecardSubTab("ROADMAP");
                    } else if (pageName === "portfolio") {
                      setStudentTab("PROFILE");
                      setProfileSubTab("CREDENTIALS");
                    }
                  }}
                />
              </div>
            )}

            {/* 2. SCORECARD tab view (With nested subtab selectors) */}
            {studentTab === "SCORECARD" && (
              <div className="space-y-6">
                
                {/* Scorecard Mini Navigation rail */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setScorecardSubTab("STATS")}
                      className={`flex items-center space-x-1.5 pb-2 font-display text-xs font-bold border-b-2 tracking-wider transition-colors uppercase cursor-pointer ${
                        scorecardSubTab === "STATS" 
                          ? "border-teal-600 text-teal-800" 
                          : "border-transparent text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Detailed Scorecards</span>
                    </button>

                    <button
                      onClick={() => setScorecardSubTab("ASSESSMENTS")}
                      className={`flex items-center space-x-1.5 pb-2 font-display text-xs font-bold border-b-2 tracking-wider transition-colors uppercase cursor-pointer ${
                        scorecardSubTab === "ASSESSMENTS" 
                          ? "border-teal-600 text-teal-800" 
                          : "border-transparent text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      <Compass className="h-4 w-4" />
                      <span>Simulation Sandbox</span>
                    </button>

                    <button
                      onClick={() => setScorecardSubTab("ROADMAP")}
                      className={`flex items-center space-x-1.5 pb-2 font-display text-xs font-bold border-b-2 tracking-wider transition-colors uppercase cursor-pointer ${
                        scorecardSubTab === "ROADMAP" 
                          ? "border-teal-600 text-teal-800" 
                          : "border-transparent text-slate-400 hover:text-slate-805"
                      }`}
                    >
                      <GitBranch className="h-4 w-4" />
                      <span>Career Pathways</span>
                    </button>
                  </div>
                  
                  <span className="text-[10px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100 font-bold uppercase">
                    Continuous Audit Node
                  </span>
                </div>

                {scorecardSubTab === "STATS" && (
                  <div className="space-y-6 text-left">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                        <div>
                          <h3 className="font-display font-black text-slate-900 text-base">Comprehensive Skills Index Matrix</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Live cognitive capabilities scorecard from real-time dynamic evaluations.</p>
                        </div>
                        <span className="text-xs font-black bg-teal-50 text-teal-700 p-1 px-3 rounded-full font-mono">
                          Rating: {employabilityScore}/100
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {skillScores.map((sk) => (
                          <div key={sk.name} className="p-4 border border-slate-150 bg-slate-50/40 rounded-xl space-y-2">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-black text-slate-800 max-w-[140px] truncate">{sk.name}</span>
                              <span className={`text-[8px] font-bold font-mono p-0.5 px-1.5 rounded uppercase ${
                                sk.status === "Verified" ? "bg-teal-100 text-teal-800" : "bg-slate-200 text-slate-500"
                              }`}>
                                {sk.status}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] text-slate-600 pt-1">
                              <span className="font-mono text-slate-400">Node type: {sk.category}</span>
                              <span className="font-bold text-teal-700 font-mono">{sk.score}%</span>
                            </div>

                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  sk.category === "Technical" ? "bg-teal-500" : "bg-indigo-600"
                                }`}
                                style={{ width: `${sk.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick evaluation alert banner */}
                    <div className="p-4 rounded-2xl border border-indigo-150 bg-indigo-50/45 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide">Improve specific skill ratings now</h4>
                        <p className="text-[11px] text-slate-600">Simulate specialized cognitive dilemmas, code compilers, or group exercises in our sandbox.</p>
                      </div>
                      <button
                        onClick={() => setScorecardSubTab("ASSESSMENTS")}
                        className="text-xs font-bold text-indigo-700 hover:text-white bg-white hover:bg-indigo-700 border border-indigo-200 p-2 px-4 rounded-xl cursor-pointer w-fit"
                      >
                        Launch Simulator Sandbox &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {scorecardSubTab === "ASSESSMENTS" && (
                  <AssessmentSuite 
                    user={user}
                    skillScores={skillScores}
                    setSkillScores={setSkillScores}
                    setEmployabilityScore={setEmployabilityScore}
                    setBadges={setBadges}
                  />
                )}

                {scorecardSubTab === "ROADMAP" && (
                  <CareerRoadmap 
                    user={user}
                    skillScores={skillScores}
                  />
                )}

              </div>
            )}

            {/* 3. PROFILE tab view */}
            {studentTab === "PROFILE" && (
              <div className="space-y-6">
                
                {/* Profile Tabs switcher */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setProfileSubTab("SUMMARY")}
                      className={`flex items-center space-x-1.5 pb-2 font-display text-xs font-bold border-b-2 tracking-wider transition-colors uppercase cursor-pointer ${
                        profileSubTab === "SUMMARY" 
                          ? "border-teal-600 text-teal-800" 
                          : "border-transparent text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span>Executive Academic Profiles</span>
                    </button>

                    <button
                      onClick={() => setProfileSubTab("CREDENTIALS")}
                      className={`flex items-center space-x-1.5 pb-2 font-display text-xs font-bold border-b-2 tracking-wider transition-colors uppercase cursor-pointer ${
                        profileSubTab === "CREDENTIALS" 
                          ? "border-teal-600 text-teal-800" 
                          : "border-transparent text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      <FolderGit2 className="h-4 w-4" />
                      <span>Portfolio & Experience credentials</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-155 px-2 py-0.5 rounded font-black uppercase">
                    Symmetric Candidate Matrix
                  </span>
                </div>

                {profileSubTab === "SUMMARY" && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-left">
                    
                    {/* Left stats: Education background */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
                      <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-1.5">
                        <GraduationCap className="h-4.5 w-4.5 text-teal-600" />
                        <span>Academic Particulars</span>
                      </h3>

                      <div className="space-y-3 pt-1 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <span className="font-mono text-[9px] uppercase text-slate-400 block font-bold">Institution Node:</span>
                          <span className="font-bold text-slate-800 leading-normal block mt-0.5">{education.collegeName || user.collegeName}</span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl">
                          <span className="font-mono text-[9px] uppercase text-slate-400 block font-bold">Degree Program:</span>
                          <span className="font-bold text-slate-800 leading-normal block mt-0.5">{education.degree || user.degree} &bull; {education.major || "Computer Science"}</span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl">
                          <span className="font-mono text-[9px] uppercase text-slate-400 block font-bold">Cumulative marks CGPA:</span>
                          <span className="font-bold text-slate-800 leading-normal block mt-0.5">{education.cgpa || user.cgpa}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <span className="font-mono text-[8px] uppercase text-slate-400 block font-bold">XII Marks:</span>
                            <span className="font-bold text-slate-800 text-[11px] block mt-0.5">{education.twelfthMarks || "92%"}</span>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <span className="font-mono text-[8px] uppercase text-slate-400 block font-bold">X Marks:</span>
                            <span className="font-bold text-slate-800 text-[11px] block mt-0.5">{education.tenthMarks || "95%"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Central: AI Resume Audit result summary */}
                    <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
                      <h3 className="font-display font-medium text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center space-x-1.5">
                        <FileText className="h-4.5 w-4.5 text-indigo-600" />
                        <span className="font-bold">Natural Language Resume analysis</span>
                      </h3>

                      {resumeAnalysis ? (
                        <div className="space-y-4 text-xs font-sans leading-normal text-slate-700">
                          <div className="flex flex-wrap items-center justify-between p-3.5 bg-emerald-50/50 border border-emerald-150 rounded-xl gap-2">
                            <div>
                              <span className="text-[9px] font-mono uppercase text-emerald-800 font-bold block">Parsing Accuracy indicator:</span>
                              <p className="font-bold text-emerald-950 mt-0.5">Resume Score evaluates to {resumeAnalysis.score}/100</p>
                            </div>
                            <span className="font-display font-black text-sm text-emerald-800 bg-white border border-emerald-150 px-2 rounded">
                              PRO
                            </span>
                          </div>

                          <p className="leading-relaxed text-slate-600 font-mono italic">
                            "{resumeAnalysis.summary}"
                          </p>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                              <span className="font-mono text-[9px] uppercase text-teal-700 font-bold block">PROVEN PROFILE STRENGTHS:</span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-600 font-sans">
                                {resumeAnalysis.strengths.map((str, i) => (
                                  <li key={i}>{str}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-1.5">
                              <span className="font-mono text-[9px] uppercase text-rose-700 font-bold block">CRITICAL PROFILE WEAKNESSES:</span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-600 font-sans">
                                {resumeAnalysis.weaknesses.map((weak, i) => (
                                  <li key={i}>{weak}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100">
                            <div>
                              <span className="font-mono text-[9px] uppercase text-slate-400 font-bold block">RECOMMENDED SKILL ACQUISITIONS:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {resumeAnalysis.recommendedSkills.map((sk, i) => (
                                  <span key={i} className="bg-indigo-50 text-indigo-700 text-[9px] font-semibold font-mono p-0.5 px-2 rounded-md">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="font-mono text-[9px] uppercase text-slate-400 font-bold block">SUGGESTED CORPORATE ROLES:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {resumeAnalysis.suggestedRoles.map((role, i) => (
                                  <span key={i} className="bg-teal-50 text-teal-700 text-[9px] font-semibold font-mono p-0.5 px-2 rounded-md">
                                    {role}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="py-12 text-center text-xs text-slate-400">Resume profile has not been uploaded. Use the settings or onboarding screen to upload candidate transcripts.</p>
                      )}
                    </div>
                  </div>
                )}

                {profileSubTab === "CREDENTIALS" && (
                  <PortfolioManager 
                    user={user}
                    projects={projects}
                    setProjects={setProjects}
                    certifications={certifications}
                    setCertifications={setCertifications}
                    internships={internships}
                    setInternships={setInternships}
                    setEmployabilityScore={setEmployabilityScore}
                  />
                )}

              </div>
            )}

            {/* 4. SETTINGS tab view */}
            {studentTab === "SETTINGS" && (
              <SettingsComponent 
                user={user}
                setUser={setUser}
                education={education}
                setEducation={setEducation}
                employabilityScore={employabilityScore}
                setEmployabilityScore={setEmployabilityScore}
                setSkillScores={setSkillScores}
                setProjects={setProjects}
                setCertifications={setCertifications}
                setInternships={setInternships}
              />
            )}

          </div>
        )}

        {activePortal === "RECRUITER" && (
          <RecruiterPortal 
            currentUser={user} 
            currentEmployabilityScore={employabilityScore}
            currentSkillScores={skillScores}
            currentProjects={projects}
          />
        )}

        {activePortal === "ADMIN" && (
          <AdminPanel 
            employabilityScore={employabilityScore}
            setEmployabilityScore={setEmployabilityScore}
            skillScores={skillScores}
            setSkillScores={setSkillScores}
          />
        )}

      </main>

      {/* Premium Sticky Bottom Navigation Bar for Student Portal */}
      {activePortal === "STUDENT" && (
        <div id="sticky-bottom-navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 shadow-lg select-none md:py-2.5">
          <div className="max-w-md mx-auto px-4 flex justify-between items-center sm:px-6">
            
            <button
              id="navigation-home-tab"
              onClick={() => setStudentTab("HOME")}
              className={`flex items-center flex-col space-y-1.5 group cursor-pointer transition-colors ${
                studentTab === "HOME" ? "text-teal-600 font-bold" : "text-slate-400 hover:text-slate-800"
              }`}
            >
              <HomeIcon className={`h-5 w-5 ${studentTab === "HOME" ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-[10px] tracking-wider font-semibold font-display uppercase">Home</span>
            </button>

            <button
              id="navigation-scorecard-tab"
              onClick={() => setStudentTab("SCORECARD")}
              className={`flex items-center flex-col space-y-1.5 group cursor-pointer transition-colors ${
                studentTab === "SCORECARD" ? "text-teal-600 font-bold" : "text-slate-400 hover:text-slate-800"
              }`}
            >
              <Sparkles className={`h-5 w-5 ${studentTab === "SCORECARD" ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-[10px] tracking-wider font-semibold font-display uppercase">Scorecard</span>
            </button>

            <button
              id="navigation-profile-tab"
              onClick={() => {
                setStudentTab("PROFILE");
                setProfileSubTab("SUMMARY");
              }}
              className={`flex items-center flex-col space-y-1.5 group cursor-pointer transition-colors ${
                studentTab === "PROFILE" ? "text-teal-600 font-bold" : "text-slate-400 hover:text-slate-800"
              }`}
            >
              <UserCheck className={`h-5 w-5 ${studentTab === "PROFILE" ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-[10px] tracking-wider font-semibold font-display uppercase">Profile</span>
            </button>

            <button
              id="navigation-settings-tab"
              onClick={() => setStudentTab("SETTINGS")}
              className={`flex items-center flex-col space-y-1.5 group cursor-pointer transition-colors ${
                studentTab === "SETTINGS" ? "text-teal-600 font-bold" : "text-slate-400 hover:text-slate-800"
              }`}
            >
              <SettingsIcon className={`h-5 w-5 ${studentTab === "SETTINGS" ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
              <span className="text-[10px] tracking-wider font-semibold font-display uppercase">Settings</span>
            </button>

          </div>
        </div>
      )}

      {/* Global Action Floating AI Careers Chatbot Assistant (available if authenticated) */}
      {activePortal !== "AUTH" && <AiChatbot />}

      {/* Futuristic footer credentials */}
      <footer className="border-t border-slate-150 py-4 text-center text-[10px] text-slate-400 mt-20">
        <p>&copy; {new Date().getFullYear()} Cognitive Careers System for Student Employability Optimization. Managed under authentic AI nodes.</p>
      </footer>

    </div>
  );
}
