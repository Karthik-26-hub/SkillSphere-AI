import React, { useState } from "react";
import { UserProfile, SkillScore, ActiveProject } from "../types";
import { 
  Sliders, 
  Database, 
  Cpu, 
  Activity, 
  Users, 
  RefreshCw, 
  CheckCircle, 
  SlidersHorizontal, 
  Fingerprint 
} from "lucide-react";

interface AdminPanelProps {
  employabilityScore: number;
  setEmployabilityScore: React.Dispatch<React.SetStateAction<number>>;
  skillScores: SkillScore[];
  setSkillScores: React.Dispatch<React.SetStateAction<SkillScore[]>>;
}

export default function AdminPanel({
  employabilityScore,
  setEmployabilityScore,
  skillScores,
  setSkillScores
}: AdminPanelProps) {
  
  // Slider states for score overrides
  const [techWeight, setTechWeight] = useState(40);
  const [commWeight, setCommWeight] = useState(25);
  const [cogWeight, setCogWeight] = useState(20);
  const [portfolioWeight, setPortfolioWeight] = useState(15);
  
  // Model version settings toggler
  const [activeModel, setActiveModel] = useState("gemini-3.5-flash");

  // Reset metrics
  const triggerRecalculateScores = () => {
    // Generate a subtle increment
    setEmployabilityScore(prev => Math.min(100, Math.max(50, Math.round(prev * 1.02))));
    alert("Score weights updated! Employability Score recalculated on active candidates database.");
  };

  return (
    <div id="admin-workspace-root" className="space-y-6 text-left">
      
      {/* 1. Stat Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        
        <div className="p-4 border border-slate-200 bg-white rounded-2xl shadow-sm flex items-center space-x-3">
          <span className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
            <Cpu className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-400">Primary model node</p>
            <p className="font-bold text-slate-900 text-sm">Gemini 3.5 Flash</p>
          </div>
        </div>

        <div className="p-4 border border-slate-200 bg-white rounded-2xl shadow-sm flex items-center space-x-3">
          <span className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-400">Server response latency</p>
            <p className="font-bold text-slate-900 text-sm">~120 ms (Optimized)</p>
          </div>
        </div>

        <div className="p-4 border border-slate-200 bg-white rounded-2xl shadow-sm flex items-center space-x-3">
          <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-400">Active Talent Profiles</p>
            <p className="font-bold text-slate-900 text-sm">3,421 Evaluated</p>
          </div>
        </div>

        <div className="p-4 border border-slate-200 bg-white rounded-2xl shadow-sm flex items-center space-x-3">
          <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Fingerprint className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-400">Hiring node security</p>
            <p className="font-bold text-slate-900 text-sm">MFA Token Guard</p>
          </div>
        </div>

      </div>

      {/* 2. Parameters Configuration Matrix */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        
        {/* Left pane - Config controllers */}
        <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-display font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <SlidersHorizontal className="h-4.5 w-4.5 text-orange-500" />
              <span>Modify Evaluation Weight Matrices</span>
            </h4>
            <span className="text-[10px] font-mono bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded-full">
              Live weights override
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            
            {/* Slider 1 */}
            <div>
              <div className="flex justify-between items-center text-slate-700 font-bold">
                <span>Technical MCQ tests influence</span>
                <span className="text-orange-600 font-mono">{techWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={techWeight}
                onChange={(e) => setTechWeight(Number(e.target.value))}
                className="mt-1.5 w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex justify-between items-center text-slate-700 font-bold">
                <span>Speech & Oral communication metrics</span>
                <span className="text-orange-600 font-mono">{commWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={commWeight}
                onChange={(e) => setCommWeight(Number(e.target.value))}
                className="mt-1.5 w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Slider 3 */}
            <div>
              <div className="flex justify-between items-center text-slate-700 font-bold">
                <span>Cognitive & behavioral dilemmas</span>
                <span className="text-orange-600 font-mono">{cogWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={cogWeight}
                onChange={(e) => setCogWeight(Number(e.target.value))}
                className="mt-1.5 w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Slider 4 */}
            <div>
              <div className="flex justify-between items-center text-slate-700 font-bold">
                <span>Accredited Project portfolios</span>
                <span className="text-orange-600 font-mono">{portfolioWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={portfolioWeight}
                onChange={(e) => setPortfolioWeight(Number(e.target.value))}
                className="mt-1.5 w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-3 rounded-xl mt-4">
              <span className="text-[10px] text-slate-500 font-mono leading-none">
                Sum matrix total: <strong className={techWeight + commWeight + cogWeight + portfolioWeight === 100 ? "text-teal-600" : "text-rose-500"}>{techWeight + commWeight + cogWeight + portfolioWeight}%</strong> (must compile to 100%)
              </span>
              <button
                id="btn-recalc-overrides"
                onClick={triggerRecalculateScores}
                disabled={techWeight + commWeight + cogWeight + portfolioWeight !== 100}
                className="p-1 px-3 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded shadow-sm disabled:bg-slate-350 cursor-pointer"
              >
                Apply parameters
              </button>
            </div>

          </div>
        </div>

        {/* Right pane - Model controller parameters */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-md flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 mb-4">
              AI Engine Tuning
            </h4>

            <div className="space-y-4 text-xs font-sans">
              
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-500 font-mono">Active evaluation nodes</span>
                <div className="mt-1.5 space-y-1.5">
                  <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="modelNode" 
                      value="gemini-3.5-flash" 
                      checked={activeModel === "gemini-3.5-flash"} 
                      onChange={() => setActiveModel("gemini-3.5-flash")}
                      className="text-teal-600 focus:ring-teal-500 h-3.5 w-3.5 rounded-full"
                    />
                    <span>Gemini 3.5 Flash (Latency focus)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="modelNode" 
                      value="gemini-3.1-pro-preview" 
                      checked={activeModel === "gemini-3.1-pro-preview"} 
                      onChange={() => setActiveModel("gemini-3.1-pro-preview")}
                      className="text-teal-600 focus:ring-teal-500 h-3.5 w-3.5 rounded-full"
                    />
                    <span>Gemini 3.1 Pro (Reasoning focus)</span>
                  </label>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 leading-normal text-[10px] text-slate-600">
                <span className="font-bold text-slate-800 uppercase block">Model Health Status:</span>
                <p>Telemetry metrics verified. Node routes initialized with correct header tags ('aistudio-build') for seamless GCP tracing logs.</p>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
