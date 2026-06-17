import React, { useState } from "react";
import { UserProfile, SkillScore, ActiveProject, LeaderboardUser } from "../types";
import { LEADERS_LIST } from "../data";
import { 
  Search, 
  SlidersHorizontal, 
  Briefcase, 
  Award, 
  FolderGit, 
  Printer, 
  User, 
  CheckCircle, 
  ChevronRight, 
  Sparkles, 
  PhoneCall, 
  FileCheck2 
} from "lucide-react";

interface RecruiterPortalProps {
  currentUser: UserProfile;
  currentEmployabilityScore: number;
  currentSkillScores: SkillScore[];
  currentProjects: ActiveProject[];
}

export default function RecruiterPortal({
  currentUser,
  currentEmployabilityScore,
  currentSkillScores,
  currentProjects
}: RecruiterPortalProps) {
  
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [minScore, setMinScore] = useState(70);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");
  
  // Aggregate Candidates data matching table
  const candidatesList = [
    {
      id: "cand-self",
      name: currentUser.name,
      email: currentUser.email,
      score: currentEmployabilityScore,
      roleTarget: currentUser.collegeName ? "Software Systems Architect" : "Candidate",
      avatarUrl: currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80",
      skills: currentSkillScores,
      projects: currentProjects,
      placementProb: Math.min(100, Math.round(currentEmployabilityScore * 1.05))
    },
    {
      id: "cand-ld-1",
      name: "Pranav Mukharjee",
      email: "pranav@alumni.it.com",
      score: 96,
      roleTarget: "Machine Learning Specialist",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&fit=crop&q=80",
      skills: [
        { name: "PyTorch Deep Learning", score: 95, category: "Technical" as const, status: "Verified" as const },
        { name: "Symmetric Design Matrices", score: 90, category: "Cognitive" as const, status: "Verified" as const }
      ],
      projects: [
        { id: "p-1", title: "NeuroTranslate Transformer API", description: "Symmetric LLM translation network with sub-50ms latency", technologies: ["Python", "PyTorch", "Kubernetes"], verifiedScore: 95 }
      ],
      placementProb: 98
    },
    {
      id: "cand-ld-2",
      name: "Siddharth Verma",
      email: "sid.verma@mit.edu",
      score: 94,
      roleTarget: "Cloud Security Engineer",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80",
      skills: [
        { name: "AWS Security Protocols", score: 94, category: "Technical" as const, status: "Verified" as const },
        { name: "Inductive Aptitude", score: 90, category: "Aptitude" as const, status: "Verified" as const }
      ],
      projects: [
        { id: "p-2", title: "Terraform Vault Decentralizer", description: "Immutable credential deployment layer protecting remote pods", technologies: ["AWS", "Terraform", "Docker"], verifiedScore: 93 }
      ],
      placementProb: 95
    },
    {
      id: "cand-ld-3",
      name: "Ananya Iyer",
      email: "ananya@academic.in",
      score: 92,
      roleTarget: "Full-Stack Tech Architect",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80",
      skills: [
        { name: "TypeScript Foundations", score: 92, category: "Technical" as const, status: "Verified" as const },
        { name: "Verbal Articulation", score: 88, category: "Communication" as const, status: "Verified" as const }
      ],
      projects: [
        { id: "p-3", title: "Synchronous Canvas whiteboard", description: "Bespoke whiteboard with sub-10ms operational transformation streams.", technologies: ["React", "TypeScript", "WebSockets"], verifiedScore: 91 }
      ],
      placementProb: 93
    }
  ];

  const [activeCandidateId, setActiveCandidateId] = useState(candidatesList[0].id);

  const activeCandidate = candidatesList.find(c => c.id === activeCandidateId) || candidatesList[0];

  // Filters candidates list based on search filters
  const filteredCandidates = candidatesList.filter((cand) => {
    const matchesSearch = 
      cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.roleTarget.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMinScore = cand.score >= minScore;
    const matchesRole = selectedRoleFilter === "All" || cand.roleTarget === selectedRoleFilter;

    return matchesSearch && matchesMinScore && matchesRole;
  });

  // Highlight specific report printing simulation
  const [showPrintedReport, setShowPrintedReport] = useState(false);

  return (
    <div id="recruiter-workspace-root" className="space-y-6 text-left">
      
      {/* 1. Header Filter Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <div>
            <h3 className="font-display font-black text-slate-900 text-lg">Hiring Node: Student Talent Matrix</h3>
            <p className="text-xs text-slate-500">Query evaluated student scores, verified project specs, and compile PDFs.</p>
          </div>
          <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full uppercase">
            Corporate Authorized
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          
          {/* Target input search */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 font-mono">Query role or student</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Systems Architect, Ananya..."
                className="block w-full rounded border border-slate-200 py-1.5 pl-8 pr-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Scale min score */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 font-mono">
              Min AI Scorecard threshold: <strong className="text-teal-600 font-black">{minScore}</strong>
            </label>
            <input
              type="range"
              min="50"
              max="95"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="mt-2 text-teal-600 accent-teal-600 block w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Target role filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 font-mono">Experience matching</label>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="mt-1 block w-full rounded border border-slate-200 py-1.5 px-2.5 text-xs focus:outline-none bg-white"
            >
              <option value="All">All vacancy paths</option>
              <option value="Software Systems Architect">Software Systems Architect</option>
              <option value="Machine Learning Specialist">Machine Learning Specialist</option>
              <option value="Cloud Security Engineer">Cloud Security Engineer</option>
              <option value="Full-Stack Tech Architect">Full-Stack Tech Architect</option>
            </select>
          </div>

        </div>
      </div>

      {/* 2. Main candidate matrix grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        
        {/* Left pane - Student search directory table */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-md flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Directory Rankings ({filteredCandidates.length})
            </h4>

            {filteredCandidates.length === 0 ? (
              <p className="py-12 text-center text-xs text-slate-400">No candidates match your queries.</p>
            ) : (
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                {filteredCandidates.map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => {
                      setActiveCandidateId(cand.id);
                      setShowPrintedReport(false);
                    }}
                    className={`block w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeCandidateId === cand.id 
                        ? "bg-slate-50 border-teal-500 shadow-sm font-bold" 
                        : "bg-white border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={cand.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-snug">{cand.name}</p>
                          <p className="text-[9px] text-slate-400 leading-none">{cand.roleTarget}</p>
                        </div>
                      </div>
                      <span className="font-display font-black text-xs text-teal-700">{cand.score}%</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right pane - Deep Candidate Evaluation reports */}
        <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          
          {!showPrintedReport ? (
            <div className="space-y-5">
              
              {/* Profile banner */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div className="flex items-center space-x-3.5">
                  <img src={activeCandidate.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-display font-bold text-slate-950 text-base">{activeCandidate.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center space-x-1">
                      <Briefcase className="h-3 w-3 text-slate-400" />
                      <span>{activeCandidate.roleTarget}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] uppercase font-mono text-slate-400 block leading-none mb-1">Employability score:</span>
                  <span className="font-display font-black text-xl text-teal-700 bg-teal-50 p-1 px-3.5 rounded-full">{activeCandidate.score}%</span>
                </div>
              </div>

              {/* Placement Probability predicting */}
              <div className="p-4 bg-slate-50 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-400 font-bold block">Placement accuracy probability:</span>
                  <span className="font-display font-black text-base text-teal-700 block mt-1">{activeCandidate.placementProb}% probability</span>
                </div>
                <div className="flex justify-end items-center">
                  <button
                    onClick={() => setShowPrintedReport(true)}
                    className="flex items-center space-x-1.5 p-2 px-4 rounded-xl text-xs font-bold text-indigo-700 border border-indigo-200 bg-white hover:bg-slate-50"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Compile Job Readiness report</span>
                  </button>
                </div>
              </div>

              {/* Verified scores matrix */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Accredited verified scores index:</span>
                <div className="grid grid-cols-2 gap-3.5">
                  {activeCandidate.skills.map((sk, idx) => (
                    <div key={idx} className="p-3 border border-slate-100 rounded-lg bg-slate-50/20">
                      <h5 className="font-semibold text-slate-900 text-xs">{sk.name}</h5>
                      <div className="flex justify-between items-center mt-2.5 border-t border-slate-100 pt-1">
                        <span className="text-[9px] text-slate-500 font-mono tracking-wide">{sk.category}</span>
                        <span className="text-xs font-black text-teal-700 font-display">{sk.score || 75}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project portfolios */}
              {activeCandidate.projects.length > 0 && (
                <div className="space-y-2 text-left pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Project portfolio:</span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {activeCandidate.projects.map((proj, idx) => (
                      <div key={idx} className="p-3 border border-slate-150 rounded-xl bg-slate-100/30">
                        <h5 className="font-bold text-slate-900 text-xs flex items-center justify-between">
                          <span>{proj.title}</span>
                          {proj.verifiedScore && <span className="font-display text-[10px] bg-teal-605 bg-teal-50 text-teal-700 p-0.5 px-2 rounded-full font-extrabold">{proj.verifiedScore}% score</span>}
                        </h5>
                        <p className="text-[10px] text-slate-500 mt-1 lines-clamp-2 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* PRINT REPORT IMMERSIVE SIMULATION CARD */
            <div className="p-6 border-2 border-dashed border-indigo-300 bg-indigo-50/20 rounded-2xl space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-indigo-200 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white shadow font-display font-bold text-sm">
                    EI
                  </div>
                  <div>
                    <h5 className="font-display font-black text-slate-900 text-xs uppercase font-bold">Hiring validation passport</h5>
                    <p className="text-[9px] text-indigo-700 font-mono">ID: EI-CAN-{(activeCandidate.name || "").substring(0,3).toUpperCase()}-402</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPrintedReport(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700"
                >
                  &larr; Back to report view
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img src={activeCandidate.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover border border-indigo-200" />
                  <div className="flex-1 min-w-0">
                    <h6 className="font-display font-extrabold text-slate-900 text-sm">{activeCandidate.name}</h6>
                    <p className="text-xs text-slate-500 font-mono">Desired role: {activeCandidate.roleTarget}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-2 rounded">
                      Cognitive validated
                    </span>
                    <span className="font-display text-2xl font-black block text-indigo-900 mt-1">{activeCandidate.score / 10} / 10</span>
                  </div>
                </div>

                <div className="p-4 bg-white border border-indigo-100 rounded-xl space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono border-b border-slate-100 pb-1">Employability indicators</h5>
                  <div className="grid grid-cols-2 gap-3 text-xs leading-normal font-sans text-slate-600">
                    <div>
                      <p><strong>Technical Foundations:</strong> Verified Level A</p>
                      <p className="mt-1"><strong>Communication index:</strong> POISE (90%)</p>
                    </div>
                    <div>
                      <p><strong>Cognitive Behavior:</strong> High Adaptability</p>
                      <p className="mt-1"><strong>Placement Probability:</strong> {activeCandidate.placementProb}% Confidence</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 leading-normal flex items-start space-x-2.5">
                  <FileCheck2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-teal-900 text-xs">Credential Authenticity Seal</h5>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      This scorecard compiles active technical testing codes, voice articulation vectors, and verified project specifications audited directly on server-side nodes.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => alert("Job Readiness report exported successfully to recruiter nodes!")}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Transmit pdf to HR mailbox</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
