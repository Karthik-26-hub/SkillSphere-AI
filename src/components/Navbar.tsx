import React, { useState } from "react";
import { UserProfile } from "../types";
import {
  Briefcase,
  Sliders,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  Bot,
  User,
  LogOut,
  AppWindow
} from "lucide-react";

interface NavbarProps {
  user: UserProfile;
  activePortal: string;
  setActivePortal: (portal: any) => void;
  employabilityScore: number;
}

export default function Navbar({
  user,
  activePortal,
  setActivePortal,
  employabilityScore
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding & Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-indigo-900 text-white shadow-md shadow-teal-100">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold tracking-tight text-slate-900 md:text-lg">
              SkillSphere AI
            </h1>
            <p className="hidden text-[10px] uppercase tracking-wider text-teal-600 font-mono md:block">
              Cognitive AI System
            </p>
          </div>
        </div>

        {/* Portal Role Switches - Quick demonstration buttons */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          <button
            id="switch-student"
            onClick={() => setActivePortal("STUDENT")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activePortal === "STUDENT" || activePortal === "STUDENT_PORTAL"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <User className="h-3.5 w-3.5 text-teal-500" />
            <span>Student Portal</span>
          </button>
          <button
            id="switch-recruiter"
            onClick={() => setActivePortal("RECRUITER")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activePortal === "RECRUITER" || activePortal === "RECRUITER_PORTAL"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
            <span>Recruiter Portal</span>
          </button>
          <button
            id="switch-admin"
            onClick={() => setActivePortal("ADMIN")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activePortal === "ADMIN" || activePortal === "ADMIN_PORTAL"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Sliders className="h-3.5 w-3.5 text-orange-500" />
            <span>Admin Suite</span>
          </button>
        </nav>

        {/* Profile, Notification Bell & Analytics */}
        <div className="flex items-center space-x-4">
          
          {/* Real-time Score Badge */}
          {activePortal !== "AUTH" && activePortal !== "ONBOARDING" && (
            <div className="hidden sm:flex items-center space-x-2 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              <span className="text-[10px] font-mono tracking-wider font-bold uppercase text-teal-700">AI SCORE:</span>
              <span className="font-display font-black text-sm text-teal-700">{employabilityScore}</span>
            </div>
          )}

          {/* User Preview */}
          <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
            <img
              src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80"}
              alt="Avatar"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-teal-500/20"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-snug">{user.name || "Student Candidate"}</p>
              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{user.email}</p>
            </div>
            <button
              id="navbar-logout"
              onClick={() => setActivePortal("AUTH")}
              title="Logout / Restart Demo"
              className="p-1 px-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Hamburguer */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-slate-600 hover:bg-slate-100 rounded lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 z-40 relative text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Portal Quick Switch</p>
          <button
            onClick={() => {
              setActivePortal("STUDENT");
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center space-x-2 p-2.5 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
          >
            <User className="h-4 w-4 text-teal-600" />
            <span>Student Dashboard</span>
          </button>
          <button
            onClick={() => {
              setActivePortal("RECRUITER");
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center space-x-2 p-2.5 rounded-lg text-xs font-semibold hover:bg-slate-50 text-indigo-800"
          >
            <Briefcase className="h-4 w-4 text-indigo-600" />
            <span>Employer / Recruiter View</span>
          </button>
          <button
            onClick={() => {
              setActivePortal("ADMIN");
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center space-x-2 p-2.5 rounded-lg text-xs font-semibold hover:bg-slate-50 text-orange-800"
          >
            <Sliders className="h-4 w-4 text-orange-600" />
            <span>System Administration</span>
          </button>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2 text-xs">
            <span className="text-slate-500 font-mono">Real-Time Evaluation score:</span>
            <span className="font-bold text-teal-600">{employabilityScore}/100</span>
          </div>
        </div>
      )}
    </header>
  );
}
