import {
  CodingChallenge,
  QuestionMock,
  BadgeMock,
  LeaderboardUser,
  SkillScore,
  ActiveProject,
  Certification,
  InternshipTracker
} from "./types";

// Suggested standard skills pool for onboarding select matrix
export const COMPREHENSIVE_SKILLS_POOL = [
  "JavaScript", "TypeScript", "React.js", "Node.js", "Python", 
  "Machine Learning", "Data Structures", "System Design", "SQL", 
  "Cloud Architecture (AWS)", "Docker", "Git Version Control",
  "HTML/CSS", "Java", "C++", "Data Analytics", "UI/UX Design",
  "Product Management", "Public Speaking", "Technical Writing"
];

// Technical skillset MCQs
export const TECHNICAL_QUESTIONS: QuestionMock[] = [
  {
    id: "tech-1",
    question: "Which of the following is true concerning the concept of closure in JavaScript?",
    options: [
      "It allows functions to execute asynchronously in the main queue.",
      "It retains access to its outer lexical scope even after execution.",
      "It strictly prevents global variables from being declared inside objects.",
      "It compiles variables into Native Machine instructions upon run time."
    ],
    correctIndex: 1
  },
  {
    id: "tech-2",
    question: "What is the worst-case space complexity of the QuickSort algorithm with optimized recursion?",
    options: [
      "O(N)",
      "O(1)",
      "O(log N)",
      "O(N log N)"
    ],
    correctIndex: 2
  },
  {
    id: "tech-3",
    question: "In ACID transaction properties, what does the 'Isolation' property guarantee?",
    options: [
      "Databases remain synchronized via external network hubs.",
      "Multiple simultaneous transactions do not interfere with each other.",
      "Data is strictly written to remote disk nodes immediately.",
      "Only approved administrators can override dynamic queries."
    ],
    correctIndex: 1
  }
];

// Aptitude & Reasoning MCQs
export const APTITUDE_QUESTIONS: QuestionMock[] = [
  {
    id: "apt-1",
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?",
    options: ["120 meters", "150 meters", "180 meters", "324 meters"],
    correctIndex: 1
  },
  {
    id: "apt-2",
    question: "Identify the next number in the logical sequence: 4, 9, 19, 39, 79, ...",
    options: ["119", "139", "159", "169"],
    correctIndex: 2
  },
  {
    id: "apt-3",
    question: "If A is father of B, but B is not son of A. What is the relation of B to A?",
    options: ["Daughter", "Cousin", "Brother-in-law", "Grandson"],
    correctIndex: 0
  }
];

// Cognitive Behavioral psychological dilemmas
export interface CognitiveScenarioDilemma {
  id: string;
  situation: string;
  options: { text: string; trait: string; ratingAdjustment: number }[];
}

export const COGNITIVE_DILEMMAS = [
  {
    id: "cog-1",
    situation: "Your project team faces a critical production bug 2 hours before a major product demo. The lead dev blames another team member's setup. How do you act?",
    options: [
      {
        text: "Calmly gather coordinates, focus immediately on hotfixing the issue collectively, and defer blaming audits to a retroactive review.",
        trait: "High Adaptability & Problem Solving",
        ratingAdjustment: 15
      },
      {
        text: "Set up a meeting with management to notify them that the timeline is compromised due to setup issues.",
        trait: "Risk Mitigation Flow",
        ratingAdjustment: 5
      },
      {
        text: "Debug independently alongside the blamed developer to find errors while assigning alternate responsibilities.",
        trait: "Collaborative Leadership",
        ratingAdjustment: 12
      }
    ]
  },
  {
    id: "cog-2",
    situation: "A client asks to integrate a highly complex secondary API feature, which is completely out of original specifications, in 4 days. How do you frame expectations?",
    options: [
      {
        text: "Agree instantly to show ultimate customer dedication, even if it forces the engineers to work through nights.",
        trait: "High Stress Tolerance (Weak Limits)",
        ratingAdjustment: 4
      },
      {
        text: "Schedule an urgent alignment sync, propose a simplified MVP version achievable in 4 days, and schedule the full release cleanly.",
        trait: "Strategic Negotiation & Scope Management",
        ratingAdjustment: 14
      },
      {
        text: "Politely refuse, citing the strict boundaries of the original contractual specification agreement.",
        trait: "Process Compliance Focus",
        ratingAdjustment: 8
      }
    ]
  }
];

// Presets of Coding Challenges for the Coding module
export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: "code-1",
    title: "Array Peak Finder",
    difficulty: "Easy",
    description: "Write a function that accepts an array of integers and returns any 'peak' element. A peak is defined as an element that is strictly greater than its neighbors. For index 0, check index 1; for the last element, check the preceding element.",
    starterCode: `function findPeakElement(nums) {\n  // Write your code here\n  if (nums.length === 0) return -1;\n  \n  return 0;\n}`,
    language: "javascript"
  },
  {
    id: "code-2",
    title: "Anharmonic String Groups",
    difficulty: "Medium",
    description: "Given an array of strings, group anagrams together into sub-arrays. Return the nested arrays in any order.",
    starterCode: `function groupAnagrams(strs) {\n  // Write your code here\n  return [];\n}`,
    language: "javascript"
  }
];

// Simulated initial skills list
export const INITIAL_SKILL_SCORES: SkillScore[] = [
  { name: "Technical Foundations", score: 70, category: "Technical", status: "Verified" },
  { name: "Coding Algorithms", score: 65, category: "Technical", status: "In-Progress" },
  { name: "Verbal Articulation", score: 80, category: "Communication", status: "Verified" },
  { name: "Inductive Aptitude", score: 75, category: "Aptitude", status: "Verified" },
  { name: "Cognitive Agility", score: 81, category: "Cognitive", status: "Verified" },
  { name: "Resilience & Grit", score: 85, category: "Personality", status: "Verified" },
  { name: "Team Integration", score: 78, category: "Soft Skills", status: "Verified" }
];

// Leaderboard data representation
export const LEADERS_LIST: LeaderboardUser[] = [
  { rank: 1, name: "Pranav Mukharjee", score: 96, roleTarget: "Machine Learning Specialist", avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&fit=crop&q=80" },
  { rank: 2, name: "Siddharth Verma", score: 94, roleTarget: "Cloud Security Engineer", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80" },
  { rank: 3, name: "Ananya Iyer", score: 92, roleTarget: "Full-Stack Tech Architect", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80" },
  { rank: 4, name: "Jessica Thornton", score: 89, roleTarget: "Product Strategist", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&fit=crop&q=80" },
  { rank: 5, name: "Wei Zhao", score: 87, roleTarget: "Distributed Engineer", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80" }
];

// Badges list
export const BADGES_STORE: BadgeMock[] = [
  { id: "badge-1", title: "Algorithm Champion", description: "Successfully passed technical tests with >80%", imageUrl: "🏆", unlocked: true },
  { id: "badge-2", title: "Speech Master", description: "Completed AI Mock Interview with exceptional communication rating", imageUrl: "🎙️", unlocked: false },
  { id: "badge-3", title: "Logical Vanguard", description: "Completed quantitative aptitude analysis successfully", imageUrl: "⚡", unlocked: true },
  { id: "badge-4", title: "Team Visionary", description: "Demonstrated cooperative traits during cognitive dilemma reviews", imageUrl: "💡", unlocked: false },
  { id: "badge-5", title: "Verified Contributor", description: "Uploaded portfolio and successfully verified a certificate", imageUrl: "🎖️", unlocked: false }
];

// Industrial Job Demand Trend
export const INDUSTRY_DEMANDS_MOCK = [
  { role: "Senior AI / ML Research Associate", growth: "+42%", averageSalary: "$165K", coreRequirement: "PyTorch, LLM Tuning, Reinforcement Learning" },
  { role: "Cloud Security Solutions Architect", growth: "+35%", averageSalary: "$150K", coreRequirement: "AWS Architecture, IAM protocols, Terraform, Docker" },
  { role: "Full-Stack Developer (React / NestJS)", growth: "+28%", averageSalary: "$115K", coreRequirement: "TypeScript, State Management, Redis Cache, Postgres" },
  { role: "Data Infrastructure Engineer (Pipelines)", growth: "+21%", averageSalary: "$130K", coreRequirement: "Apache Kafka, Spark, DB optimization, Python" }
];

// Stateful Presets
export const BAD_INITIAL_BADGES = BADGES_STORE;

export const INITIAL_PROJECT_MOCKS: ActiveProject[] = [
  {
    id: "proj-1",
    title: "Symmetric Cache Engine",
    description: "Built a thread-safe custom key-value store with automatic expiration logs of sub-milliseconds.",
    technologies: ["Node.js", "Redis", "TypeScript"],
    verifiedScore: 92
  }
];

export const INITIAL_CERT_MOCKS: Certification[] = [
  {
    id: "cert-1",
    name: "Architecting on Cloud Systems",
    issuer: "Coursera Cloud Infrastructure",
    issueDate: "2026-03-12",
    status: "Verified"
  }
];

export const INITIAL_INTERNSHIP_MOCKS: InternshipTracker[] = [
  {
    id: "intern-1",
    company: "Stripe APAC",
    role: "Developer Integrations Intern",
    status: "Interviewing",
    duration: "3 Months"
  },
  {
    id: "intern-2",
    company: "GitHub Global",
    role: "Systems Automation Intern",
    status: "Applied",
    duration: "6 Months"
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: "notif-1", title: "AI Scorecard updated!", text: "Your analytical foundations scorecard has been compiled successfully.", date: "Just now", read: false },
  { id: "notif-2", title: "Corporate vacancy match!", text: "Stripe APAC is reviewing candidates matching 'Software Systems Architect'.", date: "2 hrs ago", read: false }
];
