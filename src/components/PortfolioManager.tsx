import React, { useState } from "react";
import { UserProfile, ActiveProject, Certification, InternshipTracker } from "../types";
import { 
  Plus, 
  Trash2, 
  Upload, 
  Award, 
  FileCheck2, 
  Briefcase, 
  FolderGit2, 
  RefreshCw, 
  Calendar, 
  Link, 
  CheckCircle, 
  ArrowRight 
} from "lucide-react";

interface PortfolioManagerProps {
  user: UserProfile;
  projects: ActiveProject[];
  setProjects: React.Dispatch<React.SetStateAction<ActiveProject[]>>;
  certifications: Certification[];
  setCertifications: React.Dispatch<React.SetStateAction<Certification[]>>;
  internships: InternshipTracker[];
  setInternships: React.Dispatch<React.SetStateAction<InternshipTracker[]>>;
  setEmployabilityScore: React.Dispatch<React.SetStateAction<number>>;
}

export default function PortfolioManager({
  user,
  projects,
  setProjects,
  certifications,
  setCertifications,
  internships,
  setInternships,
  setEmployabilityScore
}: PortfolioManagerProps) {
  
  // Project creation form states
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTech, setProjTech] = useState("");
  
  // Certification creation form states
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  
  // Internship app creation states
  const [internCompany, setInternCompany] = useState("");
  const [internRole, setInternRole] = useState("");

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;

    const parsedTech = projTech.split(",").map(t => t.trim()).filter(Boolean);
    const mockAiScore = Math.floor(Math.random() * 20) + 75; // 75-95

    const newProject: ActiveProject = {
      id: `proj-${Date.now()}`,
      title: projTitle,
      description: projDesc,
      technologies: parsedTech.length > 0 ? parsedTech : ["React", "TypeScript"],
      verifiedScore: mockAiScore
    };

    setProjects([...projects, newProject]);
    setEmployabilityScore(prev => Math.min(100, prev + 2)); // boost score slightly
    setProjTitle("");
    setProjDesc("");
    setProjTech("");
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim()) return;

    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: certName,
      issuer: certIssuer || "Coursera Provider",
      issueDate: new Date().toISOString().split('T')[0],
      status: "Pending Verification"
    };

    setCertifications([...certifications, newCert]);
    setCertName("");
    setCertIssuer("");

    // Simulate verification after 3 seconds
    setTimeout(() => {
      setCertifications((prev) =>
        prev.map((c) => c.name === newCert.name ? { ...c, status: "Verified" } : c)
      );
      setEmployabilityScore(prev => Math.min(100, prev + 3)); // boost score verification
    }, 3000);
  };

  const handleAddInternshipCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internCompany.trim()) return;

    const newApp: InternshipTracker = {
      id: `intern-${Date.now()}`,
      company: internCompany,
      role: internRole || "Software Engineering Intern",
      status: "Applied",
      duration: "3 Months"
    };

    setInternships([...internships, newApp]);
    setInternCompany("");
    setInternRole("");
  };

  // Move candidate to next status in Kanban track
  const advanceInternshipStatus = (id: string, currentStatus: string) => {
    const sequence: ("Applied" | "Interviewing" | "Offered" | "Rejected")[] = [
      "Applied", "Interviewing", "Offered"
    ];
    const currentIndex = sequence.indexOf(currentStatus as any);
    if (currentIndex !== -1 && currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      setInternships(internships.map(item => item.id === id ? { ...item, status: nextStatus } : item));
    }
  };

  return (
    <div id="portfolio-workspace-root" className="space-y-6 text-left">
      
      {/* 1. Projects Matrix (CRUD) (Screen 26) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        
        {/* CRUD Creation Panel */}
        <div className="col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <h4 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center space-x-1.5">
            <FolderGit2 className="h-4.5 w-4.5 text-teal-600" />
            <span>Document New Project Portfolio</span>
          </h4>

          <form onSubmit={handleAddProject} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 font-mono">Project Title</label>
              <input
                type="text"
                required
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
                placeholder="Enterprise FinTech Ledger API"
                className="mt-1 block w-full rounded bg-slate-50 border border-slate-200 py-1.5 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 font-mono">Core Specifications Abstract</label>
              <textarea
                rows={3}
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                placeholder="Engineered a decoupled symmetric ledger ledger utilizing Redis and Node streams to limit latency..."
                className="mt-1 block w-full rounded bg-slate-50 border border-slate-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 font-mono">Technologies (comma separated)</label>
              <input
                type="text"
                value={projTech}
                onChange={(e) => setProjTech(e.target.value)}
                placeholder="React, TypeScript, Express, Redis"
                className="mt-1 block w-full rounded bg-slate-50 border border-slate-200 py-1.5 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <button
              id="btn-add-project"
              type="submit"
              className="w-full flex items-center justify-center space-x-1 border border-transparent bg-teal-600 hover:bg-teal-700 text-white font-bold p-2 rounded text-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Verify Project via AI</span>
            </button>
          </form>
        </div>

        {/* Existing Projects Portfolio list */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-md flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Student Portfolio Matrix ({projects.length})
            </h4>

            {projects.length === 0 ? (
              <p className="py-12 text-center text-xs text-slate-400">No portfolio records found. Upload a project spec to obtain AI credentials!</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-h-80 overflow-y-auto">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 border border-slate-150 rounded-xl bg-slate-50/50 flex flex-col justify-between hover:border-teal-400 transition-colors">
                    <div>
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-slate-900 text-xs truncate max-w-[140px]">{proj.title}</h5>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-normal">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-2">
                        {proj.technologies.map((t, i) => (
                          <span key={i} className="text-[8px] font-mono bg-slate-200/50 text-slate-600 p-0.5 px-1.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-150 mt-2.5 pt-2 flex items-center justify-between">
                      <span className="text-[8px] uppercase tracking-wider font-mono text-teal-600 font-bold">AI CODE REPORT:</span>
                      <span className="font-display font-extrabold text-[11px] text-teal-700 bg-teal-50 px-2 rounded">
                        {proj.verifiedScore ? `${proj.verifiedScore}/100` : "Audit pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 2. Certificate Upload & Mock Verification pipeline (Screen 27) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        
        {/* Certificate Upload Terminal Form */}
        <div className="col-span-1 md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <h4 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center space-x-1.5">
            <Award className="h-4.5 w-4.5 text-indigo-600 font-bold" />
            <span>Accredit New Certification</span>
          </h4>

          <form onSubmit={handleAddCert} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 font-mono">Issuer / Body Node</label>
              <input
                type="text"
                required
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                placeholder="Google Cloud DevOps Academy"
                className="mt-1 block w-full rounded bg-slate-50 border border-slate-200 py-1.5 px-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 font-mono">Certification Designation</label>
              <input
                type="text"
                required
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="Professional Cloud Security Engineer"
                className="mt-1 block w-full rounded bg-slate-50 border border-slate-200 py-1.5 px-2 text-xs focus:outline-none"
              />
            </div>

            <button
              id="btn-add-cert"
              type="submit"
              className="w-full flex items-center justify-center space-x-1 border border-transparent bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded text-xs cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>Verify credential</span>
            </button>
          </form>
        </div>

        {/* Action Status logs representation */}
        <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <h4 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 mb-4">
            Accreditation status index
          </h4>

          <div className="space-y-3.5 max-h-[170px] overflow-y-auto">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-center p-3.5 border border-slate-100 bg-slate-55 bg-slate-100/50 rounded-xl leading-normal">
                <div className="flex items-start space-x-3">
                  <span className="p-1 px-2.5 rounded bg-white border font-black text-xs shadow-sm">
                    {cert.status === "Verified" ? "🏆" : "⏳"}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">{cert.name}</h5>
                    <p className="text-[10px] text-slate-500">{cert.issuer} &bull; Issue date: {cert.issueDate}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    cert.status === "Verified" ? "bg-teal-100 text-teal-800" : "bg-amber-100 text-amber-800 animate-pulse"
                  }`}>
                    {cert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Internship hunt Kanban tracking ledger board (Screen 28) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md text-left">
        <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3 mb-6 gap-3">
          <div>
            <h4 className="font-display font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <Briefcase className="h-4.5 w-4.5 text-teal-600" />
              <span>Internship Recruitment Tracking</span>
            </h4>
            <p className="text-[10px] text-slate-400">Manage pending vacancies alongside corporate recruitment pipelines.</p>
          </div>

          <form onSubmit={handleAddInternshipCandidate} className="flex items-center space-x-2">
            <input
              type="text"
              required
              value={internCompany}
              onChange={(e) => setInternCompany(e.target.value)}
              placeholder="Google APAC"
              className="block bg-slate-50 border border-slate-200 rounded py-1 px-2 text-[10px] focus:outline-none"
            />
            <input
              type="text"
              value={internRole}
              onChange={(e) => setInternRole(e.target.value)}
              placeholder="Security Architect Fellow"
              className="block bg-slate-50 border border-slate-200 rounded py-1 px-2 text-[10px] focus:outline-none"
            />
            <button
              id="btn-add-internship"
              type="submit"
              className="flex items-center justify-center p-1 px-3 bg-teal-600 text-white font-bold rounded text-[10px] hover:bg-teal-700 cursor-pointer"
            >
              Track company
            </button>
          </form>
        </div>

        {/* Sequence Kanban Track Columns */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          
          {/* Column 1 - Applied */}
          <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-3 min-h-[160px]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">Applied ({internships.filter(i => i.status === "Applied").length})</span>
            {internships.filter(i => i.status === "Applied").map(item => (
              <div key={item.id} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm space-y-2">
                <div>
                  <h6 className="font-bold text-slate-900 text-[11px] truncate">{item.company}</h6>
                  <p className="text-[9px] text-slate-400 truncate">{item.role}</p>
                </div>
                <button
                  onClick={() => advanceInternshipStatus(item.id, item.status)}
                  className="w-full flex items-center justify-between text-[8px] font-bold text-indigo-600 bg-indigo-50 p-1 px-1.5 rounded hover:bg-indigo-100"
                >
                  <span>Hold for interviews</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Column 2 - Interviewing */}
          <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-3 min-h-[160px]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-600 font-bold">Interviewing ({internships.filter(i => i.status === "Interviewing").length})</span>
            {internships.filter(i => i.status === "Interviewing").map(item => (
              <div key={item.id} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm space-y-2">
                <div>
                  <h6 className="font-bold text-slate-900 text-[11px] truncate">{item.company}</h6>
                  <p className="text-[9px] text-amber-600 font-mono font-bold truncate">Live rounds active</p>
                </div>
                <button
                  onClick={() => advanceInternshipStatus(item.id, item.status)}
                  className="w-full flex items-center justify-between text-[8px] font-bold text-teal-600 bg-teal-50 p-1 px-1.5 rounded hover:bg-teal-100"
                >
                  <span>Accredit Offer</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Column 3 - Offered */}
          <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-3 min-h-[160px]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-teal-600 font-bold">Offered ({internships.filter(i => i.status === "Offered").length})</span>
            {internships.filter(i => i.status === "Offered").map(item => (
              <div key={item.id} className="p-3 border border-teal-200 bg-teal-50/20 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                  <h6 className="font-bold text-teal-900 text-[11px] truncate">{item.company}</h6>
                  <p className="text-[9px] text-teal-500 font-mono font-black">Offer extended!</p>
                </div>
                <CheckCircle className="h-4 w-4 text-teal-600" />
              </div>
            ))}
          </div>

          {/* Column 4 - Rejected */}
          <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-3 min-h-[160px]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-rose-500 font-bold">Rejected ({internships.filter(i => i.status === "Rejected").length})</span>
            {internships.filter(i => i.status === "Rejected").map(item => (
              <div key={item.id} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm opacity-60">
                <h6 className="font-bold text-slate-600 text-[11px] truncate">{item.company}</h6>
                <p className="text-[9px] text-slate-400 truncate">{item.role}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
