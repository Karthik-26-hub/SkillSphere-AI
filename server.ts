import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry headers
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini GenAI SDK initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini GenAI SDK:", error);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined in environment variables. Falling back to local offline AI model simulation.");
}

// ==========================================
// API Routing for Cognitive AI System
// ==========================================

// Chatbot and General Support endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [...(history || []), { role: "user", parts: [{ text: message }] }],
        config: {
          systemInstruction: "You are the leading AI Mentor and Employability Evaluator inside the 'Cognitive AI System for Measuring and Improving Student Employability Skills'. Be professional, highly constructive, futuristic, and encouraging. Give advice on skills, resume optimization, career paths, and technical preparedness. Respond in clear markdown format using bullet points where appropriate.",
        },
      });
      return res.json({ text: response.text || "I've processed your response, but couldn't produce content." });
    } catch (error: any) {
      console.error("Gemini Chat Error:", error);
      return res.status(500).json({ error: "Gemini server error: " + error.message, isFallback: true });
    }
  } else {
    // Elegant fallback simulation
    const simulatedAnswers = [
      "To boost your Employability Score, I recommend reinforcing your data structure skills and pursuing a Cloud Certification (AWS/GCP). This will close your high-demand technical gap.",
      "Your education details are highly aligned with software engineering roles. Adding an interactive project with rich visualizations, like an AI-powered visualizer, will impress hiring managers.",
      "To ace your next Technical Interview, practice breaking down coding problems into smaller subproblems and verbalize your mental models. Try out our Coding Challenge Module!",
      "I suggest focusing on public speaking and concise delivery. Communication is rated as one of the top five soft skills in modern enterprise recruiters.",
    ];
    const item = simulatedAnswers[Math.floor(Math.random() * simulatedAnswers.length)];
    return res.json({
      text: `*(Offline Simulation)* ${item}\n\n*Set up your \`GEMINI_API_KEY\` in your secrets panel to activate full live AI assistance!*`,
      isFallback: true,
    });
  }
});

// Resume parser and analyzer endpoint
app.post("/api/gemini/resume", async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required." });
  }

  const prompt = `Analyze the following student resume for employability insights. Provide key feedback, score current placement potential, list suggested skills to add, and detect potential job roles. Format your response strictly as a JSON object containing keys: 'score' (number between 50-95), 'summary' (string), 'strengths' (array of strings), 'weaknesses' (array of strings), 'recommendedSkills' (array of strings), and 'suggestedRoles' (array of strings). Here is the resume text:\n\n${resumeText}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT" as any,
            properties: {
              score: { type: "NUMBER" as any, description: "Estimated starting employability score based on current skills and experiences (50-95)" },
              summary: { type: "STRING" as any, description: "Highly insightful professional feedback summary" },
              strengths: { type: "ARRAY" as any, items: { type: "STRING" as any }, description: "List of top 3 resume strengths" },
              weaknesses: { type: "ARRAY" as any, items: { type: "STRING" as any }, description: "List of top 3 resume weakness/skills gaps" },
              recommendedSkills: { type: "ARRAY" as any, items: { type: "STRING" as any }, description: "Highly relevant skills suggested for onboarding" },
              suggestedRoles: { type: "ARRAY" as any, items: { type: "STRING" as any }, description: "Best matching high-demand job categories" },
            },
            required: ["score", "summary", "strengths", "weaknesses", "recommendedSkills", "suggestedRoles"],
          },
        },
      });

      const parsedData = JSON.parse(response.text || "{}");
      return res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini Resume Analysis Error:", error);
      return res.status(500).json({ error: "Failed to parse resume with AI.", isFallback: true });
    }
  } else {
    // Quality fallback response
    return res.json({
      score: 72,
      summary: "Your profile demonstrates a solid theoretical foundation in Software Engineering with essential programming experience. To reach top-tier industry standards, expand your portfolio with cloud deployment, state management frameworks, and automated unit testing.",
      strengths: ["Strong academic background in computer science concepts", "Core familiarity with foundational languages like Python, JavaScript, and Java", "Demonstrated hands-on experience in small-scale class projects"],
      weaknesses: ["Lacks real-world industry certifications", "No experience with scalable production architecture patterns", "Minimal emphasis on system design or design patterns"],
      recommendedSkills: ["TypeScript", "Docker", "REST API Development", "Cloud Architecture (GCP)", "CI/CD Orchestration"],
      suggestedRoles: ["Junior Frontend Developer", "Associate Software Engineer", "Systems Analyst Apprentice"],
      isFallback: true,
    });
  }
});

// Interactive Code Review and Evaluation endpoint
app.post("/api/gemini/code-review", async (req, res) => {
  const { challengeTitle, code, language } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Source code is required." });
  }

  const prompt = `Evaluate the following student's code solution for the coding challenge '${challengeTitle || "Algorithm design"}' using language '${language || "javascript"}'. Give professional feedback, analyze runtime and space complexity under big-O, list issues or recommendations, and provide a grading score out of 100.
Return strictly a JSON object with: 'score' (number 0-100), 'timeComplexity' (string), 'spaceComplexity' (string), 'correctness' (string: summary description), 'suggestions' (array of strings), and 'reviewedCode' (string: optimized refactored code block). Code:\n\n${code}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT" as any,
            properties: {
              score: { type: "NUMBER" as any, description: "Review score out of 100 based on syntax, runtime and readability" },
              timeComplexity: { type: "STRING" as any, description: "Estimated final time complexity (e.g. O(N log N))" },
              spaceComplexity: { type: "STRING" as any, description: "Estimated auxiliary space complexity" },
              correctness: { type: "STRING" as any, description: "Feedback on accuracy, logic, or edge cases" },
              suggestions: { type: "ARRAY" as any, items: { type: "STRING" as any }, description: "Top improvement points" },
              reviewedCode: { type: "STRING" as any, description: "Refactored/optimized clean code suggested as replacement" },
            },
            required: ["score", "timeComplexity", "spaceComplexity", "correctness", "suggestions", "reviewedCode"],
          },
        },
      });
      const parsedData = JSON.parse(response.text || "{}");
      return res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini Code Evaluation Error:", error);
      return res.status(500).json({ error: "Failed to compile AI code review.", isFallback: true });
    }
  } else {
    // Beautiful dynamic mock evaluation
    const scoreVal = code.includes("for") || code.includes("while") ? 85 : 92;
    return res.json({
      score: scoreVal,
      timeComplexity: "O(N) linear scan",
      spaceComplexity: "O(1) auxiliary constant variable allocation",
      correctness: "The solution successfully solves core test cases and handles simple inputs. Adding strict validation null checks and index out-of-bounds guards will improve enterprise reliability.",
      suggestions: [
        "Optimize variable lookup speeds by caching properties.",
        "Include comprehensive edge case checks (e.g., negative inputs, empty sequences).",
        "Consider using declarative modern array methods for superior semantic readability.",
      ],
      reviewedCode: `// Optimized version with boundary checks\nfunction solve(inputs) {\n  if (!inputs || inputs.length === 0) return [];\n  \n  // Use single iteration O(N) optimized sequence map\n  return inputs.reduce((accum, curr) => {\n    if (curr > 0) accum.push(curr * curr);\n    return accum;\n  }, []);\n}`,
      isFallback: true,
    });
  }
});

// Interactive AI Mock Interview Sim and review endpoint
app.post("/api/gemini/interview", async (req, res) => {
  const { jobRole, questionHistory, lastStudentAnswer } = req.body;
  if (!jobRole) {
    return res.status(400).json({ error: "Job role selection is required for interview context." });
  }

  // Generate either the next question or complete and grade the aggregate interview history if they have answered 3 questions
  const totalAnswersCount = (questionHistory || []).filter((q: any) => q.answer).length;
  const isCompletionGrade = totalAnswersCount >= 3;

  let prompt = "";
  if (isCompletionGrade) {
    prompt = `Analyze the complete student interview transcript below for the role '${jobRole}'. Perform general communication skill, poise, phrasing, and technical evaluation. Grade their performance strictly out of 100, and summarize concrete actionable feedback. Format your response strictly as a JSON object with keys: 'score' (number), 'communicationRating' (string out of 5 stars, e.g. '4.5'), 'technicalRating' (string out of 5), 'detailedGrammarReview' (string), 'strengths' (array of strings), 'weaknesses' (array of strings), and 'coachingVerdict' (string). Transcript:\n\n${JSON.stringify(questionHistory)}`;
  } else {
    prompt = `You are a real-world tech recruiter interviewing a student for the role of '${jobRole}'. Review their last answer: '${lastStudentAnswer || ""}' (if provided). Formulate one highly professional, critical, and realistic follow-up interview question. Make it a behavioral or technical challenge. Respond strictly with a JSON object. Keys: 'nextQuestion' (string) and 'expertInsightHint' (string: hints about what high-performing candidates discuss for this theme).`;
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: isCompletionGrade
            ? {
                type: "OBJECT" as any,
                properties: {
                  score: { type: "NUMBER" as any, description: "Final assessment score (50-100)" },
                  communicationRating: { type: "STRING" as any, description: "Stars rating for speaking patterns, clarity" },
                  technicalRating: { type: "STRING" as any, description: "Stars rating for technical exactness" },
                  detailedGrammarReview: { type: "STRING" as any, description: "Detailed phrasing feedback" },
                  strengths: { type: "ARRAY" as any, items: { type: "STRING" as any } },
                  weaknesses: { type: "ARRAY" as any, items: { type: "STRING" as any } },
                  coachingVerdict: { type: "STRING" as any },
                },
                required: ["score", "communicationRating", "technicalRating", "detailedGrammarReview", "strengths", "weaknesses", "coachingVerdict"],
              }
            : {
                type: "OBJECT" as any,
                properties: {
                  nextQuestion: { type: "STRING" as any },
                  expertInsightHint: { type: "STRING" as any, description: "A hint on what recruiters expect in a stellar response" },
                },
                required: ["nextQuestion", "expertInsightHint"],
              },
        },
      });

      const parsedData = JSON.parse(response.text || "{}");
      return res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini Interview Error:", error);
      return res.status(500).json({ error: "Gemini server failed during interview routing.", isFallback: true });
    }
  } else {
    // Simulated offline fallback response
    if (isCompletionGrade) {
      return res.json({
        score: 84,
        communicationRating: "4.2 / 5",
        technicalRating: "4.5 / 5",
        detailedGrammarReview: "Excellent confidence and standard vocabulary. Occasional use of conversational filler words like 'like' or 'basically'. Try slowing the rhythm of explanation to convey elevated composure.",
        strengths: ["Clear logical explanation structure", "Strong articulation of foundational design concepts", "Excellent active listening cues"],
        weaknesses: ["Missed describing negative constraints or trade-offs explicitly", "A bit of rushing during system architectural questions"],
        coachingVerdict: "Highly recommended for active corporate rounds. Your capacity to walk through structured frameworks is competitive. Prioritize system latency constraints next.",
        isFallback: true,
      });
    } else {
      const interviewQuestionsList = [
        "How do you approach managing architectural trade-offs between performance and code testability? Walk me through a complex choice from your projects.",
        "Imagine your system suddenly encounters a 10x spike in concurrent api traffic over 3 minutes. How would you design a rate-limiting policy or fallback cache schema on short notice?",
        "Describe a situation where a key stakeholder strongly disagreed with your proposed technical implementation. How did you coordinate the resolution and validate alignment?",
      ];
      const selected = interviewQuestionsList[Math.floor(Math.random() * interviewQuestionsList.length)];
      return res.json({
        nextQuestion: selected,
        expertInsightHint: "Great candidates employ the STAR method (Situation, Task, Action, Result) and mention objective system metrics like throughput, memory latency, and stakeholder sign-off criteria.",
        isFallback: true,
      });
    }
  }
});

// Cognitive Personality Assessment scenario Analyzer
app.post("/api/gemini/personality", async (req, res) => {
  const { selectedDecisions } = req.body;
  if (!selectedDecisions) {
    return res.status(400).json({ error: "Decisions list is required." });
  }

  const prompt = `Perform a cognitive and personality assessment on the following student scenario choices. The student responded to high-pressure work dilemmas:
${JSON.stringify(selectedDecisions)}

Analyze these cognitive choices. Return strictly a JSON object with 'personalityType' (string, e.g. 'Collaborative Analyst'), 'analyticalRating' (number 0-100), 'leadershipRating' (number 0-100), 'adaptabilityRating' (number 0-100), 'strengths' (array of strings), and 'detailedFeedback' (string: detailed insights into their default cognitive mode in corporate environments).`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT" as any,
            properties: {
              personalityType: { type: "STRING" as any, description: "MBTI styled professional temperament name" },
              analyticalRating: { type: "NUMBER" as any, description: "Rating score of problem solving efficiency" },
              leadershipRating: { type: "NUMBER" as any, description: "Rating score of initiative and team balance" },
              adaptabilityRating: { type: "NUMBER" as any, description: "Rating score of resilience/adaptability" },
              strengths: { type: "ARRAY" as any, items: { type: "STRING" as any } },
              detailedFeedback: { type: "STRING" as any },
            },
            required: ["personalityType", "analyticalRating", "leadershipRating", "adaptabilityRating", "strengths", "detailedFeedback"],
          },
        },
      });

      const parsedData = JSON.parse(response.text || "{}");
      return res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini Personality Evaluation Error:", error);
      return res.status(500).json({ error: "Failed to compile cognitive review.", isFallback: true });
    }
  } else {
    // Offline simulation fallback
    return res.json({
      personalityType: "Visionary Strategist (INTJ-Aligned)",
      analyticalRating: 88,
      leadershipRating: 75,
      adaptabilityRating: 82,
      strengths: ["Highly disciplined goal configuration", "Pragmatic data-driven decision structures", "Ability to design systemic contingencies"],
      detailedFeedback: "You prioritize system integrity, architecture safety, and measurable outcomes. You work extremely well building foundational infrastructures, but can occasionally overestimate consensus. Pair your intense analytical drive with regular soft feedback gathering loops to build supreme leadership trust.",
      isFallback: true,
    });
  }
});

// Serve Vite dev server or static compiled dist assets
const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);

    // Default error handling or generic routing fallback
    app.use((err: any, req: any, res: any, next: any) => {
      console.error("Error in Vite dev proxy middleware:", err);
      res.status(500).send("Something went wrong loading AI Studio build dependencies.");
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Dev Mode] Full-Stack Cognitive AI Server running on host 0.0.0.0, port ${PORT}`);
    });
  });
} else {
  // Serve static files in production
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Production Mode] Full-Stack Cognitive Server running on host 0.0.0.0, port ${PORT}`);
  });
}
