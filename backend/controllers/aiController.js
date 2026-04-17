/*
AI Powered Course Search Workflow

1️⃣ User frontend se search query bhejta hai (req.body.input)

2️⃣ Backend pehle normal database search karta hai
   - MongoDB me title, subtitle, description, category, aur level fields me
   - regex use karke case-insensitive match check karta hai

3️⃣ Agar courses mil jate hain
   → direct unko response me return kar diya jata hai

4️⃣ Agar koi course match nahi hota
   → user query Gemini AI ko bheji jati hai

5️⃣ AI user intent samajhkar ek relevant keyword return karta hai
   (example: "How to build websites" → "Web Development")

6️⃣ Backend fir database me dobara search karta hai
   → is baar AI ke keyword se

7️⃣ Jo courses milte hain wo frontend ko response me bhej diye jate hain

Result:
User ko relevant courses mil jate hain even if exact words match na ho.
*/

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
dotenv.config();

// Helper: generate text using @google/genai v1.x SDK
const geminiGenerate = async (prompt) => {
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
};

// Helper: check enrollment
const checkEnrollment = async (userId, courseId) => {
  const user = await User.findById(userId);
  if (!user) return false;
  return user.enrolledCourses.some(
    (id) => id.toString() === courseId.toString()
  );
};

// ============================================
// AI Search - Existing feature (no auth needed)
// ============================================
export const searchWithAi = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const prompt = `You are an intelligent assistant for an LMS platform. A user will type any query about what they want to learn. Your task is to understand the intent and return one most relevant keyword from the following list of course categories and levels:

- App Development  
- AI/ML  
- AI Tools  
- Data Science  
- Data Analytics  
- Ethical Hacking  
- UI UX Designing  
- Web Development  
- Others  
- Beginner  
- Intermediate  
- Advanced  

Only reply with one single keyword from the list above that best matches the query. Do not explain anything. No extra text.

Query: ${input}
`;

    const keyword = (await geminiGenerate(prompt)).trim();
    console.log("[AI Search] keyword:", keyword);

    const courses = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: input, $options: "i" } },
        { subTitle: { $regex: input, $options: "i" } },
        { description: { $regex: input, $options: "i" } },
        { category: { $regex: input, $options: "i" } },
        { level: { $regex: input, $options: "i" } },
      ],
    });

    if (courses.length > 0) {
      return res.status(200).json(courses);
    } else {
      const aiCourses = await Course.find({
        isPublished: true,
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { subTitle: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { category: { $regex: keyword, $options: "i" } },
          { level: { $regex: keyword, $options: "i" } },
        ],
      });
      return res.status(200).json(aiCourses);
    }
  } catch (error) {
    console.error("[searchWithAi] error:", error);
    return res.status(500).json({ message: "AI search failed" });
  }
};

// ============================================
// AI Tutor - Answer course doubts (enrolled users only)
// ============================================
export const askAiTutor = async (req, res) => {
  try {
    const { courseId, courseTitle, courseDescription, studentQuestion } = req.body;

    if (!courseTitle || !courseDescription || !studentQuestion) {
      return res.status(400).json({
        message:
          "courseTitle, courseDescription and studentQuestion are required",
      });
    }

    // Enrollment check
    if (courseId) {
      const enrolled = await checkEnrollment(req.userId, courseId);
      if (!enrolled) {
        return res.status(403).json({
          message: "Please enroll in the course to use this feature",
        });
      }
    }

    const prompt = `You are an AI tutor helping a beginner student in an online course.

Course title: ${courseTitle}
Course description: ${courseDescription}

Student question: ${studentQuestion}

Explain the answer in a clear, beginner-friendly and concise way.
Use simple language, give a short step-by-step explanation if helpful, and avoid unnecessary jargon.
Limit your answer to about 3–6 short paragraphs.`;

    const answer = await geminiGenerate(prompt);
    console.log("[askAiTutor] answer length:", answer?.length);

    return res.status(200).json({ answer });
  } catch (error) {
    console.error("[askAiTutor] error:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate AI explanation" });
  }
};

// ============================================
// AI Flashcards - Generate revision cards (enrolled users only)
// ============================================
export const generateFlashcards = async (req, res) => {
  try {
    const { courseId, courseTitle, courseDescription } = req.body;

    if (!courseTitle || !courseDescription) {
      return res
        .status(400)
        .json({ message: "courseTitle and courseDescription are required" });
    }

    // Enrollment check
    if (courseId) {
      const enrolled = await checkEnrollment(req.userId, courseId);
      if (!enrolled) {
        return res.status(403).json({
          message: "Please enroll in the course to use this feature",
        });
      }
    }

    const prompt = `You are an AI assistant for a Learning Management System.

Create 5–8 concise flashcards to help a student revise the key concepts of this course.

Course title: ${courseTitle}
Course description: ${courseDescription}

IMPORTANT OUTPUT FORMAT:
- Return ONLY valid JSON.
- No Markdown, no backticks, no explanation text.
- JSON should be an array of objects with this exact shape:

[
  {
    "question": "Question text here",
    "answer": "Short, clear answer here"
  }
]

Make questions specific and focused on the most important concepts.
Answers should be short (1–3 sentences) and beginner-friendly.`;

    let text = (await geminiGenerate(prompt)).trim();
    console.log("[generateFlashcards] raw text snippet:", text.slice(0, 200));

    // Strip markdown code fences if present
    text = text.replace(/^```[\w]*\n?/m, "").replace(/```$/m, "").trim();

    const startIdx = text.indexOf("[");
    const endIdx = text.lastIndexOf("]");
    if (startIdx !== -1 && endIdx !== -1) {
      text = text.slice(startIdx, endIdx + 1);
    }

    let flashcards;
    try {
      flashcards = JSON.parse(text);
    } catch (parseErr) {
      console.error("[generateFlashcards] JSON parse error:", parseErr, "\nRaw:", text);
      return res.status(500).json({
        message: "AI output could not be parsed into flashcards",
      });
    }

    return res.status(200).json({ flashcards });
  } catch (error) {
    console.error("[generateFlashcards] error:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate flashcards" });
  }
};

// ============================================
// AI Quiz - Generate MCQ quiz (enrolled users only)
// ============================================
export const generateQuiz = async (req, res) => {
  try {
    const { courseId, courseTitle, courseDescription } = req.body;

    if (!courseTitle || !courseDescription) {
      return res
        .status(400)
        .json({ message: "courseTitle and courseDescription are required" });
    }

    // Enrollment check
    if (courseId) {
      const enrolled = await checkEnrollment(req.userId, courseId);
      if (!enrolled) {
        return res.status(403).json({
          message: "Please enroll in the course to use this feature",
        });
      }
    }

    const prompt = `You are an AI quiz generator for an online course.

Using the course information below, create a quiz with 5 multiple-choice questions.

Course title: ${courseTitle}
Course description: ${courseDescription}

Requirements:
- Each question must have options A, B, C and D.
- Exactly one correct answer per question.
- Also include a short overall feedback string at the end, summarizing how a student who scores well has understood the course.

IMPORTANT OUTPUT FORMAT:
- Return ONLY valid JSON (no Markdown, no backticks, no extra text).
- JSON structure must be:

{
  "questions": [
    {
      "question": "Question text here",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "correctAnswer": "A"
    }
  ],
  "feedback": "Short feedback message here"
}

Make questions beginner-friendly but meaningful.`;

    let text = (await geminiGenerate(prompt)).trim();
    console.log("[generateQuiz] raw text snippet:", text.slice(0, 200));

    // Strip markdown code fences if present
    text = text.replace(/^```[\w]*\n?/m, "").replace(/```$/m, "").trim();

    const startIdx = text.indexOf("{");
    const endIdx = text.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1) {
      text = text.slice(startIdx, endIdx + 1);
    }

    let quiz;
    try {
      quiz = JSON.parse(text);
    } catch (parseErr) {
      console.error("[generateQuiz] JSON parse error:", parseErr, "\nRaw:", text);
      return res
        .status(500)
        .json({ message: "AI output could not be parsed into a quiz" });
    }

    return res.status(200).json({ quiz });
  } catch (error) {
    console.error("[generateQuiz] error:", error);
    return res.status(500).json({ message: "Failed to generate quiz" });
  }
};
