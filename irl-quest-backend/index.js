// irl-quest-backend/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3001;

// Use HF_TOKEN or HF_API_KEY from .env
const rawToken = process.env.HF_TOKEN || process.env.HF_API_KEY;
if (!rawToken) {
  console.error('❌ Missing Hugging Face token. Set HF_TOKEN or HF_API_KEY in .env');
  process.exit(1);
}
const HF_API_KEY = rawToken.trim();

// Small, chat-compatible model on HF Router
const MODEL = process.env.HF_MODEL || 'HuggingFaceTB/SmolLM3-3B:hf-inference';

// OpenAI-compatible chat endpoint on HF Router
const HF_URL = 'https://router.huggingface.co/v1/chat/completions';

app.use(cors());
app.use(express.json());

// --------- Helper to call HF Router ----------
async function callHF(userMessage) {
  const systemPrompt = `
You are an AI quest generator for an IRL RPG mobile app.
The user sends you a short message describing their goal, mood, or context.
You respond with a SINGLE, short quest description in plain text.

Format exactly like this (no JSON, no markdown):
Title: <short quest title>
Description: <1-3 sentences describing the quest>
Stat: <ONE of Strength, Intelligence, Health, Charisma, Creativity>
Difficulty: <easy | medium | hard>
`.trim();

  const body = {
    model: MODEL,
    max_tokens: 200,
    temperature: 0.8,
    stream: false,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  };

  const res = await fetch(HF_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log('[HF] status:', res.status, res.statusText);
  console.log('[HF] body:', text);

  if (!res.ok) {
    const err = new Error(`HuggingFace error ${res.status} ${res.statusText}`);
    err.hfBody = text;
    throw err;
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Failed to parse HF JSON: ' + text);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No assistant content in HF response: ' + text);
  }

  return content.toString().trim();
}

// --------- /generate-quest endpoint ----------
app.post('/generate-quest', async (req, res) => {
  try {
    const userMessage =
      (req.body && req.body.message && req.body.message.toString().trim()) ||
      'Give me a small IRL quest.';

    const raw = await callHF(userMessage);

    // Optional: cut off anything before "Title:"
    const idx = raw.indexOf('Title:');
    const questText = idx >= 0 ? raw.slice(idx).trim() : raw.trim();

    res.json({ questText });
  } catch (err) {
    console.error('Generation error:', err.message || err, err.hfBody || '');

    res.status(500).json({
      error: 'Failed to generate quest',
      detail: err.message || String(err),
      hfBody: err.hfBody || null,
    });
  }
});

// --------- Start server ----------
app.listen(PORT, () => {
  console.log(`✅ Quest backend listening on port ${PORT}`);
});
