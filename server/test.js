import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

console.log('Key found:', process.env.GEMINI_API_KEY ? 'YES' : 'NO - KEY IS MISSING');
console.log('Key starts with:', process.env.GEMINI_API_KEY?.slice(0, 8));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

try {
  const result = await model.generateContent('Say the word hello only.');
  console.log('✓ API WORKS:', result.response.text());
} catch (err) {
  console.log('✗ API FAILED:', err.message);
}