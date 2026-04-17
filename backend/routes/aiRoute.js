import express from "express";
import {
  searchWithAi,
  askAiTutor,
  generateFlashcards,
  generateQuiz,
} from "../controllers/aiController.js";
import isAuth from "../middlewares/isAuth.js";

let aiRouter = express.Router();

aiRouter.post("/search", searchWithAi);                    // public - no auth needed
aiRouter.post("/ask", isAuth, askAiTutor);                 // requires login + enrollment check
aiRouter.post("/flashcards", isAuth, generateFlashcards);  // requires login + enrollment check
aiRouter.post("/quiz", isAuth, generateQuiz);              // requires login + enrollment check

export default aiRouter;