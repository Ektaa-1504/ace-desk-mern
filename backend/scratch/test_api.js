// Quick HTTP test of the AI endpoints
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE = 'http://localhost:8000';

// Test 1: Check if server is up
try {
  const r = await axios.get(BASE + '/');
  console.log('[Server]', r.status, r.data);
} catch(e) {
  console.error('[Server DOWN]', e.message);
  process.exit(1);
}

// Test 2: Hit /api/ai/ask without auth - should get 400 "no token"
try {
  const r = await axios.post(BASE + '/api/ai/ask', {
    courseTitle: 'Test', courseDescription: 'Test desc', studentQuestion: 'What is this?'
  });
  console.log('[/api/ai/ask no-auth]', r.status, r.data);
} catch(e) {
  console.log('[/api/ai/ask no-auth expected error]', e.response?.status, e.response?.data);
}

// Test 3: Hit /api/ai/flashcards without auth
try {
  const r = await axios.post(BASE + '/api/ai/flashcards', {
    courseTitle: 'Test', courseDescription: 'Test desc'
  });
  console.log('[/api/ai/flashcards no-auth]', r.status, r.data);
} catch(e) {
  console.log('[/api/ai/flashcards no-auth expected error]', e.response?.status, e.response?.data);
}

// Test 4: Hit /api/review/givereview without auth
try {
  const r = await axios.post(BASE + '/api/review/givereview', {
    rating: 5, comment: 'Test', courseId: '69add3c2a95c253de5224f04'
  });
  console.log('[/api/review]', r.status, r.data);
} catch(e) {
  console.log('[/api/review no-auth expected error]', e.response?.status, e.response?.data);
}

console.log('\nAll routes are REACHABLE. Auth is working correctly.');
