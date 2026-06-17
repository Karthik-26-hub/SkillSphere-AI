import React from "react";
import { UserProfile, ResumeAnalysis, SkillScore, BadgeMock, LeaderboardUser } from "../types";
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  ArrowUpRight, 
  ShieldCheck, 
  Brain, 
  Activity, 
  Layers, 
  Clock 
} from "lucide-react";

interface DashboardOverviewProps {
  user: UserProfile;
  resumeAnalysis: ResumeAnalysis | null;
  skillScores: SkillScore[];
  badges: BadgeMock[];
  leaderboard: LeaderboardUser[];
  employabilityScore: number;
  setPage: (page: string) => void;
}

export default function DashboardOverview({
  user,
  resumeAnalysis,
  skillScores,
  badges,
  leaderboard,
  employabilityScore,
  setPage
}: DashboardOverviewProps) {
  
  // Placement probability is a dynamic weight of employability score and completed skills count
  const placementProb = Math.min(100, Math.round(employabilityScore * 1.05 - (8 - user.skills.length) * 1.5));
  const confidenceIndex = Math.round(75 + (employabilityScore / 10));

  // Count verified skills
  const verifiedCount = skillScores.filter(s => s.status === "Verified").length;

  return (
    <div id="dashboard-main" className="space-y-6">
      
      {/* Prime Stat Callout Banner */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        
        {/* Dynamic Radian scoring widget */}
        <div className="col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-3 left-3 bg-teal-50 text-[9px] font-mono font-black text-teal-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Employability Score
          </div>
          
          <div className="relative flex items-center justify-center h-48 w-48 mt-4">
            {/* SVG Circular path */}
            <svg className="absolute transform -rotate-90 w-full h-full">
              <circle
                cx="96"
                cy="96"
                r="72"
                stroke="#f1f5f9"
                strokeWidth="12"
                fill="transparent"
                id="radial-bg"
              />
              <circle
                cx="96"
                cy="96"
                r="72"
                stroke="url(#tealGradient)"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 72}
                strokeDashoffset={2 * Math.PI * 72 * (1 - employabilityScore / 100)}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                id="radial-progress"
              />
              <defs>
                <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>
              </defs>
            </svg>
            <div className="z-10 text-center">
              <span className="font-display text-4xl font-black tracking-tight text-slate-900 block leading-none">
                {employabilityScore}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mt-1 block">
                Live Rating
              </span>
            </div>
          </div>

          <div className="mt-4 text-xs font-semibold text-slate-600">
            {employabilityScore >= 85 ? (
              <span className="text-teal-600 flex items-center space-x-1 justify-center">
                <Sparkles className="h-4 w-4" />
                <span>Excellent placement potential!</span>
              </span>
            ) : employabilityScore >= 70 ? (
              <span className="text-indigo-600">Highly Competitive. Retake tests to hit 85+</span>
            ) : (
              <span className="text-amber-600">Needs improvement across skill nodes.</span>
            )}
          </div>
        </div>

        {/* Predictive Placement Matrix Dashboard */}
        <div className="col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                <TrendingUp className="h-4 w-4 text-teal-500" />
                <span>Job Readiness Predictions</span>
              </h3>
              <span className="text-[9px] font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                ML Model
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Placement Probability</span>
                  <span className="text-teal-600 font-display font-black text-sm">{placementProb}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-slate-100 overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-teal-500 transition-all duration-700 rounded-full"
                    style={{ width: `${placementProb}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Growth Trend Vector</span>
                  <span className="text-indigo-600 font-display font-black text-sm">+{confidenceIndex}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-slate-100 overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-700 rounded-full"
                    style={{ width: `${confidenceIndex}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl mt-4 flex items-center justify-between">
            <div className="text-[10px] text-slate-500 font-mono">
              <span className="font-bold text-slate-700">Verified Skills Completed: </span>
              {verifiedCount} / {skillScores.length}
            </div>
            <button 
              onClick={() => setPage("ASSESSMENT")}
              className="text-xs font-bold text-teal-600 hover:underline flex items-center space-x-0.5"
            >
              <span>Test now</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Skill Gap Matrix Heatmap - SVG Vector Visualizer */}
        <div className="col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <Brain className="h-4 w-4 text-amber-500" />
              <span>Skill Category Heatmap</span>
            </h3>
            <span className="text-[9px] font-mono text-slate-400">Heat Level</span>
          </div>

          <div className="mt-3.5 space-y-2.5">
            {skillScores.slice(0, 4).map((sk) => (
              <div key={sk.name} className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[124px]">{sk.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-500">{sk.score}%</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((idx) => {
                      const limitScore = idx * 20;
                      let color = "bg-slate-100";
                      if (sk.score >= limitScore) {
                        color = sk.category === "Technical" ? "bg-teal-500" : "bg-indigo-600";
                      } else if (sk.score + 10 >= limitScore) {
                        color = "bg-amber-300";
                      }
                      return (
                        <div key={idx} className={`h-3.5 w-3.5 rounded-sm ${color}`} />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid containing Progress trend and leaderboard */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* SVG Live trend tracker graph */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900">Weekly Score Trend</h3>
              <p className="text-[10px] text-slate-400">Real-time score adaptation metrics</p>
            </div>
            <div className="flex space-x-2">
              <span className="flex items-center space-x-1 text-xs text-teal-600 font-bold">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                <span>Cognitive rating</span>
              </span>
            </div>
          </div>

          <div className="mt-4 aspect-video md:h-60 w-full relative">
            {/* Elegant Custom Vector SVG Line Graph */}
            <svg viewBox="0 0 500 200" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="180" x2="480" y2="180" stroke="#f1f5f9" strokeWidth="2" />

              {/* Area Under Graph */}
              <path
                d={`M 40,180 
                    L 40,${180 - (68 * 1.5)} 
                    L 150,${180 - (72 * 1.5)} 
                    L 260,${180 - (75 * 1.5)} 
                    L 370,${180 - (employabilityScore * 1.5)} 
                    L 480,${180 - (employabilityScore * 1.5)} 
                    L 480,180 Z`}
                fill="url(#areaGradient)"
              />

              {/* Graph Curve */}
              <path
                d={`M 40,${180 - (68 * 1.5)} 
                    C 95,${180 - (70 * 1.5)} 100,${180 - (70 * 1.5)} 150,${180 - (72 * 1.5)} 
                    C 205,${180 - (74 * 1.5)} 210,${180 - (74 * 1.5)} 260,${180 - (75 * 1.5)} 
                    C 315,${180 - (employabilityScore * 1.5)} 320,${180 - (employabilityScore * 1.5)} 370,${180 - (employabilityScore * 1.5)} 
                    L 480,${180 - (employabilityScore * 1.5)}`}
                fill="none"
                stroke="#14b8a6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Interactive nodes */}
              <circle cx="40" cy={180 - (68 * 1.5)} r="5" fill="#ffffff" stroke="#14b8a6" strokeWidth="3" />
              <circle cx="150" cy={180 - (72 * 1.5)} r="5" fill="#ffffff" stroke="#14b8a6" strokeWidth="3" />
              <circle cx="260" cy={180 - (75 * 1.5)} r="5" fill="#ffffff" stroke="#14b8a6" strokeWidth="3" />
              <circle cx="370" cy={180 - (employabilityScore * 1.5)} r="5.5" fill="#4338ca" stroke="#14b8a6" strokeWidth="3" />
              <circle cx="480" cy={180 - (employabilityScore * 1.5)} r="5.5" fill="#4338ca" stroke="#14b8a6" strokeWidth="3" />

              {/* X Axis Labels */}
              <text x="40" y="195" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">W1</text>
              <text x="150" y="195" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">W2</text>
              <text x="260" y="195" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">W3</text>
              <text x="370" y="195" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">W4 (Active)</text>
              <text x="480" y="195" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Forecast</text>

              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Global Hall of Fame / Leaderboard */}
        <div id="leaderboard-section" className="col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-sm text-slate-900 flex items-center space-x-1.5 animate-pulse">
              <Award className="h-4 w-4 text-indigo-500" />
              <span>National Leaderboard</span>
            </h3>
            <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider font-mono">Verified</span>
          </div>

          <div className="mt-4 space-y-3">
            {leaderboard.map((ld, i) => (
              <div 
                key={ld.rank} 
                className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                  ld.name === user.name 
                    ? "bg-teal-50 border-teal-300 shadow-sm font-bold" 
                    : "bg-white border-transparent hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`text-xs font-black font-mono w-4 text-center ${
                    ld.rank === 1 ? "text-amber-500" : ld.rank === 2 ? "text-slate-400" : "text-slate-500"
                  }`}>
                    {ld.rank}
                  </span>
                  <img src={ld.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-slate-900 truncate max-w-[100px]">{ld.name}</p>
                    <p className="text-[9px] text-slate-500 truncate max-w-[80px]">{ld.roleTarget}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-display font-black text-xs text-teal-700">{ld.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Achievement Badges Matrix section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        <h4 className="font-display font-bold text-sm text-slate-900 mb-4 flex items-center space-x-1.5">
          <Award className="h-4 w-4 text-amber-500" />
          <span>Accredited Achievement Badges</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {badges.map((b) => (
            <div 
              key={b.id} 
              className={`p-4 rounded-xl border text-center transition-all ${
                b.unlocked 
                  ? "bg-slate-50 border-slate-200" 
                  : "bg-slate-50/40 border-dashed border-slate-200 opacity-60"
              }`}
            >
              <div className="text-3xl filter drop-shadow mb-2">{b.imageUrl}</div>
              <p className="text-[11px] font-black text-slate-900 leading-snug">{b.title}</p>
              <p className="text-[9px] text-slate-500 leading-normal mt-0.5 max-w-[120px] mx-auto">{b.description}</p>
              <div className="mt-2">
                <span className={`text-[8px] font-mono font-bold p-1 py-0.5 rounded uppercase ${
                  b.unlocked ? "bg-teal-100 text-teal-800" : "bg-slate-200 text-slate-500"
                }`}>
                  {b.unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
