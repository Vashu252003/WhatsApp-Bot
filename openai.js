const OpenAI = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('Missing OPENAI_API_KEY environment variable. Create a .env file or set the variable before running.');
}

const apiBasePath = process.env.OPENAI_API_BASE_PATH || process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
const client = new OpenAI({ apiKey, baseURL: apiBasePath });
const modelName = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

async function generateReply(userMessage) {
  const prompt = [
    { role: 'system', content: 'You are a helpful WhatsApp chatbot. Keep responses concise, friendly, and relevant to the user message.' },
    { role: 'user', content: userMessage }
  ];

  const response = await client.chat.completions.create({
    model: modelName,
    messages: prompt,
    max_tokens: 250,
    temperature: 0.7
  });

  const reply = response?.choices?.[0]?.message?.content;
  return reply ? reply.trim() : 'Sorry, I could not generate a reply at this time.';
}

module.exports = { generateReply };
