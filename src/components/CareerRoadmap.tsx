import React from "react";
import { UserProfile, SkillScore } from "../types";
import { INDUSTRY_DEMANDS_MOCK } from "../data";
import { 
  Compass, 
  MapPin, 
  CheckCircle, 
  Play, 
  BookOpen, 
  Lock, 
  GitBranch, 
  AlertCircle, 
  ChevronRight, 
  TrendingUp 
} from "lucide-react";

interface CareerRoadmapProps {
  user: UserProfile;
  skillScores: SkillScore[];
}

export default function CareerRoadmap({ user, skillScores }: CareerRoadmapProps) {
  
  // Highlight high-demand industry skills that are missing in student selected skills
  const industryHotSkills = ["Docker", "TypeScript", "Cloud Architecture (AWS)", "System Design", "Kubernetes", "PyTorch"];
  const studentSkillsLower = user.skills.map(s => s.toLowerCase());
  const missingSkills = industryHotSkills.filter(
    (skill) => !studentSkillsLower.includes(skill.toLowerCase())
  );

  return (
    <div id="career-roadmap-root" className="space-y-6 text-left">
      
      {/* 2 Screen Layout: Personalized roadmap and Skill Gap */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        
        {/* Personalized Interactive Learning Node Graph Timeline (Screen 21) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                <GitBranch className="h-4.5 w-4.5 text-indigo-600" />
                <span>Personalized Learning Roadmap</span>
              </h3>
              <p className="text-[10px] text-slate-400">Chronological learning vector path customized for {user.name}</p>
            </div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full font-mono">
              Vector Map
            </span>
          </div>

          {/* Interactive vertical node roadmap */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            
            {/* Node 1 - Completed */}
            <div className="relative">
              <span className="absolute -left-6 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-teal-500 text-white text-[10px]" title="Passed">
                ✓
              </span>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-slate-900 text-xs">Ph. 1: Core Mathematical Foundation</h5>
                  <span className="text-[8px] font-bold text-teal-700 uppercase tracking-widest font-mono bg-teal-50 px-1 rounded">Passed</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mt-1">
                  Completed. Verified matrix calculus, statistical distributions, and linear regression assessments.
                </p>
              </div>
            </div>

            {/* Node 2 - Active */}
            <div className="relative">
              <span className="absolute -left-6 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-teal-500 text-white text-[10px] ring-4 ring-teal-100 animate-pulse">
                ✓
              </span>
              <div className="bg-teal-50/40 p-4 rounded-xl border border-teal-200">
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-teal-900 text-xs text-teal-950">Ph. 2: Algorithm Engineering & MCQs</h5>
                  <span className="text-[8px] font-bold text-teal-700 uppercase tracking-widest font-mono bg-teal-100 p-0.5 px-1.5 rounded animate-bounce">Evaluating</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mt-1">
                  Active focus. Complete technical coding challenges using the Interactive Playground to record automated AI credentials.
                </p>
              </div>
            </div>

            {/* Node 3 - Locked */}
            <div className="relative">
              <span className="absolute -left-6 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-200 text-slate-400 text-[10px]">
                <Lock className="h-2.5 w-2.5" />
              </span>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 opacity-70">
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-slate-900 text-xs">Ph. 3: Full-Stack Microservice Architectures</h5>
                  <span className="text-[8px] font-mono text-slate-400">Locked</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mt-1">
                  Covers Docker orchestration, API rate-limiting patterns, and Redis caching layers. Unlock by clearing 80% algorithms score.
                </p>
              </div>
            </div>

            {/* Node 4 - Locked */}
            <div className="relative">
              <span className="absolute -left-6 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-200 text-slate-400 text-[10px]">
                <Lock className="h-2.5 w-2.5" />
              </span>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 opacity-70">
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-slate-900 text-xs">Ph. 4: Live Simulated Behavioral Capstones</h5>
                  <span className="text-[8px] font-mono text-slate-400">Locked</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mt-1">
                  Interact in complex situational design panel scenarios alongside principal staff reviewers.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Skill Gap Analysis (Screen 23) (Screen 24) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Skill Gap Block */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                <AlertCircle className="h-4.5 w-4.5 text-amber-500 animate-bounce" />
                <span>Detected Skill Gaps Matrix</span>
              </h3>
              <span className="text-[9px] font-mono text-slate-400">High Risk</span>
            </div>

            <p className="text-xs text-slate-500 leading-normal mb-4">
              AI compared your chosen skills metric against high-growth corporate vacancies. Add these nodes to minimize placement risks:
            </p>

            <div className="space-y-2.5">
              {missingSkills.map((sk) => (
                <div key={sk} className="flex items-center justify-between p-2.5 bg-amber-50/50 border border-amber-100 rounded-xl">
                  <span className="text-xs font-bold text-slate-800">{sk}</span>
                  <span className="text-[9px] font-mono uppercase bg-amber-100 text-amber-800 p-0.5 px-2 rounded-full font-black">
                    High Demand Gap
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Demand Growth Trends */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <h4 className="font-display font-bold text-sm text-slate-900 mb-3 flex items-center space-x-1.5">
              <TrendingUp className="h-4 w-4 text-teal-500" />
              <span>Job Vacancy Growth Trends</span>
            </h4>
            
            <div className="space-y-3">
              {INDUSTRY_DEMANDS_MOCK.slice(0, 2).map((item) => (
                <div key={item.role} className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{item.role}</span>
                    <span className="text-xs font-black text-teal-600 font-mono">{item.growth}</span>
                  </div>
                  <p className="text-[9px] text-slate-500"><strong>Prerequisites:</strong> {item.coreRequirement}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Suggested Courses, Practice Exercises Catalogs (Screen 22) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        <h4 className="font-display font-bold text-sm text-slate-950 mb-4 flex items-center space-x-1.5 animate-pulse">
          <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
          <span>Curated Courses & Practical Exercises</span>
        </h4>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          
          <div className="p-4 border border-slate-150 rounded-xl bg-slate-50/55 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start">
              <span className="p-1 px-2.5 rounded uppercase font-mono text-[8px] font-bold bg-teal-100 text-teal-800">Algorithms course</span>
              <span className="text-xs font-semibold text-slate-400">12 hrs lectures</span>
            </div>
            <h5 className="font-bold text-slate-900 text-sm mt-3 h-10 overflow-hidden line-clamp-2">Enterprise Data Structures & Systems</h5>
            <p className="text-[11px] text-slate-500 leading-normal mt-1">Learn recursive optimization, heaps, and load structures.</p>
            <button className="mt-4 flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:underline">
              <span>Commence exercise</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-4 border border-slate-150 rounded-xl bg-slate-50/55 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start">
              <span className="p-1 px-2.5 rounded uppercase font-mono text-[8px] font-bold bg-indigo-100 text-indigo-800">Orchestration Track</span>
              <span className="text-xs font-semibold text-slate-400">8 hrs lectures</span>
            </div>
            <h5 className="font-bold text-slate-900 text-sm mt-3 h-10 overflow-hidden line-clamp-2">Docker, Kubernetes & AWS Deployment</h5>
            <p className="text-[11px] text-slate-500 leading-normal mt-1">Step-by-step pipeline container deployment and secrets management.</p>
            <button className="mt-4 flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:underline">
              <span>Watch lesson</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-4 border border-slate-150 rounded-xl bg-slate-50/55 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start">
              <span className="p-1 px-2.5 rounded uppercase font-mono text-[8px] font-bold bg-orange-100 text-orange-800">System Design</span>
              <span className="text-xs font-semibold text-slate-400">14 hrs lectures</span>
            </div>
            <h5 className="font-bold text-slate-900 text-sm mt-3 h-10 overflow-hidden line-clamp-2">Symmetric Architecture & Distributed Caches</h5>
            <p className="text-[11px] text-slate-500 leading-normal mt-1">Covers consistency thresholds and rate-limiting patterns.</p>
            <button className="mt-4 flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:underline">
              <span>Start course</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
