require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();

const PORT = process.env.PORT || 3001;

// accept either env name (your .env has HF_TOKEN)
const HF_API_KEY =
  process.env.HF_API_KEY ||
  process.env.HF_TOKEN ||
  process.env.HF_TOKEN?.trim();

// from HF docs: a small LLM that supports HF Inference chat
// https://huggingface.co/docs/inference-providers/en/providers/hf-inference
const MODEL =
  process.env.HF_MODEL || 'HuggingFaceTB/SmolLM3-3B:hf-inference';

if (!HF_API_KEY) {
  console.error('❌ Missing Hugging Face token. Set HF_API_KEY or HF_TOKEN in .env');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

/**
 * Call Hugging Face Router chat-completions endpoint
 * using OpenAI-compatible format:
 * POST https://router.huggingface.co/v1/chat/completions
 */
async function callHuggingFace(messages) {
  const url = 'https://router.huggingface.co/v1/chat/completions';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      // give it enough room to finish <think> AND answer
      max_tokens: 768,
      temperature: 0.7,
      stream: false,
    }),
  });

  const text = await res.text();
  console.log('[HF] status:', res.status, res.statusText);
  console.log('[HF] body:', text);

  if (!res.ok) {
    const err = new Error(
      `HuggingFace request failed: ${res.status} ${res.statusText}`
    );
    err.hfBody = text;
    err.hfStatus = res.status;
    throw err;
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Unexpected HF JSON: ' + text);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No assistant content in HF response: ' + text);
  }

  return content.toString().trim();
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

/**
 * Clean model output:
 * - for reasoning models: take only the part after </think>
 * - remove any leftover <think> tags
 * - keep only from "Title:" onward
 * - limit to the first 4 non-empty lines (Title, Description, Stat, Difficulty)
 */
function cleanQuestText(rawText) {
  if (!rawText) return '';

  let txt = rawText.trim();

  // 1. If there's a closing </think>, take everything AFTER it
  const closingThinkIdx = txt.lastIndexOf('</think>');
  if (closingThinkIdx !== -1) {
    txt = txt.slice(closingThinkIdx + '</think>'.length).trim();
  }

  // 2. Remove any leftover <think> tags just in case
  txt = txt.replace(/<think>/gi, '').replace(/<\/think>/gi, '').trim();

  // 3. If we see "Title:", slice from there
  const titleIdx = txt.indexOf('Title:');
  if (titleIdx !== -1) {
    txt = txt.slice(titleIdx).trim();
  }

  // 4. Keep only first 4 non-empty lines (to avoid extra chatter)
  const lines = txt
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const fourLines = lines.slice(0, 4).join('\n');

  return fourLines;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/generate-quest') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      try {
        let payload = {};
        try {
          payload = JSON.parse(body || '{}');
        } catch {
          payload = {};
        }

        const userMessage =
          payload.message ||
          payload.prompt ||
          'I feel lazy but want a small, fun IRL quest.';

        // system prompt that forces the format we want
        const systemPrompt = `
You are an AI quest generator for an IRL RPG mobile app.
The user sends you a short message describing their goal, mood, or context.

You MUST respond with EXACTLY 4 lines, in this format, and NOTHING ELSE:
Title: <short quest title>
Description: <1-3 sentences describing the quest>
Stat: <ONE of Strength, Intelligence, Health, Charisma, Creativity>
Difficulty: <easy | medium | hard>

If you are a reasoning model that uses <think> tags, put ALL hidden reasoning ONLY inside <think>...</think>
and put the 4 visible lines AFTER </think>.
Do NOT include explanations or any other visible text besides those 4 lines.
`.trim();

        const messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ];

        const rawText = await callHuggingFace(messages);
        const questText = cleanQuestText(rawText);

        // Simple fallback if somehow still empty
        const safeQuestText =
          questText && questText.trim()
            ? questText
            : `Title: Lazy Hero Warmup
Description: Take a 10-minute walk outside, looking for one small detail you've never noticed before. When you return, write it down or snap a photo as proof of your discovery.
Stat: Health
Difficulty: easy`;

        sendJson(res, 200, { questText: safeQuestText });
      } catch (err) {
        console.error(
          'Generation error:',
          err.message || err,
          err.hfBody ?? ''
        );

        const detail = err.message || 'Unknown error';
        const hfBody = err.hfBody;

        sendJson(res, 500, {
          error: 'Failed to generate quest',
          detail,
          ...(hfBody ? { hfBody } : {}),
        });
      }
    });
    return;
  }

  // any other route = 404
  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`✅ Quest backend listening on port ${PORT}`);
});
