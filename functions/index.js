require('dotenv').config();
const express = require('express');
const cors = require('cors');
const askAI = require('./aiProxy');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const lessons = [
  { id: 1, title: 'Plants', subject: 'Science', class: 5, lang: 'en', text: 'Plants are living organisms that make their own food via photosynthesis.' },
  { id: 2, title: 'Fractions', subject: 'Maths', class: 4, lang: 'en', text: 'A fraction represents part of a whole.' },
  { id: 3, title: 'Freedom Struggle', subject: 'Social', class: 8, lang: 'en', text: 'A short history lesson about the freedom struggle.' }
];

const quiz = [
  { id: 1, q: 'What do plants need to make food?', options: ['Water', 'Sunlight', 'Soil', 'Both Water and Sunlight'], answer: 3 },
  { id: 2, q: '1/2 + 1/4 = ?', options: ['3/4', '2/3', '1/4', '1'], answer: 0 }
];

app.get('/api/lessons', (req, res) => res.json(lessons));
app.get('/api/quiz', (req, res) => res.json(quiz));

function extractAnswerFromProvider(data){
  // HuggingFace QA models usually return an object with 'answer' or 'generated_text'
  if(!data) return null;
  if(typeof data === 'string') return data;
  if(Array.isArray(data)){
    // Sometimes models return an array of answers
    const first = data[0];
    if(first && (first.answer || first.generated_text || first.summary)) return first.answer || first.generated_text || first.summary;
    // fallback to JSON string
    return JSON.stringify(data);
  }
  // object
  if(data.answer) return data.answer;
  if(data.generated_text) return data.generated_text;
  if(data[0] && data[0].generated_text) return data[0].generated_text;
  if(data[0] && data[0].answer) return data[0].answer;
  // check common keys
  if(data.summary) return data.summary;
  // fallback to stringified object
  return JSON.stringify(data);
}

app.post('/api/ask', async (req, res) => {
  const { question, context } = req.body;
  try {
    const raw = await askAI(question, context);
    const answer = extractAnswerFromProvider(raw);
    res.json({ answer, raw });
  } catch (err) {
    console.error(err?.message || err);
    res.status(500).json({ error: 'AI error', details: err?.message || String(err) });
  }
});

// Debug route: sends a canned question to the configured AI provider and returns raw response
app.get('/api/test-ai', async (req, res) => {
  const question = 'What do plants need to make food?';
  try {
    const raw = await askAI(question, '');
    const provider = process.env.HUGGINGFACE_API_KEY ? 'huggingface' : (process.env.SAMBANOVA_API_KEY ? 'sambanova' : 'none');
    const answer = extractAnswerFromProvider(raw);
    res.json({ provider, request: { question }, response: raw, answer });
  } catch (err) {
    console.error('Test AI error', err?.message || err);
    res.status(500).json({ error: 'Test AI failed', details: err?.message || String(err) });
  }
});

app.listen(PORT, () => console.log(`Functions mock server running on http://localhost:${PORT}`));
