export interface UserProfile {
  name: string;
  email: string;
  collegeName: string;
  degree: string;
  graduationYear: string;
  cgpa: string;
  experienceLevel: "Entry" | "Mid" | "Senior" | "Unspecified";
  avatarUrl: string;
  skills: string[];
}

export interface EducationDetails {
  collegeName: string;
  degree: string;
  graduationYear: string;
  cgpa: string;
  major: string;
  twelfthMarks: string;
  tenthMarks: string;
}

export interface ResumeAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendedSkills: string[];
  suggestedRoles: string[];
}

export interface SkillScore {
  name: string;
  score: number; // 0 - 100
  category: "Technical" | "Communication" | "Aptitude" | "Cognitive" | "Personality" | "Soft Skills";
  status: "Verified" | "In-Progress" | "Not-Started";
  evaluatedAt?: string;
}

export interface ActiveProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  verifiedScore?: number; // AI score
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  status: "Pending Verification" | "Verified" | "Rejected";
}

export interface InternshipTracker {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interviewing" | "Offered" | "Rejected";
  duration: string;
  stipend?: string;
}

export interface PlacementPrediction {
  employabilityScore: number; // 0-100
  placementProbability: number; // 0-100
  growthConfidence: number; // 0-100
  predictedGrowthTrend: { date: string; score: number }[];
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  starterCode: string;
  language: string;
}

export interface QuestionMock {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface BadgeMock {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  unlocked: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  score: number; // 0-100 Employability Score
  roleTarget: string;
  avatarUrl: string;
}

export type ActivePortal = "AUTH" | "ONBOARDING" | "STUDENT_PORTAL" | "RECRUITER_PORTAL" | "ADMIN_PORTAL";
