import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const tests = [
  { name: 'AskAI', prompt: 'Explain what HTML is in 2 sentences.' },
  { name: 'Flashcards', prompt: 'Return ONLY a valid JSON array of 2 flashcards. No markdown. Format: [{"question":"Q","answer":"A"}]' },
  { name: 'Quiz', prompt: 'Return ONLY valid JSON. No markdown. Format: {"questions":[{"question":"Q","options":{"A":"a","B":"b","C":"c","D":"d"},"correctAnswer":"A"}],"feedback":"good"}' },
];

for (const t of tests) {
  try {
    const response = await genAI.models.generateContent({ model: 'gemini-2.5-flash', contents: t.prompt });
    const text = response.text || '';
    console.log('[PASS]', t.name, '| chars:', text.length, '| preview:', text.slice(0, 80).replace(/\n/g,' '));
  } catch(e) {
    console.error('[FAIL]', t.name, '->', (e.message || JSON.stringify(e)).slice(0, 150));
  }
}
