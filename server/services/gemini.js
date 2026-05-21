import Groq from 'groq-sdk';

const getClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing from environment variables');
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

const safeJSON = (text) => {
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

export const generateQuestions = async (role, level) => {
  const prompt = `You are a senior ${role} interviewer at a top tech company.
Generate exactly 5 real, specific interview questions for a ${level} candidate.
Respond ONLY with a JSON array. No explanation. No markdown.
Format: ["question 1", "question 2", "question 3", "question 4", "question 5"]`;

  try {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interviewer. Respond ONLY with a valid JSON array. No markdown, no explanation, no extra text.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });
    console.log('✓ Questions generated');
    return safeJSON(response.choices[0].message.content);
  } catch (err) {
    console.error('❌ GROQ ERROR:', err.message);
    return [
      `Tell me about your experience as a ${role}.`,
      'Describe a challenging technical problem you solved.',
      'How do you handle tight deadlines?',
      'Walk me through debugging a complex problem.',
      'What is one technical concept you recently learned?'
    ];
  }
};

export const evaluateAnswer = async (role, question, answer) => {
  const prompt = `You are a senior ${role} hiring manager. Evaluate this interview answer honestly.
Question: "${question}"
Answer: "${answer}"

Respond ONLY with valid JSON. No markdown. No extra text before or after.
{
  "overallScore": <number 1-10>,
  "dimensions": {
    "starStructure": { "score": <1-10>, "feedback": "<1 sentence>" },
    "specificity":   { "score": <1-10>, "feedback": "<1 sentence>" },
    "relevance":     { "score": <1-10>, "feedback": "<1 sentence>" },
    "confidence":    { "score": <1-10>, "feedback": "<1 sentence>" }
  },
  "highlights": ["<something genuinely strong they said>"],
  "improvements": ["<specific improvement>", "<another>"],
  "topTip": "<single most important tip>"
}`;

  try {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview evaluator. You ALWAYS respond with valid JSON only. Never add markdown, explanations, or text outside the JSON object.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
    });
    const raw = response.choices[0].message.content;
    console.log('✓ Raw AI response:', raw.slice(0, 100));
    return safeJSON(raw);
  } catch (err) {
    console.error('❌ GROQ EVAL ERROR:', err.message);
    return {
      overallScore: 5,
      dimensions: {
        starStructure: { score: 5, feedback: 'Use Situation, Task, Action, Result.' },
        specificity:   { score: 5, feedback: 'Add specific numbers and outcomes.' },
        relevance:     { score: 6, feedback: 'Stay focused on what was asked.' },
        confidence:    { score: 5, feedback: 'Avoid phrases like "I think maybe".' }
      },
      highlights: ['You attempted to answer directly.'],
      improvements: ['Add a concrete example', 'Quantify your results'],
      topTip: 'Use STAR: Situation → Task → Action → Result.'
    };
  }
};
