import { type VercelRequest, type VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { verse, reference } = req.body;

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.trim() === "") {
    return res.status(500).json({ error: "OPENROUTER_API_KEY is not configured." });
  }

  const MODELS_TO_TRY = [
    "openrouter/free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "google/gemma-4-31b-it:free",
    "qwen/qwen3-coder:free",
    "z-ai/glm-4.5-air:free"
  ];

  const prompt = `Explain this Bible verse in a warm, encouraging, community-focused way for a modern audience: "${verse}" (${reference}). Keep it under 200 words.`;

  let lastError = null;

  for (const model of MODELS_TO_TRY) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY.trim()}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "https://faithcircle.vercel.app",
          "X-Title": "FaithCircle",
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data: any = await response.json();

      if (!response.ok) {
        const errorMsg = data.error?.message || JSON.stringify(data);
        lastError = new Error(errorMsg);
        if (response.status === 401) throw lastError;
        continue;
      }

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        lastError = new Error("Empty response from model");
        continue;
      }

      return res.status(200).json({ text: content });
    } catch (err: any) {
      if (err.message.includes("401") || err.message.includes("API key not valid")) {
        return res.status(500).json({ error: err.message });
      }
      lastError = err;
      continue;
    }
  }

  return res.status(500).json({ error: lastError?.message || "Failed to explain verse" });
}