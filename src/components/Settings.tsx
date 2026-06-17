import React, { useState } from "react";
import { UserProfile, EducationDetails } from "../types";
import { 
  Settings, 
  User, 
  GraduationCap, 
  Sliders, 
  RefreshCw, 
  CheckCircle, 
  Trash2, 
  Save, 
  Database,
  SlidersHorizontal,
  Camera,
  Upload,
  Link2
} from "lucide-react";
import { 
  INITIAL_SKILL_SCORES, 
  INITIAL_PROJECT_MOCKS, 
  INITIAL_CERT_MOCKS, 
  INITIAL_INTERNSHIP_MOCKS 
} from "../data";

interface SettingsProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  education: EducationDetails;
  setEducation: React.Dispatch<React.SetStateAction<EducationDetails>>;
  employabilityScore: number;
  setEmployabilityScore: React.Dispatch<React.SetStateAction<number>>;
  setSkillScores: React.Dispatch<React.SetStateAction<any>>;
  setProjects: React.Dispatch<React.SetStateAction<any>>;
  setCertifications: React.Dispatch<React.SetStateAction<any>>;
  setInternships: React.Dispatch<React.SetStateAction<any>>;
}

const PRESET_AVATARS = [
  { name: "Default (User)", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&fit=crop&q=80" },
  { name: "Tech Indigo", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80" },
  { name: "Sleek Dark", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&fit=crop&q=80" },
  { name: "Bright Minimal", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&fit=crop&q=80" },
  { name: "Engineering Core", url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&fit=crop&q=80" },
  { name: "Cognitive Amber", url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&fit=crop&q=80" }
];

export default function SettingsComponent({
  user,
  setUser,
  education,
  setEducation,
  employabilityScore,
  setEmployabilityScore,
  setSkillScores,
  setProjects,
  setCertifications,
  setInternships
}: SettingsProps) {
  
  // State variables for form inputs
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [collegeName, setCollegeName] = useState(user.collegeName);
  const [degree, setDegree] = useState(user.degree);
  const [graduationYear, setGraduationYear] = useState(user.graduationYear);
  const [cgpa, setCgpa] = useState(user.cgpa);
  
  const [major, setMajor] = useState(education.major || "Software Engineering");
  const [twelfthMarks, setTwelfthMarks] = useState(education.twelfthMarks || "92%");
  const [tenthMarks, setTenthMarks] = useState(education.tenthMarks || "95%");
  
  // Profile Picture variables
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // File Upload Handlers (conforming to drag-and-drop & click select guidelines)
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Invalid file type. Please upload an image format (png, jpg, jpeg, webp).");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setUploadError("Image file size exceeds the 2MB allocation limit.");
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to parse the dropped image. Try again.");
    };
    reader.readAsDataURL(file);
  };

  // Sync profile edits back to active system states
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("processing");
    
    setTimeout(() => {
      setUser(prev => ({
        ...prev,
        name,
        email,
        collegeName,
        degree,
        graduationYear,
        cgpa,
        avatarUrl
      }));
      
      setEducation(prev => ({
        ...prev,
        collegeName,
        degree,
        graduationYear,
        cgpa,
        major,
        twelfthMarks,
        tenthMarks
      }));

      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 800);
  };

  // Switch role target directly via instant buttons
  const handleRoleSwitch = (newRole: string) => {
    setUser(prev => ({
      ...prev,
      collegeName: prev.collegeName || "National Institute of Science & Technology" // ensures it doesn't default to student
    }));
    setSaveStatus(`switched_role:${newRole}`);
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleResetData = () => {
    // Re-assign original parameters
    setName("Tony Stark");
    setEmail("tony6250584@gmail.com");
    setCollegeName("National Institute of Science & Technology");
    setDegree("Bachelor of Technology");
    setGraduationYear("2027");
    setCgpa("8.8 CGPA");
    setMajor("Software Engineering");
    setTwelfthMarks("92%");
    setTenthMarks("95%");
    setAvatarUrl("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&fit=crop&q=80");

    setUser({
      name: "Tony Stark",
      email: "tony6250584@gmail.com",
      collegeName: "National Institute of Science & Technology",
      degree: "Bachelor of Technology",
      graduationYear: "2027",
      cgpa: "8.8 CGPA",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&fit=crop&q=80",
      skills: ["React", "JavaScript", "Python"],
      experienceLevel: "Entry"
    });

    setEducation({
      collegeName: "National Institute of Science & Technology",
      degree: "Bachelor of Technology",
      graduationYear: "2027",
      cgpa: "8.8 CGPA",
      major: "Software Engineering",
      twelfthMarks: "92%",
      tenthMarks: "95%"
    });

    setEmployabilityScore(72);
    setSkillScores(INITIAL_SKILL_SCORES);
    setProjects(INITIAL_PROJECT_MOCKS);
    setCertifications(INITIAL_CERT_MOCKS);
    setInternships(INITIAL_INTERNSHIP_MOCKS);

    setSaveStatus("reset");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div id="settings-view" className="space-y-6 text-left">
      
      {/* Title block */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
        <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
          <Settings className="h-5 w-5 animate-spin" />
        </div>
        <div>
          <h2 className="font-display text-xl font-black text-slate-900">System Preferences & Settings</h2>
          <p className="text-xs text-slate-500">Configure profile indices, custom target paths, and simulation matrices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        
        {/* Left and central: Profile detail editor */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-6">
          <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-1.5">
            <User className="h-4.5 w-4.5 text-teal-600" />
            <span>Edit Profile & Academic Records</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-6">

            {/* Profile Avatar Selection & Custom File Upload Section */}
            <div className="space-y-3 bg-slate-50/50 p-4 border border-slate-200/80 rounded-2xl">
              <label className="block text-[10px] font-bold uppercase font-mono text-slate-500 tracking-wider">
                Profile Avatar Selection & Upload
              </label>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                
                {/* Visual Avatar Preview Circle */}
                <div className="relative group w-24 h-24 shrink-0">
                  <img
                    src={avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&fit=crop&q=80"}
                    alt="Active Profile Preview"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&fit=crop&q=80";
                    }}
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-md ring-2 ring-teal-500/30 group-hover:ring-teal-500 transition-all duration-200"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Uplink Drag & Drop Area / Presets Selection */}
                <div className="flex-1 w-full space-y-4">
                  
                  {/* Presets Selection */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-600">Select pre-designed professional avatar preset:</p>
                    <div className="flex flex-wrap gap-2 block">
                      {PRESET_AVATARS.map((p) => {
                        const isSelected = avatarUrl === p.url;
                        return (
                          <button
                            type="button"
                            key={p.name}
                            onClick={() => {
                              setAvatarUrl(p.url);
                              setUploadError(null);
                            }}
                            className={`relative w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 inline-block mr-1.5 ${
                              isSelected ? "border-teal-600 scale-105 ring-2 ring-teal-500/20" : "border-slate-200"
                            }`}
                            title={p.name}
                          >
                            <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-teal-600/20 flex items-center justify-center">
                                <span className="bg-teal-600 text-white rounded-full p-0.5 text-[6px]">
                                  ✓
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Drag-And-Drop / Manual file upload area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Drag-drop or select block */}
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-3 text-center transition-all cursor-pointer ${
                        dragActive 
                          ? "border-teal-500 bg-teal-50/50" 
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <input
                        id="avatar-image-uploader"
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                      <label 
                        htmlFor="avatar-image-uploader" 
                        className="cursor-pointer flex flex-col items-center justify-center h-full space-y-1"
                      >
                        <Upload className="h-4 w-4 text-slate-400 mx-auto" />
                        <span className="text-[10px] font-semibold text-slate-600">Drag & drop or <span className="text-teal-600 hover:underline">browse</span></span>
                        <span className="text-[8px] text-slate-400">PNG, JPG, WEBP (Max 2MB)</span>
                      </label>
                    </div>

                    {/* Choose between toggling custom image URL input or showing upload info */}
                    <div className="flex flex-col justify-between p-3 border border-slate-200 bg-white rounded-xl space-y-2">
                      <div className="text-[10px] text-slate-500 leading-normal">
                        {uploadError ? (
                          <p className="text-rose-600 font-bold">{uploadError}</p>
                        ) : (
                          <p className="font-mono text-slate-400 uppercase font-bold text-[8px] leading-relaxed">
                            Image State Node: 
                            <span className="block mt-1 text-slate-700 font-sans normal-case text-[10px] font-normal leading-normal">
                              {avatarUrl && avatarUrl.startsWith("data:") 
                                ? "✓ Custom local image payload active" 
                                : "✓ Pattern URL asset mapping active"}
                            </span>
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="flex items-center space-x-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors w-fit underline cursor-pointer"
                      >
                        <Link2 className="h-3.5 w-3.5" />
                        <span>{showUrlInput ? "Hide custom URL input" : "Provide image web URL"}</span>
                      </button>
                    </div>

                  </div>

                  {/* Expandable Image URL Input */}
                  {showUrlInput && (
                    <div className="space-y-1 animate-fadeIn">
                      <label className="block text-[8px] font-bold uppercase font-mono text-slate-400">Direct Avatar Target Web URL</label>
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          placeholder="https://example.com/your-image.jpg"
                          value={avatarUrl}
                          onChange={(e) => {
                            setAvatarUrl(e.target.value);
                            setUploadError(null);
                          }}
                          className="flex-1 rounded-lg bg-white border border-slate-200 py-1.5 px-3 text-[11px] focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        />
                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setAvatarUrl("");
                              setUploadError(null);
                            }}
                            className="text-[10px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 border border-rose-100 rounded-lg px-2"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
            
            {/* General Info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase font-mono text-slate-500">Sovereign Candidate Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 px-3 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase font-mono text-slate-500">E-Mail Identity</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 px-3 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* College & Degree */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase font-mono text-slate-500">Institution Node Name</label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 px-3 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase font-mono text-slate-500">Degree Focus</label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 px-3 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Academic Particulars */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase font-mono text-slate-500">academic major</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 px-3 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase font-mono text-slate-500">graduation Year</label>
                <input
                  type="text"
                  required
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 px-3 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase font-mono text-slate-500">college cgpa</label>
                <input
                  type="text"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 px-3 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Grade Marks */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase font-mono text-slate-500">12th marks percentage</label>
                <input
                  type="text"
                  value={twelfthMarks}
                  onChange={(e) => setTwelfthMarks(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 px-3 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase font-mono text-slate-500">10th marks percentage</label>
                <input
                  type="text"
                  value={tenthMarks}
                  onChange={(e) => setTenthMarks(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 px-3 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                disabled={saveStatus === "processing"}
                className="flex items-center space-x-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold p-2.5 px-6 text-xs transition-colors disabled:bg-slate-300 cursor-pointer"
              >
                {saveStatus === "processing" ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saveStatus === "processing" ? "Synchronizing records..." : "Save Personal Details"}</span>
              </button>

              {saveStatus === "success" && (
                <span className="text-teal-600 text-xs font-bold flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Profile variables saved and updated in main nodes!</span>
                </span>
              )}
            </div>

          </form>
        </div>

        {/* Right side: Simulation, slider overrides, reset data */}
        <div className="space-y-6">
          
          {/* Dynamic Score override */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-1.5">
              <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-600" />
              <span>Scoreboard Simulation</span>
            </h3>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Manually slide the employability score to preview the live circular gauge rendering and eligibility flags.
            </p>

            <div className="space-y-2.5 py-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600 font-mono">Employability Index:</span>
                <span className="font-display font-black text-indigo-600 text-sm">{employabilityScore}%</span>
              </div>
              
              <input
                type="range"
                min="30"
                max="100"
                value={employabilityScore}
                onChange={(e) => setEmployabilityScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-[9px] font-mono text-indigo-700 font-bold leading-normal">
                AI RECRUITER VERIFY STATUS:
              </p>
              <div className="mt-1">
                {employabilityScore >= 85 ? (
                  <span className="font-bold text-[10px] text-teal-700 uppercase">Pre-Approved for corporate hiring rounds</span>
                ) : employabilityScore >= 70 ? (
                  <span className="font-bold text-[10px] text-indigo-700 uppercase">Passed preliminary ML filtering check</span>
                ) : (
                  <span className="font-bold text-[10px] text-amber-700 uppercase">Training assessment required</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Resets and Database clearance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-1.5">
              <Database className="h-4.5 w-4.5 text-rose-600" />
              <span>Danger Zone Engine</span>
            </h3>

            <p className="text-[11px] text-slate-500 leading-normal">
              Reset all credentials, achievements, verified scores, and active items in the career system tracker to initial demo presets.
            </p>

            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center space-x-1.5 rounded-xl border border-rose-200 hover:border-transparent bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold p-2.5 text-xs transition-all cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Reset Entire Career State</span>
            </button>

            {saveStatus === "reset" && (
              <p className="text-[10px] font-bold text-center text-rose-600 flex items-center justify-center space-x-1">
                <CheckCircle className="h-3 w-3 animate-bounce" />
                <span>Default state successfully restored.</span>
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
