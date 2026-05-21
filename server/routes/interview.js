import express from 'express';
import { generateQuestions, evaluateAnswer } from '../services/gemini.js';

const router = express.Router();

// POST /api/interview/questions
router.post('/questions', async (req, res) => {
  const { role, level } = req.body;

  if (!role || !level)
    return res.status(400).json({ error: 'Role and level are required.' });

  try {
    const questions = await generateQuestions(role, level);
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not generate questions. Check your API key.' });
  }
});

// POST /api/interview/evaluate
router.post('/evaluate', async (req, res) => {
  const { role, question, answer } = req.body;

  if (!role || !question || !answer)
    return res.status(400).json({ error: 'Missing required fields.' });

  if (answer.trim().length < 15)
    return res.status(400).json({ error: 'Answer too short to evaluate.' });

  try {
    const evaluation = await evaluateAnswer(role, question, answer);
    res.json({ evaluation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not evaluate answer. Try again.' });
  }
});

export default router;